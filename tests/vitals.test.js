import { describe, it, expect } from 'vitest';
import { applyDecay, clamp, getStatLevel, DECAY_RATES } from '../src/engine/vitals.js';
import { createInitialState } from '../src/engine/gameState.js';

describe('clamp', () => {
  it('returns value when in range', () => {
    expect(clamp(50)).toBe(50);
  });

  it('clamps value below 0 to 0', () => {
    expect(clamp(-10)).toBe(0);
  });

  it('clamps value above 100 to 100', () => {
    expect(clamp(120)).toBe(100);
  });

  it('handles boundary values', () => {
    expect(clamp(0)).toBe(0);
    expect(clamp(100)).toBe(100);
  });
});

describe('DECAY_RATES', () => {
  it('exports configurable decay rates', () => {
    expect(DECAY_RATES.hunger).toBe(200);
    expect(DECAY_RATES.happiness).toBe(300);
    expect(DECAY_RATES.energy).toBe(133.33);
  });

  it('happiness drains fastest, energy slowest', () => {
    expect(DECAY_RATES.happiness).toBeGreaterThan(DECAY_RATES.hunger);
    expect(DECAY_RATES.hunger).toBeGreaterThan(DECAY_RATES.energy);
  });
});

describe('applyDecay', () => {
  it('returns same state with 0 elapsed time', () => {
    const state = createInitialState('TestBot');
    const result = applyDecay(state, 0);
    expect(result).toBe(state);
  });

  it('returns same state with negative elapsed time', () => {
    const state = createInitialState('TestBot');
    const result = applyDecay(state, -100);
    expect(result).toBe(state);
  });

  it('drains hunger to 0 in ~30 seconds', () => {
    const state = createInitialState('TestBot');
    const result = applyDecay(state, 30000); // 30s
    expect(Math.round(result.pet.hunger)).toBe(0);
  });

  it('drains happiness to 0 in ~20 seconds', () => {
    const state = createInitialState('TestBot');
    const result = applyDecay(state, 20000); // 20s
    expect(Math.round(result.pet.happiness)).toBe(0);
  });

  it('drains energy to 0 in ~45 seconds', () => {
    const state = createInitialState('TestBot');
    const result = applyDecay(state, 45000); // 45s
    expect(Math.round(result.pet.energy)).toBe(0);
  });

  it('clamps stats to 0 (never negative)', () => {
    const state = createInitialState('TestBot');
    const result = applyDecay(state, 120000); // 2 minutes — well past drain
    expect(result.pet.hunger).toBe(0);
    expect(result.pet.happiness).toBe(0);
    expect(result.pet.energy).toBe(0);
  });

  it('caps catch-up to 10 minutes', () => {
    const state = createInitialState('TestBot');
    const result = applyDecay(state, 60 * 60 * 1000);      // 60 min
    const expected = applyDecay(state, 10 * 60 * 1000);     // 10 min cap
    expect(result.pet.hunger).toBe(expected.pet.hunger);
    expect(result.pet.happiness).toBe(expected.pet.happiness);
    expect(result.pet.energy).toBe(expected.pet.energy);
  });

  it('preserves non-vital state fields', () => {
    const state = createInitialState('TestBot');
    const result = applyDecay(state, 5000);
    expect(result.pet.name).toBe('TestBot');
    expect(result.pet.state).toBe('normal');
    expect(result.meta.version).toBe('1.0.0');
  });
});

describe('getStatLevel', () => {
  it('returns healthy for 70–100', () => {
    expect(getStatLevel(100)).toBe('healthy');
    expect(getStatLevel(70)).toBe('healthy');
  });

  it('returns warning for 40–69', () => {
    expect(getStatLevel(69)).toBe('warning');
    expect(getStatLevel(40)).toBe('warning');
  });

  it('returns low for 20–39', () => {
    expect(getStatLevel(39)).toBe('low');
    expect(getStatLevel(20)).toBe('low');
  });

  it('returns critical for 0–19', () => {
    expect(getStatLevel(19)).toBe('critical');
    expect(getStatLevel(0)).toBe('critical');
  });
});
