# Personal site

pnpm workspace for a personal site and related Cloudflare services.

## Projects

| Package | Path | Purpose |
| --- | --- | --- |
| `web` | `apps/web` | Astro static site deployed to Cloudflare Workers static assets. |
| `email` | `apps/email` | Cloudflare Worker that handles Resend inbound email webhooks. |

## Commands

All commands are run from the repository root.

| Command | Action |
| --- | --- |
| `pnpm install` | Install workspace dependencies. |
| `pnpm run dev` | Start the web dev server at `localhost:3000`. |
| `pnpm run build` | Build the web app for production. |
| `pnpm run preview` | Preview the production web build locally. |
| `pnpm run check` | Run Biome checks and apply formatting fixes. |
| `pnpm run check:ci` | Run Biome checks without writing changes. |
| `pnpm --filter web deploy` | Deploy the static web app to Cloudflare Workers. |
| `pnpm --filter email dev` | Run the email Worker locally with Wrangler. |
| `pnpm --filter email deploy` | Deploy the email Worker to Cloudflare Workers. |
| `pnpm --filter email cf-typegen` | Regenerate Worker types after binding changes. |

## Deployment

GitHub Actions deploys both Cloudflare Workers when changes land on `main`. A
merged pull request triggers the same workflow because it creates a push to
`main`.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Required GitHub repository variables:

- `PUBLIC_POSTHOG_PROJECT_TOKEN`
- `PUBLIC_POSTHOG_HOST`

The workflow installs pnpm with `pnpm/action-setup`, configures Node 24.13.0
with pnpm caching, runs `pnpm install --frozen-lockfile`, runs the read-only
workspace check, builds the web app, and deploys both Worker projects.
