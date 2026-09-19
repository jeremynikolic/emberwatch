// Browser persistence for the active settlement. Local-only by design: no
// account/server requirement before the core loop has proved itself.
import { key, type Route, type Sim } from './sim.js';

const STORAGE_KEY = 'emberwatch.run.v1';
const VERSION = 1;
export const RUN_SAVED_EVENT = 'emberwatch:run-saved';

export interface StoredRun {
  version: number;
  savedAt: number;
  sim: Omit<Sim, 'route' | 'occupied'> & { occupied?: never };
}

export interface LoadedRun {
  sim: Sim;
  elapsedSeconds: number;
}

function snapshot(sim: Sim): StoredRun['sim'] {
  // Structured clone through JSON-compatible fields. route and occupied are
  // derived from the locked map/tower footprint data when restoring.
  return {
    time: sim.time,
    wood: sim.wood,
    ember: sim.ember,
    enemies: sim.enemies,
    towers: sim.towers,
    spawnQueue: sim.spawnQueue,
    spawnTimer: sim.spawnTimer,
    wave: sim.wave,
    phase: sim.phase,
    buildTimer: sim.buildTimer,
    kills: sim.kills,
    leaks: sim.leaks,
  };
}

export function saveRun(sim: Sim, now = Date.now()): void {
  const payload: StoredRun = { version: VERSION, savedAt: now, sim: snapshot(sim) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent<StoredRun>(RUN_SAVED_EVENT, { detail: payload }));
}

export function clearRun(): void { localStorage.removeItem(STORAGE_KEY); }

/**
 * Makes an authenticated server snapshot available to the same local runtime
 * interface used by anonymous play. Invalid remote data is ignored rather than
 * preventing a settlement from opening.
 */
export function restoreServerRun(state: unknown): boolean {
  if (!isStoredRun(state)) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return true;
}

function isStoredRun(state: unknown): state is StoredRun {
  if (!state || typeof state !== 'object') return false;
  const stored = state as Partial<StoredRun>;
  const sim = stored.sim as Partial<StoredRun['sim']> | undefined;

  if (stored.version !== VERSION || typeof stored.savedAt !== 'number' || !sim) return false;

  return Array.isArray(sim.towers)
    && Array.isArray(sim.enemies)
    && Number.isFinite(sim.ember);
}

export function loadRun(route: Route, now = Date.now()): LoadedRun | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredRun>;
    if (parsed.version !== VERSION || !parsed.sim || typeof parsed.savedAt !== 'number') return null;
    const s = parsed.sim as StoredRun['sim'];
    if (!Array.isArray(s.towers) || !Array.isArray(s.enemies) || !Number.isFinite(s.ember)) return null;
    const occupied = new Set<string>();
    for (const tower of s.towers) {
      for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) occupied.add(key(tower.gx + dx, tower.gy + dy));
    }
    const sim: Sim = {
      ...s,
      leaks: Number.isFinite(s.leaks) ? s.leaks : 0,
      route,
      occupied,
    };
    return { sim, elapsedSeconds: Math.max(0, (now - parsed.savedAt) / 1000) };
  } catch {
    // Corrupt/old local state is never a reason the game fails to boot.
    clearRun();
    return null;
  }
}
