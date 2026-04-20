/**
 * localStorage persistence — auto-save/load
 * Phase 2: Care Loop
 * Phase 3: Backward-compatible schema update (sustainedGoodCareStart)
 * Phase 4: Added lastMilestoneShown backfill
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

    // Phase 3: Backfill missing sustainedGoodCareStart for older saves
    if (state.pet.sustainedGoodCareStart === undefined) {
      state.pet.sustainedGoodCareStart = null;
    }

    // Phase 4: Backfill missing lastMilestoneShown for older saves
    if (state.pet.lastMilestoneShown === undefined) {
      state.pet.lastMilestoneShown = 0;
    }

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
 * Phase 3: sustainedGoodCareStart is optional (backward compatible).
 * Phase 4: lastMilestoneShown is optional (backward compatible).
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

  // sustainedGoodCareStart: must be null, undefined, or a number
  if (
    pet.sustainedGoodCareStart !== null &&
    pet.sustainedGoodCareStart !== undefined &&
    typeof pet.sustainedGoodCareStart !== 'number'
  ) {
    return false;
  }

  // lastMilestoneShown: must be undefined or a number
  if (
    pet.lastMilestoneShown !== undefined &&
    typeof pet.lastMilestoneShown !== 'number'
  ) {
    return false;
  }

  return true;
}
