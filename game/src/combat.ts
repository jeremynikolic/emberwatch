// Combat — tower targeting, projectiles, slow and splash.
// Minimal-effects contract: status reads through silhouette tint and brief
// directional bursts, never particle clouds.

import type { Sim, Tower } from './sim.js';
import { TOWERS } from './sim.js';

export interface Projectile {
  x: number; y: number;          // current logical position
  tx: number; ty: number;        // target point (locked at fire time)
  speed: number;                 // logical px per second
  hitRadius: number;
  damage: number;
  splashRadius: number;          // 0 = single-target
  slowFactor: number;            // 1 = no slow
  slowDuration: number;
  dead: boolean;
}

export interface Burst {
  x: number; y: number; life: number; maxLife: number; kind: 'impact' | 'frost';
}

// Towers fire at the enemy nearest the Watchfire (furthest along the route).
export function towerCentre(t: Tower): { x: number; y: number } {
  const f = TOWERS[t.kind].footprint;
  return { x: (t.gx + f / 2) * 16, y: (t.gy + f / 2) * 16 };
}

export function progressOf(e: { waypoint: number }): number { return e.waypoint; }

export function combatStep(sim: Sim, dt: number, projectiles: Projectile[], bursts: Burst[]): void {
  // Tower cooldowns + firing.
  for (const t of sim.towers) {
    const spec = TOWERS[t.kind];
    t.cooldownLeft -= dt;
    if (t.cooldownLeft > 0) continue;

    const c = towerCentre(t);
    let target: Sim['enemies'][number] | undefined;
    let bestProgress = -1;
    for (const e of sim.enemies) {
      const d = Math.hypot(e.x - c.x, e.y - c.y);
      if (d <= spec.range && e.waypoint > bestProgress) { bestProgress = e.waypoint; target = e; }
    }
    if (!target) continue;

    t.cooldownLeft = spec.cooldown;
    projectiles.push({
      x: c.x, y: c.y - 8,
      tx: target.x, ty: target.y,
      speed: t.kind === 'bombard' ? 60 : 160,
      hitRadius: 4,
      damage: spec.damage,
      splashRadius: spec.splashRadius ?? 0,
      slowFactor: spec.slowFactor ?? 1,
      slowDuration: spec.slowDuration ?? 0,
      dead: false,
    });
  }

  // Projectile flight — locked target point, no homing (readable, deterministic).
  for (const p of projectiles) {
    const dx = p.tx - p.x, dy = p.ty - p.y;
    const dist = Math.hypot(dx, dy);
    const stepLen = p.speed * dt;
    if (dist <= stepLen + p.hitRadius) {
      p.x = p.tx; p.y = p.ty;
      p.dead = true;
      // Impact: single or splash.
      for (const e of sim.enemies) {
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        const inSplash = p.splashRadius > 0 && d <= p.splashRadius;
        if (d <= p.hitRadius + 6 || inSplash) {
          e.hp -= p.damage;
          if (p.slowFactor < 1) e.slowUntil = sim.time + p.slowDuration;
        }
      }
      bursts.push({ x: p.x, y: p.y, life: 0.22, maxLife: 0.22, kind: p.splashRadius > 0 ? 'impact' : 'frost' });
    } else {
      p.x += (dx / dist) * stepLen;
      p.y += (dy / dist) * stepLen;
    }
  }
  // Clear dead projectiles, expire bursts.
  for (let i = projectiles.length - 1; i >= 0; i--) if (projectiles[i].dead) projectiles.splice(i, 1);
  for (let i = bursts.length - 1; i >= 0; i--) {
    bursts[i].life -= dt;
    if (bursts[i].life <= 0) bursts.splice(i, 1);
  }
  // Enemies killed by this volley are removed by the caller's next sim step.
}