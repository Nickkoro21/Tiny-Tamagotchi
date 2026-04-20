# Feature Plan — Phase 4: Personal Touches

## Overview

Add a personality system that makes the pet feel alive through contextual dialogue, stat-aware reactions, and discoverable easter eggs. The pet speaks in tech jargon, reacts to stat combinations, celebrates milestones, and has hidden responses for special names — including aviation callsigns and personal tributes to the project author.

## Goal

The static status messages from Phase 3 become dynamic and contextual. The pet cycles through multiple messages per situation, creating variety. Stat combinations trigger unique reactions. Easter eggs reward curiosity. The result: a pet that feels like it has a personality, not just a state machine.

## Task Groups

### Group 1: Personality Engine (`engine/personality.js`)
- Implement `getMessage(state, now?)` — returns a contextual message string
- Message selection priority (highest to lowest):
  1. Easter egg triggers (name-based, milestone-based)
  2. Stat combination reactions (multiple stats interacting)
  3. State-specific messages (sick, evolved, normal)
  4. Single low-stat warnings
  5. Idle/ambient messages (all stats healthy)
- Random selection within each category (no repeat of last message)
- Export message catalog as constants for testability

### Group 2: Message Catalog
- **4-5 messages per category**, randomly selected:

  **Low Hunger (< 40):**
  - "Memory leak detected... need fuel ⚡"
  - "Buffer underflow in nutrition module..."
  - "Garbage collector requesting food packets 🍕"
  - "WARN: Calorie reserves at critical threshold"

  **Low Happiness (< 40):**
  - "Kernel panic... play with me! 🎮"
  - "Mood daemon has stopped responding..."
  - "Dopamine.exe not found. Run PLAY?"
  - "Serotonin levels below acceptable range 😔"

  **Low Energy (< 40):**
  - "CPU throttling... need reboot 💤"
  - "Battery saver mode activated..."
  - "Thread pool exhausted. Scheduling REST..."
  - "Power management: sleep mode recommended 🔋"

  **Sick State:**
  - "CRITICAL ERROR: Multiple systems failing..."
  - "Kernel dump in progress... help required"
  - "BSOD imminent. Emergency care needed! 🚨"
  - "System integrity compromised. Run diagnostics."
  - "ERROR 503: Service degraded. Immediate attention required."

  **Evolved State:**
  - "Firmware v2.0 loaded. Enhanced protocols active ✨"
  - "Neural pathways optimized. Running at peak efficiency 🚀"
  - "Quantum coherence achieved. All systems transcendent."
  - "Overclocked and loving it. Max performance unlocked."

  **All Stats Healthy (> 70):**
  - "All systems nominal. Life is good 😎"
  - "Running smooth. No complaints today!"
  - "Optimal performance. Ready for anything 💪"
  - "Core temp stable. Vibes: excellent."

### Group 3: Stat Combination Reactions
- Special messages when multiple conditions combine:
  - **Hungry + Tired** (hunger < 40 AND energy < 40): "Running on empty... literally. Feed AND rest me!"
  - **Happy but Hungry** (happiness > 70 AND hunger < 30): "Having fun but... my stomach is throwing exceptions."
  - **Full but Sad** (hunger > 80 AND happiness < 30): "Fed but not fulfilled. Play with me?"
  - **All Critical** (all stats < 20): "MAYDAY MAYDAY! All systems failing! 🆘"

### Group 4: Easter Eggs

**Name-based** — special greeting on naming (11 names total across 3 themes, case-insensitive matching):

  *Sci-fi theme (4):*
  - "HAL" → "I'm sorry Dave, I'm afraid I can't do that... just kidding! 🔴"
  - "Jarvis" → "At your service, sir. Shall I run diagnostics?"
  - "Cortana" → "Hey... I know you. Let's be friends."
  - "R2D2" → "Beep boop! *happy droid noises* 🤖"

  *Aviation theme (4):*
  - "Maverick" → "Feel the need... the need for FEED! 🛩️"
  - "Goose" → "Talk to me, Goose... oh wait, I AM Goose! 🪿"
  - "Iceman" → "You can be my wingman anytime. ❄️"
  - "Viper" → "Tower, this is Viper requesting immediate care. 🗼"

  *Personal theme (3) — tribute to the project author:*
  - "Nick" → "Hey Nick! Ready for some spec-driven caring? 📋"
  - "Koro" → "Koro on deck! All specs checked, systems go! ✈️"
  - "Nick Koro" → "The architect himself! SDD workflow activated. Welcome aboard, Captain! 🎖️"

**Milestone-based** — triggered at totalCareActions thresholds:
  - 10 actions: "Achievement unlocked: First responder! 🏅"
  - 25 actions: "You're a natural caretaker. 25 actions logged."
  - 50 actions: "50 care cycles! Promoting you to Senior Engineer 🎖️"
  - 100 actions: "LEGENDARY: 100 actions. You are the chosen one."

**Rare random** — 5% chance per tick when all stats > 50:
  - "Did you know I dream in binary? 01000110..."
  - "Sometimes I wonder if MY creator is also an AI..."
  - "Is this the real life? Is this just simulation?"
  - "I think, therefore I ping."

### Group 5: StatusMessage Component Update
- Update `StatusMessage.jsx` to use `getMessage()` from personality engine
- Message updates on every tick (1-second interval)
- Prevent same message repeating consecutively
- Smooth text transition (fade out/in on message change)
- Message color matches current state (cyan/red/purple)

### Group 6: Visual Polish
- Evolution celebration: brief burst animation when entering Evolved state
- Pet idle animation polish: subtle blink effect on eyes (2s interval)
- Responsive layout final check (320px–1440px)

## Approach

Engine-first: build and test the personality message selection logic, then wire it into StatusMessage, then add visual polish.

## Dependencies

- Phase 3 complete (state machine, Pet.jsx, StatusMessage.jsx)
- `pet.state`, `pet.totalCareActions`, all stats available in game state
- Current `getMessage` replaces the static STATE_MESSAGES from Phase 3

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Message flickering on every tick | Only update message when category changes or randomly every ~5s |
| Easter egg messages missed (shown only once) | Name-based shown for 5 seconds on naming; milestones shown for 3 ticks |
| Too many messages cluttering UI | Single-line display, one message at a time |
| Random messages feel random | Priority system ensures most relevant message wins |
