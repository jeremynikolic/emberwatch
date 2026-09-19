# Emberwatch Art Direction — Draft 0.2

**Status:** proposed working contract; core visual direction validated through the style-lock mock and 2× source-resolution experiment.

## Decision

Emberwatch should use **readable pixel-art industrial fantasy**, deliberately carrying Gearborn's steampunk language forward rather than generic Victorian steampunk. Pixel art is the rendering grammar, not the identity.

**Source of truth:** the Gearborn reference deconstruction in the `visual-assets` skill (`references/style-matching-checklist.md`). Emberwatch translates that established visual DNA into constrained pixel art rather than reproducing its high-resolution rendering literally.

The game must read first as a living frontier settlement under pressure, then as a tower-defense board. Its locked emotional tone is **hopeful frontier under pressure: stylized but weighty**. Machinery should feel substantial and threats consequential without drifting into grim survival, sterile factory simulation, muddy realism, or bright cozy-mobile fantasy.

## Visual pillars

1. **Functional machinery.** Every tower, workshop, cable, pipe, valve, furnace, and outpost should imply a job. Ornament never hides gameplay affordances.
2. **Warm industry against cold danger.** The settlement is lit by hearths, furnace windows, brass fixtures, and ember energy. The fog, Citadel influence, and hostile frontier are colder, darker, and more desaturated.
3. **Retro readability over detail density.** Towers, enemies, routes, ranges, active effects, shortages, and disabled assets must remain legible at the normal management zoom.
4. **Locked progression arc: frontier camp → earned steampunk civilization.** Spring begins with timber, canvas, rough stone, hand tools, and sparse brass mechanisms. Construction, staffing, and the energy breakthrough visibly add copper conduits, pressure vessels, coils, gauges, powered workshops, and mechanical assistance. The world must never look fully industrial from the first frame.
5. **Locked biome: temperate highland frontier.** The starting region combines rolling hills, thin forests, cold streams, and exposed rocky outcrops. Seasonal weather changes the ground from spring mud and bloom through summer dust and drought to autumn wind and winter frost. Fog and the Citadel press down from higher elevation to the north.
6. **The Citadel is not more brass.** It is an alien interruption: monolithic black iron, severe geometry, low saturated crimson light, and unnatural fog. Its design contrast supplies the long-term visual destination.
7. **Locked Year 1 Citadel visibility: a single spire or bell tower visible above the fog line, the rest obscured.** The player can see its silhouette and a sparse crimson light at its crown, but the full structure remains hidden. This establishes the object without revealing its scale or nature. The Year 1 experience must leave the player wanting to discover what it is.

## Gearborn visual DNA, translated for Emberwatch

The inherited baseline is **stylized digital concept art with jewel-like luminosity and a painterly polish**. Its materials are gold/brass, weathered steel, copper, and crimson crystal. Its palette combines deep navy/cerulean, amber-gold rim light, ember orange, and controlled crimson. Canonical motifs include functional gears, pipes, rivets, crystal light nodes, and ember sparks. Lighting uses strong warm-versus-cool contrast, rim-lit metal edges, selective specular highlights, and soft interior ramps.

Emberwatch translates those qualities into deliberate pixel clusters, compact colour ramps, and sparse one-pixel highlights. It must not imitate the source with smooth high-resolution gradients, downscaled concept art, or noisy pseudo-pixel filtering.

| Role | Direction | Constraint |
|---|---|---|
| Settlement structure | soot-dark timber, brown-black stone, weathered steel | low contrast; supports gameplay elements |
| Working machinery | gold/brass and copper with warm amber or ember light | warm light signals productive, powered, or staffed systems |
| Water / frost | restrained slate and icy blue | reserve bright cyan for active slow/freeze feedback |
| Fire / energy | ember orange through pale furnace-yellow | the main high-value “active” glow |
| Threat / Citadel | deep navy/cerulean fog, black iron, sparse crimson crystal | crimson means danger, corruption, or an urgent failure state—not decoration |
| UI | dark navy panels, brass framing only at hierarchy boundaries | avoid faux-Victorian trim around every control |
 **Locked UI philosophy:** abstract dark navy panels with brass framing at hierarchy boundaries. Information-dense, functional, and readable — like Factorio's information panels carried through Gearborn's material language. UI is a management surface, not a diegetic workshop object.

**Rule:** no rainbow elemental palette. Elements differentiate primarily through motion, silhouette, particles, terrain response, and a tightly controlled accent—not a permanent neon hue per system.

## Pixel-art production constraints

- **Locked:** use a **32 px tile grid** and render at integer scale only. Use 16 px only for small UI icons; use 64 px for hero props, bosses, and close inspection.
- **Locked:** author gameplay sprites at **2× source resolution** and render them one-source-pixel-per-display-pixel at 2× integer scale. Standard 2×2-tile towers are authored at **64×64**, the 3×3 Watchfire at **96×96**, and small props at 32×32. Never enlarge 1× art with nearest-neighbour filtering when a 2× source can exist; never downscale 2× art with interpolation. The 32 px tile grid contract is unchanged — this governs source asset resolution, not tile geometry.
- **Locked:** use a **fixed 3/4 top-down projection with no free rotation**. This preserves architectural character while keeping path geometry, tower range, and choke-point play readable.
- **Locked:** standard combat towers occupy a **2×2 tile footprint** (64×64 px before integer scaling). Major settlement buildings begin at **3×3 tiles**, with larger landmarks allowed when their gameplay role warrants it. Representative workers are roughly half a tile tall. Do not introduce mixed tower footprints in the initial kit; earn that complexity later through deliberately exceptional structures.
- **Locked:** use a **fixed-path mazing system** where enemies path around placed buildings. The map must clearly distinguish buildable tiles, non-buildable terrain, and the enemy route. Choke points are natural or created by the player; placement is the primary tactical decision.
 **Locked terrain readability:** use a **clean tile grid with subtle path lines** as the baseline terrain communication. Buildable ground, enemy paths, and blocked terrain must remain instantly distinguishable at management zoom. Organic surface detail is allowed only where it does not obscure the grid or path logic. The player should never guess whether a tile is buildable.
 **Locked effects philosophy: minimal particle bursts with strong silhouette changes.** Combat feedback must stay readable and lightweight — performance is a design driver. Frozen enemies gain a blue-tinted silhouette and a small ice crystal burst on application; mortar impact shows a compact smoke puff. No lingering clouds, no full-screen bloom, no rainbow trails. Status is communicated by silhouette tint and brief directional bursts, not by covering the battlefield in particles.
- **Locked:** use one canonical sprite set under a dynamic day/night lighting layer. Shift ambient palette, projected shadows, window/furnace lights, and restrained fog without recolouring gameplay-critical accents or changing silhouettes. Do not create duplicate day/night sprites.
- Define one canonical daylight direction, outline treatment, shadow ramp, and palette budget before commissioning/generating asset families.
- Use silhouettes to distinguish tower roles at a glance: direct fire is tall/narrow; frost control is low/anchored; mortar is broad/barreled; support is compact and connective.
- Staffed versus automated must be visible. A staffed tower has an operator silhouette and hand mechanisms; an automated tower shows powered linkage, belts, or a mechanical governor.
- Weather changes material and terrain readability before it changes colour: wet metal sheen, snow accumulation, wind-blown smoke, frozen routes, drought dust.

## Settlement core: the Watchfire

**Locked:** the Watchfire is the base the player defends and the visual heart of Emberwatch. It occupies a 3×3 footprint and begins as a guarded stone hearth with a timber signal mast. Progression turns it into a brass furnace-beacon without losing the readable flame-and-mast silhouette.

Enemies that reach the core drain its **Ember**, representing settlement stability. Zero Ember is not a permanent game-over state: outer systems shut down, territory contracts, and the player stabilizes around the Watchfire before rebuilding. The structure must therefore communicate healthy, strained, and ember-low states without appearing irreversibly destroyed.

The Watchfire is not automatically the warehouse, housing, or command center. Those systems may remain separate buildings so one object does not absorb the entire settlement model.

## Initial tower language

**Locked Year 1 trio:**

| Tower | Role | Silhouette and material language |
|---|---|---|
| Bolt Thrower | Direct, precise damage | Tall narrow timber frame, forward-projecting steel arms, brass winding gear, visible operator crank |
| Frost Condenser | Slow and control | Low anchored copper coil assembly around a restrained icy crystal reservoir; cold vapour only while active |
| Bombard | Delayed splash damage | Broad squat iron barrel on a timber-and-brass recoil frame; compact ember flash and smoke puff on fire |

These begin as plausible frontier mechanisms. Later upgrades add pressure lines, governors, and powered assistance without replacing their core silhouettes.

## Enemy visual language

**Locked:** Year 1 enemies are corrupted highland vegetation—plant, bark, root, thorn, fungus, and seed forms animated by the Citadel. Their silhouettes remain organic and distinct from the settlement’s engineered forms. Corruption appears as charred bark, unnatural angular growth, cold fog caught between roots, and sparse crimson sap-like fractures or eyes.

- Do not base the core roster on ordinary wolves, boars, or humanoids. The forest itself has become hostile.
- Use body shape, gait, and scale—not colour alone—to distinguish roles: low root-crawlers, skittering seed or thorn swarms, and broad bark-armored brutes.
- Keep each enemy readable as one dominant botanical idea; avoid tangled detail at 32 px.
- Reserve corrupted wildlife and mechanical constructs for later escalation so their appearance changes the threat language.
- Keep crimson sparse. More visible corruption should communicate higher threat or proximity to the Citadel.

## Population on the map

**Locked:** show small representative workers around their assigned buildings rather than one physical unit per inhabitant. They make labor allocation and staffing visible without turning the settlement into a pathfinding simulation or visual swarm.

- Use a few simplified worker sprites as a visual sample of each active assignment; UI remains authoritative for exact counts.
- Workers perform short local activity loops—hauling, hammering, operating a crank, feeding a furnace—without affecting simulation timing.
- Reassignment changes the representatives after a brief visual transition; it must not require literal map traversal.
- Idle, understaffed, powered, and shut-down buildings need distinct worker/activity states.
- Worker silhouettes should communicate job families through tools and pose before clothing colour.

## What to avoid

- Generic goggles, random gears, exposed pipes, or decorative rivets with no implied function.
- Tiny high-frequency detail that turns paths and hitboxes into noise.
- Full-screen bloom, smooth gradients, or high-resolution painted backdrops fighting the pixel language.
- Brown-on-brown industrial scenes with no information hierarchy.
- Making enemies “cooler” than towers at the cost of route, targeting, and threat readability.

## Sprite Fusion: recommended role

Sprite Fusion is worth a **small production experiment**, not a core dependency yet.

It provides a documented API for 16/32/64 px image generation, edits, style-reference generation (up to 20 references), eight-direction sets, and short animations. Each of these generation actions costs 15 credits; its documented outputs are 12 stills for generation, 9 style-reference images, 2 edits, 8 directions, or one animation. The API returns server-sent events, so an internal asset-pipeline script can capture assets and metadata reproducibly. Source: <https://www.spritefusion.com/docs/pixel-art-generator/api/api-reference> and <https://www.spritefusion.com/docs/pixel-art-generator/credits-costs> (checked 18 September 2026).

The important limitation: it makes individual sprites, not a coherent game art direction. Its tilemap editor is useful for blocking out terrain and testing visual density, but it should not dictate Emberwatch's engine or map format. We need a locked style sheet and manual art-direction pass before accepting generated output.

### Recommended trial

Generate a deliberately constrained six-asset vertical slice at 32 px:

1. The Watchfire settlement core.
2. Bolt Thrower.
3. Frost Condenser.
4. Bombard.
5. One crawler enemy.
6. One 4-tile winter route segment with a copper pipe and frozen ground.

Accept it only if the assets remain recognizably from one world at management zoom, retain readable gameplay silhouettes, and can be revised without visual drift. Do not generate a full tileset or integrate the API until that test passes.

## The first style-lock review

Produce one reference board containing the six assets above, a day/night scene crop, and the proposed UI panel. Review only these questions:

1. Does the scene read as *warm, functional settlement versus cold hostile frontier*?
2. Can each tower role and enemy route be recognized without inspecting art?
3. Does this feel like Gearbox's world language carried into a game, rather than a generic pixel steampunk pack?
4. Is the Citadel contrast distinct enough to create anticipation, even as only one spire?

After approval, turn this draft into a versioned asset bible: palette swatches, tile scale, perspective grid, outline/shadow rules, canonical materials, UI tokens, effect semantics, and prompt/reference pack.
