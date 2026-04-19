# Feature Plan — Phase 2: The Care Loop

## Overview

Add three player actions (Feed, Play, Rest) that restore specific stats, a pet naming screen on first launch, and persistence (localStorage auto-save + JSON export/import). This makes the game interactive and playable.

## Goal

The player can name their pet, perform care actions to keep stats up, and their progress is saved automatically. The tension between decay (Phase 1) and player actions creates the core gameplay loop.

## Task Groups

### Group 1: Action Logic (Engine)
- Implement action functions in `engine/vitals.js`:
  - `feedPet(state)` → Hunger +30, Happiness +5
  - `playWithPet(state)` → Happiness +25, Energy -10
  - `restPet(state)` → Energy +35, Happiness +5
- Increment `totalCareActions` on each action
- Update `lastFed` / `lastPlayed` / `lastRested` timestamps
- All stat changes clamped to 0–100

### Group 2: Cooldown System
- Each action has a cooldown period after use:
  - Feed: 3 seconds
  - Play: 4 seconds
  - Rest: 5 seconds
- During cooldown, the button is disabled with a visual countdown
- Cooldown tracked per-action in component state (not game state)

### Group 3: Naming Screen
- On first launch (no saved state), show a naming screen
- Text input for pet name (1–16 characters)
- "INITIALIZE" button to start the game
- Sci-fi themed: "Enter designation for new digital lifeform"
- After naming, transition to the main game view

### Group 4: Action Buttons UI
- Three buttons below stat bars: FEED ⚡, PLAY ✧, REST ◉
- Sci-fi styled buttons with glow effects
- Visual feedback on click (flash/pulse animation)
- Disabled state during cooldown (dimmed + timer overlay)
- Buttons show stat effect preview on hover (e.g., "+30 Hunger")

### Group 5: Persistence — localStorage
- Auto-save game state to localStorage:
  - On every care action
  - Every 30 seconds via interval
- Load saved state on app start (skip naming if save exists)
- Storage key: `tamagotchi_save`
- Validate loaded state structure before using

### Group 6: Persistence — JSON Export/Import
- "SAVE TO FILE" button → downloads `.json` file
- "LOAD FROM FILE" button → file upload dialog for `.json`
- Validate schema version before importing
- Show confirmation before overwriting current state on import
- Place save/load buttons in a small footer area

## Approach

Engine-first again: implement and test action logic, then build UI components, then wire persistence. Naming screen is independent and can be built in parallel.

## Dependencies

- Phase 1 complete (decay engine, Stats component)
- `createInitialState()` from gameState.js

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Play drains Energy — could accelerate death spiral | +25 Happiness is a strong reward; player must balance |
| localStorage quota exceeded | Game state is tiny (~500 bytes); not a concern |
| Corrupted save data crashes app | Validate structure on load; fall back to fresh state |
| Naming screen feels disconnected | Smooth fade transition into main game |
