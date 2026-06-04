# Repository Guidelines

## Scope

This file covers shared concerns for the pnpm workspace. Project-specific
instructions live alongside each package:

- `apps/web/AGENTS.md`: Astro site and static Cloudflare deployment.
- `apps/email/AGENTS.md`: inbound email Cloudflare Worker.

Workspace packages live under `apps/*`. Root tooling includes `biome.json`,
`lefthook.yml`, `pnpm-workspace.yaml`, and `scripts/link-skills.sh`.

## Shared Commands

Run commands from the repository root.

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install workspace dependencies. |
| `pnpm run dev` | Start the web development server. |
| `pnpm run build` | Build the web package for production. |
| `pnpm run preview` | Preview the production web build. |
| `pnpm run check` | Run Biome checks and apply fixes. |
| `pnpm run check:ci` | Run read-only Biome checks. |
| `./scripts/link-skills.sh` | Link shared skills and local agent guides for Claude. |

Use package-filtered commands documented in each project's `AGENTS.md` for
project-specific development and deployment.

## Shared Conventions

- Follow the existing TypeScript, Astro, React, CSS, and Cloudflare patterns.
- Biome enforces 2-space indentation, single quotes in JavaScript and
  TypeScript, double quotes in JSX attributes, trailing commas, and semicolons
  only when needed.
- Keep changes scoped to the package that owns the behavior. Update shared root
  configuration only when the change applies across the workspace.
- Do not commit secrets, generated build output, Wrangler state, or generated
  `CLAUDE.md` symlinks.

## Validation

Before submitting changes, run `pnpm run check:ci`. Run `pnpm run build` for web
or shared configuration changes, plus the package-specific validation described
in the relevant project guide.

No dedicated automated test runner is configured. Add focused tests if new
behavior becomes complex enough to justify introducing one.

## Commits and Pull Requests

Always use conventional commits, matching the existing history, such as
`feat(web): add terminal prompt`, `fix(email): validate webhook headers`, or
`chore: update workspace tooling`.

Pull requests should include a short description, validation commands run,
linked issues when applicable, and screenshots for visible web changes. Mention
Cloudflare binding or deployment changes explicitly.
