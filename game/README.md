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
| `src/main.ts` | demo board composition and input |

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

- Sim: `src/sim.ts` — pure state machine: route waypoints, enemy pathing, tower placement/footprints, wave spawner, Ember drain, win/lose.
- Combat: `src/combat.ts` — furthest-progress targeting, locked-trajectory projectiles, frost slow (silhouette tint), bombard splash, minimal bursts.
- Assets: `src/assets.ts` + `assets/*-2x.png` — the 2× source sprite set, drawn 1:1.
- Verified end-to-end by an automated Playwright smoke test (place → wave → victory, wood economy, kill counter = 24/24).

Prototype numbers (wave size, costs, 3-wave win) are placeholders, not design locks.