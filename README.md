# Tiny Tamagotchi 🐾

A virtual pet web app built with **Spec-Driven Development** — where the specification is the primary artifact, and the code follows.

> Built for the [DeepLearning.AI 7-Day Learner Challenge](https://community.deeplearning.ai/t/7-day-learner-challenge-tiny-tamagotchi-mvp-with-spec-driven-development/891489) (Spec-Driven Development with Coding Agents course).

## 🎮 Live Demo

### 🎥 Video Walkthrough

<!-- ⬇️ REPLACE THIS PLACEHOLDER AFTER RECORDING ⬇️ -->
<!-- Paste the video URL (YouTube / Loom / Vimeo / direct MP4) between the parentheses -->

> _🎬 **Video walkthrough coming soon** — will be embedded here._
>
> _Planned coverage: naming a pet, real-time vitals decay, the care loop (Feed / Play / Rest), the state machine (Normal → Sick recovery + Normal → Evolved), personality messages cycling, and easter-egg names (`Maverick`, `HAL`, `Nick Koro`)._

<!-- Once uploaded, replace the above blockquote with one of these formats:

  Option A — YouTube/Vimeo thumbnail link:
  [![Tiny Tamagotchi walkthrough](./docs/video-thumbnail.png)](https://youtu.be/YOUR_VIDEO_ID)

  Option B — Loom embed link (GitHub renders as preview):
  https://www.loom.com/share/YOUR_LOOM_ID

  Option C — Direct inline GIF (for shorter demos):
  ![Tiny Tamagotchi demo](./docs/demo.gif)
-->

### 📸 Screenshot

<!-- ![Tiny Tamagotchi screenshot](./docs/screenshot.png) -->

> _A screenshot will be added here alongside the video._

### 🖥 Run it yourself

Local setup in [Setup](#-setup) below — `npm install && npm run dev` → `http://localhost:5173`.

## ✨ Features — The Four Pillars

### 1. Living Vitals
Three stats (Hunger, Happiness, Energy) on a 0–100 scale that decay automatically in real time at different rates (Happiness fastest, Energy slowest). Visual color feedback shifts from healthy → warning → low → critical as stats drop.

### 2. The Care Loop
Three actions — **Feed** (+30 hunger / +5 happiness), **Play** (+25 happiness / −10 energy), **Rest** (+35 energy / +5 happiness) — each with its own cooldown (3–5 s). Pet naming on first launch. State persists via `localStorage` with JSON export/import backup.

### 3. Dynamic States
The pet transitions between three visual states with distinct decay modifiers:
- **Normal** — cyan glow, smooth idle animation (decay ×1.0)
- **Sick** — red glitch effect, distorted shape (decay ×1.5) — triggered when any stat drops below 20
- **Evolved** — purple glow, shimmer particles, bright eyes (decay ×0.7) — unlocked after 6+ care actions with all stats > 70 for 15 s sustained

### 4. Personal Touches
- **Tech-themed personality messages** cycling every 5 seconds, priority-ranked (milestones > state > combos > low-stat warnings > rare > ambient)
- **Context-aware reactions** for stat combinations (e.g., `Hungry + Tired`, `Full but Sad`, `All Critical = MAYDAY`)
- **11 easter-egg names** across three themes (case-insensitive):
  - **Sci-fi (4):** HAL, Jarvis, Cortana, R2D2
  - **Aviation (4):** Maverick, Goose, Iceman, Viper
  - **Personal (3):** Nick, Koro, Nick Koro
- **Milestone celebrations** at 10, 25, 50, and 100 care actions (each shown once)
- **Rare random messages** (5% chance when all stats > 50)

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| UI Framework | Preact ^10.x | 3 KB runtime, React-compatible API — lightweight for an MVP |
| Build Tool | Vite ^6.x | Instant dev server, zero-config HMR, fast builds |
| Styling | Vanilla CSS (custom properties) | No framework lock-in, full theme control via CSS variables |
| Testing | Vitest ^3.x | Native Vite integration, Jest-compatible API, first-class ESM |
| Language | JavaScript (ES2022+, JSX) | No transpile cost beyond Vite; modern syntax without a type-checker in the loop |
| Persistence | localStorage + JSON export/import | Client-only — no backend needed for a single-user MVP |

> **Why this stack?** Each choice was made to minimize MVP complexity while keeping the door open for later upgrades (e.g., swapping Preact for React, or localStorage for IndexedDB). Nothing here blocks scale; everything here accelerates shipping.

## 📂 Project Structure

```
TinyTamagotchi/
├── specs/                          # SDD Constitution
│   ├── mission.md                  #   Vision, audience, scope
│   ├── tech-stack.md               #   Architecture decisions
│   └── roadmap.md                  #   Development phases
├── feature-01-living-vitals/       # Feature specs (per phase) — same 3-file SDD structure
│   ├── feature-plan.md             #     Task groups, approach, sequence
│   ├── requirements.md             #     Functional + non-functional reqs
│   └── validation.md               #     Unit tests + manual checklist
├── feature-02-care-loop/
│   ├── feature-plan.md
│   ├── requirements.md
│   └── validation.md
├── feature-03-dynamic-states/
│   ├── feature-plan.md
│   ├── requirements.md
│   └── validation.md
├── feature-04-personal-touches/
│   ├── feature-plan.md
│   ├── requirements.md
│   └── validation.md
├── src/
│   ├── engine/                     # Pure game logic (no UI)
│   │   ├── gameState.js            #     State shape + factory
│   │   ├── vitals.js               #     Decay + actions + clamps
│   │   ├── states.js               #     Normal/Sick/Evolved state machine
│   │   └── personality.js          #     Messages, easter eggs, milestones
│   ├── components/                 # Preact UI components
│   ├── persistence/                # Save/load (localStorage + JSON)
│   └── styles/                     # CSS (dark sci-fi theme)
├── tests/                          # Vitest unit tests
└── package.json
```

## 🚀 Setup

```bash
# Clone the repo
git clone https://github.com/Nickkoro21/Tiny-Tamagotchi.git
cd Tiny-Tamagotchi

# Install dependencies
npm install

# Start dev server
npm run dev
# → Open http://localhost:5173

# Run tests
npm run test
```

## 📐 SDD Workflow

This project follows the **Spec-Driven Development** workflow:

1. **Constitution** — Define mission, tech stack, and roadmap
2. **Feature Loop** (per feature):
   - **Plan** → `feature-plan.md`
   - **Requirements** → `requirements.md`
   - **Validation** → `validation.md`
   - **Implement** → write code following specs
   - **Validate** → run tests, manual checks
3. **Replan** — review and update between features

The specs are the **primary artifact** — they capture every decision and drive the implementation.

## 📊 Spec Quality

Snapshot of the spec-driven output at submission time:

| Metric | Value |
|--------|------:|
| Constitution docs | 3 (mission, tech-stack, roadmap) |
| Feature specs | 12 (4 features × plan / requirements / validation) |
| Total spec files | **15** |
| Unit tests | **129** (6 suites: vitals, actions, states, personality, persistence, gameState) |
| Engine modules | 4 (gameState, vitals, states, personality) |
| Testing levels | 2 (automated Vitest + manual validation checklists per feature) |
| Easter-egg names | 11 (across sci-fi / aviation / personal themes) |
| Milestones | 4 (10 / 25 / 50 / 100 care actions) |
| Dynamic states | 3 (Normal / Sick / Evolved) with distinct decay multipliers |

## 🧪 Testing

- **Unit tests:** 129 tests across 6 suites — covering vitals decay, care actions, state transitions, personality messages, easter eggs, milestones, and persistence
- **Manual validation:** Checklists in each feature's `validation.md` (message variety, state transitions, easter eggs, responsive layout, persistence round-trips)
- **Two levels of difficulty:** Automated (Vitest) + manual (visual / interaction checks)

```bash
npm run test
```

## 📋 Challenge Submission

- **Challenge:** DeepLearning.AI 7-Day Learner Challenge
- **Course:** Spec-Driven Development with Coding Agents
- **Deadline:** April 22, 2026 — 11:59 PM PST

## 📄 License

MIT
