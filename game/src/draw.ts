// Minimal 2D drawing primitives over the logical (pre-scale) coordinate space.
import { P, FONT } from './tokens.js';

export type Ctx = CanvasRenderingContext2D;

export function rect(c: Ctx, x: number, y: number, w: number, h: number, color: string): void {
  c.fillStyle = color;
  c.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function line(c: Ctx, x1: number, y1: number, x2: number, y2: number, color: string, w = 1): void {
  c.strokeStyle = color;
  c.lineWidth = w;
  c.beginPath();
  c.moveTo(x1 + 0.5, y1 + 0.5);
  c.lineTo(x2 + 0.5, y2 + 0.5);
  c.stroke();
}

export type TextAlign = 'left' | 'center' | 'right';

export function text(c: Ctx, s: string, x: number, y: number, color: string = P.text, size: number = 7, align: TextAlign = 'left'): void {
  c.fillStyle = color;
  c.font = FONT(size);
  c.textAlign = align;
  c.textBaseline = 'top';
  c.fillText(s, x, y);
}

// Brass-framed panel — hierarchy boundary only, never around every control.
export function panel(c: Ctx, x: number, y: number, w: number, h: number, fill: string = P.panel): void {
  rect(c, x, y, w, h, P.brass);
  rect(c, x + 1, y + 1, w - 2, h - 2, P.navy2);
  rect(c, x + 2, y + 2, w - 4, h - 4, fill);
}

// Flat inner panel — secondary containers get no brass frame.
export function innerPanel(c: Ctx, x: number, y: number, w: number, h: number, fill: string = P.panel2): void {
  rect(c, x, y, w, h, fill);
}