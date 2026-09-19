## Variant: Emberwatch style lock

### Purpose

A disposable interactive mock used to validate the locked visual direction before generating or commissioning final sprites.

### What it tests

- Fixed 3/4 top-down presentation on a clean 32 px rendered tile grid
- Watchfire as the defended settlement core
- Bolt Thrower, Frost Condenser, and Bombard silhouettes
- Corrupted plant enemies and minimal combat effects
- Temperate highland terrain, explicit route readability, and Citadel-spire foreshadowing
- Dark navy/brass management UI
- One sprite set under day/night lighting

### Interaction

Use the **DAY/NIGHT** and **GRID** controls in the right panel.

Open `index.html` directly in a browser. Rendered checkpoints:

- [`emberwatch-style-lock-day.png`](emberwatch-style-lock-day.png)
- [`emberwatch-style-lock-night.png`](emberwatch-style-lock-night.png)

### Core sprite pass

The mock now loads five transparent native-resolution PNG assets, authored at true 2× source resolution and rendered 1:1 into the locked 32 px tile grid:

- Watchfire — 96×96 source (3×3 tiles)
- Bolt Thrower — 64×64 source (2×2 tiles)
- Frost Condenser — 64×64 source (2×2 tiles)
- Bombard — 64×64 source (2×2 tiles)
- Root Crawler — 64×64 source

Review them together in [`assets/core-sprite-sheet.png`](assets/core-sprite-sheet.png) (1× set) and [`../003-core-2x/assets/core-2x-sprite-sheet.png`](../003-core-2x/assets/core-2x-sprite-sheet.png) (2× set).
Regenerate the deterministic prototype assets from the project root:

```bash
python3 tools/generate_style_lock_sprites.py   # 1× baseline set
python3 tools/generate_core_2x_sprites.py      # 2× production-resolved set
```

### Trade-offs

These remain programmatically authored prototype sprites, not final production art. They validate composition, hierarchy, native scale, transparency, palette roles, and gameplay readability — now at the locked 2× source resolution (see `docs/art-direction.md`). They do not validate Sprite Fusion consistency or final animation quality. The image-generation path was unavailable because neither FAL nor Sprite Fusion credentials were configured, so no generated asset is presented as final art.
