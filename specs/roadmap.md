# Roadmap — Tiny Tamagotchi

## Overview

Development follows a linear feature sequence. Each phase builds on the previous one. Features are ordered by dependency: vitals must exist before actions can modify them, actions must work before state transitions can evaluate them, and states must function before personality can react to them.

```
Phase 0 ──▶ Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5
Scaffold    Living       Care        Dynamic      Personal    Polish
            Vitals       Loop        States       Touches     & MVP
```

---

## Phase 0: Project Scaffold ✅→⬜

**Goal:** Bootable Preact app with folder structure, dev server, and empty component shells.

- [ ] Initialize Vite + Preact project
- [ ] Set up folder structure (components/, engine/, persistence/, styles/)
- [ ] Create placeholder components (App, Pet, Stats, Actions)
- [ ] Set up CSS variables and dark sci-fi base theme
- [ ] Verify `npm run dev` works with a "Hello Tamagotchi" screen
- [ ] Set up Vitest with a passing dummy test

**Deliverable:** Running dev server with themed placeholder UI.

---

## Phase 1: Living Vitals (Pillar 1)

**Goal:** Three stats (Hunger, Happiness, Energy) that decay automatically over time, with visual indicators.

- [ ] Implement game state object in `engine/gameState.js`
- [ ] Implement stat decay logic in `engine/vitals.js` with configurable rates
- [ ] Create timer system (1-second tick) that calculates elapsed time
- [ ] Handle background tab / inactive window (catch-up on return)
- [ ] Build `Stats.jsx` component — three stat bars with labels and values
- [ ] Visual feedback: color transitions as stats drop (cyan → orange → red)
- [ ] CSS animations for stat bar changes
- [ ] Unit tests for decay calculations and edge cases (clamp 0–100)

**Deliverable:** Stats visible on screen, decaying in real time with visual feedback.

**Depends on:** Phase 0

---

## Phase 2: The Care Loop (Pillar 2)

**Goal:** Three actions (Feed, Play, Rest) that restore specific stats with cooldowns.

- [ ] Implement action logic in `engine/vitals.js` (or dedicated `actions.js`)
- [ ] Define action effects:
  - Feed: +25 Hunger, +5 Happiness
  - Play: +20 Happiness, -10 Energy
  - Rest: +30 Energy, +5 Happiness
- [ ] Implement cooldown system (per action, configurable duration)
- [ ] Implement diminishing returns for repeated same-action
- [ ] Build `Actions.jsx` — three action buttons with cooldown indicators
- [ ] Build `Naming.jsx` — initial pet naming screen (shown once at first launch)
- [ ] Implement localStorage auto-save (save on action + periodic)
- [ ] Implement JSON export/import functionality
- [ ] Visual feedback: button animations, stat bar response
- [ ] Unit tests for action effects, cooldowns, diminishing returns
- [ ] Unit tests for persistence (save/load/export/import)

**Deliverable:** Fully interactive care loop — name pet, perform actions, stats respond, state persists.

**Depends on:** Phase 1

---

## Phase 3: Dynamic States (Pillar 3)

**Goal:** Pet transitions between Normal, Sick, and Evolved states with distinct visuals.

- [ ] Implement state machine in `engine/states.js`:
  - **Normal → Sick:** Any stat drops below 20
  - **Sick → Normal:** All stats restored above 50 (recovery path)
  - **Normal → Evolved:** totalCareActions exceeds threshold AND all stats above 70 for sustained period
- [ ] Define state transition rules with clear thresholds
- [ ] Build visual states in `pet.css`:
  - Normal: cyan glow, smooth idle animation
  - Sick: red/glitch animation, static noise overlay
  - Evolved: purple glow, particle effects, enhanced appearance
- [ ] Build `Pet.jsx` — SVG or CSS-based creature that changes with state
- [ ] Status message system showing current state context
- [ ] Stat decay modifiers per state:
  - Sick: decay rate × 1.5 (stats drop faster when sick)
  - Evolved: decay rate × 0.7 (evolved pet is more resilient)
- [ ] Unit tests for state transitions, edge cases, decay modifiers

**Deliverable:** Pet visually transforms between three states based on care quality.

**Depends on:** Phase 2

---

## Phase 4: Personal Touches (Pillar 4)

**Goal:** Easter eggs, quirky reactions, and personality that make the pet feel alive.

- [ ] Implement personality system in `engine/personality.js`
- [ ] Tech-themed dialogue messages:
  - Low hunger: "Memory leak detected... need fuel ⚡"
  - Low energy: "CPU throttling... need reboot 💤"
  - Low happiness: "Kernel panic... play with me! 🎮"
  - High all stats: "All systems nominal! Running at peak performance 🚀"
  - Sick state: "CRITICAL ERROR: Multiple systems failing..."
  - Evolved state: "Firmware v2.0 loaded. Enhanced protocols active."
- [ ] Build `StatusMessage.jsx` — displays contextual reactions
- [ ] Context-aware reactions (stat combinations, time of day, action streaks)
- [ ] Easter eggs:
  - Name-based: Special reaction for specific pet names (e.g., "HAL", "Jarvis")
  - Milestone: Messages at care action milestones (10, 50, 100 actions)
  - Hidden: Rare random messages (low probability per tick)
- [ ] Evolution celebration animation
- [ ] Polish idle animations (breathing, blinking, subtle movement)
- [ ] Responsive layout verification (320px–1440px)

**Deliverable:** Pet with unique personality, contextual reactions, and discoverable easter eggs.

**Depends on:** Phase 3

---

## Phase 5: Polish & MVP

**Goal:** Final review, testing, documentation, and submission preparation.

- [ ] Full test suite pass (all unit tests green)
- [ ] Manual QA walkthrough of all states and transitions
- [ ] Cross-browser check (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness check
- [ ] README.md with setup instructions and project overview
- [ ] Verify spec consistency (all .md files aligned)
- [ ] Record video walkthrough of working app
- [ ] Final repo structure matches submission requirements
- [ ] Submit to challenge thread

**Deliverable:** Submission-ready repo with working app and video.

**Depends on:** Phase 4

---

## Timeline Estimate

| Phase | Estimated Effort | Cumulative |
|-------|-----------------|------------|
| Phase 0: Scaffold | ~30 min | 30 min |
| Phase 1: Living Vitals | ~1.5 hrs | 2 hrs |
| Phase 2: Care Loop | ~2 hrs | 4 hrs |
| Phase 3: Dynamic States | ~2 hrs | 6 hrs |
| Phase 4: Personal Touches | ~1.5 hrs | 7.5 hrs |
| Phase 5: Polish & MVP | ~1 hr | 8.5 hrs |

**Deadline:** Wednesday, April 22, 2026 — 11:59 PM PST

---

## Replan Checkpoints

After each phase, pause and review:
1. Does the next phase still make sense?
2. Did we discover new requirements?
3. Do the specs need updating?
4. Are the decay rates / thresholds feeling right? (especially after Phase 1 & 2)
