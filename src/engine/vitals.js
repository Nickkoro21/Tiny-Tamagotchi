/**
 * Vitals — stat decay and update logic
 * Phase 1: Living Vitals
 */

/**
 * Decay rates per minute (configurable).
 * Target drain times from full (100 → 0):
 *   Hunger:    30 seconds  → 200/min
 *   Happiness: 20 seconds  → 300/min
 *   Energy:    45 seconds  → 133.33/min
 */
export const DECAY_RATES = {
  hunger: 200,
  happiness: 300,
  energy: 133.33,
};

/** Maximum catch-up time in ms (10 minutes) */
const MAX_CATCHUP_MS = 10 * 60 * 1000;

/** Clamp a value between min and max */
export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Apply stat decay based on elapsed time.
 * Pure function: (state, elapsedMs) → newState
 * 
 * @param {Object} state - Current game state
 * @param {number} elapsedMs - Milliseconds since last tick
 * @returns {Object} New state with decayed stats
 */
export function applyDecay(state, elapsedMs) {
  if (elapsedMs <= 0) return state;

  // Cap catch-up to prevent jarring drops
  const cappedMs = Math.min(elapsedMs, MAX_CATCHUP_MS);
  const elapsedMinutes = cappedMs / 60000;

  const pet = state.pet;

  return {
    ...state,
    pet: {
      ...pet,
      hunger: clamp(pet.hunger - DECAY_RATES.hunger * elapsedMinutes),
      happiness: clamp(pet.happiness - DECAY_RATES.happiness * elapsedMinutes),
      energy: clamp(pet.energy - DECAY_RATES.energy * elapsedMinutes),
    },
  };
}

/**
 * Get the visual status level for a stat value.
 * Used for color theming in the UI.
 * 
 * @param {number} value - Stat value (0–100)
 * @returns {'healthy'|'warning'|'low'|'critical'}
 */
export function getStatLevel(value) {
  if (value >= 70) return 'healthy';
  if (value >= 40) return 'warning';
  if (value >= 20) return 'low';
  return 'critical';
}


// ============================================
// Phase 2: Care Actions
// ============================================

/** Action effect definitions */
export const ACTION_EFFECTS = {
  feed:  { hunger: +30, happiness: +5,  energy: 0 },
  play:  { hunger: 0,   happiness: +25, energy: -10 },
  rest:  { hunger: 0,   happiness: +5,  energy: +35 },
};

/** Cooldown durations in milliseconds */
export const COOLDOWNS = {
  feed: 3000,
  play: 4000,
  rest: 5000,
};

/**
 * Apply a care action to the game state.
 * Pure function: (state, actionType) → newState
 */
function applyAction(state, actionType) {
  const effects = ACTION_EFFECTS[actionType];
  if (!effects) return state;

  const now = Date.now();
  const pet = state.pet;

  const timestampKey = {
    feed: 'lastFed',
    play: 'lastPlayed',
    rest: 'lastRested',
  }[actionType];

  return {
    ...state,
    pet: {
      ...pet,
      hunger: clamp(pet.hunger + effects.hunger),
      happiness: clamp(pet.happiness + effects.happiness),
      energy: clamp(pet.energy + effects.energy),
      totalCareActions: pet.totalCareActions + 1,
      [timestampKey]: now,
    },
  };
}

/** Feed the pet: Hunger +30, Happiness +5 */
export function feedPet(state) {
  return applyAction(state, 'feed');
}

/** Play with the pet: Happiness +25, Energy -10 */
export function playWithPet(state) {
  return applyAction(state, 'play');
}

/** Rest the pet: Energy +35, Happiness +5 */
export function restPet(state) {
  return applyAction(state, 'rest');
}
