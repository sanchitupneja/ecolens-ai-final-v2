import { sanitizeString } from './inputSanitizer';

const STORAGE_KEY = 'ecopulse_user_state';

/**
 * Securely loads state from LocalStorage, validating data types.
 * @returns {object|null} Parsed state or null.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    
    // Basic verification of outer wrapper structure
    const state = JSON.parse(raw);
    if (typeof state !== 'object' || state === null) {
      return null;
    }
    
    // Ensure vital sections exist to avoid runtime crashes
    if (!state.activities || !Array.isArray(state.activities)) {
      state.activities = [];
    }
    if (!state.challenges || !Array.isArray(state.challenges)) {
      state.challenges = [];
    }
    if (!state.profile || typeof state.profile !== 'object') {
      state.profile = { name: 'Eco Explorer', target: 400 };
    }
    if (!state.scannedItems || !Array.isArray(state.scannedItems)) {
      state.scannedItems = [];
    }
    
    // Sanitize string elements inside profile name
    state.profile.name = sanitizeString(state.profile.name || 'Eco Explorer');
    
    return state;
  } catch (error) {
    console.error('Failed to parse local storage state secure load:', error);
    return null;
  }
}

/**
 * Securely writes state into LocalStorage.
 * @param {object} state - Application state.
 * @returns {boolean} True if successful.
 */
export function saveState(state) {
  try {
    if (typeof state !== 'object' || state === null) {
      return false;
    }
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
    return false;
  }
}

/**
 * Clears local state completely.
 */
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}
