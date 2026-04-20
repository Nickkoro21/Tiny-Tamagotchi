import { describe, it, expect } from 'vitest';
import {
  getMessage,
  getEasterEggGreeting,
  checkMilestone,
  MESSAGES_LOW_HUNGER,
  MESSAGES_LOW_HAPPINESS,
  MESSAGES_LOW_ENERGY,
  MESSAGES_SICK,
  MESSAGES_EVOLVED,
  MESSAGES_HEALTHY,
  MESSAGES_RARE,
  MESSAGES_COMBO,
  EASTER_EGG_NAMES,
  MILESTONES,
  MILESTONE_THRESHOLDS,
} from '../src/engine/personality.js';
import { createInitialState } from '../src/engine/gameState.js';

// ============================================
// Helper: create state with custom pet values
// ============================================
function makeState(overrides = {}) {
  const base = createInitialState('TestBot');
  return {
    ...base,
    pet: { ...base.pet, ...overrides },
  };
}

// ============================================
// Message Catalog Tests
// ============================================
describe('message catalogs', () => {
  it('low hunger messages has 4+ entries', () => {
    expect(MESSAGES_LOW_HUNGER.length).toBeGreaterThanOrEqual(4);
  });

  it('low happiness messages has 4+ entries', () => {
    expect(MESSAGES_LOW_HAPPINESS.length).toBeGreaterThanOrEqual(4);
  });

  it('low energy messages has 4+ entries', () => {
    expect(MESSAGES_LOW_ENERGY.length).toBeGreaterThanOrEqual(4);
  });

  it('sick messages has 4+ entries', () => {
    expect(MESSAGES_SICK.length).toBeGreaterThanOrEqual(4);
  });

  it('evolved messages has 4+ entries', () => {
    expect(MESSAGES_EVOLVED.length).toBeGreaterThanOrEqual(4);
  });

  it('healthy ambient messages has 4+ entries', () => {
    expect(MESSAGES_HEALTHY.length).toBeGreaterThanOrEqual(4);
  });

  it('rare messages pool has 4+ entries', () => {
    expect(MESSAGES_RARE.length).toBeGreaterThanOrEqual(4);
  });

  it('all messages are non-empty strings', () => {
    const allMessages = [
      ...MESSAGES_LOW_HUNGER,
      ...MESSAGES_LOW_HAPPINESS,
      ...MESSAGES_LOW_ENERGY,
      ...MESSAGES_SICK,
      ...MESSAGES_EVOLVED,
      ...MESSAGES_HEALTHY,
      ...MESSAGES_RARE,
    ];
    for (const msg of allMessages) {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
    }
  });
});

// ============================================
// Message Selection Priority
// ============================================
describe('getMessage priority', () => {
  it('returns healthy ambient when all stats > 70, normal state', () => {
    const state = makeState({ hunger: 90, happiness: 85, energy: 80 });
    const result = getMessage(state);
    expect(MESSAGES_HEALTHY).toContain(result.text);
  });

  it('returns hunger warning when hunger < 40', () => {
    const state = makeState({ hunger: 30, happiness: 80, energy: 80 });
    const result = getMessage(state);
    expect(MESSAGES_LOW_HUNGER).toContain(result.text);
  });

  it('returns happiness warning when happiness < 40', () => {
    const state = makeState({ hunger: 80, happiness: 25, energy: 80 });
    const result = getMessage(state);
    expect(MESSAGES_LOW_HAPPINESS).toContain(result.text);
  });

  it('returns energy warning when energy < 40', () => {
    const state = makeState({ hunger: 80, happiness: 80, energy: 35 });
    const result = getMessage(state);
    expect(MESSAGES_LOW_ENERGY).toContain(result.text);
  });

  it('sick state overrides single-stat warnings', () => {
    const state = makeState({ state: 'sick', hunger: 30, happiness: 30, energy: 30 });
    const result = getMessage(state);
    expect(MESSAGES_SICK).toContain(result.text);
    expect(result.colorVar).toBe('--accent-danger');
  });

  it('evolved state returns evolved message', () => {
    const state = makeState({ state: 'evolved', hunger: 80, happiness: 80, energy: 80 });
    const result = getMessage(state);
    expect(MESSAGES_EVOLVED).toContain(result.text);
    expect(result.colorVar).toBe('--accent-evolved');
  });

  it('combo hungry+tired overrides single-stat', () => {
    const state = makeState({ hunger: 30, happiness: 80, energy: 30 });
    const result = getMessage(state);
    expect(result.text).toBe(MESSAGES_COMBO.hungryAndTired);
  });

  it('combo happy but hungry triggers correctly', () => {
    const state = makeState({ hunger: 25, happiness: 80, energy: 80 });
    const result = getMessage(state);
    expect(result.text).toBe(MESSAGES_COMBO.happyButHungry);
  });

  it('all critical combo when all stats < 20', () => {
    const state = makeState({ hunger: 10, happiness: 10, energy: 10 });
    const result = getMessage(state);
    expect(result.text).toBe(MESSAGES_COMBO.allCritical);
  });

  it('returns default when stats are in middle range (40-70)', () => {
    const state = makeState({ hunger: 55, happiness: 55, energy: 55 });
    // Should get either rare random (5%) or default fallback
    const result = getMessage(state);
    expect(typeof result.text).toBe('string');
    expect(result.text.length).toBeGreaterThan(0);
  });
});

// ============================================
// Easter Egg Names
// ============================================
describe('getEasterEggGreeting', () => {
  it('HAL triggers easter egg', () => {
    const result = getEasterEggGreeting('HAL');
    expect(result).toBe(EASTER_EGG_NAMES.hal);
  });

  it('hal (lowercase) triggers easter egg — case-insensitive', () => {
    const result = getEasterEggGreeting('hal');
    expect(result).toBe(EASTER_EGG_NAMES.hal);
  });

  it('Maverick triggers aviation easter egg', () => {
    const result = getEasterEggGreeting('Maverick');
    expect(result).toBe(EASTER_EGG_NAMES.maverick);
  });

  it('Goose triggers aviation easter egg', () => {
    const result = getEasterEggGreeting('Goose');
    expect(result).toBe(EASTER_EGG_NAMES.goose);
  });

  it('Iceman triggers aviation easter egg', () => {
    const result = getEasterEggGreeting('Iceman');
    expect(result).toBe(EASTER_EGG_NAMES.iceman);
  });

  it('Nick triggers personal easter egg', () => {
    const result = getEasterEggGreeting('Nick');
    expect(result).toBe(EASTER_EGG_NAMES.nick);
  });

  it('Koro triggers personal easter egg', () => {
    const result = getEasterEggGreeting('Koro');
    expect(result).toBe(EASTER_EGG_NAMES.koro);
  });

  it('Nick Koro triggers personal easter egg', () => {
    const result = getEasterEggGreeting('Nick Koro');
    expect(result).toBe(EASTER_EGG_NAMES['nick koro']);
  });

  it('RandomName does NOT trigger easter egg', () => {
    const result = getEasterEggGreeting('RandomBot');
    expect(result).toBeNull();
  });

  it('empty string does NOT trigger easter egg', () => {
    const result = getEasterEggGreeting('');
    expect(result).toBeNull();
  });

  it('null does NOT trigger easter egg', () => {
    const result = getEasterEggGreeting(null);
    expect(result).toBeNull();
  });

  it('easter egg names list is exported', () => {
    expect(typeof EASTER_EGG_NAMES).toBe('object');
    expect(Object.keys(EASTER_EGG_NAMES).length).toBeGreaterThanOrEqual(11);
  });
});

// ============================================
// Milestones
// ============================================
describe('checkMilestone', () => {
  it('triggers at 10 actions when lastMilestoneShown is 0', () => {
    const result = checkMilestone(10, 0);
    expect(result).not.toBeNull();
    expect(result.threshold).toBe(10);
    expect(result.message).toBe(MILESTONES[10]);
  });

  it('does NOT re-trigger at 10 when already shown', () => {
    const result = checkMilestone(10, 10);
    expect(result).toBeNull();
  });

  it('triggers at 25 when lastMilestoneShown is 10', () => {
    const result = checkMilestone(25, 10);
    expect(result).not.toBeNull();
    expect(result.threshold).toBe(25);
  });

  it('triggers at 50 when lastMilestoneShown is 25', () => {
    const result = checkMilestone(50, 25);
    expect(result).not.toBeNull();
    expect(result.threshold).toBe(50);
  });

  it('triggers at 100 when lastMilestoneShown is 50', () => {
    const result = checkMilestone(100, 50);
    expect(result).not.toBeNull();
    expect(result.threshold).toBe(100);
  });

  it('returns null when no milestone threshold is reached', () => {
    const result = checkMilestone(15, 10);
    expect(result).toBeNull();
  });

  it('milestone message in getMessage takes priority', () => {
    const state = makeState({
      totalCareActions: 10,
      lastMilestoneShown: 0,
      hunger: 30, // Would normally trigger hunger warning
    });
    const result = getMessage(state);
    expect(result.text).toBe(MILESTONES[10]);
    expect(result.milestone).toBe(10);
  });
});

// ============================================
// Rare Random Messages
// ============================================
describe('rare random messages', () => {
  it('rare message only possible when all stats > 50', () => {
    // With one stat ≤ 50, should never get a rare message
    const state = makeState({ hunger: 45, happiness: 60, energy: 60 });
    // Run 100 times — should never get a rare message
    for (let i = 0; i < 100; i++) {
      const result = getMessage(state);
      expect(MESSAGES_RARE).not.toContain(result.text);
    }
  });
});

// ============================================
// No Repeat
// ============================================
describe('message repeat avoidance', () => {
  it('avoids repeating lastText when possible', () => {
    const state = makeState({ state: 'sick' });
    const first = getMessage(state);
    // Request again with lastText = first message
    // With 5 messages, should get a different one (statistically almost always)
    let gotDifferent = false;
    for (let i = 0; i < 20; i++) {
      const second = getMessage(state, first.text);
      if (second.text !== first.text) {
        gotDifferent = true;
        break;
      }
    }
    expect(gotDifferent).toBe(true);
  });
});
