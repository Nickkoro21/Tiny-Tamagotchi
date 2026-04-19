# Tiny Tamagotchi 🛸

A sci-fi themed virtual pet web app — built with **Spec-Driven Development**.

## About

Tiny Tamagotchi is a single-page web app where you care for a digital blob creature with a techy personality. Feed it, play with it, let it rest — or watch it glitch out from neglect.

Built as a submission for the [DeepLearning.AI 7-Day Learner Challenge](https://community.deeplearning.ai/t/7-day-learner-challenge-tiny-tamagotchi-mvp-with-spec-driven-development/891489) (Spec-Driven Development with Coding Agents course).

## Tech Stack

- **Preact** — Lightweight React alternative (~3KB)
- **Vite** — Fast build tool with HMR
- **Vanilla CSS** — Custom sci-fi dark theme
- **Vitest** — Unit testing

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run unit tests |
| `npm run preview` | Preview production build |

## Project Structure

```
specs/              → SDD Constitution (mission, tech-stack, roadmap)
feature-*/          → Feature specs (plan, requirements, validation)
src/components/     → Preact UI components
src/engine/         → Game logic (no UI dependencies)
src/persistence/    → Save/load (localStorage + JSON export)
src/styles/         → CSS files
tests/              → Unit tests (Vitest)
```

## SDD Workflow

This project follows Spec-Driven Development:
1. **Constitution** → mission.md, tech-stack.md, roadmap.md
2. **Feature Loop** → plan → requirements → validation → implement → validate
3. **Replan** → review & adjust between features

## License

MIT
