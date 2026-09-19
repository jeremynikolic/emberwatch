// Shared live/offline simulation runner. One deterministic tick path prevents
// a second, simplified "offline combat" game from drifting away from live play.
import { combatStep, type Burst, type Projectile } from './combat.js';
import { step, type Sim } from './sim.js';

export interface AdvanceOutcome {
  seconds: number;
  kills: number;
  leaks: number;
  emberLost: number;
  waveFrom: number;
  waveTo: number;
  capped: boolean;
}

export const OFFLINE_CAP_SECONDS = 15 * 60;
const STEP_SECONDS = 0.05;

function clearDead(sim: Sim): number {
  let kills = 0;
  const survivors = sim.enemies.filter(enemy => {
    if (enemy.hp > 0) return true;
    if (!enemy.leaked) kills += 1;
    return false;
  });
  sim.enemies = survivors;
  sim.kills += kills;
  return kills;
}

/** Advance a run through the same movement and combat path used by the UI.
 * dt is sliced so a long tab absence cannot tunnel enemies through waypoints.
 */
export function advance(sim: Sim, seconds: number, projectiles: Projectile[] = [], bursts: Burst[] = []): AdvanceOutcome {
  const elapsed = Math.max(0, Math.min(seconds, OFFLINE_CAP_SECONDS));
  const beforeKills = sim.kills;
  const beforeLeaks = sim.leaks;
  const beforeEmber = sim.ember;
  const waveFrom = sim.wave;
  let remaining = elapsed;

  while (remaining > 0 && sim.phase !== 'won' && sim.phase !== 'lost') {
    const dt = Math.min(STEP_SECONDS, remaining);
    step(sim, dt);
    if (sim.phase === 'wave') combatStep(sim, dt, projectiles, bursts);
    clearDead(sim);
    remaining -= dt;
  }

  // Callers performing offline catch-up use the default throwaway arrays; live
  // rendering passes persistent arrays so projectiles survive across frames.
  return {
    seconds: elapsed,
    kills: sim.kills - beforeKills,
    leaks: sim.leaks - beforeLeaks,
    emberLost: beforeEmber - sim.ember,
    waveFrom,
    waveTo: sim.wave,
    capped: seconds > OFFLINE_CAP_SECONDS,
  };
}
