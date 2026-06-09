/**
 * Carbon Footprint Estimation Engine
 * Uses EPA (Environmental Protection Agency) and IPCC estimates for average carbon coefficients.
 * All outputs represent kilograms of CO2 equivalents (kg CO2e).
 */

export const EMISSION_FACTORS = {
  // Transport coefficients (per mile or per trip)
  transport: {
    car_petrol: 0.404,     // kg CO2 per mile (US average passenger vehicle)
    car_hybrid: 0.220,     // kg CO2 per mile
    car_electric: 0.110,   // kg CO2 per mile (based on US average electric grid)
    bus: 0.140,            // kg CO2 per passenger mile
    train: 0.080,          // kg CO2 per passenger mile
    flight_short: 150.0,   // kg CO2 per hour (short-haul flight)
    flight_long: 110.0,    // kg CO2 per hour (long-haul flight, higher altitude but more cruising)
    bicycle: 0.000,        // Zero emissions
    walk: 0.000            // Zero emissions
  },
  // Energy coefficients
  energy: {
    electricity_kwh: 0.385, // kg CO2 per kWh (average grid mix)
    natural_gas_therms: 5.3, // kg CO2 per therm
    heating_oil_gallons: 10.15, // kg CO2 per gallon
    water_gallons: 0.003    // kg CO2 per gallon (water processing and pumping)
  },
  // Food coefficients (per serving / meal)
  food: {
    beef: 4.5,             // kg CO2 per serving (beef has extremely high methane impact)
    poultry_pork: 1.2,     // kg CO2 per serving
    dairy: 0.9,            // kg CO2 per serving (milk, cheese, butter)
    plant_based: 0.25,     // kg CO2 per serving (grains, pulses)
    veg_local: 0.10        // kg CO2 per serving (locally sourced fruits/vegetables)
  },
  // Shopping/Apparel coefficients (per item purchased)
  shopping: {
    clothing: 12.5,        // kg CO2 per average item (cotton/polyester production)
    electronics: 150.0,    // kg CO2 per device (metals, semiconductor manufacturing)
    furniture: 45.0,       // kg CO2 per item
    packaged_goods: 2.0    // kg CO2 per pack (plastic packaging footprint)
  }
};

/**
 * Calculates emissions for a specific activity item.
 * @param {string} category - transport, energy, food, shopping
 * @param {string} type - specific sub-factor (e.g., 'car_petrol', 'electricity_kwh')
 * @param {number} quantity - numerical amount (miles, kWh, servings, items)
 * @returns {number} Calculated kg CO2e.
 */
export function calculateEmissions(category, type, quantity) {
  const catFactors = EMISSION_FACTORS[category];
  if (!catFactors) return 0;
  
  const factor = catFactors[type];
  if (factor === undefined) return 0;
  
  return parseFloat((factor * quantity).toFixed(2));
}

/**
 * Get visual rating based on monthly emissions in kg.
 * Average US citizen is ~1300 kg/month. Target sustainable is ~300 kg/month.
 * @param {number} totalMonthlyKg 
 * @returns {{label: string, color: string, description: string}} rating info.
 */
export function getEmissionsRating(totalMonthlyKg) {
  if (totalMonthlyKg <= 200) {
    return {
      label: 'Eco-Champion',
      color: 'var(--brand-emerald)',
      description: 'Your footprint is within the sustainable global target to keep warming below 1.5°C.'
    };
  } else if (totalMonthlyKg <= 500) {
    return {
      label: 'Climate Conscious',
      color: 'var(--accent-blue)',
      description: 'Good job! You are below average, but simple tweaks can get you to true sustainability.'
    };
  } else if (totalMonthlyKg <= 1000) {
    return {
      label: 'Moderate Impact',
      color: 'var(--accent-orange)',
      description: 'You are close to the modern average. Try reducing meat servings and car trips.'
    };
  } else {
    return {
      label: 'High Footprint',
      color: 'var(--accent-red)',
      description: 'Your emissions are high. Using public transit and choosing low-carbon alternatives will help.'
    };
  }
}
