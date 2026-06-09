import React, { createContext, useReducer, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { calculateEmissions } from '../utils/emissionsCalculator';
import { sanitizeString, sanitizeNumber } from '../utils/inputSanitizer';

// Initial state definition
const DEFAULT_STATE = {
  profile: {
    name: 'Eco Explorer',
    target: 400 // target monthly emissions in kg CO2
  },
  activities: [
    // Pre-populate some historical data so the dashboard charts look gorgeous and complete on first load
    { id: '1', category: 'transport', type: 'car_petrol', quantity: 200, emissions: 80.8, date: '2026-06-01', notes: 'Daily commute' },
    { id: '2', category: 'energy', type: 'electricity_kwh', quantity: 350, emissions: 134.75, date: '2026-06-03', notes: 'Monthly utility bill' },
    { id: '3', category: 'food', type: 'beef', quantity: 8, emissions: 36.0, date: '2026-06-05', notes: 'Steak meals' },
    { id: '4', category: 'shopping', type: 'clothing', quantity: 2, emissions: 25.0, date: '2026-06-06', notes: 'Bought denim' },
    { id: '5', category: 'transport', type: 'bus', quantity: 50, emissions: 7.0, date: '2026-06-07', notes: 'Transit to downtown' }
  ],
  challenges: [
    { id: 'car_free_day', name: 'Car-Free Commute', points: 120, category: 'transport', description: 'Log a walk or bicycle ride instead of a car drive.', status: 'available' },
    { id: 'meatless_sunday', name: 'Meatless Day', points: 100, category: 'food', description: 'Avoid beef and poultry for an entire day to reduce methane emissions.', status: 'available' },
    { id: 'unplug_standby', name: 'Standby Killer', points: 60, category: 'energy', description: 'Unplug high-draw electronics (TVs, game consoles) overnight.', status: 'available' },
    { id: 'zero_waste_shop', name: 'Package Free Hero', points: 90, category: 'shopping', description: 'Shop with zero single-use plastics and write a note.', status: 'available' }
  ],
  scannedItems: [],
  badges: ['Eco First Step'],
  points: 150
};

export const CarbonContext = createContext(null);

function carbonReducer(state, action) {
  switch (action.type) {
    case 'ADD_ACTIVITY': {
      const { category, type, quantity, date, notes } = action.payload;
      const cleanQuantity = sanitizeNumber(quantity);
      const cleanNotes = sanitizeString(notes || '');
      const emissions = calculateEmissions(category, type, cleanQuantity);
      
      const newActivity = {
        id: Date.now().toString(),
        category,
        type,
        quantity: cleanQuantity,
        emissions,
        date: date || new Date().toISOString().split('T')[0],
        notes: cleanNotes
      };
      
      // Check for potential badge unlocks
      const newBadges = [...state.badges];
      if (state.activities.length === 0 && !newBadges.includes('Active Tracker')) {
        newBadges.push('Active Tracker');
      }
      if (newActivity.emissions > 100 && !newBadges.includes('Heavy Load')) {
        newBadges.push('Carbon Aware');
      }
      
      return {
        ...state,
        activities: [newActivity, ...state.activities],
        badges: newBadges
      };
    }
    
    case 'REMOVE_ACTIVITY': {
      const filtered = state.activities.filter(act => act.id !== action.payload);
      return {
        ...state,
        activities: filtered
      };
    }
    
    case 'CLAIM_CHALLENGE': {
      const challengeId = action.payload;
      let addedPoints = 0;
      const updatedChallenges = state.challenges.map(chal => {
        if (chal.id === challengeId && chal.status === 'available') {
          addedPoints = chal.points;
          return { ...chal, status: 'completed' };
        }
        return chal;
      });
      
      if (addedPoints === 0) return state; // Avoid duplicate claims
      
      const newBadges = [...state.badges];
      const completedCount = updatedChallenges.filter(c => c.status === 'completed').length;
      if (completedCount >= 1 && !newBadges.includes('Challenger Initiate')) {
        newBadges.push('Challenger Initiate');
      }
      if (completedCount >= 3 && !newBadges.includes('Sustainer Master')) {
        newBadges.push('Sustainer Master');
      }
      
      return {
        ...state,
        challenges: updatedChallenges,
        points: state.points + addedPoints,
        badges: newBadges
      };
    }
    
    case 'ADD_SCANNED_ITEM': {
      const newItem = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString()
      };
      
      const newBadges = [...state.badges];
      if (!newBadges.includes('Visionary Scanner')) {
        newBadges.push('Visionary Scanner');
      }
      
      return {
        ...state,
        scannedItems: [newItem, ...state.scannedItems],
        badges: newBadges
      };
    }
    
    case 'UPDATE_PROFILE': {
      const { name, target } = action.payload;
      return {
        ...state,
        profile: {
          name: sanitizeString(name || state.profile.name),
          target: sanitizeNumber(target, 400)
        }
      };
    }
    
    case 'RESET_STATE': {
      return {
        ...DEFAULT_STATE,
        points: 0,
        badges: ['Eco First Step'],
        activities: [],
        scannedItems: []
      };
    }
    
    default:
      return state;
  }
}

export const CarbonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carbonReducer, null, () => {
    const local = loadState();
    return local || DEFAULT_STATE;
  });

  // Sync state to localStorage on modification
  useEffect(() => {
    if (state) {
      saveState(state);
    }
  }, [state]);

  return (
    <CarbonContext.Provider value={{ state, dispatch }}>
      {children}
    </CarbonContext.Provider>
  );
};
