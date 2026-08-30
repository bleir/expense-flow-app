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
