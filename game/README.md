# Emberwatch game

A browser-first idle tower-defense prototype.

## Stack

- **Vite** for local development and production static builds
- **React + TypeScript** for the application shell, responsive layout, and future management UI
- **Tailwind CSS** for interface styling
- **Canvas 2D** for the real-time battlefield only
- A pure TypeScript simulation/runtime (`src/game/`) for deterministic live and offline progression
- Browser `localStorage` for the current local run

React deliberately does **not** render the game frame-by-frame. `mountGame(canvas)` is the runtime seam: React supplies the canvas host and owns application UI; the runtime owns the simulation, input, rendering loop, assets, and persistence lifecycle.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Vite produces deployable static files in `dist/`. Deploy **that output directory** to Cloudflare Pages or Vercel. There is no server process, PHP runtime, database, or Node runtime at player request time.

## Current game slice

Build Bolt Throwers, Frost Condensers, and Bombards; start a three-wave defense; protect the Watchfire's Ember. Local runs persist between visits and report elapsed-time outcomes on return. Game balance and content remain prototype-grade.
