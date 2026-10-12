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
- Recurring payments have a type: `p.type` "bill" (rent, loans, utilities, phone, insurance) or "sub" (streaming, cloud, gym); default from category (rozrywka/chmura/zdrowie = sub). Tab is "Stałe opłaty", grouped "Rachunki i kredyty" / "Subskrypcje". "Korzystasz?" question, "Nie używam" and savings apply to subscriptions only. Analysis shows bills vs subscriptions and fixed vs variable splits.
- Partner / family, plans and data tools live in Profile; partner UI appears only after a partner is added.
- Analysis tab: Expenses / Subscriptions × Month / Year; 12-month bars, deltas vs previous month and a year ago (current month compares the same days), category donut with change chips; subscriptions show price increases from `p.hist` (`{to, a}` = old amount valid before `to`), share of spending, top in year scale.
- Custom expense categories in `S.customCats` (`{id:"c_…", name, color}`); notes in `note` on expenses and payments.
- Splash: animated brand mark, no progress bars.
- Mobile rules: inputs ≥16px (no iOS zoom), no horizontal scroll, `overscroll-behavior:none`, body margin 0, status-bar scrim in standalone mode.

## Next stage (not done)
Supabase auth (Google + email magic link; Apple when native) with RLS per household, sync, shared list with partner, push reminders.

## Owner
Andrii Deleniv · deweb.studio
