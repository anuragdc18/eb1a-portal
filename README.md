# Extraordinary Profile OS

EB1A profile management portal frontend.

Monorepo: npm workspaces + Turborepo.

## Project Structure

```
.env                         Secrets (gitignored), loaded via Vite's loadEnv
packages/
  web/                       Unified server (API + web frontend via Vite)
    vite.config.ts           Vite 7 config — loads .env and registers plugins
    index.html               Frontend HTML entry
    vite/plugins/
      hono-dev-plugin.ts     Intercepts /api/* in dev, forwards to Hono via SSR
    src/
      api/
        index.ts             Hono routes (.basePath('api')) + AppType export
        database/
          index.ts           Supabase admin client
          schema.ts          Shared API data types placeholder
      web/
        main.tsx             App entry
        app.tsx              Root component + Wouter routing
        pages/               Page components
        components/          UI components
        hooks/
          use-desktop.ts     Desktop detection
        lib/
          api.ts             Typed API client (hono client)
          desktop.ts         Electron API types
          utils.ts           Shared utilities
        styles.css           Tailwind CSS entry
  mobile/                    Expo + React Native + expo-router
    app/                     File-based routing
    lib/
      api.ts                 Typed API client
  desktop/                   Electron shell (loads web app from server)
    electron/
      main.ts                Main process + IPC handlers
      preload.ts             contextBridge API
    vite.config.ts           Vite config
```

## Environment Variables

Secrets and credentials live in `.env` at the project root, which is gitignored. Vite's `loadEnv` loads them into `process.env` at dev/build time. In browser code, only `VITE_`-prefixed variables are exposed via `import.meta.env`.

Required Supabase variables:

```sh
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Desktop UI

The desktop app has no separate renderer by default. It loads the web app from `packages/web`; desktop-specific UI should live in `packages/web/src/web/` and be gated with `useDesktop()` / `window.electronAPI`. Keep `packages/desktop` for Electron window setup, menus/tray/shortcuts, IPC handlers, native OS APIs, and packaging. Only add a separate desktop renderer when the product intentionally needs a different desktop-only UI architecture.

## Development

```sh
npm install
npm run dev
npm run build:web
```

## Database

Supabase/Postgres manages the database schema. Keep the real keys in `.env`; do not commit them.

To create the portal tables:

1. Open Supabase dashboard.
2. Go to SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. From this project folder, run `node scripts/seed-supabase-auth.mjs` to create/reset the default Supabase Auth users.

The frontend reads portal records from Supabase tables such as `portal_clients`, `portal_tasks`, `portal_documents`, `portal_criteria`, and the service tracker tables. Each table stores records as `{ id, data }`, where `data` is JSON matching the portal UI shape.

Default seeded Supabase Auth accounts:

- `super@epros.com` / `demo1234`
- `admin@epros.com` / `demo1234`
- `admin2@epros.com` / `demo1234`
- `client@epros.com` / `demo1234`
- `team@epros.com` / `demo1234`
- `consultant@epros.com` / `demo1234`

For Vercel, set these environment variables on the project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
