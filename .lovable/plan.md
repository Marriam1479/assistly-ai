# Weekly Health Task Planner

Add a new page to the app that turns this plan into a polished, summarized, interactive planner — matching the existing SaaS design system (rounded cards, soft gradients, sidebar nav).

## What gets built

A new route `/health-planner` with:

1. **Header** — title + one-line intro summarizing the planner's purpose.
2. **Core Health Pillars** — 5 rounded cards (Hydration, Movement, Nutrition, Sleep, Mental Health), each with an icon and a short verb-first daily habit (e.g. "Drink 2L water", "Walk 10k steps", "Sleep 7 hours").
3. **Daily Checklist** — a checkable list of the day's habits with progress saved to `localStorage` (reuses the existing store pattern) so progress persists.
4. **Weekly Goal + Reflection** — a compact card for the week's focus and a short reflection note.
5. **Expert Insight / Pro-Tip** — a rotating science-backed tip card.

Content is condensed per the plan's own rules: max 5 pillars, task text under 10 words, verb-first, minimalist whitespace-heavy layout.

## Navigation

Add a "Health Planner" item to the sidebar (`src/components/app/app-sidebar.tsx`) under the Workspace group with a suitable Lucide icon (e.g. `HeartPulse`).

## Technical details

- New file `src/routes/health-planner.tsx` using `createFileRoute`, with `head()` setting a unique title + meta description.
- Checklist state persisted via a small `localStorage` key (following the existing `src/lib/store.tsx` conventions) so daily check-offs survive reloads.
- Pure frontend/presentation — no backend, no AI calls, no new dependencies.
- Uses existing shadcn components (`Card`, `Checkbox`, `Badge`, `Progress`) and semantic design tokens; no hardcoded colors.

## Out of scope

No new AI generation, database, or auth. This is a static/curated planner page, not a generator.