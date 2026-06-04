# Web Project Guidelines

## Scope and Structure

This package is an Astro static site with React components and Tailwind CSS,
deployed through Cloudflare Workers static assets.

- `src/pages`: Astro file-based routes.
- `src/layouts`: shared Astro page layouts and metadata.
- `src/components`: reusable React UI.
- `src/styles/global.css`: Tailwind imports, theme tokens, and global styles.
- `public`: static assets such as favicons and social preview images.
- `wrangler.jsonc`: Cloudflare static asset deployment configuration.

The production build writes to `dist`. Keep page filenames lowercase where
Astro routing expects them, and use PascalCase for React component files.

## Commands

Run commands from the repository root.

| Command | Purpose |
| --- | --- |
| `pnpm --filter web dev` | Start Astro at `localhost:3000`. |
| `pnpm --filter web build` | Build the static site into `apps/web/dist`. |
| `pnpm --filter web preview` | Preview the production build. |
| `pnpm --filter web deploy` | Deploy static assets to Cloudflare Workers. |
| `pnpm run check:ci` | Run read-only workspace Biome checks. |

## Implementation Conventions

- Prefer Astro for page structure, metadata, and static content. Use React where
  interactive or reusable component behavior benefits from it.
- Reuse the existing terminal UI components and theme tokens before adding new
  visual patterns.
- Preserve accessibility semantics, keyboard behavior, responsive layouts, SEO
  metadata, canonical URLs, and structured data when changing pages.
- Keep external links safe with `noopener,noreferrer` when opening new tabs.
- Keep `wrangler.jsonc` aligned with Astro's `dist` output and static 404
  handling.

## Validation

Before submitting changes, run `pnpm run check:ci` and
`pnpm --filter web build`. For visible UI changes, also inspect the affected
pages at desktop and mobile widths and include screenshots in the pull request.
