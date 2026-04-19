# Requirements — Phase 3: Dynamic States

## Functional Requirements

### FR-1: Pet States
- Three mutually exclusive states: `"normal"`, `"sick"`, `"evolved"`
- State stored in `pet.state` field (string)
- Initial state on new pet: `"normal"`
- Only one state active at any time — transitions are instantaneous

### FR-2: State Transitions
- **Normal → Sick:** Triggered when **any single stat** (hunger, happiness, or energy) drops **below 20**
- **Sick → Normal:** Triggered when **all three stats** are restored to **≥ 50**
- **Normal → Evolved:** Triggered when **both** conditions are met simultaneously:
  1. `pet.totalCareActions ≥ 6`
  2. All three stats have been **continuously above 70** for at least **15 seconds** (15,000 ms)
- **Evolved → Sick:** Triggered when **any single stat** drops **below 20** (evolution is reversible)
- There is **no** direct Evolved → Normal transition
- After recovering from Sick (→ Normal), the pet must re-earn evolution from scratch (sustained timer resets)

### FR-3: Sustained Good Care Tracking
- New field: `pet.sustainedGoodCareStart` (timestamp in ms, or `null`)
- When all stats are > 70 and pet is in Normal state:
  - If `sustainedGoodCareStart` is `null`, set it to `Date.now()`
  - If already set, check if `Date.now() - sustainedGoodCareStart ≥ 15000`
- When any stat drops to ≤ 70 (while tracking), reset `sustainedGoodCareStart` to `null`
- When pet transitions to Sick, reset `sustainedGoodCareStart` to `null`
- Field persisted in localStorage (survives browser refresh)

### FR-4: Decay Rate Modifiers
- Stat decay rates are multiplied by a state-dependent factor:
  | State    | Multiplier | Effect                          |
  |----------|------------|--------------------------------------|
  | Normal   | ×1.0       | Standard decay (unchanged from Phase 1) |
  | Sick     | ×1.5       | Stats drain 50% faster — creates urgency |
  | Evolved  | ×0.7       | Stats drain 30% slower — rewards care    |
- Multiplier applies to all three stats equally
- Multiplier is applied inside `applyDecay()` function
- Formula: `newValue = oldValue - (rate × multiplier × elapsedMinutes)`

### FR-5: State Evaluation Timing
- State transitions are evaluated:
  1. On every decay tick (1-second interval), **after** decay is applied
  2. Immediately after every care action (Feed, Play, Rest)
- Evaluation order per tick: apply decay → evaluate state → update UI
- Function signature: `evaluateStateTransition(state) → newState`

### FR-6: Pet Visual States
- Pet blob appearance changes based on current state via CSS class:
  - **`.pet--normal`**: Cyan glow, smooth idle breathing animation (current blob behavior)
  - **`.pet--sick`**: Red/danger tint, glitch effect (CSS `clip-path` or skew animation), static noise overlay, slightly distorted blob shape
  - **`.pet--evolved`**: Purple glow (`--accent-evolved`), enhanced shimmer/particle effect, slightly larger scale (1.1×), smoother animation
- Transition between visual states: CSS `transition: all 0.6s ease`
- The blob creature (`.scaffold-blob`) is wrapped by a `.pet-container` div that receives the state class

### FR-7: Status Messages
- A status line below the pet reflects the current state:
  | State   | Message                                         |
  |---------|--------------------------------------------------|
  | Normal  | `▸ ALL SYSTEMS NOMINAL`                          |
  | Sick    | `⚠ CRITICAL ERROR: Systems degraded`            |
  | Evolved | `★ FIRMWARE v2.0 — Enhanced protocols active`   |
- Message updates immediately on state transition
- Styled with state-appropriate color (cyan / red / purple)

### FR-8: Game State Schema Update
- Add `sustainedGoodCareStart` to pet object in `createInitialState()`:
  ```javascript
  pet: {
    ...existingFields,
    sustainedGoodCareStart: null  // timestamp (ms) or null
  }
  ```
- `validateState()` must accept saves **with or without** this field (backward compatibility)
- If loaded save is missing `sustainedGoodCareStart`, default to `null`

## Non-Functional Requirements

### NFR-1: Pure Functions
- `evaluateStateTransition(state) → newState` is a pure function (no side effects)
- `getDecayMultiplier(petState) → number` is a pure function
- All transition thresholds are exported named constants:
  ```javascript
  export const SICK_THRESHOLD = 20;
  export const RECOVERY_THRESHOLD = 50;
  export const EVOLUTION_CARE_THRESHOLD = 6;
  export const EVOLUTION_STAT_THRESHOLD = 70;
  export const EVOLUTION_SUSTAINED_MS = 15000;
  ```

### NFR-2: Performance
- State evaluation adds negligible overhead to the 1-second tick
- CSS animations use `transform` and `opacity` only (GPU-accelerated)
- No JavaScript-driven animations — CSS only
- Glitch effect uses lightweight CSS (no canvas or heavy SVG filters)

### NFR-3: Visual Smoothness
- State transitions have a 0.6s CSS transition for color/glow/scale changes
- No abrupt visual jumps between states
- Glitch animation loops at a comfortable frequency (not seizure-inducing)

### NFR-4: Backward Compatibility
- Existing Phase 2 saves (without `sustainedGoodCareStart`) load correctly
- Existing unit tests (vitals, actions, persistence) pass without modification
- `applyDecay()` defaults to multiplier 1.0 if called without a multiplier argument

### NFR-5: Code Organization
- State transition logic: `src/engine/states.js`
- Decay multiplier function: `src/engine/states.js`
- Pet visuals: `src/components/Pet.jsx` + `src/styles/pet.css`
- Status messages: `src/components/StatusMessage.jsx`
- Schema update: `src/engine/gameState.js` + `src/persistence/localStorage.js`

## Constraints

- No JavaScript animation libraries — CSS only
- State evaluation must not trigger unnecessary re-renders (only when state actually changes)
- Thresholds are configurable constants (not magic numbers in code)
- Pet component uses CSS classes for state visuals, not inline styles
- The glitch/static effect for Sick state must be achievable with pure CSS (no images or canvas)
