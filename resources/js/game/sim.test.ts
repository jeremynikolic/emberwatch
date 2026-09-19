import { describe, expect, it } from 'vitest';
import { makeSim, place, startWave, step } from './sim';

const route = { waypoints: [{ x: 8, y: 8 }] };

describe('simulation invariants', () => {
  it('claims a complete tower footprint and charges its cost once', () => {
    const sim = makeSim(route, 130);

    expect(place(sim, 'bolt', 3, 4)).toBe(true);
    expect(sim.wood).toBe(90);
    expect(sim.occupied).toEqual(new Set(['3,4', '4,4', '3,5', '4,5']));
    expect(place(sim, 'frost', 4, 4)).toBe(false);
  });

  it('records a Watchfire arrival as a leak, never as a kill', () => {
    const sim = makeSim(route);
    startWave(sim);

    step(sim, 0.05);

    expect(sim.leaks).toBe(1);
    expect(sim.kills).toBe(0);
    expect(sim.ember).toBe(90);
  });
});
