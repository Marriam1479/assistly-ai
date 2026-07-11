# WorkWise AI — Productivity Suite

An AI-powered workplace productivity assistant that automates everyday tasks: draft professional emails, summarize meeting notes, and build prioritized task plans — all in one clean, minimalist app.

## Features

- **Dashboard** — welcome overview with productivity stats, weekly activity chart, quick actions, and recent generations.
- **Email Writer** — draft professional emails in seconds.
- **Meeting Notes** — turn transcripts into clear summaries and action items.
- **Task Planner** — build prioritized, structured project plans.
- **Health Planner** — a weekly health task planner with 5 core pillars (Hydration, Movement, Nutrition, Sleep, Mental Health), a daily checklist with saved progress, weekly goals, and expert tips.
- **History & Saved** — browse, favorite, and reuse past generations (persisted locally).

## Tech Stack

- **TanStack Start v1** — full-stack React 19 framework (SSR/SSG + server functions)
- **Vite 7** — build tooling
- **Tailwind CSS v4** — styling via `src/styles.css` design tokens
- **shadcn/ui** — accessible component primitives
- **Recharts** — data visualization
- **Lovable AI Gateway** — AI generation

## Getting Started

```bash
# install dependencies
bun install

# start the dev server
bun run dev
```

The app runs at `http://localhost:8080`.

## Project Structure

```text
src/
  routes/         # file-based routes (pages + API endpoints)
  components/     # reusable UI and app components
  lib/            # store, AI functions, utilities
  styles.css      # Tailwind v4 theme + design tokens
```

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run build` | Build for production |

## License

This project was built with [Lovable](https://lovable.dev).