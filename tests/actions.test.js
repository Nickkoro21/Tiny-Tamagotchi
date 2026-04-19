import { describe, it, expect } from 'vitest';
import { feedPet, playWithPet, restPet, ACTION_EFFECTS, COOLDOWNS } from '../src/engine/vitals.js';
import { createInitialState } from '../src/engine/gameState.js';

describe('ACTION_EFFECTS & COOLDOWNS', () => {
  it('exports action effect definitions', () => {
    expect(ACTION_EFFECTS.feed.hunger).toBe(30);
    expect(ACTION_EFFECTS.play.happiness).toBe(25);
    expect(ACTION_EFFECTS.rest.energy).toBe(35);
  });

  it('exports cooldown durations', () => {
    expect(COOLDOWNS.feed).toBe(3000);
    expect(COOLDOWNS.play).toBe(4000);
    expect(COOLDOWNS.rest).toBe(5000);
  });
});

describe('feedPet', () => {
  it('increases hunger by 30', () => {
    const state = createInitialState('Bot');
    state.pet.hunger = 50;
    const result = feedPet(state);
    expect(result.pet.hunger).toBe(80);
  });

  it('increases happiness by 5', () => {
    const state = createInitialState('Bot');
    state.pet.happiness = 50;
    const result = feedPet(state);
    expect(result.pet.happiness).toBe(55);
  });

  it('clamps hunger at 100', () => {
    const state = createInitialState('Bot');
    state.pet.hunger = 90;
    const result = feedPet(state);
    expect(result.pet.hunger).toBe(100);
  });

  it('increments totalCareActions', () => {
    const state = createInitialState('Bot');
    expect(state.pet.totalCareActions).toBe(0);
    const result = feedPet(state);
    expect(result.pet.totalCareActions).toBe(1);
  });

  it('updates lastFed timestamp', () => {
    const state = createInitialState('Bot');
    const before = state.pet.lastFed;
    const result = feedPet(state);
    expect(result.pet.lastFed).toBeGreaterThanOrEqual(before);
  });
});

describe('playWithPet', () => {
  it('increases happiness by 25', () => {
    const state = createInitialState('Bot');
    state.pet.happiness = 50;
    const result = playWithPet(state);
    expect(result.pet.happiness).toBe(75);
  });

  it('decreases energy by 10', () => {
    const state = createInitialState('Bot');
    state.pet.energy = 50;
    const result = playWithPet(state);
    expect(result.pet.energy).toBe(40);
  });

  it('clamps energy at 0', () => {
    const state = createInitialState('Bot');
    state.pet.energy = 5;
    const result = playWithPet(state);
    expect(result.pet.energy).toBe(0);
  });

  it('increments totalCareActions', () => {
    const state = createInitialState('Bot');
    const result = playWithPet(state);
    expect(result.pet.totalCareActions).toBe(1);
  });
});

describe('restPet', () => {
  it('increases energy by 35', () => {
    const state = createInitialState('Bot');
    state.pet.energy = 50;
    const result = restPet(state);
    expect(result.pet.energy).toBe(85);
  });

  it('increases happiness by 5', () => {
    const state = createInitialState('Bot');
    state.pet.happiness = 50;
    const result = restPet(state);
    expect(result.pet.happiness).toBe(55);
  });

  it('clamps energy at 100', () => {
    const state = createInitialState('Bot');
    state.pet.energy = 90;
    const result = restPet(state);
    expect(result.pet.energy).toBe(100);
  });

  it('increments totalCareActions', () => {
    const state = createInitialState('Bot');
    const result = restPet(state);
    expect(result.pet.totalCareActions).toBe(1);
  });
});

describe('action immutability', () => {
  it('does not mutate the original state', () => {
    const state = createInitialState('Bot');
    state.pet.hunger = 50;
    const original = state.pet.hunger;
    feedPet(state);
    expect(state.pet.hunger).toBe(original);
  });

  it('preserves unrelated fields', () => {
    const state = createInitialState('Bot');
    const result = feedPet(state);
    expect(result.pet.name).toBe('Bot');
    expect(result.pet.state).toBe('normal');
    expect(result.meta.version).toBe('1.0.0');
  });
});
