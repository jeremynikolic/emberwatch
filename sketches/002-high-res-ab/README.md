# 1× versus 2× source-resolution test

A controlled visual experiment for Emberwatch. Both variants use identical gameplay footprints, palette, terrain, lighting, and on-screen dimensions.

- **A:** 32×32 Bombard and 48×48 Watchfire enlarged with nearest-neighbour scaling.
- **B:** truly authored 64×64 Bombard and 96×96 Watchfire rendered at one source pixel per display pixel.

The experiment tests whether additional native resolution adds useful material and mechanical detail without weakening the pixel-art silhouette.

Open `index.html` directly and use **Switch to Day/Night**. Regenerate the proposed assets with:

```bash
python3 tools/generate_high_res_ab.py
```

Rendered checkpoints:

- [`comparison-day.png`](comparison-day.png)
- [`comparison-night.png`](comparison-night.png)
- [`assets/high-res-sprite-sheet.png`](assets/high-res-sprite-sheet.png)

## Result

The true 2× source materially improves material separation and mechanical readability at the same on-screen footprint. The Watchfire gains readable masonry, timber, brass joints, and layered flame; the Bombard gains a clearer carriage, barrel planes, gearing, and fasteners. Both retain their silhouettes under day and night lighting. Adoption for the complete asset set remains a design decision rather than an implicit consequence of this experiment.

These remain deterministic prototype assets, not final production artwork.
