# Core 2× sprite set

The complete five-sprite 2×-source set for Emberwatch, validated through the [`002-high-res-ab`](../002-high-res-ab/) experiment and now rendered in the primary style-lock mock.

| Asset | Source resolution | Footprint |
|---|---|---|
| Watchfire | 96×96 | 3×3 tiles |
| Bolt Thrower | 64×64 | 2×2 tiles |
| Frost Condenser | 64×64 | 2×2 tiles |
| Bombard | 64×64 | 2×2 tiles |
| Root Crawler | 64×64 | 1 enemy |

Regenerate deterministically from the project root:

```bash
python3 tools/generate_core_2x_sprites.py
```

Contact sheet: [`assets/core-2x-sprite-sheet.png`](assets/core-2x-sprite-sheet.png)

These remain deterministic prototype assets authored as proof of the 2× source-resolution lock (`docs/art-direction.md`), not final production artwork.