# Deployment Guide

## Environments

| Environment | Branch    | URL                                        | Purpose                      |
|-------------|-----------|---------------------------------------------|------------------------------|
| Development | feature/* | http://localhost:3000                        | Local development            |
| Staging     | staging   | https://paroquia-nsa-staging.vercel.app     | Pre-production validation    |
| Production  | main      | https://paroquia-nsa.vercel.app             | Live site                    |

> The staging and production URLs above are examples. Actual URLs are assigned by Vercel when the project is created.

---

## Branching Strategy

```
feature/my-feature ──PR──> staging ──PR──> main
                            │                │
                            ▼                ▼
                      Vercel Staging    Vercel Production
```

1. **Feature branches** — Create from `staging`, develop locally
2. **Pull Request to `staging`** — CI runs (lint, test, build). On merge, Vercel deploys to staging environment
3. **Pull Request from `staging` to `main`** — After QA on staging, merge triggers production deployment

---

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

Triggers on every push/PR to `main` and `staging`:

| Job       | What it does                                    |
|-----------|-------------------------------------------------|
| Lint      | Runs ESLint across the codebase                 |
| Test      | Runs Vitest with coverage (80% threshold)       |
| Build     | Runs `prisma generate` + `next build`           |

All jobs must pass before a PR can be merged.

### Vercel Auto-Deploy

Vercel is connected to the GitHub repository and auto-deploys:
- **`staging` branch** → Staging deployment (Preview environment)
- **`main` branch** → Production deployment

No manual deployment steps needed — merging the PR triggers deployment.

---

## Initial Setup

### 1. Vercel Project Setup

1. Go to [vercel.com](https://vercel.com) and import the GitHub repository
2. Vercel auto-detects Next.js — accept the defaults
3. **Set the Production Branch** to `main` (default)

### 2. Configure Environment Variables

In the Vercel dashboard, go to **Settings > Environment Variables** and add:

| Variable       | Staging                            | Production                       |
|----------------|------------------------------------|----------------------------------|
| `DATABASE_URL` | Your staging DB connection string  | Your production DB connection string |
| `AUTH_SECRET`  | Generate with `npx auth secret`    | Generate with `npx auth secret` (different from staging!) |
| `AUTH_URL`     | `https://your-staging-url.vercel.app` | `https://your-production-url.vercel.app` |
| `NODE_ENV`     | `production`                       | `production`                     |

**Important:**
- Each environment must have its **own** `AUTH_SECRET` (never share between staging and prod)
- Set variables scoped to the correct Vercel environment:
  - Staging values → **Preview** environment
  - Production values → **Production** environment

### 3. Database Setup for Production

SQLite works great for development but has limitations for production on serverless platforms (Vercel). For production, consider:

**Option A: Keep SQLite (small scale / low traffic)**
- Use a persistent volume or an SQLite hosting service like Turso
- Change `DATABASE_URL` to the remote connection string

**Option B: Migrate to PostgreSQL (recommended for scale)**
1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
2. Update `prisma.config.ts` with the PostgreSQL connection URL
3. Replace `@prisma/adapter-better-sqlite3` with `@prisma/adapter-pg` or use Prisma's native driver
4. Update `src/lib/prisma.ts` accordingly
5. Run `npx prisma db push` against the new database

Recommended PostgreSQL providers:
- **Vercel Postgres** (tight Vercel integration)
- **Neon** (serverless Postgres, generous free tier)
- **Supabase** (Postgres + extras)

### 4. Seed the Admin User

After the database is set up, create the initial admin user:

```bash
# Connect to your database and run:
npx prisma db seed
```

Or create a seed script in `prisma/seed.ts`:

```ts
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("change-me-immediately", 10);
  await prisma.user.upsert({
    where: { email: "admin@paroquia.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@paroquia.com",
      passwordHash,
      role: "admin",
      isActive: true,
    },
  });
}

main();
```

**Change the admin password immediately after first login.**

---

## Deployment Workflow

### Deploying a New Feature

```bash
# 1. Create feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/my-feature

# 2. Develop and commit
git add src/components/MyFeature.tsx
git commit -m "feat: add my feature"
# Pre-commit hooks run: ESLint, Vitest

# 3. Push and create PR to staging
git push -u origin feature/my-feature
gh pr create --base staging --title "feat: add my feature"
# CI runs on the PR

# 4. After PR review and CI passes, merge to staging
gh pr merge --squash
# Vercel auto-deploys to staging

# 5. Validate on staging environment
# Test the feature on https://your-staging-url.vercel.app

# 6. Create PR from staging to main
gh pr create --base main --head staging --title "release: deploy to production"
# CI runs again

# 7. After final review, merge to main
gh pr merge --merge
# Vercel auto-deploys to production
```

### Hotfix (skip staging)

For urgent production fixes:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Fix and commit
git commit -m "fix: critical bug description"

# PR directly to main
gh pr create --base main --title "hotfix: critical fix"
# After CI passes and review, merge to main

# Back-merge to staging
git checkout staging
git merge main
git push origin staging
```

---

## Environment Variables Reference

| Variable       | Required | Description                              |
|----------------|----------|------------------------------------------|
| `DATABASE_URL` | Yes      | Database connection string               |
| `AUTH_SECRET`   | Yes      | Random secret for Auth.js JWT signing    |
| `AUTH_URL`      | Yes*     | Full URL of the app (Vercel auto-sets)   |
| `NODE_ENV`      | No       | Set automatically by Vercel              |

*`AUTH_URL` is auto-detected by Vercel in most cases, but set it explicitly if using a custom domain.

Generate a new `AUTH_SECRET`:
```bash
npx auth secret
```

---

## Monitoring & Rollback

### Vercel Dashboard
- **Deployments tab** — View deployment history, logs, and status
- **Analytics tab** — Web Vitals performance metrics
- **Logs tab** — Runtime logs for debugging

### Rollback
If a production deployment has issues:
1. Go to Vercel Dashboard > **Deployments**
2. Find the last working deployment
3. Click **"..." > Promote to Production**

This instantly reverts production to the previous build without needing a git revert.

---

## Pre-commit Checks

Every commit locally runs these checks via Husky:

1. **lint-staged** — ESLint with `--max-warnings=0` on staged `.ts`/`.tsx` files
2. **vitest run** — Full test suite (150+ tests, 80% coverage threshold)

If any check fails, the commit is blocked. Fix the issue and commit again.

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server (Turbopack)
npm run build            # Production build
npm run lint             # Run ESLint

# Testing
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Database
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema to database
npx prisma studio        # Open Prisma Studio (DB browser)
```
