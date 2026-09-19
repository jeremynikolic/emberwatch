// UI kit — dark navy panels, brass framing only at hierarchy boundaries.
// Information-dense management surface; UI is not a diegetic object.
import { P } from './tokens.js';
import { rect, text, panel, innerPanel, type Ctx, type TextAlign } from './draw.js';

export interface StatSpec {
  key: string;      // 'WOOD'
  value: string;     // '184'
  color?: string;    // value colour
}

export function statusBar(c: Ctx, x: number, y: number, stats: StatSpec[], spacing = 58): void {
  let sx = x;
  for (const s of stats) {
    text(c, s.key, sx, y, P.muted, 5);
    text(c, s.value, sx, y + 7, s.color ?? P.text, 8);
    sx += spacing;
  }
}

export interface Button {
  x: number; y: number; w: number; h: number; id: string;
}

export function button(c: Ctx, b: Omit<Button, never>, label: string): void {
  panel(c, b.x, b.y, b.w, b.h, P.panel2);
  text(c, label, b.x + b.w / 2, b.y + 5, P.text, 6, 'center' as TextAlign);
}

export function hitTest(buttons: Button[], x: number, y: number): Button | undefined {
  return buttons.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
}

// Inspector rows — label left, value right, dense vertical rhythm.
export function statRow(c: Ctx, x: number, y: number, label: string, value: string): void {
  text(c, label, x, y, P.muted, 5);
  text(c, value, x + 92, y - 2, P.text, 8, 'right' as TextAlign);
}

// Resource bar fragment with brass-bound edge for hierarchy transitions.
export function bottomBar(c: Ctx, x: number, y: number, w: number, h: number): void {
  rect(c, x, y, w, h, P.navy);
  rect(c, x, y, w, 2, P.brass);
}

export { panel, innerPanel };