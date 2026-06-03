# Email Worker Guidelines

## Scope

This package is a Cloudflare Worker that receives Resend Inbound webhooks and
forwards accepted email to a personal inbox.

- Entry point: `src/index.ts`
- Runtime schemas and local types: `src/types.ts`
- Cloudflare configuration: `wrangler.jsonc`
- Generated Worker types: `worker-configuration.d.ts`

## Documentation Checks

Cloudflare Workers and Resend APIs change over time. Before changing Worker
runtime behavior, Wrangler configuration, Resend webhook handling, or deployment
steps, check the current vendor docs:

- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Wrangler commands: https://developers.cloudflare.com/workers/wrangler/commands/
- Resend inbound webhooks: https://resend.com/docs/webhooks/emails/received

For Cloudflare limits and quotas, retrieve the current product limits page
instead of relying on memory.

## Commands

Run commands from the repository root.

| Command | Purpose |
| --- | --- |
| `pnpm --filter email dev` | Run the Worker locally with Wrangler. |
| `pnpm --filter email deploy` | Deploy the Worker to Cloudflare. |
| `pnpm --filter email cf-typegen` | Regenerate `worker-configuration.d.ts`. |
| `pnpm run check` | Run Biome checks and formatting for the workspace. |

Run `pnpm --filter email cf-typegen` after changing `wrangler.jsonc` bindings or
compatibility settings.

## Configuration

The Worker requires these bindings:

- `RESEND_API_KEY`
- `RESEND_WEBHOOK_SECRET`
- `FORWARD_FROM`
- `FORWARD_TO`

Keep secrets out of git. Use `apps/email/.dev.vars` for local development and
Cloudflare Worker secrets for production values.

## Implementation Notes

- Validate environment bindings and webhook payloads with Zod before using them.
- Verify Resend webhook signatures before parsing or forwarding the email.
- Keep the public route at `POST /api/webhook/inbound` unless the Resend webhook
  configuration is updated at the same time.
- Preserve attachment forwarding unless a change explicitly scopes it out.
- Return JSON responses for webhook outcomes and avoid logging message bodies or
  secrets.
- Use the local Wrangler dependency through pnpm scripts instead of global
  Wrangler commands.
