# Emberwatch

**Emberwatch** is an idle tower-defense game: design a defense, leave it running, return to an explicit outcome report, and iterate. The playable core currently includes tactical placement, three combat waves, deterministic elapsed-time catch-up, and browser/local-account persistence.

## Stack

- **Laravel 13** — routing, auth, database migrations, account-backed snapshots, deployment foundation
- **Inertia.js + React** — page shell, navigation, account UI, and Canvas lifecycle
- **TypeScript + Canvas 2D** — deterministic simulation and all per-frame game rendering
- **Laravel Vite + Tailwind CSS** — frontend assets and styling
- **SQLite locally** — replace with a managed production database through Laravel environment configuration

React intentionally does **not** render terrain, enemies, projectiles, or combat as DOM elements. The boundary is:

```text
Inertia Play page → React lifecycle → mountGame(canvas) → deterministic Canvas runtime
```

That keeps framework/UI changes from contaminating simulation rules and fixed-step timing.

## Local development

### Prerequisites

- PHP 8.3+ with SQLite support
- Composer
- Node.js 22+ and npm

### First run

```bash
composer install
npm ci
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

Run the application in two terminals:

```bash
php artisan serve
npm run dev
```

Open `http://127.0.0.1:8000`. Anonymous play is stored in browser `localStorage`. Creating an account adds a per-user server snapshot so the settlement can be restored on another device.

### Mobile play

Emberwatch supports touch input in **landscape orientation**. On portrait touch devices, the game shows a rotation prompt instead of shrinking the 31-column board into unusable targets. Landscape Canvas interaction uses Pointer Events and disables browser pan/zoom gestures over the battlefield.

> Current account sync stores a convenience snapshot, not an anti-cheat authority. The deterministic runtime still executes in the browser. Server-authoritative progression needs a future rules/action API rather than trusting raw client state.

## Verification

```bash
php artisan test
npm run typecheck
npm test
npm run build
```

The PHP test suite covers the Inertia route and authenticated snapshot endpoint. The Vitest suite covers simulation invariants: tower footprints/costs and Watchfire leak accounting.

## Deployment

This repository is a normal Laravel application. The web root is:

```text
public/
```

The front controller is `public/index.php`; do **not** configure a static `dist/` directory or a hashed JavaScript file as the entry point.

A deploy must install PHP dependencies, build frontend assets, and migrate the database:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan migrate --force
```

Configure production environment variables through the host (at minimum `APP_KEY`, `APP_ENV=production`, `APP_URL`, database connection variables, and mail settings if verification/password reset is enabled). Laravel’s generated Vite manifest belongs in `public/build/` and is created during deployment, not committed.

## Structure

```text
app/Http/Controllers/RunSnapshotController.php  Account-snapshot HTTP boundary
app/Models/Run.php                              One persisted snapshot per user
database/migrations/                            User and run schema
resources/js/Pages/Play.jsx                     Inertia page and React Canvas host
resources/js/game/                              Framework-independent TypeScript runtime
public/game-assets/                             Pixel-art source sprites
resources/css/app.css                           Tailwind entry stylesheet
```

## Design material

- [`docs/art-direction.md`](docs/art-direction.md) — pixel-art industrial-fantasy visual contract
- [`docs/playtests/`](docs/playtests/) — recent automated-playtest captures
- [`sketches/`](sketches/) — visual explorations and sprite-resolution experiments
- [`references/idle-tower-defense-design-handout.md`](references/idle-tower-defense-design-handout.md) — consolidated design direction and open decisions
