import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/engine/gameState.js';

describe('Scaffold sanity check', () => {
  it('should create initial state with default values', () => {
    const state = createInitialState('TestBot');
    expect(state.pet.name).toBe('TestBot');
    expect(state.pet.hunger).toBe(100);
    expect(state.pet.happiness).toBe(100);
    expect(state.pet.energy).toBe(100);
    expect(state.pet.state).toBe('normal');
  });

  it('should have meta version', () => {
    const state = createInitialState();
    expect(state.meta.version).toBe('1.0.0');
  });
});
