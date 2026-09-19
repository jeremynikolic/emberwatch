# Adjacency stress test

Worst-case packing of the 2× source sprite set: towers touching edge-to-edge, a continuous tower wall, and dense combat with enemies interleaved between towers. Includes 2× zoom inspection crops.

- **A · Cluster** — four towers packed in a 4×4 block plus direct east neighbours.
- **B · Wall line** — six towers abutting into one continuous platform along a route.
- **C · Dense combat** — Watchfire, three towers, and enemies overlapping between them.
- **Right panels** — cluster and wall crops at 2× zoom.

## Findings (visual review)

**Holds:**
- All three tower types stay distinguishable when touching — distinct silhouette envelopes plus unique dominant accents.
- Fused base rims read as an intentional shared platform, not mush.
- No sprite clipping or unintended interpenetration.

**Risks:**
- Ballista strings and crystal stripes are similar 1px light-on-mid patterns; a wall packed one tile tighter would merge them.
- Thin enemy legs partially sink into the dark base shadow of neighbouring towers.
- At 1× with a dense wall, tower identity leans on accent colour more than silhouette.

Open `index.html` in a browser (day/night toggle available). Rendered checkpoints: [`adjacency-day.png`](adjacency-day.png), [`adjacency-night.png`](adjacency-night.png). Assets reuse [`../003-core-2x/`](../003-core-2x/).