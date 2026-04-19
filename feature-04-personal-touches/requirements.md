# Requirements — Phase 4: Personal Touches

## Functional Requirements

### FR-1: Personality Message System
- `getMessage(state, now?)` function in `engine/personality.js`
- Pure function: `(gameState, timestamp?) → { text: string, color: string }`
- Returns the most relevant message based on priority hierarchy
- Priority order (highest wins):
  1. Milestone messages (temporary, shown for 3 ticks)
  2. Easter egg name reactions (shown once on naming, for 5 seconds)
  3. Stat combination reactions (2+ stats in notable ranges)
  4. State-specific messages (sick, evolved)
  5. Single low-stat warnings (any stat < 40)
  6. Rare random messages (5% chance when all stats > 50)
  7. Ambient healthy messages (all stats > 70)
  8. Default neutral message (fallback)

### FR-2: Message Variety
- Each category has **4–5 message variants**
- Random selection within category
- No consecutive repeat of the same message text
- Track `lastMessageText` in component state to prevent repeats

### FR-3: Low Stat Messages (stat < 40)
- Trigger: any single stat drops below 40
- 4 messages per stat (Hunger, Happiness, Energy)
- Tech/cyberpunk themed language
- Include relevant emoji

### FR-4: State-Specific Messages
- **Sick** (5 messages): urgent error-themed, red-toned
- **Evolved** (4 messages): confident, enhanced, purple-toned
- **Normal with all stats > 70** (4 messages): content, optimistic
- Override single-stat warnings when active

### FR-5: Stat Combination Reactions
- Special messages when multiple stat conditions combine:
  | Condition | Trigger |
  |-----------|---------|
  | Hungry + Tired | hunger < 40 AND energy < 40 |
  | Happy but Hungry | happiness > 70 AND hunger < 30 |
  | Full but Sad | hunger > 80 AND happiness < 30 |
  | All Critical | all stats < 20 |
- Combinations take priority over single-stat warnings

### FR-6: Easter Eggs — Name-Based
- On pet naming, check name against known list (case-insensitive)
- Show special greeting message for 5 seconds, then resume normal messages
- Known names and reactions:
  | Name | Theme | Reaction |
  |------|-------|----------|
  | HAL | Sci-fi | "I'm sorry Dave, I'm afraid I can't do that... just kidding! 🔴" |
  | Jarvis | Sci-fi | "At your service, sir. Shall I run diagnostics?" |
  | Cortana | Sci-fi | "Hey... I know you. Let's be friends." |
  | R2D2 | Sci-fi | "Beep boop! *happy droid noises* 🤖" |
  | Maverick | Aviation | "Feel the need... the need for FEED! 🛩️" |
  | Goose | Aviation | "Talk to me, Goose... oh wait, I AM Goose! 🪿" |
  | Iceman | Aviation | "You can be my wingman anytime. ❄️" |
  | Viper | Aviation | "Tower, this is Viper requesting immediate care. 🗼" |
- Matching is case-insensitive: "hal", "HAL", "Hal" all match

### FR-7: Easter Eggs — Milestone-Based
- Triggered when `totalCareActions` reaches specific thresholds
- Each milestone shown for 3 message cycles (≈3 seconds), then normal
- Milestones:
  | Actions | Message |
  |---------|---------|
  | 10 | "Achievement unlocked: First responder! 🏅" |
  | 25 | "You're a natural caretaker. 25 actions logged." |
  | 50 | "50 care cycles! Promoting you to Senior Engineer 🎖️" |
  | 100 | "LEGENDARY: 100 actions. You are the chosen one." |
- Track `lastMilestoneShown` in game state to prevent re-triggering

### FR-8: Easter Eggs — Rare Random
- 5% probability per message update cycle when all stats > 50
- 4 rare messages in the pool
- These are low-priority — overridden by any warning or state message

### FR-9: Message Display Timing
- Messages update every **5 seconds** (not every tick — prevents flickering)
- Except: state transitions trigger immediate message update
- Except: care actions trigger immediate message update
- Message text fades out/in on change (CSS transition 0.3s)

### FR-10: Game State Extension
- Add `pet.lastMilestoneShown` (number, default: 0) to track shown milestones
- Backward compatible: missing field defaults to 0
- Persisted in localStorage

## Non-Functional Requirements

### NFR-1: Pure Functions
- `getMessage()` is deterministic given the same inputs (except for randomness)
- Message catalog exported as constants for testability
- Easter egg name list exported for testability

### NFR-2: Performance
- Message selection runs in < 1ms (simple conditionals, no heavy computation)
- No DOM manipulation in personality engine
- CSS transitions for message changes (no JS animation)

### NFR-3: Code Organization
- Message selection logic: `src/engine/personality.js`
- Message display: `src/components/StatusMessage.jsx`
- All message strings defined in `personality.js` (single source of truth)

### NFR-4: Backward Compatibility
- Existing saves without `lastMilestoneShown` load correctly (default: 0)
- `validateState()` updated to accept optional `lastMilestoneShown`

## Constraints

- Single-line message display (no multi-line or chat bubbles)
- One message visible at a time
- Messages are decorative — they don't affect game mechanics
- Emoji usage should be tasteful (max 1-2 per message)
- No copyrighted catchphrases (original variations only)
