# Validation — Phase 3: Dynamic States

## Unit Tests (Vitest)

### Test Suite: states.test.js

#### State Transition Tests

| #  | Test Case | Input State | Expected Result |
|----|-----------|-------------|-----------------|
| 1  | Normal pet, all stats healthy (≥ 20) | state: "normal", hunger: 80 | State remains "normal" |
| 2  | Normal → Sick: hunger drops below 20 | state: "normal", hunger: 15 | State becomes "sick", `sustainedGoodCareStart` reset to null |
| 3  | Normal → Sick: happiness drops below 20 | state: "normal", happiness: 10 | State becomes "sick" |
| 4  | Normal → Sick: energy drops below 20 | state: "normal", energy: 19 | State becomes "sick" |
| 5  | Normal → Sick: exactly 20 does NOT trigger | state: "normal", hunger: 20 | State remains "normal" (threshold is strictly < 20) |
| 6  | Sick → Normal: all stats ≥ 50 | state: "sick", all stats: 55 | State becomes "normal" |
| 7  | Sick stays Sick: one stat still < 50 | state: "sick", hunger: 45, rest ≥ 50 | State remains "sick" |
| 8  | Sick → Normal: exactly 50 triggers recovery | state: "sick", all stats: 50 | State becomes "normal" (threshold is ≥ 50) |

#### Evolution Tests

| #  | Test Case | Input State | Expected Result |
|----|-----------|-------------|-----------------|
| 9  | Evolution conditions NOT met: too few actions | totalCareActions: 5, all stats > 70, sustained 15s | State remains "normal" |
| 10 | Evolution conditions NOT met: stats not sustained | totalCareActions: 10, sustainedGoodCareStart: now | State remains "normal" (hasn't been 15s yet) |
| 11 | Evolution conditions NOT met: one stat ≤ 70 | totalCareActions: 10, hunger: 65 | State remains "normal", `sustainedGoodCareStart` reset to null |
| 12 | Normal → Evolved: all conditions met | totalCareActions: 6, all stats > 70, sustained ≥ 15s | State becomes "evolved" |
| 13 | Evolved → Sick: stat drops below 20 | state: "evolved", energy: 12 | State becomes "sick" |
| 14 | Evolved stays Evolved: all stats healthy | state: "evolved", all stats > 30 | State remains "evolved" |

#### Sustained Care Tracking Tests

| #  | Test Case | Input State | Expected Result |
|----|-----------|-------------|-----------------|
| 15 | Tracking starts: all stats > 70, no timer yet | sustainedGoodCareStart: null, all > 70 | `sustainedGoodCareStart` set to current time |
| 16 | Tracking continues: all stats > 70, timer running | sustainedGoodCareStart: (recent), all > 70 | `sustainedGoodCareStart` unchanged |
| 17 | Tracking resets: a stat drops to ≤ 70 | sustainedGoodCareStart: (set), hunger: 70 | `sustainedGoodCareStart` reset to null |
| 18 | Tracking resets on Sick transition | sustainedGoodCareStart: (set), hunger: 15 | `sustainedGoodCareStart` reset to null |
| 19 | Timer not started when pet is Sick | state: "sick", all stats > 70 | `sustainedGoodCareStart` remains null |
| 20 | Timer not started when pet is Evolved | state: "evolved", all stats > 70 | `sustainedGoodCareStart` unchanged (already evolved) |

#### Decay Multiplier Tests

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 21 | `getDecayMultiplier("normal")` | Returns 1.0 |
| 22 | `getDecayMultiplier("sick")` | Returns 1.5 |
| 23 | `getDecayMultiplier("evolved")` | Returns 0.7 |
| 24 | `getDecayMultiplier` with unknown state | Returns 1.0 (safe fallback) |

### Test Suite: vitals.test.js (extend existing)

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 25 | `applyDecay` with multiplier 1.5 (sick) | Decay is 50% faster than normal |
| 26 | `applyDecay` with multiplier 0.7 (evolved) | Decay is 30% slower than normal |
| 27 | `applyDecay` without multiplier argument | Behaves exactly as before (defaults to 1.0) |

### Test Suite: persistence.test.js (extend existing)

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 28 | Save/load preserves `sustainedGoodCareStart` | Field survives round-trip |
| 29 | Load Phase 2 save (missing `sustainedGoodCareStart`) | Defaults to null, loads successfully |
| 30 | `validateState` accepts state with `sustainedGoodCareStart` | Returns true |

### Exported Constants Tests

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 31 | `SICK_THRESHOLD` is importable | Equals 20 |
| 32 | `RECOVERY_THRESHOLD` is importable | Equals 50 |
| 33 | `EVOLUTION_CARE_THRESHOLD` is importable | Equals 6 |
| 34 | `EVOLUTION_SUSTAINED_MS` is importable | Equals 15000 |

## Manual Validation Checklist

### Normal → Sick Transition
- [ ] Start fresh pet, let stats decay naturally
- [ ] When first stat drops below 20: pet blob changes to red/glitch appearance
- [ ] Status message changes to "⚠ CRITICAL ERROR: Systems degraded"
- [ ] Observe stats decaying faster than before (×1.5 multiplier)
- [ ] Stat bars still show correct color feedback (critical red)

### Sick → Normal Recovery
- [ ] While Sick, use Feed, Play, Rest to raise all stats above 50
- [ ] Pet blob returns to cyan/normal appearance
- [ ] Status message returns to "▸ ALL SYSTEMS NOMINAL"
- [ ] Decay rate returns to normal speed

### Normal → Evolved Transition
- [ ] Start fresh pet, perform 6+ care actions
- [ ] Keep all stats above 70 for at least 15 seconds
- [ ] Pet blob transforms to purple glow with shimmer effect
- [ ] Status message changes to "★ FIRMWARE v2.0 — Enhanced protocols active"
- [ ] Observe stats decaying slower than before (×0.7 multiplier)

### Evolved → Sick (Reversibility)
- [ ] While Evolved, stop caring — let stats decay
- [ ] When any stat drops below 20: pet goes Sick (even from Evolved)
- [ ] After recovering to Normal, evolution progress resets (must re-earn)

### Visual Quality Checks
- [ ] Normal → Sick transition has smooth 0.6s visual crossfade
- [ ] Sick → Normal transition has smooth visual crossfade
- [ ] Normal → Evolved transition has smooth visual crossfade
- [ ] Glitch animation on Sick pet is not seizure-inducing (comfortable frequency)
- [ ] Evolved shimmer effect is visually distinct from Normal
- [ ] All three states look clearly different from each other

### Persistence Checks
- [ ] Get pet to Evolved state, refresh browser → pet loads as Evolved
- [ ] Get pet to Sick state, refresh browser → pet loads as Sick
- [ ] Start evolution timer (stats > 70), refresh before 15s → timer continues from saved timestamp
- [ ] Load a Phase 2 save file (JSON import) → loads correctly, pet starts as Normal

### Responsive Layout
- [ ] Pet blob + state visuals render correctly on mobile (320px)
- [ ] Status message readable on all viewport sizes
- [ ] No overflow or layout break from state CSS effects

### Edge Cases
- [ ] Multiple stats drop below 20 simultaneously → single Sick transition (no double-trigger)
- [ ] Stats exactly at threshold: 20 (not sick), 50 (triggers recovery), 70 (not sustained)
- [ ] Rapid state cycling (sick → normal → sick quickly) → no visual glitches
- [ ] Evolved pet with decaying stats: verify ×0.7 rate until stat < 20 triggers Sick

## Acceptance Criteria

Phase 3 is **DONE** when:
1. ✅ All new unit tests pass (states.test.js: 20+ tests)
2. ✅ All existing unit tests still pass (no regressions)
3. ✅ Normal → Sick transition works visually and mechanically
4. ✅ Sick → Normal recovery works
5. ✅ Normal → Evolved transition works with sustained care
6. ✅ Evolved → Sick reversibility works
7. ✅ Decay multipliers active per state (×1.0 / ×1.5 / ×0.7)
8. ✅ Three distinct visual states clearly visible
9. ✅ State persists across browser refresh
10. ✅ Backward compatible with Phase 2 saves
11. ✅ No console errors or warnings
