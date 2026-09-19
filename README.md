# the-judge-ui

Small Next.js frontend for [the-judge](../the-judge) LLM evaluation runner.

## Stack

- Next.js (App Router) + React + TypeScript
- Zod (form + response validation)
- Tailwind CSS (theme tokens in `src/app/globals.css`)
- `next-themes` (system default, manual toggle, persisted)

## Prerequisites

1. Go API + worker running (see `../the-judge/README.md`)
2. Postgres + Redis up
3. LM Studio (or Gemini) available for real evaluations

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Browser calls go to `/backend/*`, rewritten to `JUDGE_API_URL` (default `http://localhost:8080`).

## Pages

| Route | Purpose |
|-------|---------|
| `/runs` | List evaluation runs |
| `/runs/new` | Create suite + case + run from a simple form |
| `/runs/[id]` | Inspect results (polls while pending/running) |

## Theme

CSS variables in `:root` / `.dark` control brand, page, surface, and status colors. Swap those tokens to match your design system later. Header theme control: click toggles light/dark; right-click resets to system.
