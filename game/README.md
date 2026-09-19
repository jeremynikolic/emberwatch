# Emberwatch game

The browser build. Zero-install, no framework, no build step at runtime.

- **Stack (locked):** vanilla canvas in TypeScript ES modules, compiled ahead of time to `dist/`. Browser-only — come to the site and play.
- **Rendering:** 1280×720 backing canvas at 2× logical scale; 32 px tile grid contract unchanged; 2× source sprites drawn 1:1.
- **Source of truth for style:** `src/tokens.ts` encodes the art contract (`docs/art-direction.md`) as code.

## Module layout

| Module | Responsibility |
|---|---|
| `src/tokens.ts` | palette, tile metrics, typography, lighting contract |
| `src/draw.ts` | primitives — rect/line/text/panel over logical space |
| `src/terrain.ts` | tile kinds (grass/path/blocked/water), grid, board compositor |
| `src/ui.ts` | status bar, inspector rows, buttons, bottom bar |
| `src/lighting.ts` | day/night tint + warm light pools |
| `src/runtime.ts` | shared fixed-step runner for live play and elapsed-time catch-up |
| `src/persistence.ts` | local run snapshot, restore, and bounded return report |
| `src/main.ts` | composition, input, persistence lifecycle, and rendering |

## Build & run

```bash
# compile TS → dist/ (tsc 5.6)
npx tsc -p tsconfig.json

# serve locally (ES modules require an HTTP origin)
python3 -m http.server 8901
# open http://localhost:8901
```

## State

**Playable prototype.** Build towers (Bolt Thrower / Frost Condenser / Bombard) on free tiles, start waves, watch root crawlers march the fixed route, and defend the Watchfire's Ember. Three repelled waves win; leaked enemies drain Ember.

### Idle-loop behavior

An active settlement is snapshotted locally in the browser (`localStorage`) after placement, wave start, periodically while open, and when the page hides. Reopening it advances the *same* fixed-step movement/combat simulation for elapsed wall time, then presents a **Return Report**: time simulated, wave progression, crawler kills, leaks, and Ember lost.

- Catch-up is deliberately capped at **15 minutes** per reopen in this prototype — a safety boundary, not a final progression rule.
- Local persistence is intentionally single-browser for now: no account, server, or fabricated cloud state.
- The return report is outcomes-first; it exposes what happened rather than asking the player to infer it from a timer.

### Verified behavior

- Sim: `src/sim.ts` — pure state machine: route waypoints, enemy pathing, tower placement/footprints, wave spawner, Ember drain, win/lose.
- Combat: `src/combat.ts` — furthest-progress targeting, tracked projectiles, frost slow (silhouette tint), bombard splash, minimal bursts.
- Assets: `src/assets.ts` + `assets/*-2x.png` — the 2× source sprite set, drawn 1:1.
- Playwright smoke test: viable starter trio places and reaches victory across 3 waves.
- Return test: a 75-second persisted absence advances through combat and shows a verified outcome report (20 kills, no leaks, Ember held).

Prototype numbers (wave size, costs, 3-wave win, 15-minute catch-up cap) are placeholders, not design locks.