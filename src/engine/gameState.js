/**
 * Game State — central state object and factory
 * Phase 1: Initial implementation
 */

/** Creates a fresh game state for a new pet */
export function createInitialState(petName = '') {
  const now = Date.now();
  return {
    pet: {
      name: petName,
      hunger: 100,
      happiness: 100,
      energy: 100,
      state: 'normal', // 'normal' | 'sick' | 'evolved'
      createdAt: now,
      totalCareActions: 0,
      lastFed: now,
      lastPlayed: now,
      lastRested: now,
    },
    meta: {
      lastSaveTime: now,
      version: '1.0.0',
    },
  };
}
