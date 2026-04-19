# Validation — Phase 1: Living Vitals

## Unit Tests (Vitest)

### Test Suite: vitals.test.js

| # | Test Case | Expected Result |
|---|-----------|----------------|
| 1 | `applyDecay` with 0 elapsed time | Stats unchanged |
| 2 | `applyDecay` with 60000ms (1 min) elapsed | Hunger: 98, Happiness: 98.5, Energy: 99 |
| 3 | `applyDecay` with 3000000ms (50 min) elapsed | All stats clamped to 0 (not negative) |
| 4 | `applyDecay` preserves other state fields | `pet.name`, `pet.state`, `meta` unchanged |
| 5 | `clamp` with value below 0 | Returns 0 |
| 6 | `clamp` with value above 100 | Returns 100 |
| 7 | `clamp` with value in range | Returns value unchanged |
| 8 | Decay rates are configurable constants | Can import `DECAY_RATES` from vitals.js |

### Test Suite: gameState.test.js (extend existing)

| # | Test Case | Expected Result |
|---|-----------|----------------|
| 9 | Initial state has all stats at 100 | hunger=100, happiness=100, energy=100 |
| 10 | Initial state has `state: 'normal'` | Confirmed |

## Manual Validation Checklist

### Visual Checks
- [ ] Three stat bars visible below the pet blob
- [ ] Each bar has a label, fill bar, and numeric value
- [ ] Bars visually shrink over time (wait 30 seconds, observe)
- [ ] Numeric values decrease as bars shrink
- [ ] Hunger bar decreases fastest, Energy slowest

### Color Transition Checks
- [ ] Fresh start: all bars show healthy color (stat-specific accents)
- [ ] Wait until a stat drops below 70: bar color shifts to amber
- [ ] Wait until a stat drops below 40: bar color shifts to orange-red
- [ ] Wait until a stat drops below 20: bar color turns red with pulsing glow
- [ ] Color transitions are smooth (not instant jumps)

### Background Tab Behavior
- [ ] Open app, note stat values
- [ ] Switch to another tab for 2 minutes
- [ ] Return to app tab — stats should have decayed for those 2 minutes
- [ ] No visual glitch on return (smooth update)

### Edge Cases
- [ ] Stats never display negative numbers
- [ ] Stats never display above 100
- [ ] Page refresh resets to initial state (no persistence yet — Phase 2)

### Responsive Layout
- [ ] Desktop (1440px): stats centered, readable
- [ ] Tablet (768px): stats fill container, no overflow
- [ ] Mobile (320px): stats stack properly, text readable

## Acceptance Criteria

Phase 1 is **DONE** when:
1. ✅ All unit tests pass (`npm run test`)
2. ✅ Three stat bars visible and decaying in real time
3. ✅ Color transitions work across all thresholds
4. ✅ Background tab catch-up works correctly
5. ✅ Layout responsive from 320px to 1440px
6. ✅ No console errors or warnings
