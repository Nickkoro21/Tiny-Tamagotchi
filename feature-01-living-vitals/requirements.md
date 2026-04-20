# Requirements — Phase 1: Living Vitals

## Functional Requirements

### FR-1: Stat Values
- Three stats: Hunger, Happiness, Energy
- Each stat is a number in the range [0, 100] (inclusive)
- Initial value for all stats: 100 (from `createInitialState`)
- Values must be clamped — never below 0 or above 100

### FR-2: Automatic Decay
- Stats decrease automatically over real time
- Decay is calculated based on elapsed milliseconds, not per-tick fixed amounts
- Decay rates (per minute, configurable):

  | Stat      | Rate          | Full drain time | Relative speed         |
  |-----------|---------------|-----------------|------------------------|
  | Hunger    | -200/min      | ~30 seconds     | Fastest                |
  | Happiness | -171.43/min   | ~35 seconds     | Mid (5s slower than hunger) |
  | Energy    | -133.33/min   | ~45 seconds     | Slowest                |

- Decay formula: `newValue = oldValue - (rate * elapsedMinutes)`
- Decay continues accumulating when the browser tab is inactive (catch-up on return)
- **Replan note (post-Phase-4):** Happiness was originally -300/min (~20s drain) but
  tuned down to -171.43/min (~35s) for a smoother care cadence

### FR-3: Timer System
- A 1-second interval drives the decay tick
- Each tick calculates actual elapsed time using `Date.now()`
- Timer starts when the app mounts
- Timer stops (cleanup) when the app unmounts
- If elapsed time since last tick exceeds 10 minutes, cap the catch-up to 10 minutes to prevent jarring instant drops

### FR-4: Stat Display
- Three stat bars visible on the main screen
- Each bar shows:
  - Stat label (e.g., "HUNGER", "HAPPINESS", "ENERGY")
  - Visual fill bar (width = percentage of stat value)
  - Numeric value displayed as integer (e.g., "73")
- Bars update in real time as stats decay

### FR-5: Color Feedback
- Bar fill color changes based on stat value:
  | Range  | Visual State | Color Theme          |
  |--------|-------------|----------------------|
  | 70–100 | Healthy     | Stat-specific accent  |
  | 40–69  | Warning     | Amber/Orange          |
  | 20–39  | Low         | Orange-Red            |
  | 0–19   | Critical    | Red + pulsing glow    |
- Transitions between color states are smooth (CSS transition)

## Non-Functional Requirements

### NFR-1: Performance
- Decay calculation must be pure function (no side effects)
- No unnecessary re-renders — only update when stat values actually change (integer level)
- Timer interval must be cleaned up on unmount to prevent memory leaks

### NFR-2: Responsiveness
- Stats layout works from 320px to 1440px viewport width
- Stat bars are full-width within the container (max-width: 480px)
- Touch-friendly sizing (minimum 44px tap targets for future actions)

### NFR-3: Testability
- `applyDecay` is a pure function: `(state, elapsedMs) → newState`
- No DOM or Preact dependencies in engine functions
- Edge cases testable: 0 elapsed time, negative values, overflow above 100

### NFR-4: Code Organization
- All decay logic in `src/engine/vitals.js`
- All stat UI in `src/components/Stats.jsx`
- Stat bar styles in `src/styles/components.css`
- Timer logic in `src/app.jsx` (or custom hook)

## Constraints

- No external state management library
- No animation library — CSS only for visual transitions
- Decay rates are constants defined in `vitals.js`, easily adjustable
- Stats display as integers to the user (internal calculation uses floats)
