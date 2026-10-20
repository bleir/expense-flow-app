# Expense Flow

A personal ledger for income and expenses: an account, categories with a monthly budget, transactions, and a summary of the last 30 days.

## Demo

https://expense-flow-app-frontend.vercel.app/

![Expense Flow dashboard welcome screen](docs/dashboard.png)

The demo API is at https://expense-flow-app-backend.vercel.app. The Vercel frontend is a Next.js app. A separate [Deploy to GitHub Pages](.github/workflows/deploy-github-pages.yml) workflow builds a static export of the same frontend.

## Problem

A spreadsheet is flexible and unstructured: income and expenses get mixed up, categories disappear, and the month's remaining balance is hard to see. A bank app shows one account and does not split spending into your own categories.

Expense Flow is a small ledger for one account. You record income or an expense (amount, date, category, description, note), group them into colored categories with an optional monthly budget, and see the balance plus a 30-day chart on the dashboard. Without an account the app shows only the welcome screen. Each user's data stays separate.

## Architecture

A pnpm and Turborepo monorepo: `frontend` (Next.js 16, React 19) and `backend` (NestJS 11).

```mermaid
flowchart LR
  browser["Browser"] --> next["Next.js"]
  next -->|"Axios, Bearer JWT"| nest["NestJS"]
  nest -->|"TypeORM"| pg["Postgres"]
```

Routes: `/` redirects to `/dashboard`, then `/transactions`, `/categories`, and `/settings`. Server state lives in TanStack Query. Forms use React Hook Form and Zod. The UI is Tailwind CSS and shadcn/ui.

| Resource | Access | Role |
| --- | --- | --- |
| `POST /auth/signup`, `POST /auth/signin` | public | account and token |
| `GET /` | public | plain response that the API is up |
| `GET /users/me`, `PATCH /users/me` | JWT | profile and theme |
| `/categories` | JWT | category and budget CRUD |
| `/transactions` | JWT | transaction CRUD; `GET` accepts `limit` |
| `/currencies` | JWT | per-user currency CRUD |

Model: `User`, `Category`, `Transaction`, `Currency`. A category, transaction, and currency each have `user_id`. Deleting a user cascades to their rows. Deleting a category that still has transactions is blocked (`ON DELETE RESTRICT`). A transaction points at a category owned by the same user. A currency code is unique within an account.

## Key technical decisions

**Amounts are `decimal(12,2)` and strings in the API.** Postgres stores the exact value, and JSON does not turn it into a float on the way through. The UI formats the string with `toLocaleString`.

**The whole API sits behind JWT.** `JwtAuthGuard` is a global guard. `@Public()` covers only sign-up, sign-in, and `GET /`. Passwords are bcrypt hashes. The token lasts 7 days and lives in `localStorage`. Every data query filters on `user.id`, so an id in the URL is not enough to read someone else's row.

**React Query keys include `userId`.** After switching accounts, the previous user's cache does not come back on screen. Theme is the `users.theme` column and is saved with `PATCH /users/me`, using an optimistic update. The default currency (the symbol next to amounts) is a browser choice in `localStorage`, stored separately per `userId`. The app does not convert exchange rates.

**The schema comes from the entities.** TypeORM starts with `synchronize: true`, so a local database and the demo follow the code without migration files. That is a deliberate shortcut for the MVP: schema history is not versioned.

**The same NestJS process runs locally and on Vercel.** `backend/src/main.ts` exports an HTTP handler. Outside Vercel it listens on port 3001. The Vercel frontend is a normal Next.js build. With `GITHUB_PAGES=true`, Next builds a static export with `basePath` `/expense-flow-app`.

**Neon connects through `DATABASE_URL`.** The `channel_binding` parameter is removed before the URL reaches the `pg` driver, which does not accept it. SSL is off only for `localhost`.

**The chart uses a fixed 30-day window.** The window ends today. When that range has no transactions, the end moves to the date of the latest transaction, so older data still draws a line.

**DTOs validate API input.** The global `ValidationPipe` uses `whitelist`, `forbidNonWhitelisted`, and `transform`. A category color must be a `#rrggbb` hex value. A password must be at least 8 characters.

## Tests

From the repo root:

```bash
pnpm test
```

Turborepo runs the tests in both packages.

Backend (Jest, files `backend/src/**/*.spec.ts`):

```bash
pnpm --filter backend test
```

`AuthService` covers three behaviors: the profile comes back without the password, a missing user throws `NotFoundException`, and a theme change is saved for the current `userId`. The other controller and service specs check that the module compiles.

The e2e test (`backend/test/app.e2e-spec.ts`) boots the full `AppModule` and calls `GET /`. It needs a running Postgres and `JWT_SECRET`:

```bash
pnpm --filter backend test:e2e
```

Frontend (Vitest and Testing Library):

```bash
pnpm --filter frontend test
```

`Header` and `Menu` cover guest navigation, the sign-in dialog, and the menu after a stored session. `ThemeToggle` checks that the switch reads the account theme and sends the change to the API.

## Running locally

Node.js 22.12 or newer and pnpm 10.30.3 (`packageManager` at the repo root). Postgres locally, or a Neon database.

```bash
pnpm install
```

`backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/expense_flow
JWT_SECRET=change-me
```

`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, and `DATABASE_NAME` can replace `DATABASE_URL`. On startup TypeORM creates the tables from the entities.

`frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Without that variable, development still targets `http://localhost:3001`, and production targets the Vercel API.

```bash
pnpm dev
```

Frontend: http://localhost:3000. Backend: http://localhost:3001. Separately: `pnpm dev:frontend` and `pnpm dev:backend`.

Create an account from the UI (Sign up). Then add a category, a transaction, and open the dashboard.
