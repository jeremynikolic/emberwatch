# Browser Based Idle Tower Defense

## Comprehensive Design Handout

**Design snapshot:** 18 September 2026  
**Source:** [Tower Defence Recommendations](chatgpt-conversation://6a9dc2bc-57e4-83ed-98a3-708c3d358d92)  
**Working title:** Not yet chosen  
**Initial delivery target:** Playable Year 1 in a browser, supported by a live Balance Lab

An idle tower-defense game about growing a small foothold into a defensive civilization. Players assign people, gather resources, build and staff towers, discover elemental interactions, push back fog, survive seasons, and gradually automate their strategy. A distant Citadel gives expansion a destination.

The defining experience: **design a defense, leave it running, return to completed work and useful evidence, then improve it.** Placement and attack timing remain important throughout progression. Failure contracts the settlement toward a recoverable state; recovery remains a player decision.

This handout consolidates the conversation into a design reference. No game, simulator, balance results, or validated numerical configuration was produced in that conversation.

### How to read decision status

- **Established direction:** Explicit user request or preference, including broadly accepted design pillars.
- **Working proposal:** Concrete elaboration from the conversation, suitable for prototyping but not individually approved or balanced.
- **Open decision:** Unresolved choice, ambiguity, or conflicting examples.
- **Handoff recommendation:** Additional implementation clarification in this document; not a prior agreement.

Numerical examples are illustrative unless identified as calendar definitions. Candidate tower names, building costs, resource rates, probabilities, and thresholds are not final content.

## Contents

1. [Vision and design principles](#1-vision-and-design-principles)
2. [Player loop and information](#2-player-loop-and-information)
3. [Calendar and simulation clocks](#3-calendar-and-simulation-clocks)
4. [Resources and economic model](#4-resources-and-economic-model)
5. [Population and lodging](#5-population-and-lodging)
6. [Tower defense and cadence](#6-tower-defense-and-cadence)
7. [Progression and automation](#7-progression-and-automation)
8. [Seasons and weather](#8-seasons-and-weather)
9. [Fog expansion and the Citadel](#9-fog-expansion-and-the-citadel)
10. [Graceful degradation and recovery](#10-graceful-degradation-and-recovery)
11. [Offline progression](#11-offline-progression)
12. [Year 1 MVP](#12-year-1-mvp)
13. [Simulation and browser architecture](#13-simulation-and-browser-architecture)
14. [Configuration inventory](#14-configuration-inventory)
15. [Balance Lab](#15-balance-lab)
16. [Mathematical foundation](#16-mathematical-foundation)
17. [Open decisions and reconciliation](#17-open-decisions-and-reconciliation)
18. [Suggested implementation sequence](#18-suggested-implementation-sequence)
19. [Deferred concepts](#19-deferred-concepts)
20. [Glossary and source map](#20-glossary-and-source-map)

## 1 Vision and design principles

### Inspiration and identity

The original motivation was the tactical depth and discovery of Warcraft III custom tower-defense maps. Element TD 2 supplied the preferred atmosphere and elemental-combination inspiration. The concept then developed its own identity around population, recoverable contraction, seasons, territory, and automation.

Other games appeared in the initial recommendation exchange, but their features are not requirements for this project. Likewise, the Kittens Game discussion supplied a recovery analogy; reproducing that game's exact starvation or offline rules is not required.

### Established principles

1. **Preserve tactical tower defense.** Geometry, choke points, range, enemy movement, reload timing, and elemental combinations must matter.
2. **Unlock decisions more often than larger numbers.** New capabilities, information, and control should carry progression.
3. **Make absence productive.** Construction, research, gathering, and configured defenses continue while the player is away.
4. **Prefer graceful degradation to terminal failure.** Stress should lead to contraction and stabilization, with a path to recovery.
5. **Make failure informative.** Reports should explain what failed and why.
6. **Let automation express player intent.** Automation executes a strategy; it should not invent the strategy for the player.
7. **Keep territory strategically relevant.** Expansion changes geometry, resources, exposure, and responsibility.
8. **Use environmental change to require adaptation.** Seasons and weather affect economy and combat.
9. **Make balance configurable and observable.** Live tuning, simulations, trends, progression metrics, and comparisons are core project requirements.

The principal tension is immediate safety versus future strength. Resources and labor spent on growth cannot simultaneously defend the next assault. A healthy rhythm alternates comfort, pressure, adaptation, and renewed stability.

## 2 Player loop and information

### Session rhythm

1. **Return:** Read the offline summary and inspect completed work.
2. **Diagnose:** Find shortages, leaks, low tower uptime, poor splash efficiency, or environmental changes.
3. **Reconfigure:** Reassign workers, reposition towers, adjust targeting, alter cadence, or reduce exposure.
4. **Invest:** Spend reserves on infrastructure, research, accommodation, or defenses.
5. **Push:** Attempt a difficult threat, boss, or expansion.
6. **Leave:** The configured system continues operating.

The return experience should offer both rewards and a solvable strategic problem. Accumulated currency alone does not fulfill the concept.

### Proposed game screen

- Central battlefield and expanding map.
- Resource stocks, net rates, and storage limits.
- Population, lodging capacity, and job assignments.
- Current game date and season.
- Next threat countdown and scouting information.
- Construction and research queues.
- Exploration and outpost controls.
- Shortage alerts and recovery options.
- Tower inspection with damage, uptime, status effects, and firing timeline.

Information can itself become progression: broad warnings first, then enemy archetypes, composition estimates, arrival windows, likely routes, resistances, and weather forecasts. Exact unlock order remains open.

## 3 Calendar and simulation clocks

### Strategic time

**Established:** One strategic simulation tick represents one fictional hour. Time passes much faster than reality. The fictional calendar is independent of the real calendar.

The adopted working calendar is:

| Unit | Definition | Strategic ticks |
|---|---|---:|
| Hour | Atomic strategic step | 1 |
| Day | 24 hours | 24 |
| Week | 7 days | 168 |
| Season | 13 weeks | 2,184 |
| Year | 4 seasons, 52 weeks | 8,736 |

This is a **364-day fictional year**, not a Gregorian year. Calendar constants should remain configurable for experiments; derived durations should be calculated from them.

Each strategic tick advances resource production and consumption, population and upkeep, construction, research, exploration, environment, and scheduled events. “Stone per hour” means stone per strategic tick under this baseline.

### Real time conversion

Let `T` be real seconds per strategic tick. `T` remains unchosen.

| Illustrative T | Real duration of a day | Week | Season | Year |
|---|---:|---:|---:|---:|
| 5 seconds | 2 minutes | 14 minutes | 3 h 2 m | 12 h 8 m |
| 30 seconds | 12 minutes | 84 minutes | 18 h 12 m | 72 h 48 m |
| 60 seconds | 24 minutes | 2 h 48 m | 36 h 24 m | 145 h 36 m |

The conversation suggested 30–60 seconds as a range worth exploring, not a final target. Determine this from desired session length, upgrade frequency, offline returns, and Year 1 completion time.

### Combat time

Combat needs finer resolution than the strategic hour. Tower reloads, projectile travel, enemy movement, freeze duration, and attack offsets operate in combat seconds or equivalent substeps.

Two approaches remain open:

- Resolve a detailed battle within a strategic hour, then advance the world.
- Run combat continuously while strategic state advances at hour boundaries.

Either approach must define how battle duration interacts with world time and offline catch-up. Rendering speed must not silently change economic outcomes.

### Weekly threats

The weekly cycle is the primary preparation-and-defense cadence. The original idea equated week number with wave number. A later proposal broadened this to a **weekly threat cycle**: assault, swarm migration, calm period, boss, or attacks on multiple fronts.

Keep calendar time distinct from cleared combat progress. A stalled defense cannot roll the date backward. The precise behavior of future threats while stalled remains unresolved.

**Handoff recommendation:** Record absolute tick, year, week of year, week of season, and threat ID separately. Earlier conversational wave/date examples were illustrative and not always arithmetically consistent.

## 4 Resources and economic model

### Progression spine

```text
People → gather wood → build and staff first towers
       → unlock stone → stronger infrastructure
       → defeat a significant boss → unlock energy
       → reduce labor needs → research, scouting, and expansion
```

**Established:** People gather wood; early towers also require operators. Stone follows. Gold as a trading currency and boss-gated energy were user suggestions carried into the working design.

### Candidate resource roles

| Resource | Main source | Main use | Status |
|---|---|---|---|
| Wood | Manual gathering, later mills | First towers, accommodation, basic construction | Core early resource |
| Stone | Gathering or quarry after unlock | Durable towers, storage, infrastructure | Core progression resource |
| Gold | Trade, loot, discoveries | Imports, rare goods, possible specialists | Trade role proposed |
| Food | Food production | Population support and reserves | Proposed resilience system |
| Knowledge | Researchers or research buildings | Research and capabilities | Proposed research resource |
| Energy | Boss-unlocked source, later generators | Powered infrastructure and labor reduction | Working progression gate |
| Essence or specialized materials | Bosses, elements, discoveries | Elemental or prestige progression | Deferred candidates |

The conversation alternated between roughly five resources and a six-resource example. Final Year 1 resource count remains open. Food needs an explicit production route if included; the sample configs never completed that route.

### Different resource behaviors

- **Stocks:** Wood, stone, gold, food; accumulate to storage limits, possibly decay.
- **Flows:** Production and consumption rates, especially energy throughput.
- **Capacities:** Lodging, storage, and available labor.
- **Meta resources:** Potential future prestige currencies, outside Year 1 commitment.

Energy is both a flow and potentially a stored reserve. Batteries can support short bursts that exceed generation. Per-shot energy costs and per-hour upkeep need explicit conversion rules across the two clocks.

### Investment and buffering

Every major purchase should expose its cost, staffing demand, upkeep, expected benefit, and payback horizon. Storage allows preparation for winter and temporary deficits. Economic growth must be strong enough to reward idle time without making defensive choices irrelevant.

Trade should provide flexibility rather than turn every resource into interchangeable gold. Proposed extensions include traveling merchants, seasonal shortages, exports, and rare components. Prices, offer intervals, and scarcity remain tunable.

## 5 Population and lodging

**Established:** Accommodation, described as barracks leading to lodging, gates population growth. Population also limits the early economy and tower operation.

### Capacity versus growth

The working interpretation separates available beds from actual inhabitants:

```text
Camp → Barracks → Lodging → Housing → Settlement
```

Building accommodation creates capacity; people arrive or grow over time. Free capacity, food surplus, and safety can affect arrivals. Reputation, births, and rescued survivors are later possibilities.

An example display is `Population 8 / 12; next arrival in 18 game hours`. Accommodation should not instantly spawn workers under this proposal.

Example values from the conversation: five starting people and five beds; barracks costing 80 wood, taking 36 ticks, adding three beds; lodging costing 120 wood and 40 stone, adding five beds and a growth multiplier. These values are **unbalanced examples**, superseding neither a tested baseline nor a final schema.

### Labor allocation

Workers compete across gathering, food production if included, tower operation, scouting, research, construction, and outpost support. A new tower costs both materials and the production forgone by assigning its operator.

Proposed staffing progression:

| Stage | Staffing pattern | Strategic consequence |
|---|---|---|
| Manual | Roughly one operator per tower | Defense competes directly with gathering |
| Assisted | Shared operators or reduced requirements | First labor relief |
| Mechanized | Basic towers and production need less staff | Expansion becomes easier |
| Automated | People become specialists | Research, engineering, scouting, command |

Fractional requirements such as `0.25 workers per tower` represent shared service capacity, not fractional people. Pooling, locality, rounding, and partial staffing behavior remain open.

### Population under stress

Overcrowding or shortages can stop growth, reduce efficiency, and eventually cause departures. Outer outposts can lose staffing first. Accommodation upkeep was proposed to prevent population expansion from being cost-free.

Recovery must remain possible after severe population loss. The zero-population case needs an explicit rule; an economy requiring workers for every recovery action otherwise risks a permanent deadlock.

## 6 Tower defense and cadence

### Tactical requirements

Placement, path exposure, range, choke points, splash geometry, projectile travel, reload time, targeting, and status duration form the combat model. High displayed DPS alone should not determine success.

The defining example is **freeze or slow enemies before a slow-reloading splash cannon fires**. Position determines when enemies enter overlapping ranges; cadence determines whether impact lands during the useful control window.

```text
Group enemies → freeze or slow → apply vulnerability
              → splash impact → clear survivors
```

This sequence is a design pattern, not a requirement to ship every effect in Year 1.

### Candidate starter roster

| Tower role | Candidate | Purpose |
|---|---|---|
| Basic direct damage | Wooden ballista | Establish manual staffing and placement |
| Control | Frost pylon | Slow or freeze, extend useful exposure |
| Burst splash | Mortar | Reward clustering and timing |
| Optional fourth role | Lightning or support tower | Cleanup or amplification |

The latest MVP proposal calls for three to four towers. Exact names, stats, elemental prerequisites, and whether frost means slowing or hard freezing remain open. Earlier samples used both effects and different intervals.

### Progressive control

Start with understandable targeting such as first, closest, last, or strongest. Later candidates include minimum target count, phase offset, waiting for a status, firing after another tower, and compound conditions.

Example progression: “target first” → “fire when enough enemies cluster” → “fire shortly after frost triggers” → “fire only when frozen and armor-reduced.” A firing timeline can make these rules visible.

### Enemies and threats

Initial candidates: ordinary crawler, slow armored brute, fast low-health swarm, plus one significant boss. Later archetypes include regeneration, shields, flying, elemental resistance, splitting, tower disruption, and theft.

A proposed threat-budget generator buys enemies using archetype costs and composition weights. Scale health, count, armor, rewards, and speed deliberately; avoid making every attribute exponential. Archetypes and environments should interrupt pure stat scaling.

Combat randomness should remain controlled enough for timing decisions to be explainable. Seeded enemy composition and weather were preferred places for variation; crits, spread, and random targeting remain choices to assess.

## 7 Progression and automation

### Three progression channels

- **Infrastructure:** Time-based construction, production upgrades, accommodation, storage, and outposts.
- **Knowledge:** New capabilities and information, such as impact prediction, timing controls, logistics, or forecasting.
- **Power:** Damage, range, reload, and elemental amplification.

Power remains useful, but capability unlocks should carry the game's identity.

### Energy as a change of age

A significant boss grants access to the first energy source. Candidate fiction included an ancient generator, elemental core, storm creature, buried reactor, or Citadel relay. None was selected.

Energy should gradually reduce labor needs, not instantly erase population management. First powered assistance should visibly free people for another purpose. Full automation belongs later.

### Automation beyond combat

Candidate unlocks include spending priorities, reserve thresholds, auto-upgrade, auto-build, seasonal loadouts, conditional abilities, emergency load shedding, and fallback doctrines. The Year 1 requirement is the first meaningful automation or labor-reduction unlock, not this entire catalogue.

Long-term build identities considered include slow-and-burst, poison attrition, swarm clearing, energy burst, economy greed, boss killing, and terrain control. Different builds should change decisions, not merely use different damage colors.

## 8 Seasons and weather

**Established:** Environmental change should create strategic curveballs. The working calendar uses four predictable 13-week seasons; weather supplies shorter variation.

| Season | Weeks | Proposed pressures and opportunities |
|---|---|---|
| Spring | 1–13 | Growth, vegetation, river changes, early expansion |
| Summer | 14–26 | Strong production, drought, faster enemies, fire or solar opportunities |
| Autumn | 27–39 | Harvest, swarms, stockpiling, wind |
| Winter | 40–52 | Reduced production, higher demand, attrition, frozen routes |

These are a menu of mechanics, not a requirement to implement all of them. Year 1 needs a small set that visibly changes preparation and tactics.

Examples included vegetation obstructing line of sight, dry ponds opening routes, frozen rivers creating paths, frost diminishing returns, fire interactions with frozen enemies, and storms affecting lightning or solar output. Later energy mechanics should not be assumed available before the boss unlock.

Forecasting makes adaptation fair: show season boundaries, construction deadlines, arrival estimates, and reserve runway. The player should be able to prepare before a predictable winter shortage.

Weather configuration needs seasonal weights, duration, severity, and modifiers. Modifier stacking and safeguards against extreme combinations remain to be specified.

## 9 Fog expansion and the Citadel

### Territorial progression

**Established:** The playable map expands through fog. The player begins around a small safe core, progressively exposing territory and tower placement opportunities.

Expansion can require resources, scout time, research, a boss, population, outposts, or stable supplies. Revealing land is distinct from establishing and maintaining control.

New regions should offer geometry and tradeoffs: canyons, hills, swamps, rivers, ruins, forests, deserts, or frozen lakes. Better resources and positions can also expose another entrance or increase the perimeter to defend.

### Outposts

Proposed functions: extend build radius, connect resource sites, provide local storage, reveal fog, support towers, and form fallback positions. Outer outposts can become abandoned or inactive during collapse, preserving a route to reclaim them.

Exploration consumes workers and time. Surveys and outpost construction can complete offline. A hand-designed region topology with configurable contents was favored as a working approach over unrestricted procedural maps.

### Discoveries and onboarding

Fog can hide shrines, old towers, deposits, relics, ruins, bosses, enemy nests, alternate paths, and new systems. Revealing them gradually introduces complexity through the world.

Directional choices can support different strategies: peaks for defensive frost terrain, deserts for solar and fire, forests for nature and growth, ruins for technology and automation. These remain future content proposals.

### The Citadel

**Established:** The user explicitly favored the Citadel-behind-the-fog lore. It supplies a distant objective beyond endless waves.

Working fiction: a silhouette is visible early; expansion reveals outer lands and strongholds; signs suggest the Citadel notices the settlement. Suggested events included a bell at the end of Year 1, later scouts or armies, a surrounding storm, and an ancient road.

Approach could increase pressure through invasions, corruption, sabotage, or weather manipulation. Reaching the Citadel might conclude a campaign or open a new realm/prestige layer. Neither ending nor reset rules are settled.

**Year 1 boundary:** Foreshadow the Citadel; do not reach it. Distances such as 40 regions and entry conditions such as eight bosses were sample config values only.

## 10 Graceful degradation and recovery

**Established failure law:**

```text
Stress → degradation → stabilization → player-directed recovery
```

Loss can reduce efficiency, advanced tower uptime, territory, staffing, or combat progress. It should almost never make the save irrecoverable. Bad optimization can hurt; absence itself should rarely be the punishment.

### Stall versus collapse

| State | Meaning | Player task |
|---|---|---|
| Stall | Cannot overcome next threat; underlying economy remains viable | Improve defense or change tactics |
| Collapse | Economy or infrastructure is unsustainable; systems shut down or territory contracts | Restore sustainable operation, then rebuild |

### Proposed fallback behavior

Energy shortage can pause research and trade, shed economic boosters, disable support, and throttle advanced towers before core defense. Food shortage can stop growth and exploration, reduce outpost staffing, and abandon outer positions.

Protected systems proposed: core storage, basic food production, and minimum defense. Exact priorities and protected capacities require testing; protection is a design intent, not yet a proven invariant.

### Recovery decisions

Players may mothball or sell expensive assets, reassign labor, reroute energy, use reserves, change elements, retreat to a shorter perimeter, repair cadence, or wait for seasonal improvement. Stabilization can be automatic; restoring prior prosperity should require meaningful choices.

Later automation can improve this behavior through reserve floors, custom shutdown priorities, and emergency doctrines. Cheap reactivation of abandoned outposts was proposed; a 25% cost multiplier was illustrative.

### Proposed balance targets

- Moderate mistakes: recovery within roughly one to three game weeks.
- Major overextension: recovery within roughly one season.
- Catastrophic planning: painful but still recoverable.
- Irrecoverable states: effectively zero as a design goal.

These targets were proposed, not measured. The Lab must distinguish stabilization time, production recovery, territory recovery, and player intervention.

## 11 Offline progression

### Required behavior

Offline time advances the configured world: gathering, consumption, storage, construction, research, arrivals, exploration, environment, threats, automation, and degradation. Defense should execute the player's setup and encounter real limits.

Avoid reducing outcomes to `DPS × hours away`; that discards the very geometry and cadence the game is built around.

Baseline conversion:

```text
elapsedRealSeconds = currentTime - lastSavedTime
elapsedTicks = floor(elapsedRealSeconds / realSecondsPerTick)
```

Example: eight real hours at 30 seconds per tick gives 960 fictional hours, or 40 game days. Catch-up limits and partial-tick handling are unresolved.

### Offline report

The report should answer:

- What was produced, spent, capped, or depleted?
- Which buildings, research, arrivals, and expeditions completed, and when?
- Which threats were cleared, stalled, or caused collapse?
- Which towers or routes underperformed, and why?
- Which seasons or weather events changed conditions?
- What unlocked, shut down, or remains recoverable?

Useful diagnostics include leaked enemies, low slow uptime, poor splash efficiency, or mortar impact arriving after freeze expires. Report specific causes only when supported by recorded events.

### Fidelity remains open

Earlier config proposed statistical offline combat; the later architecture insists on the same engine and rules everywhere. Approximation must not silently become a separate balance model.

**Handoff recommendation:** Begin with shared deterministic combat resolution without rendering. Introduce fast paths only after comparing their outcomes against detailed resolution, especially around bosses, weather changes, collapse, and timing synergies.

Other unresolved policies: offline cap, clock rollback, major-event pausing, boss attempts while absent, and permissible permanent loss. A sample `allow_permanent_loss: false` needs reconciliation with population departures and temporary territorial losses.

## 12 Year 1 MVP

**Established scope boundary:** A full simulated and playable first year. The latest proposed content boundary follows.

### Included vertical slice

- Browser-playable game and Balance Lab using shared logic and configs.
- 52 weeks, four seasons, 8,736 strategic ticks.
- Early population and labor allocation.
- Wood, stone, and gold/trade progression; settle food and knowledge inclusion.
- Barracks/lodging and population growth.
- Three to four tower types and a first elemental mechanic.
- Small set of enemy archetypes and weekly threats.
- A few regions, fog reveal, and expansion pressure.
- Seasonal/environmental modifiers.
- One significant boss granting the first energy unlock.
- First automation or labor-reduction capability.
- Graceful degradation, stabilization, and recovery.
- Offline progression with useful return diagnostics.
- Citadel foreshadowing without reaching it.

The conversation also suggested approximately five buildings and three enemy types as a small initial roster. Exact content list remains unapproved.

### Latest seasonal progression outline

| Period | Intended progression |
|---|---|
| Spring | Survive, gather wood, first towers, barracks |
| Summer | Stone, stronger construction, first expansion |
| Autumn | Economic pressure, trade/gold, deeper tower synergy |
| Winter | First substantial systemic stress test |
| End of Year | Significant boss and first energy breakthrough |

**Open boundary issue:** A boss at the final tick leaves no room to experience energy and automation within Year 1. Choose a late-winter boss with time afterward, an earlier boss, or a short post-year demonstration. Do not silently treat this as resolved.

### What Year 1 must prove

1. Something useful remains available to work toward.
2. Labor allocation creates meaningful tradeoffs.
3. Expansion adds pressure without permanently ruining the run.
4. Seasons change strategy.
5. Placement and cadence produce measurable differences.
6. The boss is a satisfying progression gate.
7. Energy visibly changes labor allocation.
8. Bad economies stabilize and can recover.
9. Returning after absence feels rewarding and informative.
10. Progression avoids long periods with no meaningful decision.

Simulation can expose bottlenecks and suspicious patterns; playtesting must judge enjoyment, clarity, and whether choices feel meaningful.

### Outside the initial commitment

Reaching the Citadel, multiple realms, ascension, extensive prestige trees, dozens of towers, full terrain editing, complete logistics networks, advanced doctrine programming, multiplayer, and years of authored content are not Year 1 requirements.

## 13 Simulation and browser architecture

### Core contract

**Required architectural direction: One simulation engine, one data model, one configuration system.**

```text
Versioned configuration + scenario + strategy + seed
                         |
                  Simulation engine
                         |
              State + events + metrics
                 /               \
          Browser game        Balance Lab
          and offline         experiments
```

The engine is the game logic. The live game advances a small amount, offline mode catches up, and the Lab runs long or repeated experiments. Rendering is a consumer, not the authority for rules.

### Proposed technology

- TypeScript simulation core, without React or rendering dependencies.
- React management UI.
- Canvas or WebGL battlefield.
- JSON data, or YAML authored and converted to JSON.
- Web Workers for heavy simulations.
- IndexedDB or equivalent local persistence for saves and config snapshots.
- Desktop-first responsive interface; mobile management support as a later refinement.

These are recommendations from the conversation, not final library or deployment selections. One product with game and Lab modes is the intended shape; separate app folders versus a `/lab` route remains an implementation choice.

### Suggested package structure

```text
apps/
  game-web/
  balance-lab/
packages/
  simulation-core/
  game-config/
  combat/
  economy/
  progression/
  map/
  analytics/
```

Engine operations proposed: `advance(1)`, `advance(168)`, `advance(8736)`, and repeated `run(config, strategy, seed)`. These describe the intended interface, not existing code.

### Reproducibility and saves

Every simulated world needs a seed. A failed scenario should be replayable with its config and strategy. Saves proposed in the conversation include config version, seed, current tick, world state, population, resources, buildings, towers, research, map state, and event state.

**Handoff recommendations:** Also persist random-generator state, queued work, automation settings, relevant combat state, last-save timestamp, and partial-tick remainder. Version state schemas and define config migration behavior. Seed alone does not reproduce a run without identical initial state and decisions.

### Worker execution

Long batches should run outside the UI thread and return aggregate results. Worker count and batch size must suit available hardware. Ten thousand agents over five years means 436.8 million strategic ticks before detailed combat; instant results are an aspiration, not a demonstrated performance claim.

**Handoff recommendations:** Include progress reporting, cancellation, bounded concurrency, incremental results, and sampled traces. Pin each run to a config snapshot so live edits cannot make comparisons ambiguous.

## 14 Configuration inventory

**Established:** Balancing values should be data-driven so they can be changed and simulated without rewriting mechanics.

| Domain | Required or proposed configurable data |
|---|---|
| Simulation | Story hours per tick, real seconds per tick, catch-up limits |
| Calendar | Hours/day, days/week, weeks/season, seasons/year |
| Population | Initial count/capacity, growth, needs, efficiency, departure behavior |
| Jobs | Staffing, outputs, unlocks, assignment rules |
| Resources | Initial stocks, caps, tradeability, decay, unlocks, resource kind |
| Production | Inputs, outputs, intervals, staffing and power needs |
| Buildings | Costs, build time, staffing, effects, recipes, upgrades |
| Towers | Costs, build time, staffing, damage, reload, range, projectile speed, splash, targeting, statuses |
| Combat | Resolution rules, armor/resistance model, status stacking, timing and energy semantics |
| Enemies | Health, speed, armor, traits, rewards, threat cost, scaling |
| Waves | Budgets, composition weights, growth, duration, arrival rules |
| Bosses | Appearance conditions, stats, mechanics, unlock/resource rewards |
| Seasons | Dates, economic/combat modifiers, terrain and path effects |
| Weather | Seasonal weights, duration, severity, modifiers |
| Research | Costs, durations, prerequisites, capabilities and modifiers |
| Automation | Unlocks, allowed conditions/actions, parameter limits, reserves |
| Exploration | Costs, cost growth, worker progress, reveals, prerequisites |
| Regions | Topology, resources, terrain, seasonal paths, entry points |
| Outposts | Cost, time, labor, radius, storage, reveal effects, shutdown priority |
| Trade | Offers, quantities, prices, refresh interval, price variation |
| Degradation | Shortage thresholds, shutdown stages, protected systems |
| Recovery | Reactivation costs and conditions, repair behavior |
| Unlocks | Declarative conditions and resulting capabilities |
| Milestones | Conditions and rewards |
| Citadel | Visibility, distance, proximity pressure, story events, entry requirements |
| Offline | Caps, resolution policy, major-event handling, loss policy |
| Difficulty | Named modifier profiles for simulation and possible play |
| Scenarios | Duration, starting state, strategy, labor/spending policy, seed sets |

The conversation proposed separate files per domain rather than one monolithic file. JSON versus YAML is open; a coherent validated runtime format matters more than the authoring syntax.

### Generic producers and effects

Buildings should reference reusable production recipes. Seasons, terrain, research, buildings, relics, and bosses should share a modifier mechanism where practical.

Illustrative modifier shape:

```yaml
modifier:
  target: wood.production
  operation: multiply
  value: 1.25
```

Illustrative prototype clock:

```yaml
simulation:
  tick_story_hours: 1
  real_seconds_per_tick: 30  # Experiment only; not a chosen pace
calendar:
  hours_per_day: 24
  days_per_week: 7
  weeks_per_season: 13
  seasons_per_year: 4
```

**Handoff recommendations:** Validate units, references, allowed operations, ranges, and unlock dependencies. Define modifier order, stacking, expiry, and clamping. Avoid double-counting labor in both a building and its recipe. Detect circular unlocks, unaffordable recovery paths, and energy-dependent production before energy exists.

Live editing also needs a policy: changes can apply to a new experiment, a cloned state, or explicitly to the current world. The conversation requested live tuning but did not settle migration semantics.

## 15 Balance Lab

**Established requirement:** A proper simulation interface for live tuning and examining trends, progression, and calibration. This is part of the initial architecture, not a later spreadsheet substitute.

### Main workflow

1. Select a config snapshot and scenario.
2. Adjust grouped settings in the interface.
3. Choose duration, player strategy, and seeds.
4. Run a trace or batch.
5. Inspect charts, milestones, shortages, and failures.
6. Compare against a saved baseline.
7. Replay interesting seeds and revise.

Primary proposed actions: **Run 1 Week**, **Run 1 Season**, **Run 1 Year**, and a Monte Carlo batch. Earlier labels included “Run 1,000 Years”; for Year 1 balancing, interpret and label this clearly as **1,000 independent Year 1 runs**, distinct from one 1,000-year campaign. Larger multi-year and 10,000-run experiments remain future capacity targets.

### Strategy agents

| Agent | Behavior to model |
|---|---|
| Conservative | Food safety, defense, storage, economy, then expansion |
| Greedy | Economic ROI, population, expansion; late defensive spending |
| Militaristic | Heavy tower investment and aggressive pushing |
| Explorer | Rapid fog reveal and territorial expansion |
| Idle | Infrequent intervention and reliance on unlocked automation |
| Inefficient | Plausible mistakes and suboptimal purchases |
| Baseline or optimized | Comparison policies, once explicitly defined |

These agents are scripted player policies, not a requirement to use AI models. They must obey player-visible information, unlocks, costs, and available actions. Otherwise results will misrepresent the game.

### Dashboard and metrics

| Area | Metrics |
|---|---|
| Progression | Unlock-time distributions, research completion, first energy/automation, upgrades per hour, expansion timing, dead periods |
| Economy | Gross production, consumption, net rates, spending, storage saturation, shortages, utilization, payback |
| Population | Count/capacity, assigned/idle workers, job mix, staffing shortages, growth, labor freed by automation |
| Combat | Defense/threat ratio, leaks, damage by tower, uptime, target utilization, hardest archetypes, stalls, synergy effectiveness |
| World | Territory, exploration speed, seasonal and weather impacts, distance toward Citadel |
| Resilience | Collapse frequency/cause/severity, disabled systems, losses, stabilization and recovery time, intervention, irrecoverable cases |

Candidate views: resource timelines with production/consumption/capacity overlays; population and labor charts; defense versus threat; progression timelines; resource and labor flow diagrams; ROI comparisons; collapse-and-recovery traces.

“Meaningful choices per session” and “Citadel ETA” were suggested dashboard ideas. The former requires a defined proxy plus playtesting; the latter is speculative before full campaign content exists.

### Experiments and comparison

- Monte Carlo runs across weather, composition, discoveries, and other seeded variation.
- Sensitivity analysis for one parameter, such as wood per worker.
- Two-dimensional sweeps, such as gathering rate versus barracks cost.
- Config snapshots and side-by-side results.
- Percentiles as well as medians; distinguish strategy cohorts.
- Replayable failures and exportable config/simulation reports.

The source's sample percentages, unlock dates, ROI figures, and dashboard tables were invented demonstrations. None is a measured baseline or acceptance result.

### Automated warnings

Flag prolonged capped storage, unused buildings, skipped towers, dominant strategies, payback beyond the scenario horizon, severe seasonal collapse, and stretches without useful purchases or unlocks. Warnings need adjustable thresholds and context, not universal judgments.

**Handoff recommendations:** Compare configs on matched seed sets; record sample size and non-completion rates; do not compute unlock medians only among successful runs without showing failures. Define recovery relative to a recorded pre-collapse baseline. Measure synergy with controlled comparisons where practical, rather than attributing every nearby tower's damage to frost.

## 16 Mathematical foundation

All formulas below are starting models, not validated balance.

### Stocks and shortages

```text
netRate(resource, t) = production(resource, t) - consumption(resource, t)
stock(t+1) = clamp(stock(t) + netRate(t) - decay(t), 0, capacity(t))
```

Clamping alone does not resolve shortages. The engine must record unmet demand and invoke staffing, shutdown, or degradation rules. Production and consumption depend on labor, infrastructure, season, weather, and modifiers.

### Reserve runway

```text
runwayTicks = storedAmount / (consumption - production)
```

Applies only while consumption exceeds production and rates stay constant. For example, 4,800 food at a deficit of six per hour lasts 800 ticks, or 33 days and eight hours. Forecasts should account for upcoming season changes.

### Simple payback

```text
paybackTicks = investmentCost / additionalNetProductionPerTick
```

Use consistent resource units. Mixed-resource costs need an explicit valuation model or separate accounting. Realized payback differs because of staffing, power, downtime, storage overflow, and opportunity cost.

### Combat diagnostics

```text
nominalDPS = damagePerShot / attackIntervalSeconds
defenseMargin = effectiveDPS / requiredDPS
```

These are diagnostic summaries, not replacements for combat simulation. Effective damage depends on coverage, armor, overkill, clustering, status windows, targeting, and available power.

### Growth curves

The conversation explored exponential health, cost, and power curves, with illustrative multipliers around 1.06–1.07 for enemy health, 1.15 for upgrade cost, and 1.10 for power. These are not chosen coefficients.

Rising costs faster than power can encourage diversified investments, but compounding must be checked over the actual 52-week horizon. Enemy archetypes, unlocks, season changes, and budget composition should interrupt smooth curves.

## 17 Open decisions and reconciliation

| Priority | Decision | Current direction or conflict |
|---|---|---|
| Before baseline | First playable sequence | First 30–60 minutes and first 10 game weeks remain undesigned |
| Before baseline | Pace | Real seconds per tick, session cadence, Year 1 duration unchosen |
| Before baseline | Resource roster | Roughly five-resource scope versus six-resource examples; food production missing |
| Before baseline | Initial population | Five people is an example; starting capacity varied between examples |
| Before baseline | Housing semantics | Capacity then arrivals favored; exact barracks/lodging relationship and upkeep open |
| Before baseline | Staffing | Shared labor locality, fractional pooling, partial efficiency, reassignment timing |
| Before baseline | Combat clocks | Battle within a tick versus continuous combat; economic impact of combat duration |
| Before baseline | Weekly pressure | Guaranteed assault versus varied threats; stalled progress versus advancing calendar |
| Before baseline | Boss timing | Early Week 13 examples versus latest year-end outline |
| Before baseline | Energy demonstration | Enough time after boss to test labor relief within MVP |
| Before baseline | Recovery guarantee | Protected core, zero-population escape route, damage/loss limits |
| Before baseline | Offline model | Detailed versus statistical resolution, caps, boss handling, major-event policy |
| Before baseline | State changes | Tick update order, config edits mid-run, modifier stacking, save migration |
| During prototype | Content | Exact towers, enemies, buildings, first element, regions, costs and unlocks |
| During prototype | Map interaction | Fixed paths, blockers, relocation, bridges, path validity, seasonal rerouting |
| During prototype | Environment | Which seasonal mechanics ship; acceptable randomness and forecasting |
| During prototype | Automation scope | First rule or labor unlock; complexity and UI limits |
| During prototype | Growth and trade | Arrival source, growth rates, gold sources, pricing, economic exploits |
| During prototype | Technical stack | Renderer, route/app split, persistence, performance targets, deployment |
| During prototype | Lab criteria | Metric definitions, strategy policies, warning thresholds, acceptance ranges |
| Later | Citadel ending | Victory, new realm, prestige, pressure curve, lore specifics |
| Later | Persistence | What resets and survives prestige; no settled mandatory reset loop |
| Later | Device scope | Depth of mobile placement versus management experience |

### Earlier proposals superseded or narrowed

- **Mandatory death/reset runs:** Replaced as the central failure model by recoverable degradation. Optional future prestige remains possible.
- **One coarse tick for every tower action:** Replaced by the clarified fictional-hour macro tick plus finer combat timing.
- **Waves 1–100 or 1–300 as prototype boundary:** Replaced by the Year 1 boundary.
- **Twelve towers, four elements, bosses every ten waves:** Early brainstorming scope; not the latest MVP.
- **Five or six Year 1 towers:** Narrowed to three or four in the latest proposal.
- **Gold as universal first currency:** Shifted toward wood-first, population-constrained production and possible gold trade.
- **Fixed Week 13 energy:** An early example, not a settled commitment; latest outline places the breakthrough near year-end.
- **Exact sample config values:** Remain examples; conflicting rates and unlock conditions must be resolved in a single baseline.

## 18 Suggested implementation sequence

This sequence is a handoff recommendation, not an already approved schedule.

1. **Resolve the baseline contract.** Choose first-year roster, tick pace experiment, initial state, first ten weeks, boss window, staffing, and recovery rules.
2. **Build the shared headless engine.** Implement calendar, state, seeded randomness, config validation, events, resources, population, queues, unlocks, and persistence.
3. **Prove the combat interaction.** Make basic tower, control tower, and splash tower produce placement- and timing-sensitive outcomes. Record useful diagnostics.
4. **Build the first Lab workflow alongside the game.** Edit config, run week/season/year, inspect trace and charts, compare snapshots, replay seeds.
5. **Complete the Year 1 systems.** Add seasonal pressures, limited expansion, contraction/recovery, boss, energy, and first labor relief.
6. **Connect offline catch-up and return report.** Verify online/offline consistency with the same starting state, actions, and seed.
7. **Run strategy batches and playtests.** Investigate deadlocks, timing cliffs, dominant investments, dead periods, and unintelligible failures.

### Proposed readiness checks

- Full 8,736-tick scenario completes without invalid resources, impossible staffing, or broken event state.
- Identical config, state, seed, and action history reproduce outcomes.
- Game, offline mode, and Lab share rules and produce consistent results at the chosen fidelity.
- Changing tower placement or timing changes outcomes in expected, explainable ways.
- Moderate overexpansion can stabilize and recover through legal player actions.
- Every unlock dependency is reachable, including recovery after severe loss.
- Boss and energy timing let players experience the intended progression within the chosen boundary.
- Lab remains responsive during long runs and supports comparison and replay.
- Human playtests confirm that the loop is understandable and worth returning to.

## 19 Deferred concepts

Preserve these ideas without treating them as commitments:

- Six-element ecosystem: fire, water, nature, earth, lightning, darkness.
- Dual/triple-element combinations and economic identities, such as wildfire, tempest, or obsidian.
- Elemental production chains, biomass compounding, and burst energy storage/discharge.
- Tower evolution based on achievements, nearby towers, or semi-secret conditions.
- Runs, realms, ascensions, essence, primal cores, and rule-changing elemental laws.
- Optional reset layers that change how future worlds work rather than only increasing damage.
- Terrain editing, bridges, tunnels, elevation, path redirectors, and elemental terrain.
- Advanced auto-placement, support relocation, seasonal loadouts, and programmable doctrines.
- Player-facing tower testing sandbox, distinct from the developer-facing Balance Lab.
- Multi-year chapters: survival, expansion, automation, frontier, and march toward the Citadel. Exact year assignments were illustrative.
- Later simulation acceleration or batching through quiet periods, returning to detailed resolution for important events.

## 20 Glossary and source map

| Term | Meaning in this design |
|---|---|
| Strategic tick | One fictional hour under the baseline calendar |
| Combat time | Fine resolution for movement, shots, impacts, and statuses |
| Threat cycle | Weekly pressure schedule, not necessarily one identical assault |
| Cadence | Timing relationship among attacks, effects, movement, and resource availability |
| Lodging capacity | Maximum supported population; separate from actual inhabitants |
| Labor requirement | Staffing capacity needed to operate a job or asset |
| Stall | Blocked combat advancement with a viable economy |
| Collapse | Unsustainable operation triggering shutdown or contraction |
| Stabilization | End of ongoing deterioration at a lower sustainable state |
| Recovery | Player-directed restoration or redesign after loss |
| Outpost | Frontier infrastructure enabling control and supporting expansion |
| Citadel | Distant campaign objective beyond the fog |
| Balance Lab | Developer interface for tuning and testing the shared simulation |
| Strategy agent | Explicit policy simulating player decisions |
| Config snapshot | Versioned experiment settings retained for comparison |
| Seed | Randomness input used with state and actions for reproducible runs |

### Conversation provenance

The full retrieved conversation contained 21 user turns, beginning with game recommendations and ending with the handout request. The design-bearing sequence was:

1. Element TD-inspired idle concept and early reset/element ideas.
2. Offline completion, upgrades, seasonality, placement, and freeze-to-splash cadence.
3. Resource flows and ticks.
4. Questions about persistence, automation, geometry, information, and pacing.
5. Recoverable failure, followed by explicit preference for graceful degradation.
6. Fog expansion and an endgame castle, followed by explicit enthusiasm for Citadel lore.
7. Mathematical balancing, calendar structure, and fictional-hour clarification.
8. Wood gathering, staffed towers, stone, trade, and boss-gated energy.
9. Config-driven systems, barracks/lodging, and live simulation metrics.
10. Browser delivery and the one-year scope boundary.

Later explicit preferences take precedence over earlier exploratory suggestions. The open-decision register preserves unresolved choices rather than turning illustrative examples into false commitments.
