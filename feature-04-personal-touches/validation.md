# Validation — Phase 4: Personal Touches

## Unit Tests (Vitest)

### Test Suite: personality.test.js

#### Message Selection Priority Tests

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 1  | All stats healthy (> 70), normal state | Returns ambient healthy message |
| 2  | Hunger < 40, other stats healthy | Returns hunger warning message |
| 3  | Happiness < 40, other stats healthy | Returns happiness warning message |
| 4  | Energy < 40, other stats healthy | Returns energy warning message |
| 5  | Sick state overrides single-stat warnings | Returns sick state message |
| 6  | Evolved state returns evolved message | Returns evolved message |
| 7  | Combination: hunger < 40 AND energy < 40 | Returns combo message, not single-stat |
| 8  | Combination: happiness > 70 AND hunger < 30 | Returns "happy but hungry" combo |
| 9  | All stats < 20 returns "all critical" combo | Returns MAYDAY message |

#### Easter Egg Tests

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 10 | Name "HAL" triggers easter egg | Returns HAL-specific greeting |
| 11 | Name "hal" triggers easter egg (case-insensitive) | Returns HAL-specific greeting |
| 12 | Name "Maverick" triggers aviation easter egg | Returns Maverick greeting |
| 13 | Name "Goose" triggers aviation easter egg | Returns Goose greeting |
| 14 | Name "Iceman" triggers aviation easter egg | Returns Iceman greeting |
| 15 | Name "RandomName" does NOT trigger easter egg | Returns null/undefined |
| 16 | Easter egg names list is exported | Can import EASTER_EGG_NAMES |

#### Milestone Tests

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 17 | totalCareActions = 10, lastMilestoneShown = 0 | Returns milestone message for 10 |
| 18 | totalCareActions = 10, lastMilestoneShown = 10 | Returns null (already shown) |
| 19 | totalCareActions = 25, lastMilestoneShown = 10 | Returns milestone message for 25 |
| 20 | totalCareActions = 50, lastMilestoneShown = 25 | Returns milestone message for 50 |
| 21 | totalCareActions = 100, lastMilestoneShown = 50 | Returns milestone message for 100 |
| 22 | totalCareActions = 15, no milestone threshold | Returns null |

#### Message Catalog Tests

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 23 | Low hunger messages array has 4+ entries | Length ≥ 4 |
| 24 | Low happiness messages array has 4+ entries | Length ≥ 4 |
| 25 | Low energy messages array has 4+ entries | Length ≥ 4 |
| 26 | Sick messages array has 4+ entries | Length ≥ 4 |
| 27 | Evolved messages array has 4+ entries | Length ≥ 4 |
| 28 | Healthy ambient messages array has 4+ entries | Length ≥ 4 |
| 29 | All messages are non-empty strings | Every entry is typeof string, length > 0 |

#### Rare Random Tests

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 30 | Rare messages pool has 4+ entries | Length ≥ 4 |
| 31 | Rare message only triggers when all stats > 50 | No rare message when any stat ≤ 50 |

### Test Suite: persistence.test.js (extend)

| #  | Test Case | Expected Result |
|----|-----------|-----------------|
| 32 | Save/load preserves `lastMilestoneShown` | Field survives round-trip |
| 33 | Load save missing `lastMilestoneShown` | Defaults to 0 |

## Manual Validation Checklist

### Message Variety
- [ ] Start fresh pet, observe messages cycling (wait 15+ seconds)
- [ ] No two consecutive messages are identical
- [ ] Messages change approximately every 5 seconds

### Low Stat Messages
- [ ] Let hunger drop below 40 → see hunger-specific tech message
- [ ] Let happiness drop below 40 → see happiness-specific tech message
- [ ] Let energy drop below 40 → see energy-specific tech message
- [ ] Messages include emoji and tech jargon

### State-Specific Messages
- [ ] When Sick: messages are urgent/error-themed
- [ ] When Evolved: messages are confident/enhanced-themed
- [ ] When Normal + healthy stats: messages are content/positive

### Stat Combinations
- [ ] Hungry + Tired simultaneously → combo message appears
- [ ] All stats < 20 → MAYDAY message appears
- [ ] Combo messages take priority over single-stat warnings

### Easter Eggs — Names
- [ ] Name pet "HAL" → see HAL greeting for ~5 seconds
- [ ] Name pet "Maverick" → see aviation greeting
- [ ] Name pet "Goose" → see Goose greeting
- [ ] Name pet "Iceman" → see Iceman greeting
- [ ] Name pet "Jarvis" → see Jarvis greeting
- [ ] Name pet "anything-else" → no special greeting
- [ ] Case-insensitive: "hal" works same as "HAL"

### Easter Eggs — Milestones
- [ ] Perform 10 care actions → milestone message appears briefly
- [ ] Perform 25 care actions → next milestone message
- [ ] Milestone messages don't re-trigger on page refresh

### Easter Eggs — Rare Random
- [ ] With healthy pet, observe for 1-2 minutes → occasional rare message
- [ ] Rare messages don't appear when stats are low

### Visual Polish
- [ ] Message text fades smoothly on change (no abrupt text swap)
- [ ] Message color matches state (cyan normal, red sick, purple evolved)
- [ ] Pet eyes blink subtly during idle
- [ ] Layout looks good on mobile (320px) and desktop (1440px)

### Persistence
- [ ] Achieve milestone, refresh → milestone not re-shown
- [ ] Name pet with easter egg name, refresh → normal messages resume

## Acceptance Criteria

Phase 4 is **DONE** when:
1. ✅ All new unit tests pass (personality.test.js: 31+ tests)
2. ✅ All existing tests still pass (no regressions)
3. ✅ Messages cycle with variety (4-5 per category)
4. ✅ Low stat warnings appear contextually
5. ✅ Stat combinations trigger special messages
6. ✅ Name-based easter eggs work (11 names including aviation and personal)
7. ✅ Milestone easter eggs trigger and don't repeat
8. ✅ Rare random messages appear occasionally
9. ✅ Message transitions are smooth (fade effect)
10. ✅ Backward compatible with Phase 3 saves
11. ✅ No console errors or warnings
