import { sanitizeString } from './inputSanitizer';

/**
 * Sustainability Database for Scanner Items
 */
export const SCANNER_PRODUCTS = {
  plastic_bottle: {
    name: 'Single-Use Plastic Water Bottle',
    category: 'Shopping',
    carbonScore: 32,
    sustainabilityScore: 'D',
    emissionsKg: 0.25,
    analysis: 'Manufacturing and transporting single-use plastics releases high greenhouse gases and leaves microplastics in ecosystems.',
    alternatives: [
      { name: 'Reusable Stainless Steel Bottle', reduction: '99% savings', description: 'Reusing a steel flask eliminates plastic waste entirely.' },
      { name: 'Filtered Tap Water', reduction: '99% savings', description: 'Fill up from your faucet instead of buying bottled water.' }
    ]
  },
  beef_patty: {
    name: 'Beef Patty (Red Meat)',
    category: 'Food',
    carbonScore: 12,
    sustainabilityScore: 'F',
    emissionsKg: 4.5,
    analysis: 'Methane emissions from cattle digestion and extensive land use for pasture make beef the highest-footprint food source.',
    alternatives: [
      { name: 'Impossible Plant-Based Patty', reduction: '89% savings', description: 'Tastes identical but uses a fraction of land and water.' },
      { name: 'Organic Poultry Fillet', reduction: '73% savings', description: 'Chicken emits significantly lower methane compared to cattle.' }
    ]
  },
  disposable_cup: {
    name: 'Paper Coffee Cup with Plastic Lid',
    category: 'Shopping',
    carbonScore: 45,
    sustainabilityScore: 'C-',
    emissionsKg: 0.12,
    analysis: 'Most coffee cups are lined with plastic polyethylene, making them non-recyclable in standard facilities, leading to landfill incineration.',
    alternatives: [
      { name: 'Bamboo travel mug', reduction: '95% savings', description: 'Most cafes offer a 10% discount when bringing your own reusable cup.' },
      { name: 'Ceramic Dine-In Mug', reduction: '100% savings', description: 'Enjoy your beverage at the cafe to eliminate disposable waste.' }
    ]
  },
  cheap_tshirt: {
    name: 'Fast-Fashion Polyester T-Shirt',
    category: 'Shopping',
    carbonScore: 28,
    sustainabilityScore: 'D-',
    emissionsKg: 12.5,
    analysis: 'Polyester is made of petroleum fibers. Its manufacture consumes massive power, and washing releases plastic fibers into oceans.',
    alternatives: [
      { name: 'GOTS Certified Organic Cotton Tee', reduction: '60% savings', description: 'Organic farming uses natural irrigation and zero toxic pesticides.' },
      { name: 'Second-hand Thrift Shop Find', reduction: '90% savings', description: 'Extend the life of existing garments to save high manufacturing costs.' }
    ]
  },
  new_smartphone: {
    name: 'New Generation Smartphone',
    category: 'Shopping',
    carbonScore: 18,
    sustainabilityScore: 'E',
    emissionsKg: 85.0,
    analysis: 'Over 80% of a smartphone\'s lifetime footprint comes from raw material extraction (cobalt, lithium) and high-heat fabrication.',
    alternatives: [
      { name: 'Refurbished Smartphone', reduction: '82% savings', description: 'Buy certified pre-owned devices, extending electronics lifecycle.' },
      { name: 'Repair current phone battery', reduction: '95% savings', description: 'Replacing battery/screen instead of upgrade prevents e-waste.' }
    ]
  }
};

/**
 * Returns mock scanning result for a item code key.
 * @param {string} key 
 * @returns {object} Scanned product payload.
 */
export function getProductScanResult(key) {
  const item = SCANNER_PRODUCTS[key];
  if (!item) {
    return {
      name: 'Unknown Mixed Waste Item',
      category: 'Shopping',
      carbonScore: 50,
      sustainabilityScore: 'C',
      emissionsKg: 1.5,
      analysis: 'Unidentified waste product. Sorting this properly in recycling helps avoid processing contamination.',
      alternatives: [
        { name: 'Reduce usage', reduction: 'Varies', description: 'Choose package-free buying options where possible.' }
      ]
    };
  }
  return item;
}

/**
 * AI Coach Response engine.
 * Generates custom advice based on users current footprint and specific inputs.
 * @param {string} userMessage - Sanitize message before checking queries.
 * @param {number} totalEmissions - Total calculated emissions of the user.
 * @param {Array} activities - List of logged activities.
 * @returns {string} Sanitized text answer.
 */
export function getCoachResponse(userMessage, totalEmissions, activities) {
  const query = sanitizeString(userMessage).toLowerCase();
  
  // Analyze activities to find high emitters
  const categories = { transport: 0, energy: 0, food: 0, shopping: 0 };
  activities.forEach(act => {
    if (categories[act.category] !== undefined) {
      categories[act.category] += act.emissions;
    }
  });

  const maxCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
  
  if (query.includes('hi') || query.includes('hello') || query.includes('coach') || query.includes('welcome')) {
    return `Hello there! I am your AI Sustainability Coach. I have analyzed your carbon logs. 
      Your total logged emissions are **${totalEmissions.toFixed(1)} kg CO2e**. 
      Your highest impact source is **${maxCategory}** (emitting **${categories[maxCategory].toFixed(1)} kg CO2e**). 
      
      How can I assist you today? You can ask me about:
      - "How to reduce transport emissions?"
      - "Tips for saving energy?"
      - "What is a sustainable food diet?"
      - "Analyze my carbon footprint."`;
  }
  
  if (query.includes('transport') || query.includes('car') || query.includes('drive') || query.includes('flight')) {
    return `Transport represents a major chunk of individual emissions. 
      1. **Avoid single-occupant car drives**: Walk or bike for trips under 2 miles.
      2. **Use public transit**: Trains emit 80% less and buses 65% less than conventional petrol cars per mile.
      3. **Limit flights**: One short-haul flight can add **150 kg CO2e**. Try taking trains or using video conferencing.`;
  }
  
  if (query.includes('energy') || query.includes('electricity') || query.includes('gas') || query.includes('power')) {
    return `Home energy carbon emissions come from power plants burning fossil fuels.
      1. **Set thermostat wisely**: Lowering heating by 1°C saves up to 8% energy.
      2. **Unplug vampire loads**: Unplug chargers when not in use. They leak power.
      3. **Switch to LED bulbs**: LEDs use 80% less electricity than incandescent bulbs and last 25 times longer.
      4. **Switch to clean electricity**: Look into green energy tariffs in your area.`;
  }
  
  if (query.includes('diet') || query.includes('food') || query.includes('meat') || query.includes('beef')) {
    return `Food choices have an immediate, daily impact on carbon.
      1. **Cut beef and lamb**: One serving of beef creates **4.5 kg CO2e**, which is 18x higher than grain or local vegetables.
      2. **Buy local and seasonal**: Reduces 'food miles' and refrigerated transport footprints.
      3. **Eliminate food waste**: 30% of global food is wasted. Compost organic scrap so it doesn't emit methane in standard landfill dumps.`;
  }
  
  if (query.includes('analyze') || query.includes('footprint') || query.includes('stats') || query.includes('report')) {
    let summary = `Here is your custom **Emissions Audit**:
      - **Transport footprint**: ${categories.transport.toFixed(1)} kg CO2e
      - **Energy footprint**: ${categories.energy.toFixed(1)} kg CO2e
      - **Food footprint**: ${categories.food.toFixed(1)} kg CO2e
      - **Shopping footprint**: ${categories.shopping.toFixed(1)} kg CO2e
      
      Total footprint: **${totalEmissions.toFixed(1)} kg CO2e**.
      `;
      
    if (totalEmissions > 500) {
      summary += `\n**Recommendation**: Your footprint is high. Focus first on reducing **${maxCategory}** activities. Let's try activating a Community Challenge to build positive habits!`;
    } else {
      summary += `\n**Recommendation**: Wonderful work! You are keeping a lean footprint. Consider planting trees through community goals to offset your remaining emissions.`;
    }
    return summary;
  }
  
  return `I understand you are asking about: "${userMessage}". To reduce your carbon footprint, focus on small daily habits. Try walking instead of driving, reducing red meat, and turning off idle appliances. Every step counts! Ask me specific questions like "energy tips" or "food diet advice" for detailed strategies.`;
}
