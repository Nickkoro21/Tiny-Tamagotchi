# Roadmap — Tiny Tamagotchi

## Overview

Development follows a linear feature sequence. Each phase builds on the previous one. Features are ordered by dependency: vitals must exist before actions can modify them, actions must work before state transitions can evaluate them, and states must function before personality can react to them.

```
Phase 0 ──▶ Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5 ──▶ Phase 6
Scaffold    Living       Care        Dynamic      Personal    Polish       A11y
            Vitals       Loop        States       Touches     & MVP        (post-MVP)
```

---

## Phase 0: Project Scaffold ✅

**Goal:** Bootable Preact app with folder structure, dev server, and empty component shells.

- [ ] Initialize Vite + Preact project
- [ ] Set up folder structure (components/, engine/, persistence/, styles/)
- [ ] Create placeholder components (App, Pet, Stats, Actions)
- [ ] Set up CSS variables and dark sci-fi base theme
- [ ] Verify `npm run dev` works with a "Hello Tamagotchi" screen
- [ ] Set up Vitest with a passing dummy test

**Deliverable:** Running dev server with themed placeholder UI.

---

## Phase 1: Living Vitals (Pillar 1) ✅

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

## Phase 2: The Care Loop (Pillar 2) ✅

**Goal:** Three actions (Feed, Play, Rest) that restore specific stats with cooldowns.

- [ ] Implement action logic in `engine/vitals.js` (or dedicated `actions.js`)
- [ ] Define action effects:
  - Feed: +30 Hunger, +5 Happiness
  - Play: +25 Happiness, -10 Energy
  - Rest: +35 Energy, +5 Happiness
- [ ] Implement cooldown system (per action, configurable duration)
- [ ] Build `Actions.jsx` — three action buttons with cooldown indicators
- [ ] Build `Naming.jsx` — initial pet naming screen (shown once at first launch)
- [ ] Implement localStorage auto-save (save on action + periodic)
- [ ] Implement JSON export/import functionality
- [ ] Visual feedback: button animations, stat bar response
- [ ] Unit tests for action effects, cooldowns
- [ ] Unit tests for persistence (save/load/export/import)

**Deliverable:** Fully interactive care loop — name pet, perform actions, stats respond, state persists.

**Depends on:** Phase 1

---

## Phase 3: Dynamic States (Pillar 3) ✅

**Goal:** Pet transitions between Normal, Sick, and Evolved states with distinct visuals.

- [ ] Implement state machine in `engine/states.js`:
  - **Normal → Sick:** Any stat drops below 20
  - **Sick → Normal:** All stats restored to ≥ 50 (recovery path; `sustainedGoodCareStart` is reset to `null` — evolution must be re-earned)
  - **Normal → Evolved:** `totalCareActions ≥ 6` **AND** all stats `> 70` for `≥ 15 s` sustained
  - **Evolved → Sick:** Any stat drops below 20 (Evolved pet is resilient but not invincible — there is no direct Evolved → Normal transition)
- [ ] **Zero Stats Edge Case (FR-9):** When all three stats = 0, pet remains in Sick state (no permanent death per challenge rules); care actions remain fully functional; status shows `⚠ CRITICAL STASIS — Use Feed, Play, Rest to restore systems` hint in `--accent-danger` color; recovery follows standard Sick → Normal path when all stats ≥ 50
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

## Phase 4: Personal Touches (Pillar 4) ✅

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
  - Milestone: Messages at care action milestones (10, 25, 50, 100 actions)
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

## Phase 6: Accessibility (a11y) 📍 _Planned — post-MVP_

**Goal:** Make the application usable for people who rely on screen readers, keyboard-only navigation, or reduced motion — following WCAG 2.1 AA and the principle that accessibility is **always-on**, not a toggle.

> **Design note:** Accessibility is not implemented as a "blind-friendly mode" button. A user who cannot see the screen cannot discover and activate such a toggle. Instead, a11y affordances are baked into the default UI and progressively enhance the experience for assistive-technology users without altering the experience for sighted users.

- [ ] **Semantic structure audit** — verify landmarks (`<main>`, `<header>`, `<footer>`), heading hierarchy (single `<h1>`, logical `<h2>` progression), and list semantics for the vitals display
- [ ] **ARIA labels on action buttons** — `aria-label="Feed pet (+30 hunger, +5 happiness)"` etc., including cooldown state (`aria-disabled`, `aria-describedby` pointing to cooldown timer)
- [ ] **Live regions for vitals** — `aria-live="polite"` on the stats container so screen readers announce stat changes after actions; `aria-live="assertive"` on state transitions (Normal → Sick → Evolved)
- [ ] **Keyboard navigation** — full tab order through naming → actions → reset; visible focus indicators on all interactive elements (outline, never `outline: none` without replacement)
- [ ] **Stat values in text, not just color** — already partially done (numeric values shown); verify no information is conveyed by color alone (WCAG 1.4.1)
- [ ] **Color contrast audit** — verify all text against backgrounds at WCAG AA ratios (4.5:1 for body, 3:1 for large text and UI components), especially the Sick-state red tint and Evolved-state purple glow
- [ ] **`prefers-reduced-motion` support** — disable or simplify the idle breathing animation, glitch effect (Sick), and shimmer particles (Evolved) when the user has reduced-motion preference set
- [ ] **Screen reader testing** — manual walkthrough with NVDA (Windows) and VoiceOver (macOS): name a pet, perform actions, observe state transitions, trigger an easter egg
- [ ] **Personality messages announced** — verify that cycling personality messages reach the screen reader (likely via `aria-live="polite"` on the message container with debounce to avoid flooding)
- [ ] **Easter-egg naming still accessible** — the case-insensitive matching already works; verify the reaction text is announced
- [ ] Unit tests for ARIA attributes on rendered components (via Vitest + @testing-library/preact queries like `getByRole`, `getByLabelText`)
- [ ] Automated a11y audit via `axe-core` / `vitest-axe` integration (CI-runnable)

**Deliverable:** WCAG 2.1 AA compliant application, tested with at least one screen reader and validated with an automated a11y linter.

**Depends on:** Phase 5 (submission)

**Deferred from MVP because:**
- Proper a11y is cross-cutting (touches every component) and not a feature toggle
- Requires its own full SDD cycle (plan / requirements / validation) to do correctly
- The MVP scope is satisfied without it per challenge rules; a11y is a quality commitment, not a challenge deliverable

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
