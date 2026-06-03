# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm workspace for a personal site and related services. Workspace packages live under `apps/*`.

- `apps/web`: Astro site with React components and Tailwind CSS. Pages are in `apps/web/src/pages`, reusable layouts are in `apps/web/src/layouts`, shared UI is in `apps/web/src/components`, global styles are in `apps/web/src/styles/global.css`, and static assets are in `apps/web/public`.
- `apps/email`: Cloudflare Worker email service. Source starts at `apps/email/src/index.ts`, shared types are in `apps/email/src/types.ts`, and deployment config is in `apps/email/wrangler.jsonc`.
- Root config includes `biome.json`, `lefthook.yml`, `pnpm-workspace.yaml`, and `package.json`.

## Build, Test, and Development Commands

Run commands from the repository root unless noted.

- `pnpm install`: install workspace dependencies.
- `pnpm run dev`: start the Astro web app locally through the `web` workspace.
- `pnpm run build`: build the web app for production.
- `pnpm run preview`: preview the production web build locally.
- `pnpm run check`: run Biome checks and apply formatting fixes.
- `pnpm --filter email dev`: run the Cloudflare Worker locally with Wrangler.
- `pnpm --filter email deploy`: deploy the email Worker.
- `pnpm --filter email cf-typegen`: regenerate Worker types after `wrangler.jsonc` binding changes.

## Coding Style & Naming Conventions

Use TypeScript, Astro, React, and CSS conventions already present in the repo. Biome enforces 2-space indentation, single quotes in JavaScript/TypeScript, double quotes in JSX attributes, trailing commas, and semicolons only when needed. Prefer descriptive component names in PascalCase, such as `HomeTerminal.tsx`, and keep page filenames lowercase where Astro routing expects them.

## Testing Guidelines

No dedicated test runner is currently configured. Before submitting changes, run `pnpm run check` and `pnpm run build`. For Worker changes, also run `pnpm --filter email dev` or the relevant Wrangler command to validate runtime behavior. Add focused tests when introducing a test framework or when behavior becomes complex enough to justify one.

## Commit & Pull Request Guidelines

Always use conventional commits, matching the existing history: `feat: update favicon`, `fix: open links on new tab`, `chore: format code`. Keep commit scopes optional but useful, for example `feat(web): add terminal prompt`.

Pull requests should include a short description, validation commands run, linked issues when applicable, and screenshots for visible web UI changes. Mention Cloudflare binding or deployment changes explicitly, and follow `apps/email/AGENTS.md` for Worker-specific documentation checks.
