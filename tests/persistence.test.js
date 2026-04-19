import { describe, it, expect, beforeEach } from 'vitest';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage, validateState } from '../src/persistence/localStorage.js';
import { createInitialState } from '../src/engine/gameState.js';

beforeEach(() => {
  localStorage.clear();
});

describe('validateState', () => {
  it('accepts valid state', () => {
    const state = createInitialState('Bot');
    expect(validateState(state)).toBe(true);
  });

  it('rejects null', () => {
    expect(validateState(null)).toBe(false);
  });

  it('rejects missing pet', () => {
    expect(validateState({ meta: { version: '1.0.0' } })).toBe(false);
  });

  it('rejects missing meta', () => {
    expect(validateState({ pet: { name: 'Bot', hunger: 100, happiness: 100, energy: 100, state: 'normal' } })).toBe(false);
  });

  it('rejects wrong version', () => {
    const state = createInitialState('Bot');
    state.meta.version = '0.0.1';
    expect(validateState(state)).toBe(false);
  });

  it('rejects non-numeric stats', () => {
    const state = createInitialState('Bot');
    state.pet.hunger = 'high';
    expect(validateState(state)).toBe(false);
  });
});

describe('localStorage save/load', () => {
  it('saves and loads state correctly', () => {
    const state = createInitialState('TestBot');
    saveToLocalStorage(state);
    const loaded = loadFromLocalStorage();
    expect(loaded).not.toBeNull();
    expect(loaded.pet.name).toBe('TestBot');
    expect(loaded.pet.hunger).toBe(100);
    expect(loaded.meta.version).toBe('1.0.0');
  });

  it('returns null when no save exists', () => {
    const loaded = loadFromLocalStorage();
    expect(loaded).toBeNull();
  });

  it('returns null for corrupted data', () => {
    localStorage.setItem('tamagotchi_save', 'not-json');
    const loaded = loadFromLocalStorage();
    expect(loaded).toBeNull();
  });

  it('returns null for invalid structure', () => {
    localStorage.setItem('tamagotchi_save', JSON.stringify({ foo: 'bar' }));
    const loaded = loadFromLocalStorage();
    expect(loaded).toBeNull();
  });
});

describe('clearLocalStorage', () => {
  it('removes saved state', () => {
    const state = createInitialState('Bot');
    saveToLocalStorage(state);
    expect(loadFromLocalStorage()).not.toBeNull();
    clearLocalStorage();
    expect(loadFromLocalStorage()).toBeNull();
  });
});
