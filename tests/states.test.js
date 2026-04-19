import { describe, it, expect } from 'vitest';
import {
  evaluateStateTransition,
  getDecayMultiplier,
  SICK_THRESHOLD,
  RECOVERY_THRESHOLD,
  EVOLUTION_CARE_THRESHOLD,
  EVOLUTION_STAT_THRESHOLD,
  EVOLUTION_SUSTAINED_MS,
} from '../src/engine/states.js';
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
// Exported Constants
// ============================================
describe('exported constants', () => {
  it('SICK_THRESHOLD equals 20', () => {
    expect(SICK_THRESHOLD).toBe(20);
  });

  it('RECOVERY_THRESHOLD equals 50', () => {
    expect(RECOVERY_THRESHOLD).toBe(50);
  });

  it('EVOLUTION_CARE_THRESHOLD equals 6', () => {
    expect(EVOLUTION_CARE_THRESHOLD).toBe(6);
  });

  it('EVOLUTION_STAT_THRESHOLD equals 70', () => {
    expect(EVOLUTION_STAT_THRESHOLD).toBe(70);
  });

  it('EVOLUTION_SUSTAINED_MS equals 15000', () => {
    expect(EVOLUTION_SUSTAINED_MS).toBe(15000);
  });
});

// ============================================
// Decay Multipliers
// ============================================
describe('getDecayMultiplier', () => {
  it('returns 1.0 for normal', () => {
    expect(getDecayMultiplier('normal')).toBe(1.0);
  });

  it('returns 1.5 for sick', () => {
    expect(getDecayMultiplier('sick')).toBe(1.5);
  });

  it('returns 0.7 for evolved', () => {
    expect(getDecayMultiplier('evolved')).toBe(0.7);
  });

  it('returns 1.0 for unknown state (safe fallback)', () => {
    expect(getDecayMultiplier('unknown')).toBe(1.0);
    expect(getDecayMultiplier('')).toBe(1.0);
  });
});

// ============================================
// State Transitions: Normal
// ============================================
describe('Normal state transitions', () => {
  it('stays normal when all stats are healthy', () => {
    const state = makeState({ state: 'normal', hunger: 80, happiness: 75, energy: 90 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('normal');
  });

  it('transitions to sick when hunger drops below 20', () => {
    const state = makeState({ state: 'normal', hunger: 15, happiness: 80, energy: 80 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('sick');
  });

  it('transitions to sick when happiness drops below 20', () => {
    const state = makeState({ state: 'normal', hunger: 80, happiness: 10, energy: 80 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('sick');
  });

  it('transitions to sick when energy drops below 20', () => {
    const state = makeState({ state: 'normal', hunger: 80, happiness: 80, energy: 19 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('sick');
  });

  it('does NOT transition to sick at exactly 20', () => {
    const state = makeState({ state: 'normal', hunger: 20, happiness: 20, energy: 20 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('normal');
  });

  it('resets sustainedGoodCareStart on sick transition', () => {
    const state = makeState({
      state: 'normal',
      hunger: 15,
      sustainedGoodCareStart: Date.now() - 10000,
    });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('sick');
    expect(result.pet.sustainedGoodCareStart).toBeNull();
  });
});

// ============================================
// State Transitions: Sick
// ============================================
describe('Sick state transitions', () => {
  it('recovers to normal when all stats >= 50', () => {
    const state = makeState({ state: 'sick', hunger: 55, happiness: 60, energy: 50 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('normal');
  });

  it('stays sick when one stat is still below 50', () => {
    const state = makeState({ state: 'sick', hunger: 45, happiness: 60, energy: 55 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('sick');
  });

  it('recovers at exactly 50 (threshold is >=)', () => {
    const state = makeState({ state: 'sick', hunger: 50, happiness: 50, energy: 50 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('normal');
  });

  it('resets sustainedGoodCareStart on recovery', () => {
    const state = makeState({
      state: 'sick',
      hunger: 55, happiness: 55, energy: 55,
      sustainedGoodCareStart: Date.now(),
    });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('normal');
    expect(result.pet.sustainedGoodCareStart).toBeNull();
  });
});

// ============================================
// State Transitions: Evolution
// ============================================
describe('Evolution transitions', () => {
  it('does NOT evolve with too few care actions', () => {
    const now = Date.now();
    const state = makeState({
      state: 'normal',
      hunger: 90, happiness: 90, energy: 90,
      totalCareActions: 5,
      sustainedGoodCareStart: now - 20000, // 20s sustained
    });
    const result = evaluateStateTransition(state, now);
    expect(result.pet.state).toBe('normal');
  });

  it('does NOT evolve when sustained time is not enough', () => {
    const now = Date.now();
    const state = makeState({
      state: 'normal',
      hunger: 90, happiness: 90, energy: 90,
      totalCareActions: 10,
      sustainedGoodCareStart: now - 5000, // only 5s
    });
    const result = evaluateStateTransition(state, now);
    expect(result.pet.state).toBe('normal');
  });

  it('does NOT evolve when a stat is <= 70', () => {
    const now = Date.now();
    const state = makeState({
      state: 'normal',
      hunger: 65, happiness: 90, energy: 90,
      totalCareActions: 10,
      sustainedGoodCareStart: now - 20000,
    });
    const result = evaluateStateTransition(state, now);
    expect(result.pet.state).toBe('normal');
    expect(result.pet.sustainedGoodCareStart).toBeNull(); // reset because stat dropped
  });

  it('evolves when all conditions are met', () => {
    const now = Date.now();
    const state = makeState({
      state: 'normal',
      hunger: 90, happiness: 85, energy: 95,
      totalCareActions: 6,
      sustainedGoodCareStart: now - 16000, // 16s > 15s threshold
    });
    const result = evaluateStateTransition(state, now);
    expect(result.pet.state).toBe('evolved');
  });

  it('starts sustained timer when all stats > 70 and no timer set', () => {
    const now = Date.now();
    const state = makeState({
      state: 'normal',
      hunger: 80, happiness: 80, energy: 80,
      totalCareActions: 3,
      sustainedGoodCareStart: null,
    });
    const result = evaluateStateTransition(state, now);
    expect(result.pet.state).toBe('normal');
    expect(result.pet.sustainedGoodCareStart).toBe(now);
  });

  it('keeps sustained timer running when already set', () => {
    const now = Date.now();
    const startTime = now - 5000;
    const state = makeState({
      state: 'normal',
      hunger: 80, happiness: 80, energy: 80,
      totalCareActions: 3,
      sustainedGoodCareStart: startTime,
    });
    const result = evaluateStateTransition(state, now);
    expect(result.pet.sustainedGoodCareStart).toBe(startTime); // unchanged
  });

  it('resets sustained timer when a stat drops to exactly 70', () => {
    const now = Date.now();
    const state = makeState({
      state: 'normal',
      hunger: 70, happiness: 80, energy: 80,
      sustainedGoodCareStart: now - 10000,
    });
    const result = evaluateStateTransition(state, now);
    expect(result.pet.sustainedGoodCareStart).toBeNull();
  });
});

// ============================================
// State Transitions: Evolved
// ============================================
describe('Evolved state transitions', () => {
  it('stays evolved when all stats are healthy', () => {
    const state = makeState({ state: 'evolved', hunger: 60, happiness: 50, energy: 40 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('evolved');
  });

  it('transitions to sick when a stat drops below 20', () => {
    const state = makeState({ state: 'evolved', hunger: 50, happiness: 50, energy: 12 });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('sick');
  });

  it('resets sustainedGoodCareStart on evolved → sick', () => {
    const state = makeState({
      state: 'evolved',
      energy: 12,
      sustainedGoodCareStart: Date.now(),
    });
    const result = evaluateStateTransition(state);
    expect(result.pet.sustainedGoodCareStart).toBeNull();
  });
});

// ============================================
// Edge Cases
// ============================================
describe('edge cases', () => {
  it('does not start sustained timer when pet is sick', () => {
    const now = Date.now();
    const state = makeState({
      state: 'sick',
      hunger: 80, happiness: 80, energy: 80,
      sustainedGoodCareStart: null,
    });
    const result = evaluateStateTransition(state, now);
    // Sick with all stats >= 50 → recovers to normal, timer stays null
    expect(result.pet.state).toBe('normal');
    expect(result.pet.sustainedGoodCareStart).toBeNull();
  });

  it('returns same reference if nothing changed', () => {
    const state = makeState({ state: 'normal', hunger: 50, happiness: 50, energy: 50 });
    const result = evaluateStateTransition(state);
    expect(result).toBe(state); // same object — no unnecessary re-render
  });

  it('handles unknown state by resetting to normal', () => {
    const state = makeState({ state: 'corrupted' });
    const result = evaluateStateTransition(state);
    expect(result.pet.state).toBe('normal');
  });
});
