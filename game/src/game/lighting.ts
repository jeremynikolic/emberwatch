// Day/night lighting layer — one sprite set, no recoloured duplicates.
// Contract: night shifts ambient palette and adds light pools around warm
// sources without covering gameplay-critical accents or changing silhouettes.
import { P, LIGHT } from './tokens.js';
import { rect, type Ctx } from './draw.js';

export interface LightPool {
  x: number; y: number; w: number; h: number; color: string;
}

export function applyLighting(c: Ctx, mode: 'day' | 'night', world: { x: number; y: number; w: number; h: number }, pools: LightPool[]): void {
  if (mode !== 'night') return;
  // Full-scene tint first.
  rect(c, world.x, world.y, world.w, world.h, LIGHT.night.tint ?? P.nightTint);
  // Blocky warm light pools — cheap, readable, no bloom.
  for (const p of pools) {
    rect(c, p.x, p.y, p.w, p.h, p.color);
  }
}