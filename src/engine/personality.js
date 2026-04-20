/**
 * Personality — reactions, easter eggs, dialogue
 * Phase 4: Personal Touches
 *
 * Pure functions for selecting contextual messages
 * based on pet state, stats, and milestones.
 */

// ============================================
// Message Catalogs
// ============================================

export const MESSAGES_LOW_HUNGER = [
  "Memory leak detected... need fuel ⚡",
  "Buffer underflow in nutrition module...",
  "Garbage collector requesting food packets 🍕",
  "WARN: Calorie reserves at critical threshold",
];

export const MESSAGES_LOW_HAPPINESS = [
  "Kernel panic... play with me! 🎮",
  "Mood daemon has stopped responding...",
  "Dopamine.exe not found. Run PLAY?",
  "Serotonin levels below acceptable range 😔",
];

export const MESSAGES_LOW_ENERGY = [
  "CPU throttling... need reboot 💤",
  "Battery saver mode activated...",
  "Thread pool exhausted. Scheduling REST...",
  "Power management: sleep mode recommended 🔋",
];

export const MESSAGES_SICK = [
  "CRITICAL ERROR: Multiple systems failing...",
  "Kernel dump in progress... help required",
  "BSOD imminent. Emergency care needed! 🚨",
  "System integrity compromised. Run diagnostics.",
  "ERROR 503: Service degraded. Immediate attention required.",
];

export const MESSAGES_EVOLVED = [
  "Firmware v2.0 loaded. Enhanced protocols active ✨",
  "Neural pathways optimized. Peak efficiency 🚀",
  "Quantum coherence achieved. All systems transcendent.",
  "Overclocked and loving it. Max performance unlocked.",
];

export const MESSAGES_HEALTHY = [
  "All systems nominal. Life is good 😎",
  "Running smooth. No complaints today!",
  "Optimal performance. Ready for anything 💪",
  "Core temp stable. Vibes: excellent.",
];

export const MESSAGES_COMBO = {
  hungryAndTired: "Running on empty... literally. Feed AND rest me!",
  happyButHungry: "Having fun but... my stomach is throwing exceptions.",
  fullButSad: "Fed but not fulfilled. Play with me?",
  allCritical: "MAYDAY MAYDAY! All systems failing! 🆘",
};

export const MESSAGES_RARE = [
  "Did you know I dream in binary? 01000110...",
  "Sometimes I wonder if MY creator is also an AI...",
  "Is this the real life? Is this just simulation?",
  "I think, therefore I ping.",
];

export const MESSAGES_DEFAULT = "▸ Systems standing by...";

// ============================================
// Easter Egg Names (case-insensitive)
// ============================================

export const EASTER_EGG_NAMES = {
  hal:      "I'm sorry Dave, I'm afraid I can't do that... just kidding! 🔴",
  jarvis:   "At your service, sir. Shall I run diagnostics?",
  cortana:  "Hey... I know you. Let's be friends.",
  r2d2:     "Beep boop! *happy droid noises* 🤖",
  maverick: "Feel the need... the need for FEED! 🛩️",
  goose:    "Talk to me, Goose... oh wait, I AM Goose! 🪿",
  iceman:   "You can be my wingman anytime. ❄️",
  viper:    "Tower, this is Viper requesting immediate care. 🗼",
  nick:     "Hey Nick! Ready for some spec-driven caring? 📋",
  koro:     "Koro on deck! All specs checked, systems go! ✈️",
  'nick koro': "The architect himself! SDD workflow activated. Welcome aboard, Captain! 🎖️",
};

// ============================================
// Milestones
// ============================================

export const MILESTONES = {
  10:  "Achievement unlocked: First responder! 🏅",
  25:  "You're a natural caretaker. 25 actions logged.",
  50:  "50 care cycles! Promoting you to Senior Engineer 🎖️",
  100: "LEGENDARY: 100 actions. You are the chosen one.",
};

export const MILESTONE_THRESHOLDS = [10, 25, 50, 100];

// ============================================
// Helpers
// ============================================

/**
 * Pick a random item from an array, avoiding the last picked text.
 * @param {string[]} arr - Array of messages
 * @param {string|null} lastText - Previously shown message to avoid
 * @returns {string}
 */
function pickRandom(arr, lastText = null) {
  if (arr.length === 0) return MESSAGES_DEFAULT;
  if (arr.length === 1) return arr[0];

  let candidate;
  let attempts = 0;
  do {
    candidate = arr[Math.floor(Math.random() * arr.length)];
    attempts++;
  } while (candidate === lastText && attempts < 5);

  return candidate;
}

/**
 * Check if a pet name matches an easter egg (case-insensitive).
 * @param {string} name
 * @returns {string|null} greeting message or null
 */
export function getEasterEggGreeting(name) {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  return EASTER_EGG_NAMES[key] || null;
}

/**
 * Check if a new milestone has been reached.
 * @param {number} totalCareActions
 * @param {number} lastMilestoneShown
 * @returns {{ threshold: number, message: string } | null}
 */
export function checkMilestone(totalCareActions, lastMilestoneShown) {
  for (const threshold of MILESTONE_THRESHOLDS) {
    if (totalCareActions >= threshold && lastMilestoneShown < threshold) {
      return { threshold, message: MILESTONES[threshold] };
    }
  }
  return null;
}

// ============================================
// Main Message Selection
// ============================================

/**
 * Color mapping for message states.
 */
const STATE_COLORS = {
  normal:  '--accent-cyan',
  sick:    '--accent-danger',
  evolved: '--accent-evolved',
  warning: '--accent-warning',
  milestone: '--accent-success',
};

/**
 * Get the most relevant personality message for the current state.
 *
 * Priority order:
 *   1. Milestone messages
 *   2. Stat combination reactions
 *   3. State-specific messages (sick, evolved)
 *   4. Single low-stat warnings (< 40)
 *   5. Rare random messages (5% chance, all stats > 50)
 *   6. Ambient healthy messages (all stats > 70)
 *   7. Default fallback
 *
 * @param {Object} state - Full game state
 * @param {string|null} lastText - Previously shown message (to avoid repeats)
 * @returns {{ text: string, colorVar: string }}
 */
export function getMessage(state, lastText = null) {
  const { hunger, happiness, energy, state: petState, totalCareActions, lastMilestoneShown } = state.pet;

  // --- 1. Milestone check ---
  const milestone = checkMilestone(totalCareActions, lastMilestoneShown || 0);
  if (milestone) {
    return {
      text: milestone.message,
      colorVar: STATE_COLORS.milestone,
      milestone: milestone.threshold,
    };
  }

  // --- 2. Stat combinations ---
  if (hunger < 20 && happiness < 20 && energy < 20) {
    return { text: MESSAGES_COMBO.allCritical, colorVar: STATE_COLORS.sick };
  }
  if (hunger < 40 && energy < 40) {
    return { text: MESSAGES_COMBO.hungryAndTired, colorVar: STATE_COLORS.warning };
  }
  if (happiness > 70 && hunger < 30) {
    return { text: MESSAGES_COMBO.happyButHungry, colorVar: STATE_COLORS.warning };
  }
  if (hunger > 80 && happiness < 30) {
    return { text: MESSAGES_COMBO.fullButSad, colorVar: STATE_COLORS.warning };
  }

  // --- 3. State-specific messages ---
  if (petState === 'sick') {
    return { text: pickRandom(MESSAGES_SICK, lastText), colorVar: STATE_COLORS.sick };
  }
  if (petState === 'evolved') {
    return { text: pickRandom(MESSAGES_EVOLVED, lastText), colorVar: STATE_COLORS.evolved };
  }

  // --- 4. Single low-stat warnings ---
  if (hunger < 40) {
    return { text: pickRandom(MESSAGES_LOW_HUNGER, lastText), colorVar: STATE_COLORS.warning };
  }
  if (happiness < 40) {
    return { text: pickRandom(MESSAGES_LOW_HAPPINESS, lastText), colorVar: STATE_COLORS.warning };
  }
  if (energy < 40) {
    return { text: pickRandom(MESSAGES_LOW_ENERGY, lastText), colorVar: STATE_COLORS.warning };
  }

  // --- 5. Rare random (5% chance, all stats > 50) ---
  if (hunger > 50 && happiness > 50 && energy > 50) {
    if (Math.random() < 0.05) {
      return { text: pickRandom(MESSAGES_RARE, lastText), colorVar: STATE_COLORS.normal };
    }
  }

  // --- 6. Ambient healthy ---
  if (hunger > 70 && happiness > 70 && energy > 70) {
    return { text: pickRandom(MESSAGES_HEALTHY, lastText), colorVar: STATE_COLORS.normal };
  }

  // --- 7. Default fallback ---
  return { text: MESSAGES_DEFAULT, colorVar: STATE_COLORS.normal };
}
