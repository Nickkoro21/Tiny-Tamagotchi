# Validation — Phase 2: The Care Loop

## Unit Tests (Vitest)

### Test Suite: actions.test.js

| # | Test Case | Expected Result |
|---|-----------|----------------|
| 1 | `feedPet` increases hunger by 30 | hunger: 70 → 100 (clamped) |
| 2 | `feedPet` increases happiness by 5 | happiness goes up by 5 |
| 3 | `feedPet` clamps hunger at 100 | hunger 90 + 30 = 100 (not 120) |
| 4 | `playWithPet` increases happiness by 25 | happiness goes up by 25 |
| 5 | `playWithPet` decreases energy by 10 | energy goes down by 10 |
| 6 | `playWithPet` clamps energy at 0 | energy 5 - 10 = 0 (not -5) |
| 7 | `restPet` increases energy by 35 | energy goes up by 35 |
| 8 | `restPet` increases happiness by 5 | happiness goes up by 5 |
| 9 | All actions increment totalCareActions | counter goes from 0 to 1 |
| 10 | All actions update their timestamp | lastFed/lastPlayed/lastRested changes |

### Test Suite: persistence.test.js

| # | Test Case | Expected Result |
|---|-----------|----------------|
| 11 | `serializeState` produces valid JSON | JSON.parse succeeds |
| 12 | `deserializeState` restores state from JSON | All fields match |
| 13 | `deserializeState` rejects invalid JSON | Returns null |
| 14 | `deserializeState` rejects missing `pet` key | Returns null |
| 15 | `deserializeState` rejects version mismatch | Returns null |
| 16 | `validateState` accepts valid state | Returns true |
| 17 | `validateState` rejects incomplete state | Returns false |

## Manual Validation Checklist

### Naming Screen
- [ ] First launch (clear localStorage): naming screen appears
- [ ] Cannot submit empty name
- [ ] Can type 1–16 character name
- [ ] "INITIALIZE" button starts the game
- [ ] Pet name visible in main game view
- [ ] Refresh after naming: game loads directly (no naming screen)

### Action Buttons
- [ ] Three buttons visible: FEED, PLAY, REST
- [ ] Clicking FEED increases Hunger bar visibly
- [ ] Clicking PLAY increases Happiness, decreases Energy
- [ ] Clicking REST increases Energy bar visibly
- [ ] Visual feedback on button click (flash/pulse)
- [ ] Buttons disable during cooldown with countdown
- [ ] Cooldowns: Feed 3s, Play 4s, Rest 5s
- [ ] Stats never exceed 100 or drop below 0 from actions

### Persistence — localStorage
- [ ] Play for 30+ seconds, then refresh page
- [ ] State restores correctly (stats, name, pet state)
- [ ] Perform action → immediate refresh → state persisted

### Persistence — JSON
- [ ] "SAVE TO FILE" downloads a .json file
- [ ] "LOAD FROM FILE" imports a previously saved .json
- [ ] Loading invalid file shows error message
- [ ] State updates correctly after import

### Reset
- [ ] "NEW PET" shows confirmation dialog
- [ ] Confirming clears state and shows naming screen
- [ ] Canceling does nothing

### Gameplay Loop
- [ ] Can keep pet alive indefinitely by performing actions
- [ ] Stats decay between actions (from Phase 1)
- [ ] Play creates interesting trade-off (happiness vs energy)

## Acceptance Criteria

Phase 2 is **DONE** when:
1. ✅ All unit tests pass (actions + persistence)
2. ✅ Naming screen works on fresh launch
3. ✅ Three actions modify stats correctly with cooldowns
4. ✅ localStorage auto-save/load works across refreshes
5. ✅ JSON export/import works correctly
6. ✅ Game is playable — can keep pet alive through actions
7. ✅ No console errors or warnings
