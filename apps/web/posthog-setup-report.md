<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the portfolio site. Here is a summary of what was added:

- **`src/components/posthog.astro`** — New component that initialises PostHog via the web snippet using the `is:inline` directive (required to prevent Astro/TypeScript from processing `window.posthog`). Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables at build time.
- **`src/layouts/HomeLayout.astro`** — Imports and renders `<PostHog />` inside `<head>` so analytics initialises on every page.
- **`src/components/HomeTerminal.tsx`** — Added a `handleLinkClick` helper that fires `social_link_clicked` with `link_label` and `link_href` properties on every anchor click in the terminal footer. Also added a `Window` type declaration for `window.posthog` to keep TypeScript happy without an extra dependency.
- **`src/pages/index.astro`** — Added a `window.posthog?.capture('keyboard_shortcut_used', …)` call inside the existing `keydown` handler, capturing `shortcut_key`, `link_label`, and `link_href` properties whenever a visitor uses a numeric keyboard shortcut.
- **`apps/web/.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`; covered by `.gitignore`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `social_link_clicked` | Fired when a visitor clicks a social or contact link (GitHub, LinkedIn, Email, Credly) in the terminal footer. Properties: `link_label`, `link_href`. | `src/components/HomeTerminal.tsx` |
| `keyboard_shortcut_used` | Fired when a visitor uses a numeric keyboard shortcut (1–4) to open a link instead of clicking it. Properties: `shortcut_key`, `link_label`, `link_href`. | `src/pages/index.astro` |

## Next steps

We've built a dashboard and five insights to keep an eye on visitor engagement:

- 📊 [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/455807/dashboard/1673971)
- 📈 [Social link clicks over time](https://us.posthog.com/project/455807/insights/CNSjPsrU)
- 📊 [Social link clicks by destination](https://us.posthog.com/project/455807/insights/AqDbaq9z)
- 📈 [Keyboard shortcut usage over time](https://us.posthog.com/project/455807/insights/vtwvmQj9)
- 📈 [Link engagement: clicks vs keyboard shortcuts](https://us.posthog.com/project/455807/insights/2I8z6zTs)
- 📊 [Keyboard shortcut key used](https://us.posthog.com/project/455807/insights/MAE0I8wH)

### Agent skill

We've left an agent skill folder in your project at `.agents/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
