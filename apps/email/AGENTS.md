# Email Worker Guidelines

## Scope and Structure

This package is a Cloudflare Worker that receives Resend inbound webhooks,
verifies them, fetches the received message and attachments, and forwards the
email to a personal inbox.

- `src/index.ts`: request routing, webhook verification, and forwarding.
- `src/types.ts`: Zod schemas and shared runtime types.
- `wrangler.jsonc`: Cloudflare Worker configuration.
- `worker-configuration.d.ts`: generated Worker types; do not edit manually.

The public endpoint is `POST /api/webhook/inbound`. Keep it stable unless the
Resend webhook configuration is updated at the same time.

## Commands

Run commands from the repository root.

| Command | Purpose |
| --- | --- |
| `pnpm --filter email dev` | Run the Worker locally with Wrangler. |
| `pnpm --filter email deploy` | Deploy the Worker to Cloudflare. |
| `pnpm --filter email cf-typegen` | Regenerate Worker types. |
| `pnpm run check:ci` | Run read-only workspace Biome checks. |

Run `pnpm --filter email cf-typegen` after changing Wrangler bindings or
compatibility settings.

## Configuration and Security

The Worker requires `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `FORWARD_FROM`,
and `FORWARD_TO`. Validate bindings with the existing Zod schema before use.

Keep secrets out of git. Use `.dev.vars` for local development and Cloudflare
Worker secrets for production. Preserve `keep_vars: true` unless deployment
variable management is intentionally changed.

- Verify Resend webhook signatures before parsing or forwarding messages.
- Preserve attachment forwarding unless a change explicitly scopes it out.
- Return JSON responses for webhook outcomes.
- Do not log email bodies, attachment contents, credentials, or secrets.
- Use the local Wrangler dependency through pnpm scripts.

## Documentation and Validation

Cloudflare Workers, Wrangler, and Resend APIs change over time. Check current
vendor documentation before changing runtime behavior, Wrangler configuration,
webhook handling, deployment steps, limits, or quotas:

- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Wrangler: https://developers.cloudflare.com/workers/wrangler/commands/
- Resend inbound webhooks: https://resend.com/docs/webhooks/emails/received

Before submitting changes, run `pnpm run check:ci` and validate the Worker with
`pnpm --filter email dev` or the relevant Wrangler command.
