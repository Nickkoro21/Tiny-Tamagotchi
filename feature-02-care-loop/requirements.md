# Requirements — Phase 2: The Care Loop

## Functional Requirements

### FR-1: Care Actions
- Three actions available: Feed, Play, Rest
- Action effects on stats:
  | Action | Primary Effect    | Secondary Effect  |
  |--------|------------------|-------------------|
  | Feed   | Hunger +30       | Happiness +5      |
  | Play   | Happiness +25    | Energy -10        |
  | Rest   | Energy +35       | Happiness +5      |
- All resulting values clamped to [0, 100]
- Each action increments `pet.totalCareActions` by 1
- Each action updates its respective timestamp (`lastFed`, `lastPlayed`, `lastRested`)

### FR-2: Cooldowns
- Each action has an independent cooldown timer:
  | Action | Cooldown |
  |--------|----------|
  | Feed   | 3 sec    |
  | Play   | 4 sec    |
  | Rest   | 5 sec    |
- Button disabled during cooldown with visual countdown
- Cooldowns are UI-only (not persisted in save state)
- Cooldowns reset on page refresh

### FR-3: Pet Naming
- First-launch experience: naming screen before main game
- Text input field: accepts 1–16 alphanumeric characters + spaces
- "INITIALIZE" submit button (disabled if name is empty)
- Name stored in `pet.name`
- Naming screen skipped if saved state exists in localStorage
- Name displayed in the main game UI (header or near the pet)

### FR-4: localStorage Auto-Save
- Save triggers:
  - After every care action (Feed, Play, Rest)
  - Every 30 seconds via periodic interval
- Storage key: `tamagotchi_save`
- Saved data: full game state object as JSON string
- On app load:
  1. Check localStorage for existing save
  2. Validate structure (has `pet` and `meta` keys, version matches)
  3. If valid: load state, skip naming screen
  4. If invalid or missing: show naming screen, start fresh

### FR-5: JSON Export/Import
- Export: download current state as `tamagotchi_save_YYYY-MM-DD.json`
- Import: file input accepting `.json` files
- On import:
  1. Parse JSON
  2. Validate structure and version
  3. Replace current game state
- Error handling: show alert if file is invalid
- UI: two small buttons in a footer section

### FR-6: Reset Option
- "NEW PET" button that clears save and restarts with naming screen
- Requires confirmation before executing (prevent accidental reset)

## Non-Functional Requirements

### NFR-1: Action Functions Purity
- `feedPet`, `playWithPet`, `restPet` are pure functions: `(state) → newState`
- No side effects in engine functions
- Persistence calls happen at the App level after state update

### NFR-2: UX Feedback
- Button press triggers a visual flash/pulse (CSS animation)
- Stat bars animate smoothly when values change from actions
- Cooldown countdown visible on disabled buttons

### NFR-3: Responsive
- Action buttons work well on mobile (min 48px height, full width)
- Naming input is touch-friendly
- Footer buttons compact but tappable

## Constraints

- No external form library
- Cooldowns managed with `useState` + `setTimeout` in component
- Persistence functions in dedicated `src/persistence/` files
- Save/load must not block the main thread
