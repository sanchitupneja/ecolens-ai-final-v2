import { describe, it, expect } from 'vitest';
import { calculateEmissions, getEmissionsRating } from '../../utils/emissionsCalculator';

describe('Emissions Calculator Utility', () => {
  it('correctly calculates car petrol emission output', () => {
    // 100 miles in gasoline car * 0.404 factor = 40.4 kg CO2
    const emissions = calculateEmissions('transport', 'car_petrol', 100);
    expect(emissions).toBe(40.4);
  });

  it('correctly calculates flight emissions', () => {
    // 3 hours short flight * 150 factor = 450 kg CO2
    const emissions = calculateEmissions('transport', 'flight_short', 3);
    expect(emissions).toBe(450);
  });

  it('correctly handles zero emission travel types', () => {
    const walkEm = calculateEmissions('transport', 'walk', 25);
    const bikeEm = calculateEmissions('transport', 'bicycle', 50);
    expect(walkEm).toBe(0);
    expect(bikeEm).toBe(0);
  });

  it('handles invalid category/type references gracefully', () => {
    expect(calculateEmissions('invalid_cat', 'type', 10)).toBe(0);
    expect(calculateEmissions('transport', 'warp_drive', 10)).toBe(0);
  });

  it('determines the correct rating brackets based on monthly kg CO2', () => {
    expect(getEmissionsRating(150).label).toBe('Eco-Champion');
    expect(getEmissionsRating(400).label).toBe('Climate Conscious');
    expect(getEmissionsRating(800).label).toBe('Moderate Impact');
    expect(getEmissionsRating(1200).label).toBe('High Footprint');
  });
});
