/**
 * State Transitions — Normal / Sick / Evolved
 * Phase 3: Dynamic States
 *
 * Pure functions for evaluating pet state transitions
 * and decay rate modifiers.
 */

// ============================================
// Transition Thresholds (configurable constants)
// ============================================

/** Any stat below this triggers Normal → Sick or Evolved → Sick */
export const SICK_THRESHOLD = 20;

/** All stats must be ≥ this to recover from Sick → Normal */
export const RECOVERY_THRESHOLD = 50;

/** Minimum totalCareActions required for evolution */
export const EVOLUTION_CARE_THRESHOLD = 6;

/** All stats must be above this for sustained period to evolve */
export const EVOLUTION_STAT_THRESHOLD = 70;

/** Duration (ms) all stats must stay above EVOLUTION_STAT_THRESHOLD */
export const EVOLUTION_SUSTAINED_MS = 15000;

// ============================================
// Decay Multipliers
// ============================================

const DECAY_MULTIPLIERS = {
  normal: 1.0,
  sick: 1.5,
  evolved: 0.7,
};

/**
 * Get the decay rate multiplier for a given pet state.
 * @param {string} petState - "normal" | "sick" | "evolved"
 * @returns {number} multiplier (defaults to 1.0 for unknown states)
 */
export function getDecayMultiplier(petState) {
  return DECAY_MULTIPLIERS[petState] ?? 1.0;
}

// ============================================
// State Transition Logic
// ============================================

/**
 * Check if any stat is below the sick threshold.
 * @param {Object} pet - Pet state object
 * @returns {boolean}
 */
function isAnySickLevel(pet) {
  return pet.hunger < SICK_THRESHOLD ||
         pet.happiness < SICK_THRESHOLD ||
         pet.energy < SICK_THRESHOLD;
}

/**
 * Check if all stats are at or above the recovery threshold.
 * @param {Object} pet - Pet state object
 * @returns {boolean}
 */
function isAllRecovered(pet) {
  return pet.hunger >= RECOVERY_THRESHOLD &&
         pet.happiness >= RECOVERY_THRESHOLD &&
         pet.energy >= RECOVERY_THRESHOLD;
}

/**
 * Check if all stats are above the evolution stat threshold.
 * @param {Object} pet - Pet state object
 * @returns {boolean}
 */
function isAllAboveEvolutionThreshold(pet) {
  return pet.hunger > EVOLUTION_STAT_THRESHOLD &&
         pet.happiness > EVOLUTION_STAT_THRESHOLD &&
         pet.energy > EVOLUTION_STAT_THRESHOLD;
}

/**
 * Evaluate state transitions based on current pet stats.
 * Pure function: (state, now?) → newState
 *
 * Transition rules:
 *   Normal  → Sick:    any stat < 20
 *   Sick    → Normal:  all stats ≥ 50
 *   Normal  → Evolved: totalCareActions ≥ 6 AND all stats > 70 for 15s
 *   Evolved → Sick:    any stat < 20
 *
 * @param {Object} state - Full game state object
 * @param {number} [now=Date.now()] - Current timestamp (injectable for testing)
 * @returns {Object} New state with updated pet.state and pet.sustainedGoodCareStart
 */
export function evaluateStateTransition(state, now = Date.now()) {
  const pet = state.pet;
  let newPetState = pet.state;
  let newSustainedStart = pet.sustainedGoodCareStart;

  switch (pet.state) {
    case 'normal': {
      // --- Check Normal → Sick ---
      if (isAnySickLevel(pet)) {
        newPetState = 'sick';
        newSustainedStart = null;
        break;
      }

      // --- Check Normal → Evolved ---
      if (isAllAboveEvolutionThreshold(pet)) {
        // Start tracking sustained care if not already
        if (newSustainedStart === null || newSustainedStart === undefined) {
          newSustainedStart = now;
        }

        // Check if sustained long enough AND enough care actions
        const sustainedDuration = now - newSustainedStart;
        if (
          pet.totalCareActions >= EVOLUTION_CARE_THRESHOLD &&
          sustainedDuration >= EVOLUTION_SUSTAINED_MS
        ) {
          newPetState = 'evolved';
          // Keep sustainedGoodCareStart as-is (no longer needed but preserved)
        }
      } else {
        // Stats dropped to ≤ 70, reset sustained timer
        newSustainedStart = null;
      }
      break;
    }

    case 'sick': {
      // --- Check Sick → Normal ---
      if (isAllRecovered(pet)) {
        newPetState = 'normal';
        newSustainedStart = null; // Must re-earn evolution
      }
      // While sick, no sustained care tracking
      break;
    }

    case 'evolved': {
      // --- Check Evolved → Sick ---
      if (isAnySickLevel(pet)) {
        newPetState = 'sick';
        newSustainedStart = null;
      }
      // Evolved pet stays evolved otherwise (no tracking needed)
      break;
    }

    default:
      // Unknown state — reset to normal
      newPetState = 'normal';
      newSustainedStart = null;
  }

  // Only create new state if something changed
  if (newPetState === pet.state && newSustainedStart === pet.sustainedGoodCareStart) {
    return state;
  }

  return {
    ...state,
    pet: {
      ...pet,
      state: newPetState,
      sustainedGoodCareStart: newSustainedStart,
    },
  };
}
