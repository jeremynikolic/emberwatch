// Emberwatch style tokens — the locked art contract as code.
// Source of truth: docs/art-direction.md (Draft 0.2).
// All colours are proposal-grade, consistent with the sketch pipeline.

export const T = 16;                 // logical tile size (32 px grid rendered at 2×)
export const SCALE = 2;              // device pixels per logical pixel
export const CANVAS_W = 640;         // logical canvas width
export const CANVAS_H = 360;         // logical canvas height

export const P = {
  // Environment
  void: '#080d17',
  grass: '#425745', grass2: '#50654c', moss: '#6a7651', earth: '#66533d',
  path: '#776b56', pathHi: '#93846a',
  stone: '#53616a', stoneDark: '#303b43', steel: '#71808b', steelHi: '#a7b3b8',
  water: '#355867', waterHi: '#6f9297',
  fog: '#8aa0ae',
  // Warm industry (settlement)
  timber: '#76503a', timberHi: '#a06b45',
  copper: '#a75d39',
  ember: '#ee7e32', flame: '#ffd275',
  // Cold danger (frontier / Citadel)
  ice: '#73c9cf', iceHi: '#c0f4e9',
  crimson: '#a62f3e', crimsonHi: '#e05758',
  // UI — dark navy panels, brass framing at hierarchy boundaries only
  navy: '#0d1727', navy2: '#14233a', panel: '#101c2e', panel2: '#192a40',
  brass: '#b78845', brassHi: '#e0b865',
  text: '#d3d9d7', muted: '#83919a',
  good: '#78ad72', warn: '#e6a24c',
  // Night overlay — must preserve silhouette readability (validated in sketches)
  nightTint: '#08152b78',
} as const;

export type Palette = typeof P;
export type ColorKey = keyof Palette;

// Semantic accents — motion/particles/tint, never a permanent neon hue per system.
export const ACCENT: Record<'frost' | 'ember' | 'danger' | 'ok', string> = {
  frost: P.ice, ember: P.ember, danger: P.crimsonHi, ok: P.good,
};

// Typography — management UI, monospace, information-first.
export const FONT = (size: number): string => `bold ${size}px ui-monospace, "Cascadia Mono", monospace`;

// Day/night contract: one sprite set + dynamic lighting layer.
// Night must not recolour gameplay-critical accents or change silhouettes.
export interface LightProfile {
  ambient: number;
  tint?: string;
  shadow?: string;
}

export const LIGHT: Record<'day' | 'night', LightProfile> = {
  day: { ambient: 1, shadow: 'rgba(10,14,15,0.53)' },
  night: { ambient: 1, tint: P.nightTint },
};