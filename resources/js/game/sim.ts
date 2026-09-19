// Simulation core — grid state, enemy pathing, tower footprints, economy.
// Deliberately UI-agnostic: pure state + step function, no canvas references.



export type TowerKind = 'bolt' | 'frost' | 'bombard';

export interface TowerSpec {
  kind: TowerKind;
  name: string;
  footprint: number;          // tiles per side
  cost: number;
  range: number;              // logical px, centre to target centre
  damage: number;
  cooldown: number;            // seconds between shots
  slowFactor?: number;        // frost only
  slowDuration?: number;       // frost only
  splashRadius?: number;       // bombard only
}

export const TOWERS: Record<TowerKind, TowerSpec> = {
  bolt:     { kind: 'bolt', name: 'BOLT', footprint: 2, cost: 40, range: 56, damage: 14, cooldown: 1.0 },
  frost:    { kind: 'frost', name: 'FROST', footprint: 2, cost: 30, range: 48, damage: 4, cooldown: 1.4, slowFactor: 0.5, slowDuration: 2.0 },
  bombard:  { kind: 'bombard', name: 'BOMBARD', footprint: 2, cost: 60, range: 62, damage: 26, cooldown: 3.0, splashRadius: 24 },
};

export interface EnemySpec {
  hp: number;
  speed: number;               // logical px per second
  emberDrain: number;          // Ember lost when it reaches the Watchfire
}

export const CRAWLER: EnemySpec = { hp: 18, speed: 14, emberDrain: 10 };

export interface Enemy {
  x: number; y: number;        // logical px, centre
  hp: number;
  slowUntil: number;           // sim time when slow expires
  waypoint: number;            // index into route waypoints
  spec: EnemySpec;
  leaked: boolean;             // true if it reached the Watchfire (drains Ember)
}

export interface Tower {
  kind: TowerKind;
  gx: number; gy: number;      // top-left grid cell of footprint
  cooldownLeft: number;
}

export interface Route {
  waypoints: { x: number; y: number }[];   // logical px centres of path cells
}

export interface Sim {
  time: number;
  wood: number;
  ember: number;
  enemies: Enemy[];
  towers: Tower[];
  route: Route;
  occupied: Set<string>;        // "gx,gy" of every tile claimed by a tower
  spawnQueue: number;          // enemies left to spawn this wave
  spawnTimer: number;
  wave: number;
  phase: 'build' | 'wave' | 'won' | 'lost';
  buildTimer: number;          // seconds until next wave starts
  kills: number;
  leaks: number;
}

export function key(gx: number, gy: number): string { return `${gx},${gy}`; }

export function makeSim(route: Route, startingWood = 100): Sim {
  return {
    time: 0, wood: startingWood, ember: 100,
    enemies: [], towers: [], route,
    occupied: new Set(), spawnQueue: 0, spawnTimer: 0,
    wave: 0, phase: 'build', buildTimer: 8, kills: 0, leaks: 0,
  };
}

// Wave composition scales gently — prototype numbers, not design promises.
export function waveSize(wave: number): number { return 4 + wave * 2; }

export function canPlace(sim: Sim, kind: TowerKind, gx: number, gy: number, cols: number, rows: number): boolean {
  const f = TOWERS[kind].footprint;
  if (gx < 0 || gy < 0 || gx + f > cols || gy + f > rows) return false;
  for (let dy = 0; dy < f; dy++)
    for (let dx = 0; dx < f; dx++)
      if (sim.occupied.has(key(gx + dx, gy + dy))) return false;
  return sim.wood >= TOWERS[kind].cost;
}

export function place(sim: Sim, kind: TowerKind, gx: number, gy: number): boolean {
  if (!canPlace(sim, kind, gx, gy, 999, 999)) return false;
  const f = TOWERS[kind].footprint;
  for (let dy = 0; dy < f; dy++)
    for (let dx = 0; dx < f; dx++)
      sim.occupied.add(key(gx + dx, gy + dy));
  sim.towers.push({ kind, gx, gy, cooldownLeft: 0 });
  sim.wood -= TOWERS[kind].cost;
  return true;
}

export function startWave(sim: Sim): void {
  sim.wave += 1;
  sim.spawnQueue = waveSize(sim.wave);
  sim.spawnTimer = 0;
  sim.phase = 'wave';
}

// One simulation step. dt in seconds.
export function step(sim: Sim, dt: number): void {
  sim.time += dt;

  if (sim.phase === 'build') {
    sim.buildTimer -= dt;
    if (sim.buildTimer <= 0) startWave(sim);
    return;
  }
  if (sim.phase !== 'wave') return;

  // Spawning
  if (sim.spawnQueue > 0) {
    sim.spawnTimer -= dt;
    if (sim.spawnTimer <= 0) {
      const w = sim.route.waypoints[0];
      sim.enemies.push({ x: w.x, y: w.y, hp: CRAWLER.hp, slowUntil: 0, waypoint: 1, spec: CRAWLER, leaked: false });
      sim.spawnQueue -= 1;
      sim.spawnTimer = 0.9;
    }
  }

  // Enemy movement — waypoint follower, slow-aware.
  for (const e of sim.enemies) {
    const speed = e.slowUntil > sim.time ? e.spec.speed * 0.5 : e.spec.speed;
    let remaining = speed * dt;
    while (remaining > 0 && e.waypoint < sim.route.waypoints.length) {
      const w = sim.route.waypoints[e.waypoint];
      const dx = w.x - e.x, dy = w.y - e.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= remaining) {
        e.x = w.x; e.y = w.y;
        e.waypoint += 1;
        remaining -= dist;
      } else {
        e.x += (dx / dist) * remaining;
        e.y += (dy / dist) * remaining;
        remaining = 0;
      }
    }
    if (e.waypoint >= sim.route.waypoints.length) {
      // Reached the Watchfire: drain Ember.
      sim.ember = Math.max(0, sim.ember - e.spec.emberDrain);
      e.hp = 0; e.leaked = true; sim.leaks += 1; // remove + flag as leak, not a kill
      if (sim.ember <= 0) { sim.phase = 'lost'; return; }
    }
  }
  sim.enemies = sim.enemies.filter(e => e.hp > 0);

  // Wave complete?
  if (sim.spawnQueue === 0 && sim.enemies.length === 0) {
    if (sim.wave >= 3) { sim.phase = 'won'; return; }  // prototype: 3 waves = victory
    sim.phase = 'build';
    sim.buildTimer = 8;
    sim.wood += 20; // wave-clear bonus
  }
}