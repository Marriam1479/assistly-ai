# WorkWise AI — Productivity Suite

## Project Overview

WorkWise AI is an AI-powered workplace productivity assistant that automates
everyday tasks in one clean, minimalist app. It helps users draft professional
emails, summarize meeting notes, and build prioritized task plans, plus a
weekly Health Planner for tracking healthy habits. Generated content and
progress are saved so users can review, favorite, and reuse their work.

## Features Implemented

- **Dashboard** — welcome overview with productivity stats, a weekly activity
  chart, quick actions, and a list of recent generations.
- **Email Writer** — draft professional emails in seconds.
- **Meeting Notes** — turn transcripts into clear summaries and action items.
- **Task Planner** — build prioritized, structured project plans.
- **Health Planner** — a weekly health planner with 5 core pillars (Hydration,
  Movement, Nutrition, Sleep, Mental Health), a daily checklist with progress
  saved locally, weekly goals and reflection, and rotating expert tips.
- **History & Saved** — browse, favorite, and reuse past generations, persisted
  in the browser.
- **Responsive UI** — sidebar navigation, dark-mode-ready design tokens, and a
  polished SaaS-style layout.

## Technologies & Tools Used

- **TanStack Start v1** — full-stack React 19 framework (SSR/SSG + server functions)
- **React 19** — UI library
- **Vite 7** — build tooling and dev server
- **TypeScript** — type-safe development
- **Tailwind CSS v4** — styling via `src/styles.css` design tokens
- **shadcn/ui** — accessible component primitives
- **Lucide React** — icon set
- **Recharts** — data visualization / charts
- **Lovable AI Gateway** — AI text generation (Google Gemini / OpenAI models)
- **Bun** — package manager and script runner

## Setup Instructions

```bash
# 1. Install dependencies
bun install

# 2. Start the development server
bun run dev
```

The app runs at `http://localhost:8080`.

To create a production build:

```bash
bun run build
```

### Project Structure

```text
src/
  routes/         # file-based routes (pages + API endpoints)
  components/     # reusable UI and app components
  lib/            # store, AI functions, utilities
  styles.css      # Tailwind v4 theme + design tokens
```

---

Built with [Lovable](https://lovable.dev).