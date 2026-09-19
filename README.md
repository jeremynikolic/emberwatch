# Emberwatch

An idle tower-defense game in early design exploration.

The intended experience is to design a defense, leave it running, return to useful outcomes and diagnostics, and iterate. The game will combine tactical placement and cadence with population, resources, seasons, expansion, recovery from failure, and progressive automation.

## Current status

Brainstorming only. No implementation or technical stack has been committed yet.

## Design documents

- [`docs/art-direction.md`](docs/art-direction.md) — proposed pixel-art industrial-fantasy contract and visual validation plan.
- [`sketches/001-style-lock/`](sketches/001-style-lock/) — interactive pixel-blocking mock plus verified day/night screenshots; renders the 2× source sprite set.
- [`sketches/002-high-res-ab/`](sketches/002-high-res-ab/) — controlled 1× versus true 2× source-resolution experiment that validated the 2× lock.
- [`sketches/003-core-2x/`](sketches/003-core-2x/) — the complete five-sprite 2× source set and contact sheet.
- [`sketches/004-adjacency-stress/`](sketches/004-adjacency-stress/) — worst-case tower-packing readability test.
- [`game/`](game/) — the browser build: TypeScript canvas style system, compiled ES modules, zero-install.

## Reference material

- [`references/idle-tower-defense-design-handout.md`](references/idle-tower-defense-design-handout.md) — consolidated design direction, assumptions, and open decisions.
- [`references/tower-defence-source-transcript.md`](references/tower-defence-source-transcript.md) — original source conversation.
