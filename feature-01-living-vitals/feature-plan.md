# Feature Plan — Phase 1: Living Vitals

## Overview

Implement the three vital stats (Hunger, Happiness, Energy) that decay automatically over time, with real-time visual feedback. This is the foundation of the Tamagotchi — without vitals, there's nothing to care for.

## Goal

The player sees three stat bars on screen that visually decrease over time. Each bar changes color as it drops, creating urgency. The decay continues even when the browser tab is in the background, and catches up when the player returns.

## Task Groups

### Group 1: Game State & Decay Engine
- Implement `applyDecay(state, elapsedMs)` in `engine/vitals.js`
- Decay rates (per minute): Hunger -2, Happiness -1.5, Energy -1
- All stats clamped to 0–100 range
- Calculate decay based on actual elapsed time (not fixed tick)
- Handle large time gaps gracefully (e.g., tab was inactive for 10 minutes)

### Group 2: Timer System
- Create a 1-second interval tick in the App component
- On each tick: calculate elapsed time since last tick, call `applyDecay`
- Use `Date.now()` for accurate time tracking regardless of interval drift
- Store `lastTickTime` in state for elapsed calculation
- Clean up interval on component unmount

### Group 3: Stats UI Component
- Build `Stats.jsx` with three horizontal stat bars
- Each bar shows: icon/label, fill bar, numeric value (0–100)
- Bar width proportional to stat value (CSS width percentage)
- Sci-fi styling: dark containers, glowing bar fills, monospace values

### Group 4: Visual Feedback — Color Transitions
- Stat bar color changes based on value thresholds:
  - 70–100: Healthy color (stat-specific: orange/yellow/blue)
  - 40–69: Warning (amber/orange tint)
  - 20–39: Low (orange-red)
  - 0–19: Critical (red, pulsing glow animation)
- Smooth CSS transitions between color states
- Optional: subtle shake animation when a stat hits critical

### Group 5: Integration & Polish
- Wire Stats component into App with live state
- Import and apply `pet.css` and `components.css`
- Ensure the blob creature remains on screen above stats
- Verify responsive layout (mobile 320px to desktop)

## Approach

Engine-first: build and test the decay logic as pure functions before touching UI. This keeps logic testable and separated from rendering. Then build the Stats component with hardcoded values, verify it looks good, and finally wire it to the live engine.

## Dependencies

- Phase 0 scaffold (complete)
- `engine/gameState.js` — `createInitialState()` (complete)
- `engine/vitals.js` — `clamp()` (complete)

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Timer drift in background tabs | Use elapsed-time calculation, not fixed decrements |
| Stats hitting 0 too fast/slow | Rates are configurable; will tune after seeing it run |
| CSS transitions janky on mobile | Keep animations simple, use `transform` and `opacity` |
