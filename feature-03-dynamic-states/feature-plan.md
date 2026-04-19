# Feature Plan — Phase 3: Dynamic States

## Overview

Implement a state machine that transitions the pet between three states — Normal, Sick, and Evolved — based on vital stat levels and sustained care quality. Each state has distinct visual feedback (animations, colors, glow effects) and modifies the stat decay rate, creating meaningful consequences for player behavior.

## Goal

The pet visually transforms between three states. Neglect (low stats) triggers sickness with accelerated decay, creating urgency. Sustained excellent care unlocks evolution with reduced decay as a reward. The player sees and *feels* the consequences of their care through dramatic visual changes to the blob creature.

## State Machine

```
                    ┌─────────────────────────┐
                    │                         │
                    ▼                         │
    ┌───────────────────────────┐             │
    │         NORMAL            │             │
    │   (default healthy)       │             │
    │   decay rate: ×1.0        │             │
    └─────┬───────────┬─────────┘             │
          │           │                       │
   any stat < 20      │ totalCareActions ≥ 6  │
          │           │ AND all stats > 70    │
          │           │ for 15s sustained     │
          ▼           ▼                       │
 ┌──────────────┐  ┌──────────────────┐       │
 │    SICK      │  │    EVOLVED       │       │
 │  glitch/red  │  │  purple glow     │       │
 │  decay ×1.5  │  │  decay ×0.7      │       │
 └──────┬───────┘  └────────┬─────────┘       │
        │                   │                 │
  all stats ≥ 50      any stat < 20           │
        │                   │                 │
        └───────────────────┼─────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │    SICK      │
                    │ (from evolved)│
                    └──────────────┘
```

**Transition Rules Summary:**
| From     | To       | Condition                                              |
|----------|----------|--------------------------------------------------------|
| Normal   | Sick     | Any single stat drops below 20                         |
| Sick     | Normal   | All three stats restored to ≥ 50                       |
| Normal   | Evolved  | `totalCareActions ≥ 6` AND all stats > 70 for 15s      |
| Evolved  | Sick     | Any single stat drops below 20 (evolution is reversible)|

**Note:** There is no direct Evolved → Normal transition. An evolved pet stays evolved unless it gets sick. After recovering from sick, it returns to Normal and must re-earn evolution.

## Task Groups

### Group 1: State Transition Engine
- Implement `evaluateStateTransition(state)` in `engine/states.js`
- Pure function: `(state) → newState` (with updated `pet.state` and `pet.sustainedGoodCareStart`)
- Handle all four transitions from the table above
- Add `sustainedGoodCareStart` field to game state (persisted via localStorage)
- Export transition thresholds as named constants for testability

### Group 2: Decay Rate Modifiers
- Modify `applyDecay()` in `engine/vitals.js` to accept decay multiplier
- Implement `getDecayMultiplier(petState)` in `engine/states.js`:
  - `"normal"` → 1.0
  - `"sick"` → 1.5 (stats drain 50% faster — urgency)
  - `"evolved"` → 0.7 (stats drain 30% slower — reward)
- Integrate multiplier into the existing tick loop in `app.jsx`

### Group 3: Pet Visual Component
- Rebuild `Pet.jsx` with a CSS-based blob creature that changes per state
- Three visual modes via CSS class switching (`.pet--normal`, `.pet--sick`, `.pet--evolved`):
  - **Normal:** Cyan glow, smooth idle breathing animation (existing blob style)
  - **Sick:** Red/danger tint, glitch/static-noise animation, distorted shape
  - **Evolved:** Purple glow, particle-like shimmer effects, enhanced/larger appearance
- Smooth CSS transitions between states (0.6s ease)

### Group 4: State-Aware Status Messages
- Implement basic status line in `StatusMessage.jsx` that reflects current state
- Messages per state:
  - Normal: "▸ ALL SYSTEMS NOMINAL"
  - Sick: "⚠ CRITICAL ERROR: Systems degraded"
  - Evolved: "★ FIRMWARE v2.0 — Enhanced protocols active"
- Update status on every state transition
- (Full personality messages deferred to Phase 4)

### Group 5: Game State Schema Update
- Add `pet.sustainedGoodCareStart` (timestamp | null) to `createInitialState()`
- Update `validateState()` in localStorage.js to accept the new field
- Ensure backward compatibility: existing saves without the field default to `null`
- Update auto-save to persist the new field

### Group 6: Integration & Wiring
- Wire `evaluateStateTransition()` into the App tick loop (after decay, before render)
- Wire decay multiplier into `applyDecay()` call
- Pass `pet.state` to Pet, Stats, and StatusMessage components
- Add state-indicator class to app-layout for global CSS state awareness
- Call state evaluation after each care action too (not just on tick)

## Approach

Engine-first, same as Phase 1 and 2. Build and test the state transition logic as pure functions first. Then implement decay modifiers and verify with existing tests. Then build visuals. Finally wire everything together.

**Order:** Group 1 → Group 2 → Group 5 → Group 1+2 tests → Group 3 → Group 4 → Group 6

## Dependencies

- Phase 2 complete (care actions, persistence, naming)
- `totalCareActions` field in game state (exists from Phase 2)
- `applyDecay()` in vitals.js (exists from Phase 1)
- `saveToLocalStorage()` / `loadFromLocalStorage()` (exists from Phase 2)

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| State flicker at threshold boundaries | Add hysteresis: require stat to stay below 20 for a full tick before transitioning to Sick |
| Evolved too easy with 6 actions + 15s | Thresholds are configurable constants; easy to tune post-implementation |
| CSS glitch animation performance on mobile | Keep animations CSS-only, use `transform` and `opacity`, test on throttled CPU |
| Backward compatibility with Phase 2 saves | `validateState()` defaults missing `sustainedGoodCareStart` to `null` |
| Decay multiplier breaks existing tests | Multiplier defaults to 1.0 — existing tests pass unchanged |
