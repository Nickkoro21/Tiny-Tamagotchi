# Tech Stack — Tiny Tamagotchi

## Architecture Overview

Single-page application (SPA) with client-side rendering. No backend server — all logic runs in the browser. State persists via localStorage with manual JSON export/import as backup.

```
┌─────────────────────────────────────┐
│            Browser (SPA)            │
│                                     │
│  ┌───────────┐    ┌──────────────┐  │
│  │  Preact    │───▶│  Game Engine │  │
│  │  Components│◀───│  (state,     │  │
│  │  (UI)      │    │   timers,    │  │
│  │            │    │   logic)     │  │
│  └───────────┘    └──────┬───────┘  │
│                          │          │
│              ┌───────────┴────────┐ │
│              │  Persistence Layer │ │
│              │  localStorage +    │ │
│              │  JSON export/import│ │
│              └────────────────────┘ │
└─────────────────────────────────────┘
```

## Core Technologies

| Layer        | Technology     | Version  | Rationale                                      |
|-------------|---------------|----------|------------------------------------------------|
| UI Framework | Preact        | ^10.x    | Lightweight React alternative (~3KB), same API |
| Build Tool   | Vite          | ^6.x     | Fast HMR, native ESM, minimal config          |
| Styling      | Vanilla CSS   | —        | Full control, no dependencies, CSS custom properties for theming |
| Testing      | Vitest        | ^3.x     | Native Vite integration, fast, Jest-compatible API |
| Language     | JavaScript    | ES2022+  | JSX via Preact, no TypeScript overhead for this scope |

## Project File Structure

```
TinyTamagotchi/
├── specs/                        # SDD Constitution
│   ├── mission.md
│   ├── tech-stack.md
│   └── roadmap.md
├── feature-01-living-vitals/     # Feature specs
│   ├── feature-plan.md
│   ├── requirements.md
│   └── validation.md
├── feature-02-care-loop/
├── feature-03-dynamic-states/
├── feature-04-personal-touches/
├── src/
│   ├── index.html                # Entry point
│   ├── main.jsx                  # App bootstrap
│   ├── app.jsx                   # Root component
│   ├── components/               # UI components
│   │   ├── Pet.jsx               # Pet display + animations
│   │   ├── Stats.jsx             # Vital stat bars
│   │   ├── Actions.jsx           # Feed, Play, Rest buttons
│   │   ├── Naming.jsx            # Pet naming screen
│   │   └── StatusMessage.jsx     # Pet reactions/dialogue
│   ├── engine/                   # Game logic (no UI)
│   │   ├── gameState.js          # State management
│   │   ├── vitals.js             # Stat decay & update logic
│   │   ├── states.js             # State transitions (Normal/Sick/Evolved)
│   │   └── personality.js        # Reactions, easter eggs, messages
│   ├── persistence/              # Save/load
│   │   ├── localStorage.js       # Auto-save to localStorage
│   │   └── jsonExport.js         # Manual JSON export/import
│   ├── styles/                   # CSS files
│   │   ├── main.css              # Global styles, CSS variables
│   │   ├── pet.css               # Pet animations & states
│   │   └── components.css        # Component-specific styles
│   └── assets/                   # Static assets (SVGs, etc.)
├── tests/                        # Test files
│   ├── vitals.test.js
│   ├── states.test.js
│   └── persistence.test.js
├── package.json
├── vite.config.js
└── README.md
```

## Key Architecture Decisions

### 1. Separation of Engine and UI

Game logic lives in `src/engine/` as pure JavaScript functions with no Preact imports. This makes logic testable independently from the UI and keeps components thin.

```
Component (UI) ──calls──▶ Engine (Logic) ──returns──▶ New State
     │                                                    │
     └──────────────── re-renders with ◀──────────────────┘
```

### 2. State Management

No external state library. Use Preact's built-in `useState` + `useReducer` at the App level, passing state down via props. The game state object shape:

```javascript
{
  pet: {
    name: "",              // string, set at start
    hunger: 100,           // 0–100
    happiness: 100,        // 0–100
    energy: 100,           // 0–100
    state: "normal",       // "normal" | "sick" | "evolved"
    createdAt: timestamp,  // when pet was created
    totalCareActions: 0,   // lifetime care counter (for evolution)
    lastFed: timestamp,
    lastPlayed: timestamp,
    lastRested: timestamp
  },
  meta: {
    lastSaveTime: timestamp,
    version: "1.0.0"       // for future migration support
  }
}
```

### 3. Persistence Strategy (Hybrid)

**Auto-save (localStorage):**
- Save state every 30 seconds and on every care action
- Load on app start — seamless experience
- Key: `tamagotchi_save`

**Manual JSON export/import:**
- "Save to File" button downloads `tamagotchi_save_YYYY-MM-DD.json`
- "Load from File" button accepts `.json` upload
- Validates schema version before importing
- Useful as backup or to transfer between browsers

### 4. Stat Decay Timing

Vitals decay using `requestAnimationFrame` or `setInterval` (1-second tick). On each tick:
- Calculate elapsed time since last tick (handles tab-in-background)
- Apply decay rates per stat
- Check for state transitions

Decay rates (per minute, configurable):
| Stat      | Decay Rate | Notes                          |
|-----------|-----------|--------------------------------|
| Hunger    | -2/min    | Fastest decay — needs most attention |
| Happiness | -1.5/min  | Medium decay                   |
| Energy    | -1/min    | Slowest decay                  |

### 5. Styling Strategy

CSS custom properties (variables) for theming and state-based visual changes:

```css
:root {
  --bg-primary: #0a0e17;       /* dark sci-fi background */
  --text-primary: #e0e6f0;     
  --accent-cyan: #00d4ff;      /* healthy/normal accent */
  --accent-warning: #ff6b35;   /* low stat warning */
  --accent-danger: #ff2257;    /* sick state */
  --accent-evolved: #a855f7;   /* evolved state */
  --glow-intensity: 0.5;       /* adjustable glow effects */
}
```

State-based class switching on the root pet container:
- `.pet--normal` → cyan glow, smooth idle animation
- `.pet--sick` → red tint, glitch/static animation
- `.pet--evolved` → purple glow, particle effects

### 6. Responsive Design

Mobile-first approach. Single-column layout that works from 320px up. No media-query breakpoints needed for this scope — the layout is simple enough to be naturally responsive with flexbox.

## Development Workflow

```
npm create vite@latest . -- --template preact    # scaffold
npm install                                       # install deps
npm run dev                                       # dev server (localhost:5173)
npm run build                                     # production build
npm run test                                      # run vitest
```

## Testing Strategy

- **Unit tests** (Vitest): Engine functions — stat decay calculations, state transitions, persistence serialization
- **Manual testing**: Visual states, animations, responsive layout
- **Validation scripts**: Automated checks against feature spec requirements

## Constraints

- No backend, no database, no API calls
- No TypeScript (keeping setup minimal for this scope)
- No CSS framework or preprocessor
- No state management library
- Bundle size target: < 50KB gzipped (Preact helps here)
- Browser support: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
