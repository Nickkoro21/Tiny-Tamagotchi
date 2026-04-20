# Tiny Tamagotchi 🐾

A virtual pet web app built with **Spec-Driven Development** — where the specification is the primary artifact, and the code follows.

> Built for the [DeepLearning.AI 7-Day Learner Challenge](https://community.deeplearning.ai/t/7-day-learner-challenge-tiny-tamagotchi-mvp-with-spec-driven-development/891489) (Spec-Driven Development with Coding Agents course).

## 🎮 Live Demo

Run locally — see [Setup](#setup) below.

## ✨ Features — The Four Pillars

### 1. Living Vitals
Three stats (Hunger, Happiness, Energy) on a 0–100 scale that decay automatically in real time. Visual color feedback shifts from healthy → warning → critical as stats drop.

### 2. The Care Loop
Three actions — **Feed**, **Play**, **Rest** — each restore specific stats with cooldowns. Pet naming on first launch. State persists via localStorage with JSON export/import backup.

### 3. Dynamic States
The pet transitions between three visual states:
- **Normal** — cyan glow, smooth idle animation (decay ×1.0)
- **Sick** — red glitch effect, distorted shape (decay ×1.5)
- **Evolved** — purple glow, shimmer particles, bright eyes (decay ×0.7)

### 4. Personal Touches
- Tech-themed personality messages cycling every 5 seconds
- Context-aware reactions for stat combinations
- Easter eggs for special names (HAL, Maverick, Goose, Iceman, Nick Koro, and more)
- Milestone celebrations at 10, 25, 50, 100 care actions
- Rare random messages (5% chance)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | Preact ^10.x |
| Build Tool | Vite ^6.x |
| Styling | Vanilla CSS (custom properties) |
| Testing | Vitest ^3.x |
| Language | JavaScript (ES2022+, JSX) |
| Persistence | localStorage + JSON export/import |

## 📂 Project Structure

```
TinyTamagotchi/
├── specs/                          # SDD Constitution
│   ├── mission.md                  # Vision, audience, scope
│   ├── tech-stack.md               # Architecture decisions
│   └── roadmap.md                  # Development phases
├── feature-01-living-vitals/       # Feature specs (per phase)
│   ├── feature-plan.md
│   ├── requirements.md
│   └── validation.md
├── feature-02-care-loop/
├── feature-03-dynamic-states/
├── feature-04-personal-touches/
├── src/
│   ├── engine/                     # Pure game logic (no UI)
│   │   ├── gameState.js
│   │   ├── vitals.js
│   │   ├── states.js
│   │   └── personality.js
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
   - **Plan** → feature-plan.md
   - **Requirements** → requirements.md
   - **Validation** → validation.md
   - **Implement** → write code following specs
   - **Validate** → run tests, manual checks
3. **Replan** — review and update between features

The specs are the **primary artifact** — they capture every decision and drive the implementation.

## 🧪 Testing

- **Unit tests:** 100+ tests covering vitals, actions, state transitions, personality, persistence
- **Manual validation:** Checklists in each feature's `validation.md`
- **Two levels:** Automated (Vitest) + manual (visual/interaction checks)

```bash
npm run test
```

## 📋 Challenge Submission

- **Challenge:** DeepLearning.AI 7-Day Learner Challenge
- **Course:** Spec-Driven Development with Coding Agents
- **Deadline:** April 22, 2026 — 11:59 PM PST

## 📄 License

MIT
