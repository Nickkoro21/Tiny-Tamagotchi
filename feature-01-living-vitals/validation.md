# Validation — Phase 1: Living Vitals

## Unit Tests (Vitest)

### Test Suite: vitals.test.js

| # | Test Case | Expected Result |
|---|-----------|----------------|
| 1 | `applyDecay` with 0 elapsed time | Stats unchanged (same object reference) |
| 2 | `applyDecay` with 30000ms (30s) elapsed | Hunger drains to ~0 |
| 3 | `applyDecay` with 35000ms (35s) elapsed | Happiness drains to ~0 (tuned from 20s in replan) |
| 4 | `applyDecay` with 45000ms (45s) elapsed | Energy drains to ~0 |
| 5 | `applyDecay` with 120000ms (2 min) elapsed | All stats clamped to 0 (not negative) |
| 6 | `applyDecay` with 60 min elapsed | Capped to 10 min catch-up |
| 7 | `applyDecay` preserves other state fields | `pet.name`, `pet.state`, `meta` unchanged |
| 8 | `clamp` with value below 0 | Returns 0 |
| 9 | `clamp` with value above 100 | Returns 100 |
| 10 | `clamp` with value in range | Returns value unchanged |
| 11 | Decay rates are configurable constants | Can import `DECAY_RATES` from vitals.js |
| 12 | `DECAY_RATES` values are correct | hunger=200, happiness=171.43, energy=133.33 |
| 13 | Hunger drains fastest, energy slowest | Decay rate ordering validated |

### Test Suite: gameState.test.js (extend existing)

| # | Test Case | Expected Result |
|---|-----------|----------------|
| 14 | Initial state has all stats at 100 | hunger=100, happiness=100, energy=100 |
| 15 | Initial state has `state: 'normal'` | Confirmed |

## Manual Validation Checklist

### Visual Checks
- [ ] Three stat bars visible below the pet blob
- [ ] Each bar has a label, fill bar, and numeric value
- [ ] Bars visually shrink over time (wait 30 seconds, observe)
- [ ] Numeric values decrease as bars shrink
- [ ] **Hunger bar decreases fastest** (reaches 0 first, around 30s mark)
- [ ] **Happiness bar decreases mid-speed** (reaches 0 around 35s mark)
- [ ] **Energy bar decreases slowest** (reaches 0 around 45s mark)

### Color Transition Checks
- [ ] Fresh start: all bars show healthy color (stat-specific accents)
- [ ] Wait until a stat drops below 70: bar color shifts to amber
- [ ] Wait until a stat drops below 40: bar color shifts to orange-red
- [ ] Wait until a stat drops below 20: bar color turns red with pulsing glow
- [ ] Color transitions are smooth (not instant jumps)

### Background Tab Behavior
- [ ] Open app, note stat values
- [ ] Switch to another tab for 2 minutes
- [ ] Return to app tab — stats should have decayed for those 2 minutes (capped at 10 min)
- [ ] No visual glitch on return (smooth update)

### Edge Cases
- [ ] Stats never display negative numbers
- [ ] Stats never display above 100
- [ ] Page refresh reloads previous state (Phase 2 localStorage persistence)

### Responsive Layout
- [ ] Desktop (1440px): stats centered, readable
- [ ] Tablet (768px): stats fill container, no overflow
- [ ] Mobile (320px): stats stack properly, text readable

## Acceptance Criteria

Phase 1 is **DONE** when:
1. ✅ All unit tests pass (`npm run test`)
2. ✅ Three stat bars visible and decaying in real time
3. ✅ Color transitions work across all thresholds
4. ✅ Background tab catch-up works correctly (capped at 10 min)
5. ✅ Layout responsive from 320px to 1440px
6. ✅ Decay ordering: Hunger (30s) > Happiness (35s) > Energy (45s)
7. ✅ No console errors or warnings
