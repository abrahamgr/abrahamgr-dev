# Email Worker

Cloudflare Worker that receives Resend Inbound webhooks, verifies the webhook
signature, fetches the received email from Resend, and forwards it to a personal
inbox.

## How it works

1. Resend sends an `email.received` webhook to the Worker.
2. The Worker verifies the Svix webhook headers with `RESEND_WEBHOOK_SECRET`.
3. The Worker fetches the full email and any attachments from Resend.
4. The Worker sends the message to `FORWARD_TO` from `FORWARD_FROM`.

The webhook route is:

- `POST /api/webhook/inbound`

Configure that URL in Resend as a webhook endpoint for the `email.received`
event.

## Configuration

The Worker expects these environment bindings:

| Binding | Description |
| --- | --- |
| `RESEND_API_KEY` | Resend API key used to fetch inbound emails and send forwarded messages. |
| `RESEND_WEBHOOK_SECRET` | Resend webhook signing secret used to verify inbound webhook requests. |
| `FORWARD_FROM` | Sender address for forwarded emails. Must be allowed by the verified Resend sending domain. |
| `FORWARD_TO` | Personal inbox that receives forwarded emails. |

For local development, put non-committed values in `apps/email/.dev.vars`.

For production, store sensitive values as Cloudflare Worker secrets:

```sh
pnpm --filter email wrangler secret put RESEND_API_KEY
pnpm --filter email wrangler secret put RESEND_WEBHOOK_SECRET
```

`FORWARD_FROM` and `FORWARD_TO` can be managed as dashboard variables if you do
not want email addresses in source control. `wrangler.jsonc` sets
`keep_vars: true` so `pnpm --filter email deploy` does not remove
dashboard-managed variables during deploy.

## Commands

Run commands from the repository root.

| Command | Action |
| --- | --- |
| `pnpm --filter email dev` | Start the Worker locally with Wrangler. |
| `pnpm --filter email deploy` | Deploy the Worker to Cloudflare. |
| `pnpm --filter email cf-typegen` | Regenerate `worker-configuration.d.ts` after binding or Wrangler config changes. |
| `pnpm run check` | Run Biome checks and apply formatting fixes for the workspace. |
| `pnpm run check:ci` | Run Biome checks without writing changes. |

## Deployment

GitHub Actions deploys this Worker after the read-only workspace check passes on
pushes to `main`. A merged pull request triggers deployment through the
resulting push to `main`.

The GitHub repository must define these secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Development notes

- Source code starts in `src/index.ts`.
- Runtime schemas and shared types live in `src/types.ts`.
- Worker configuration lives in `wrangler.jsonc`.
- The Worker intentionally ignores webhook event types other than
  `email.received`.
- Run `pnpm --filter email cf-typegen` after editing `wrangler.jsonc` bindings
  so the generated `Env` type stays current.
