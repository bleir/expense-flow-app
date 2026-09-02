# Expense Flow

Expense Flow is an **MVP in active development**. The app is not finished and the feature set will change as the project evolves.

This repository is a pnpm monorepo with a Next.js frontend, a NestJS API, and Turborepo for running tasks across both apps.

## Structure

- `frontend` — Next.js app
- `backend` — NestJS API

## Getting started

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts both apps in parallel via Turborepo.

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

Run them separately:

```bash
pnpm dev:frontend
pnpm dev:backend
```

## GitHub Pages

The **frontend** is deployed to GitHub Pages as a static site:

**https://bleir.github.io/expense-flow-app/**

GitHub Pages cannot host the NestJS API. Point the frontend at a deployed backend with a repository secret:

1. Repo **Settings → Secrets and variables → Actions**
2. Add `NEXT_PUBLIC_API_URL` (e.g. `https://your-api.example.com`)
3. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**

The workflow in `.github/workflows/deploy-github-pages.yml` publishes on every push to `master`.
