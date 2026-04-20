# Video Walkthrough — Production Guide

> **Target:** 2:15–2:45 minutes
> **Toolchain:** Snipping Tool (record) → Clipchamp (edit + labels + music) → upload
> **Narrative style:** **Text labels + background music** (no voice-over)
> **Output:** 1080p .mp4 or YouTube / Loom URL

---

## 🧰 Tooling

| Stage | Tool | Why |
|-------|------|-----|
| Screen recording | **Snipping Tool (Windows 11)** | Built-in, records system audio + mic, saves .mp4 to `Videos\Screen Recordings\` |
| Background music | **Pixabay Music** | CC0 royalty-free, no attribution needed |
| Editing + labels | **Clipchamp (Windows 11)** | Built-in, drag-and-drop text overlays, auto-export |
| Upload | YouTube (unlisted) / Loom / GitHub asset | Shareable URL for README |

---

## 🎯 Key Principle (no voice-over)

Without a narrator, the video has to **tell the story through two channels only**:

1. **Visual action** (what the app is doing)
2. **On-screen text labels** (what you want the viewer to notice + why it matters)

That means labels are no longer optional captions — they ARE the narration. The pattern for each scene:

```
┌─────────────────────────────────────────────┐
│  TITLE LABEL (large, short, punchy)         │   ← what this is
│  Subtitle line — a detail or consequence    │   ← why it matters
└─────────────────────────────────────────────┘
```

**Example:**
```
🎮 Pillar 2 — The Care Loop
Feed +30 hunger · Play +25 happiness · Rest +35 energy
```

See `docs/LABELS_SCRIPT.md` for the full copy-paste-ready list.

---

## ⚙️ One-Time Setup (~5 min)

### Snipping Tool audio (simpler without voice-over)

1. Open **Snipping Tool** (Start menu → "Snipping")
2. Click the **camera icon** → switch to screen recording mode
3. Click **⋯ → Settings → Screen recording**:
   - ✅ *Include system audio by default* (ON — captures app sounds)
   - ❌ *Include microphone input by default* (**OFF** — you're not narrating)

> 💡 Without voice-over, you skip the mic-permission dance entirely. Less can go wrong.

### Get your music

On **pixabay.com/music**, search one of:
- `synthwave ambient`
- `cyberpunk chill`
- `retro tech lo-fi`
- `spacey electronic`

**What to look for:**
- 2–3 minutes long
- **No vocals** (competes with labels the viewer is reading)
- Steady tempo (nothing with jarring drops)
- `CC0` or `Royalty-Free` badge

Save to `D:\SpecDrivenDev\TinyTamagotchi\docs\music\` (local only, not in git).

---

## 📋 Prep Checklist (before EACH take)

- [ ] Clear `localStorage` (DevTools F12 → Application → Local Storage → Clear)
- [ ] Close unrelated tabs; **Focus Assist ON** (no notifications)
- [ ] Dev server running: `npm run dev` at `http://localhost:5173`
- [ ] Terminal ready with `npm run test` pre-typed (don't press Enter yet)
- [ ] GitHub repo open in a browser tab at the main README
- [ ] VS Code open with `specs/` folder expanded
- [ ] Display resolution **1920×1080**
- [ ] Browser zoom **~110%** (pet visuals more visible)
- [ ] Close Discord, Slack, Teams, etc. (no surprise sounds)

---

## 🎬 Scene-by-Scene Plan (no voice-over version, ~2:30)

Each scene lists: **timing · action · labels** (both title and subtitle).

For exact label text ready to paste into Clipchamp, see **`docs/LABELS_SCRIPT.md`**.

### Scene 1 — Intro (0:00–0:12) — 12s
- **Action:** GitHub README → slow scroll from title down through "Four Pillars" section
- **Labels:** 2 labels fade in/out
  - `🐾 Tiny Tamagotchi` / _A virtual pet built with Spec-Driven Development_
  - `📋 DeepLearning.AI — 7-Day Learner Challenge` / _Spec-Driven Development with Coding Agents_

### Scene 2 — SDD Evidence (0:12–0:28) — 16s
- **Action:** VS Code — expand `specs/` → then `feature-01` and `feature-04` folders
- **Labels:** 2 labels
  - `📐 The Constitution` / _mission · tech-stack · roadmap_
  - `📑 4 Features × 3 spec files = 15 .md total` / _plan · requirements · validation_

### Scene 3 — Tests (0:28–0:42) — 14s
- **Action:** Terminal → press Enter on `npm run test` → wait for green "pass" lines
- **Labels:** 1 label, appears when tests finish
  - `✅ 129/129 tests passing` / _6 suites · vitals, actions, states, personality, persistence, gameState_

### Scene 4 — Naming + Easter Egg (0:42–0:58) — 16s
- **Action:** Browser → fresh app → naming screen → type "**Maverick**" → submit
- **Labels:** 2 labels
  - `🛩️ Easter Egg: Aviation Callsign` / _Type "Maverick" and see what happens_
  - (when reaction appears) `🎯 Context-aware reaction triggered` / _1 of 11 easter-egg names_

### Scene 5 — Living Vitals (0:58–1:12) — 14s
- **Action:** Stats bars decaying. If too slow → in Clipchamp speed-up **2×** for this scene only
- **Labels:** 2 labels
  - `⚡ Pillar 1 — Living Vitals` / _Hunger · Happiness · Energy · 0–100 scale_
  - `⏱️ Real-time decay` / _Happiness drains fastest (20s) · Energy slowest (45s)_

### Scene 6 — Care Loop (1:12–1:30) — 18s
- **Action:** Click **Feed** → watch stats jump → click **Play** → click **Rest**. Show cooldown on buttons briefly
- **Labels:** 2 labels
  - `🎮 Pillar 2 — The Care Loop` / _3 actions, each restores specific stats_
  - `⏳ Cooldowns prevent button-mashing` / _Feed 3s · Play 4s · Rest 5s_

### Scene 7 — Sick State + Reaction (1:30–1:55) — 25s
- **Action:** Don't care — wait for a stat to drop < 20 → pet turns red/glitchy. The message panel shows a "CRITICAL ERROR" reaction
- **Labels:** 3 labels (this scene is the most important — 3 layers)
  - `🚨 Pillar 3 — Sick State` / _Any stat drops below 20_
  - `💥 Decay accelerates ×1.5` / _Neglect has consequences_
  - `🔴 "BSOD imminent. Emergency care needed!"` / _Context-aware reaction_

### Scene 8 — Recovery (1:55–2:08) — 13s
- **Action:** Click Feed + Play + Rest repeatedly → all stats > 50 → pet returns to cyan Normal
- **Labels:** 1 label
  - `💊 Recovery: Sick → Normal` / _Restore all stats above 50 to heal_

### Scene 9 — Evolution (2:08–2:30) — 22s
- **Action:** Continue caring. After 6+ total actions with all stats > 70 for 15 sec → purple glow + shimmer particles appear
- **Labels:** 2 labels
  - `✨ Pillar 3 — Evolved State` / _6+ actions · all stats > 70 · sustained 15s_
  - `🌟 Decay slows ×0.7` / _Sustained good care is rewarded_

### Scene 10 — Outro (2:30–2:45) — 15s
- **Action:** F5 refresh (show pet state survives) → switch to GitHub → scroll to **Spec Quality** table
- **Labels:** 2 labels
  - `💾 localStorage persistence` / _Your pet is still here after refresh_
  - `📐 Built with Spec-Driven Development` / _15 specs · 129 tests · 11 easter eggs_

---

## ✂️ Editing in Clipchamp — Label-Driven Workflow

### 1. Import everything

1. Open **Clipchamp** → **Create a new video** → **16:9 widescreen**
2. **Import media** → drag in:
   - Your `.mp4` from `Videos\Screen Recordings\`
   - Your music `.mp3` from `docs\music\`
3. Drag video clip onto **Track 1**, music onto **Track 2**

### 2. Mix audio

- **Video clip → Audio tab → Volume: 75%** (keeps app sounds, subtle)
- **Music clip → Audio tab → Volume: 25%** (subtle, doesn't drown labels' mental reading voice)
- Music shorter than video? Right-click clip → **Duplicate** to extend, trim the end
- Add **fade out** on the last 2 seconds of music (Audio tab → Fade out)

### 3. Add labels — THE KEY STEP

For each scene, use this Clipchamp workflow:

**Step A — Add the title label:**
1. Left sidebar → **Text** tab
2. Pick **"Title"** or **"Simple"** style (plain, no flashy animations)
3. Drag onto the timeline at the correct timestamp
4. Stretch duration to **3–4 seconds**
5. Double-click text → paste the title from `LABELS_SCRIPT.md`

**Step B — Style the title:**
- Font: **Inter** or **Segoe UI**
- Size: **56 px** (large enough to read easily)
- Color: **Cyan `#00D4FF`** for pillar/feature labels, **Red `#FF3B47`** for Sick, **Purple `#B388FF`** for Evolved, **Green `#4CAF50`** for success
- Add a **semi-transparent dark box** behind (background opacity ~70%)
- Position: **Bottom-center**, leaving space for subtitle below
- Animation: **Fade in 0.3s**, **Fade out 0.3s**

**Step C — Add subtitle below:**
- Same process, but:
- Size: **32 px** (smaller than title)
- Color: **White** (#FFFFFF)
- Position: directly below the title
- Same timing as title (appears and disappears together)

**Step D — Save as template:**
- Once you style ONE title-subtitle pair, select both → right-click → **Save as template**
- For every subsequent label pair, drag the template in → just change text

> 💡 Budget ~30 min for labels if you save a template after the first one. Without the template it's closer to 60 min.

### 4. Speed adjustments

- **Scene 5 (Living Vitals):** select clip → **Speed → 2×** to speed up decay
- **Scene 9 (Evolution wait):** speed up the 15-second wait to **3×**, then back to normal for the flash

### 5. Export

- **Export button (top-right) → 1080p**
- Format: **MP4** (default)
- Download the file — save to `docs\` locally

---

## 🎨 Label Color Key

Keep labels consistent across scenes:

| Scene type | Title color | Use case |
|-----------|-------------|----------|
| Intro / Outro | White `#FFFFFF` on dark | Scenes 1, 10 |
| SDD evidence | Cyan `#00D4FF` | Scenes 2, 3 |
| Pillar / feature | Cyan `#00D4FF` | Scenes 4, 5, 6 |
| Sick state | Red `#FF3B47` | Scene 7 |
| Recovery | Green `#4CAF50` | Scene 8 |
| Evolved state | Purple `#B388FF` | Scene 9 |

All subtitles: **White #FFFFFF**, smaller size.

---

## ⏱️ Label Duration Rules

| Label length | Min duration |
|-------------|--------------|
| 1–3 words | 2.5 sec |
| 4–6 words | 3.5 sec |
| 7–10 words | 4.5 sec |
| 10+ words | Don't — split into two |

If a label overlaps with a scene action the viewer needs to see, position it in a corner (top-left) instead of covering the content.

---

## ⚠️ Common Pitfalls (no voice-over edition)

- ❌ **Too-short labels** — viewers can't read. Min 2.5 sec for short, 4.5 sec for longer.
- ❌ **Label over the pet** — the viewer needs to see what you're labeling. Position bottom-center or top-center ONLY.
- ❌ **No dark box behind label** — white text on cyan pet glow becomes unreadable.
- ❌ **Music with vocals** — lyrics compete with labels the viewer is reading.
- ❌ **Too many labels on screen at once** — max 1 title + 1 subtitle.
- ❌ **No scene breathing room** — add 0.5 sec with no label between scenes so eyes can rest.
- ❌ **Copyrighted music** — Spotify tracks flag YouTube copyright automatically.

---

## 🔧 Troubleshooting

### Snipping Tool recording is laggy / drops frames
Close memory-heavy apps (Chrome tabs, VS Code extensions). Recording runs better if only the app + terminal + browser are open.

### Clipchamp export takes forever
Normal for 1080p with many text overlays. 3-minute video ≈ 3-5 min export. Don't cancel.

### Labels look blurry in exported video
Export settings → check you selected **1080p** not 720p. Re-export if needed.

### File size > 100 MB
Still fine for YouTube/Loom. For GitHub asset upload (100 MB limit), re-export at **720p** instead.

---

## 📤 Upload + Embed in README

### Option A — YouTube (recommended for long-term)

1. Upload as **Unlisted**
2. Copy video ID from URL
3. Screenshot a good frame as thumbnail → save as `docs/video-thumbnail.png`
4. Replace placeholder in README with:
   ```markdown
   [![Tiny Tamagotchi walkthrough](./docs/video-thumbnail.png)](https://youtu.be/YOUR_VIDEO_ID)
   ```

### Option B — Loom (fastest)

1. Upload .mp4 to Loom
2. Copy share URL
3. Paste URL alone on its own line in README — GitHub renders a preview

### Option C — GitHub assets (for short clips < 100 MB)

1. Open any Issue on your repo
2. Drag-and-drop the .mp4 into the comment box
3. GitHub generates a `https://github.com/user-attachments/...` URL
4. Use inside the README:
   ```html
   <video src="URL_HERE" controls width="720"></video>
   ```

---

## ✅ Final Quality Check

- [ ] Video is **2:15–2:45** long
- [ ] All **4 pillars** clearly shown and labeled
- [ ] `npm run test` → **129/129** visible
- [ ] At least one **easter egg** triggered (Maverick)
- [ ] State transition **Normal → Sick** visible (red glitch)
- [ ] State transition **Normal → Evolved** visible (purple shimmer)
- [ ] README / spec files briefly shown at start and end
- [ ] Music audible but **subtle** (labels are the story)
- [ ] Every scene has **at least one label** (title + subtitle ideally)
- [ ] **No personal info** leaked (tabs, notifications)
- [ ] Exported at **1080p MP4**
- [ ] Video URL added back to README as embed
