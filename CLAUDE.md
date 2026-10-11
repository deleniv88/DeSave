# DeSave

PWA for tracking all recurring household payments (rent, utilities, phone, car insurance, subscriptions) plus everyday spending. Target: Poland, UI in PL / UA / EN. Test phase with friends; later a paid subscription (~5 $/month).

## Stack
- Static site, no build step on Vercel. `index.html` holds the whole app (HTML + CSS + JS in one file).
- Data: `localStorage` key `co-miesiac-v4-c` (per device, no accounts yet).
- Analytics: PostHog EU (`CM_CONFIG.posthogKey` at the top of `index.html`). No autocapture, no session recording. Never send amounts, payment names, name or photo.
- `sw.js`: offline shell. Bump `VERSION` whenever shipped files change.
- `manifest.webmanifest`, `icons/` (brand mark: white "D" with a round coin hole on a blue→violet gradient).
- `privacy.html`: privacy page in PL / UA / EN.

## Product decisions
- Home = variant C: tabs "Subskrypcje / Wydatki". Hero changes with the tab:
  - Subscriptions: real total for the current month (no averaging) + paid/left bar, next month card, "Możesz zaoszczędzić".
  - Expenses: spent this month (paid recurring + expenses), daily average, top category.
- Before a subscription charge (≤7 days) the app asks "Korzystasz z tej subskrypcji?" → "Nie używam" marks it unused and adds to savings.
- Onboarding: language → 2 info screens → pick regular payments (chips) → amounts + dates → app with own data. "Najpierw pokaż przykład" loads sample data; after the first own payment the app offers to remove the sample.
- Partner / family, plans and data tools live in Profile; partner UI appears only after a partner is added.
- Splash: animated brand mark, no progress bars.
- Mobile rules: inputs ≥16px (no iOS zoom), no horizontal scroll, `overscroll-behavior:none`, body margin 0, status-bar scrim in standalone mode.

## Next stage (not done)
Supabase auth (Google + email magic link; Apple when native) with RLS per household, sync, shared list with partner, push reminders.

## Owner
Andrii Deleniv · deweb.studio
