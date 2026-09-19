// Emberwatch playable prototype — wave combat against the locked style system.
import { CANVAS_W, CANVAS_H, SCALE, T, P } from './tokens.js';
import { rect, text, panel, type Ctx } from './draw.js';
import { type Board, drawBoard, drawGrid, type TileKind } from './terrain.js';
import { button, hitTest, type Button } from './ui.js';
import { applyLighting } from './lighting.js';
import { type Assets, loadAssets, type AssetKey } from './assets.js';
import {
  type Sim, makeSim, place, startWave,
  type TowerKind, TOWERS,
} from './sim.js';
import { type Projectile, type Burst } from './combat.js';
import { advance, type AdvanceOutcome } from './runtime.js';
import { clearRun, loadRun, saveRun } from './persistence.js';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const c = canvas.getContext('2d')!;
c.imageSmoothingEnabled = false;
c.scale(SCALE, SCALE);

const WORLD_X = 0, WORLD_Y = 24, WORLD_W = 504, WORLD_H = 288; // 288 = 360 − top 24 − build bar 48; 18 tile rows
// 504 px is not tile-aligned (504/16 = 31.5); the playable world is 31 columns.
const COLS = Math.floor(WORLD_W / T), ROWS = WORLD_H / T;

const BUILD_BAR: { kind: TowerKind; key: AssetKey }[] = [
  { kind: 'bolt', key: 'boltThrower' },
  { kind: 'frost', key: 'frostCondenser' },
  { kind: 'bombard', key: 'bombard' },
];

// ---- Board + route ---------------------------------------------------------
// Route: west entrance → serpentine → Watchfire at the east end.
const ROUTE_CELLS: [number, number][] = (() => {
  const cells: [number, number][] = [];
  for (let gx = 0; gx <= 10; gx++) cells.push([gx, 4]);
  for (let gy = 5; gy <= 9; gy++) cells.push([10, gy]);
  for (let gx = 11; gx <= 18; gx++) cells.push([gx, 9]);
  for (let gy = 8; gy >= 6; gy--) cells.push([18, gy]);
  for (let gx = 19; gx <= 27; gx++) cells.push([gx, 6]);
  for (let gy = 7; gy <= 13; gy++) cells.push([27, gy]);
  for (let gx = 28; gx <= 30; gx++) cells.push([gx, 13]);
  return cells;
})();

const WATCHFIRE_CELL: [number, number] = [30, 13];

function buildBoard(): Board {
  const board: Board = Array.from({ length: ROWS }, () => Array<TileKind>(COLS).fill('grass'));
  for (const [gx, gy] of ROUTE_CELLS) board[gy][gx] = 'path';
  for (const [gx, gy] of [[4, 1], [9, 2], [22, 2], [13, 6], [5, 8], [24, 10]] as [number, number][]) board[gy][gx] = 'blocked';
  for (let gx = 0; gx <= 9; gx++) board[1][gx] = 'water';
  for (let gx = 0; gx <= 2; gx++) board[2][gx] = 'water';
  // Watchfire footprint 3x3 around its cell.
  const [wx, wy] = WATCHFIRE_CELL;
  board[wy][wx] = 'path'; // keep it on-route visually (base pad drawn over)
  return board;
}

// Route coordinates are local to the clipped world; rendering translates once.
// Keeping this separate from screen-space prevents tower targeting drift.
const ROUTE = {
  waypoints: [
    ...ROUTE_CELLS.slice(0, -1).map(([gx, gy]) => ({ x: gx * T + T / 2, y: gy * T + T / 2 })),
    { x: WATCHFIRE_CELL[0] * T + T / 2, y: WATCHFIRE_CELL[1] * T + T / 2 },
  ],
};

const BOARD = buildBoard();
let sim: Sim = makeSim(ROUTE, 130);
const projectiles: Projectile[] = [];
const bursts: Burst[] = [];
let assets: Assets;
let returnReport: AdvanceOutcome | null = null;
// Test/debug hooks: expose state snapshots without leaking module internals into gameplay.
Object.defineProperty(window, '__sim', { get: () => sim });
Object.defineProperty(window, '__debug', { get: () => ({
  returnReport,
  projectiles: projectiles.length,
  towerCooldowns: sim.towers.map(t => ({ kind: t.kind, cooldown: t.cooldownLeft })),
  enemies: sim.enemies.map(e => ({ hp: e.hp, x: e.x, y: e.y, waypoint: e.waypoint })),
}) });

// ---- Input state ------------------------------------------------------------
let selectedBuild: TowerKind | null = null;
let hover: { gx: number; gy: number } | null = null;
let night = false;
let gridOn = true;
const buttons: Button[] = [];

// ---- Helpers -----------------------------------------------------------------
const toWorld = (x: number, y: number): { gx: number; gy: number } =>
  ({ gx: Math.floor((x - WORLD_X) / T), gy: Math.floor((y - WORLD_Y) / T) });

function validBuildCell(gx: number, gy: number): boolean {
  if (gx < 0 || gy < 0 || gx + 2 > COLS || gy + 2 > ROWS) return false;
  for (const [rx, ry] of ROUTE_CELLS) {
    if (rx >= gx && rx < gx + 2 && ry >= gy && ry < gy + 2) return false;
  }
  if (BOARD[gy]?.[gx] === 'water' || BOARD[gy]?.[gx] === 'blocked') return false;
  if (BOARD[gy + 1]?.[gx] === 'water' || BOARD[gy + 1]?.[gx + 1] === 'water') return false;
  const [wx, wy] = WATCHFIRE_CELL;
  if (Math.abs(gx - wx) < 4 && Math.abs(gy - wy) < 4) return false; // keep the core clear
  return !sim.occupied.has(`${gx},${gy}`) && !sim.occupied.has(`${gx + 1},${gy}`) && !sim.occupied.has(`${gx},${gy + 1}`) && !sim.occupied.has(`${gx + 1},${gy + 1}`);
}

function formatDuration(seconds: number): string {
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  return minutes > 0 ? `${minutes}m ${whole % 60}s` : `${whole}s`;
}

function restartRun(): void {
  sim = makeSim(ROUTE, 130);
  projectiles.length = 0;
  bursts.length = 0;
  selectedBuild = null;
  returnReport = null;
  clearRun();
  saveRun(sim);
}

// ---- Rendering ----------------------------------------------------------------
function drawEnemy(c: Ctx, e: Sim['enemies'][number]): void {
  c.drawImage(assets.rootCrawler, e.x - 16, e.y - 16, 32, 32);
  if (e.slowUntil > sim.time) { // frozen status: blue tint block over silhouette
    rect(c, e.x - 16, e.y - 16, 32, 32, '#73c9cf55');
  }
  // HP pip above head when damaged.
  if (e.hp < e.spec.hp) {
    const w = 20, frac = Math.max(0, e.hp / e.spec.hp);
    rect(c, e.x - w / 2, e.y - 20, w, 2, P.stoneDark);
    rect(c, e.x - w / 2, e.y - 20, Math.ceil(w * frac), 2, P.good);
  }
}

function drawTower(c: Ctx, t: Sim['towers'][number]): void {
  const img: AssetKey = t.kind === 'bolt' ? 'boltThrower' : t.kind === 'frost' ? 'frostCondenser' : 'bombard';
  c.drawImage(assets[img], t.gx * T + WORLD_X, t.gy * T + WORLD_Y, 32, 32);
}

function drawProjectiles(c: Ctx): void {
  for (const p of projectiles) {
    if (p.splashRadius > 0) rect(c, p.x - 2, p.y - 2, 4, 4, P.stoneDark);
    else if (p.slowFactor < 1) rect(c, p.x - 1, p.y - 1, 2, 2, P.iceHi);
    else rect(c, p.x - 1, p.y - 1, 2, 2, P.brassHi);
  }
  for (const b of bursts) {
    const s = b.kind === 'impact' ? 8 : 4;
    const alpha = Math.floor((b.life / b.maxLife) * 5) + 2;
    rect(c, b.x - s / 2, b.y - s / 2, s, s, b.kind === 'impact' ? `#ee7e32${alpha}0` : `#c0f4e9${alpha}0`);
  }
}

function drawUI(): void {
  // Top bar
  rect(c, 0, 0, CANVAS_W, WORLD_Y, P.navy);
  rect(c, 0, WORLD_Y - 2, CANVAS_W, 2, P.brass);
  text(c, 'EMBERWATCH', 10, 6, P.flame, 10);
  const stats: [string, string, string][] = [
    ['WOOD', `${sim.wood}`, P.timberHi],
    ['WAVE', `${sim.wave} / 3`, P.text],
    ['KILLS', `${sim.kills}`, P.text],
    ['EMBER', `${Math.round(sim.ember)}%`, P.ember],
  ];
  let sx = 115;
  for (const [k, v, col] of stats) { text(c, k, sx, 5, P.muted, 5); text(c, v, sx, 12, col, 8); sx += 58; }
  const phaseLabel = sim.phase === 'build' ? `BUILD ${Math.ceil(sim.buildTimer)}s` :
    sim.phase === 'wave' ? 'WAVE LIVE' : sim.phase === 'won' ? 'VICTORY' : 'EMBER LOST';
  text(c, phaseLabel, 630, 7, sim.phase === 'wave' ? P.crimsonHi : sim.phase === 'build' ? P.good : P.flame, 8, 'right');

  // Build bar (bottom)
  const barY = WORLD_Y + WORLD_H;
  rect(c, 0, barY, WORLD_W, 48, P.navy);
  rect(c, 0, barY, WORLD_W, 2, P.brass);
  text(c, 'BUILD', 9, barY + 6, P.muted, 6);
  buttons.length = 0;
  BUILD_BAR.forEach((b, i) => {
    const bx = 47 + i * 44;
    panel(c, bx, barY + 4, 38, 32, selectedBuild === b.kind ? '#263a4b' : P.panel);
    c.drawImage(assets[b.key], bx + 9, barY + 5, 20, 20);
    text(c, TOWERS[b.kind].name, bx + 19, barY + 27, selectedBuild === b.kind ? P.flame : P.muted, 5, 'center');
    text(c, `${TOWERS[b.kind].cost}`, bx + 19, barY + 38, sim.wood >= TOWERS[b.kind].cost ? P.good : P.crimsonHi, 5, 'center');
    buttons.push({ x: bx, y: barY + 4, w: 38, h: 32, id: `build:${b.kind}` });
  });
  const hint = selectedBuild
    ? `PLACING ${TOWERS[selectedBuild].name} — CLICK A FREE TILE · ${TOWERS[selectedBuild].cost} WOOD`
    : 'SELECT A TOWER, THEN CLICK THE MAP';
  text(c, hint, 191, barY + 20, P.muted, 6);
  text(c, 'START WAVE →', 400, barY + 20, P.flame, 7);

  // Right panel: threat + toggles
  rect(c, WORLD_W, WORLD_Y, CANVAS_W - WORLD_W, CANVAS_H - WORLD_Y, P.navy);
  rect(c, WORLD_W, WORLD_Y, 2, CANVAS_H - WORLD_Y, P.brass);
  text(c, 'ROUTE', 516, 36, P.muted, 6);
  text(c, `ENEMIES ${sim.enemies.length}`, 516, 46, P.text, 8);
  text(c, `IN QUEUE ${sim.spawnQueue}`, 516, 58, P.text, 8);
  const nBtn: Button = { x: 516, y: 269, w: 50, h: 17, id: 'night' };
  const gBtn: Button = { x: 571, y: 269, w: 49, h: 17, id: 'grid' };
  button(c, nBtn, night ? 'DAY' : 'NIGHT');
  button(c, gBtn, gridOn ? 'GRID ✓' : 'GRID');
  buttons.push(nBtn, gBtn);

  // Return diagnostics are the idle-loop contract: outcomes, not an opaque timer.
  if (returnReport) {
    rect(c, 142, 126, 356, 104, P.navy2);
    panel(c, 140, 124, 360, 108);
    text(c, 'RETURN REPORT', 320, 140, P.flame, 11, 'center');
    text(c, `${formatDuration(returnReport.seconds)} simulated · wave ${returnReport.waveFrom} → ${returnReport.waveTo}`, 320, 158, P.text, 7, 'center');
    const outcome = returnReport.leaks > 0
      ? `${returnReport.kills} crawlers stopped · ${returnReport.leaks} leak${returnReport.leaks === 1 ? '' : 's'} · Ember -${Math.round(returnReport.emberLost)}`
      : `${returnReport.kills} crawlers stopped · Watchfire held`;
    text(c, outcome, 320, 172, returnReport.leaks > 0 ? P.warn : P.good, 7, 'center');
    if (returnReport.capped) text(c, 'Catch-up capped at 15m for this prototype.', 320, 184, P.muted, 5, 'center');
    const continueButton: Button = { x: 268, y: 196, w: 104, h: 18, id: 'report:continue' };
    button(c, continueButton, 'CONTINUE');
    buttons.push(continueButton);
  } else if (sim.phase === 'won' || sim.phase === 'lost') {
    rect(c, 152, 140, 336, 80, P.navy2);
    panel(c, 150, 138, 340, 84);
    text(c, sim.phase === 'won' ? 'SETTLEMENT HOLDS' : 'THE EMBER FADES', 320, 158, P.flame, 12, 'center');
    text(c, sim.phase === 'won'
      ? `3 waves repelled · ${sim.kills} kills`
      : `Outer systems shut down · ${sim.leaks} leaks`, 320, 178, P.text, 7, 'center');
    const restartButton: Button = { x: 278, y: 194, w: 84, h: 18, id: 'restart' };
    button(c, restartButton, 'NEW RUN');
    buttons.push(restartButton);
  }
}

function draw(): void {
  rect(c, 0, 0, CANVAS_W, CANVAS_H, P.void);
  c.save();
  c.translate(WORLD_X, WORLD_Y);
  c.beginPath(); c.rect(0, 0, WORLD_W, WORLD_H); c.clip();
  drawBoard(c, BOARD);
  if (gridOn) drawGrid(c, WORLD_W, WORLD_H);
  // Watchfire at route end.
  const [wx, wy] = WATCHFIRE_CELL;
  c.drawImage(assets.watchfire, wx * T - 8, wy * T - 8, 48, 48);
  for (const t of sim.towers) drawTower(c, t);
  for (const e of sim.enemies) drawEnemy(c, e);
  drawProjectiles(c);

  // Placement ghost + range ring.
  if (selectedBuild && hover) {
    const ok = validBuildCell(hover.gx, hover.gy) && sim.wood >= TOWERS[selectedBuild].cost;
    if (selectedBuild && hover && hover.gx >= 0 && hover.gx + 2 <= COLS && hover.gy >= 0 && hover.gy + 2 <= ROWS) {
      rect(c, hover.gx * T, hover.gy * T, 32, 32, ok ? '#78ad7244' : '#e0575844');
      const img = selectedBuild === 'bolt' ? 'boltThrower' : selectedBuild === 'frost' ? 'frostCondenser' : 'bombard';
      c.globalAlpha = 0.6;
      c.drawImage(assets[img as AssetKey], hover.gx * T, hover.gy * T, 32, 32);
      c.globalAlpha = 1;
      const spec = TOWERS[selectedBuild];
      const cx = hover.gx * T + 16, cy = hover.gy * T + 16;
      c.strokeStyle = '#d7ba6855'; c.setLineDash([2, 2]); c.lineWidth = 1;
      c.beginPath(); c.arc(cx, cy, spec.range, 0, Math.PI * 2); c.stroke();
      c.setLineDash([]);
    }
  }
  applyLighting(c, night ? 'night' : 'day', { x: 0, y: 0, w: WORLD_W, h: WORLD_H }, [
    { x: wx * T - 24, y: wy * T - 20, w: 72, h: 60, color: '#ee7e3218' },
    { x: wx * T - 12, y: wy * T - 14, w: 48, h: 48, color: '#ffd27522' },
  ]);
  c.restore();

  drawUI();
  (window as unknown as Record<string, unknown>).mockReady = true;
}

// ---- Input -----------------------------------------------------------------
canvas.addEventListener('click', (e: MouseEvent) => {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * CANVAS_W / r.width;
  const y = (e.clientY - r.top) * CANVAS_H / r.height;
  const b = hitTest(buttons, x, y);
  if (b) {
    if (b.id === 'report:continue') { returnReport = null; saveRun(sim); return; }
    if (b.id === 'restart') { restartRun(); return; }
    if (b.id.startsWith('build:')) {
      const kind = b.id.slice(6) as TowerKind;
      selectedBuild = selectedBuild === kind ? null : kind;
      return;
    }
    if (b.id === 'night') { night = !night; return; }
    if (b.id === 'grid') { gridOn = !gridOn; return; }
  }
  if (sim.phase === 'won' || sim.phase === 'lost') return;
  // Map click: place selected tower, or start wave on the prompt.
  if (x >= 400 && x < 504 && y > WORLD_Y + WORLD_H) {
    if (sim.phase === 'build') { startWave(sim); saveRun(sim); }
    return;
  }
  if (selectedBuild && x < WORLD_W && y >= WORLD_Y && y < WORLD_Y + WORLD_H) {
    const { gx, gy } = toWorld(x, y);
    if (validBuildCell(gx, gy) && sim.wood >= TOWERS[selectedBuild].cost) {
      if (place(sim, selectedBuild, gx, gy)) { selectedBuild = null; saveRun(sim); }
    }
  }
});

canvas.addEventListener('mousemove', (e: MouseEvent) => {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * CANVAS_W / r.width;
  const y = (e.clientY - r.top) * CANVAS_H / r.height;
  hover = toWorld(x, y);
});

// ---- Loop ------------------------------------------------------------------
let last = performance.now();
let lastSave = last;
function loop(now: number): void {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  advance(sim, dt, projectiles, bursts);
  if (now - lastSave >= 1000) { saveRun(sim); lastSave = now; }
  draw();
  requestAnimationFrame(loop);
}

function restoreRun(): void {
  const loaded = loadRun(ROUTE);
  if (!loaded) return;
  sim = loaded.sim;
  // A sub-second load is a refresh, not a meaningful return. Avoid noise.
  if (loaded.elapsedSeconds >= 1 && sim.phase !== 'won' && sim.phase !== 'lost') {
    returnReport = advance(sim, loaded.elapsedSeconds);
  }
  saveRun(sim);
}

// Persist on lifecycle boundaries; a reload/reopen restores against elapsed wall time.
window.addEventListener('pagehide', () => saveRun(sim));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') saveRun(sim);
});

loadAssets().then(a => {
  assets = a;
  restoreRun();
  requestAnimationFrame(loop);
}).catch(err => {
  document.querySelector('.hint')!.textContent = `ASSET ERROR: ${String(err)}`;
});