/**
 * localStorage persistence — auto-save/load
 * Phase 2: Care Loop
 */

const STORAGE_KEY = 'tamagotchi_save';
const CURRENT_VERSION = '1.0.0';

/**
 * Save game state to localStorage.
 */
export function saveToLocalStorage(state) {
  try {
    const data = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
    return false;
  }
}

/**
 * Load game state from localStorage.
 * Returns null if no save exists or data is invalid.
 */
export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const state = JSON.parse(raw);
    if (!validateState(state)) return null;

    return state;
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
    return null;
  }
}

/**
 * Clear saved state from localStorage.
 */
export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Validate that a state object has the required structure.
 */
export function validateState(state) {
  if (!state || typeof state !== 'object') return false;
  if (!state.pet || typeof state.pet !== 'object') return false;
  if (!state.meta || typeof state.meta !== 'object') return false;
  if (state.meta.version !== CURRENT_VERSION) return false;

  const { pet } = state;
  if (typeof pet.name !== 'string') return false;
  if (typeof pet.hunger !== 'number') return false;
  if (typeof pet.happiness !== 'number') return false;
  if (typeof pet.energy !== 'number') return false;
  if (typeof pet.state !== 'string') return false;

  return true;
}
