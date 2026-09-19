// Terrain tileset — clean tile grid, subtle path lines, instantly
// distinguishable buildable / route / blocked / water at management zoom.
// Contract: docs/art-direction.md "Locked terrain readability".
import { T, P } from './tokens.js';
import type { Ctx } from './draw.js';

export type TileKind = 'grass' | 'path' | 'blocked' | 'water';

// Deterministic per-tile texture so boards look organic without noise.
function hash(x: number, y: number): number {
  return ((x * 17 + y * 29) % 11 + 11) % 11;
}

export function drawTile(c: Ctx, kind: TileKind, gx: number, gy: number): void {
  const x = gx * T, y = gy * T;
  const n = hash(gx, gy);

  switch (kind) {
    case 'grass': {
      c.fillStyle = P.grass;
      c.fillRect(x, y, T, T);
      if (n === 0) { c.fillStyle = P.grass2; c.fillRect(x + 3, y + 4, 2, 1); } // sparse blade
      if (n === 7) { c.fillStyle = P.earth; c.fillRect(x + 7, y + 7, 1, 2); }  // mud fleck
      if (n === 4) { c.fillStyle = P.moss; c.fillRect(x + 11, y + 12, 2, 1); }
      break;
    }
    case 'path': {
      c.fillStyle = P.path;
      c.fillRect(x, y, T, T);
      c.fillStyle = P.pathHi;
      c.fillRect(x, y, T, 2);           // worn top edge
      if ((gx + gy) % 3 === 0) { c.fillStyle = P.earth; c.fillRect(x + 5, y + 8, 5, 1); }
      break;
    }
    case 'blocked': {
      // Rocky outcrop — non-buildable reads as raised stone.
      c.fillStyle = P.stoneDark;
      c.fillRect(x, y + 6, T, T - 6);
      c.fillStyle = P.stone;
      c.fillRect(x + 2, y + 2, T - 4, T - 5);
      c.fillStyle = P.steelHi;
      c.fillRect(x + 4, y, 6, 3);
      break;
    }
    case 'water': {
      c.fillStyle = P.water;
      c.fillRect(x, y, T, T);
      c.fillStyle = P.waterHi;
      c.fillRect(x, y, T, 2);
      if (n < 3) { c.fillStyle = P.waterHi; c.fillRect(x + 4, y + 8, 6, 1); }
      break;
    }
  }
}

// The grid itself is part of the readability contract, not an editor overlay.
export function drawGrid(c: Ctx, w: number, h: number): void {
  c.strokeStyle = '#354b3e';
  c.lineWidth = 1;
  c.beginPath();
  for (let x = 0; x <= w; x += T) { c.moveTo(x + 0.5, 0); c.lineTo(x + 0.5, h); }
  for (let y = 0; y <= h; y += T) { c.moveTo(0, y + 0.5); c.lineTo(w, y + 0.5); }
  c.stroke();
}

export type Board = TileKind[][];

export function drawBoard(c: Ctx, board: Board): void {
  for (let gy = 0; gy < board.length; gy++)
    for (let gx = 0; gx < board[gy].length; gx++)
      drawTile(c, board[gy][gx], gx, gy);
}