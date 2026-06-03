# Web

Astro static site for the personal homepage. The production build writes static
assets to `apps/web/dist` and deploys them as Cloudflare Workers static assets.

## Commands

Run commands from the repository root.

| Command | Action |
| --- | --- |
| `pnpm --filter web dev` | Start the Astro dev server at `localhost:3000`. |
| `pnpm --filter web build` | Build the static site into `apps/web/dist`. |
| `pnpm --filter web preview` | Preview the built site locally with Astro. |
| `pnpm --filter web deploy` | Deploy `apps/web/dist` to Cloudflare Workers. |
| `pnpm run check` | Run Biome checks and apply formatting fixes for the workspace. |
| `pnpm run check:ci` | Run Biome checks without writing changes. |

## Deployment

Deployment is configured in `wrangler.jsonc`.

- `assets.directory` points to `./dist`, the Astro build output.
- `assets.not_found_handling` is `404-page`, which is appropriate for a static
  site with file-based routes.
- GitHub Actions deploys this package after running the read-only workspace
  check and web build on pushes to `main`.

The GitHub repository must define these secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
