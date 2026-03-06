# Architecture Documentation

## Overview

Parish website for "Paroquia Nossa Senhora Aparecida" (Maringa, PR, Brazil). A full-stack Next.js application with authentication, event management calendar, and admin dashboard. Built celebrating the parish's 25th anniversary.

---

## Tech Stack

| Layer        | Technology                          | Version  |
|--------------|-------------------------------------|----------|
| Framework    | Next.js (App Router, Turbopack)     | 16.1.6   |
| UI Library   | React                               | 19.2.3   |
| Styling      | Tailwind CSS + shadcn/ui            | 4.x      |
| Auth         | Auth.js (next-auth v5 beta)         | 5.0.0-b  |
| Database     | SQLite via Prisma 7                 | 7.4.2    |
| DB Adapter   | @prisma/adapter-better-sqlite3      | 7.4.2    |
| State (UI)   | Zustand                             | 5.x      |
| Testing      | Vitest + React Testing Library      | 4.x      |
| CI/CD        | GitHub Actions + Vercel             | -        |
| Security     | gitleaks, Husky pre-commit hooks    | -        |

---

## Project Structure

```
paroquia-nossa-sra-de-aparecida/
├── .github/workflows/         # CI pipeline (lint, test, build, security)
├── .husky/                    # Git hooks (pre-commit: lint + test + gitleaks)
├── prisma/
│   └── schema.prisma          # Database schema (User, Event models)
├── prisma.config.ts           # Prisma v7 datasource config
├── public/images/             # Static assets (logo, etc.)
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── (auth)/            # Auth route group (centered layout)
│   │   │   ├── login/         # Login page
│   │   │   └── registro/      # Registration page
│   │   ├── admin/             # Admin dashboard (protected: admin role)
│   │   │   ├── eventos/       # Event management
│   │   │   └── usuarios/      # User management
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth handlers + registration
│   │   │   ├── eventos/       # Event CRUD endpoints
│   │   │   └── admin/users/   # Admin user management endpoint
│   │   ├── calendario/        # Calendar page (protected: logged in)
│   │   ├── layout.tsx         # Root layout (SessionProvider, fonts)
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── admin/             # Admin-specific components
│   │   ├── auth/              # Auth forms, SessionProvider
│   │   ├── calendario/        # Calendar grid, event form/detail
│   │   └── ui/                # shadcn/ui primitives
│   ├── lib/
│   │   ├── auth.config.ts     # Auth config (edge-safe, no Prisma)
│   │   ├── auth.ts            # Full auth config (with Prisma + bcrypt)
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Utility functions (cn)
│   ├── store/
│   │   └── useParishStore.ts  # Zustand store (mass schedule, mobile menu)
│   ├── types/
│   │   └── next-auth.d.ts     # Auth.js type augmentation
│   ├── middleware.ts           # Route protection (admin, calendario)
│   └── __tests__/             # Unit tests mirroring source structure
├── .env.example               # Environment variable template
├── .gitleaks.toml             # Secret scanning config
├── vercel.json                # Vercel deployment config
├── vitest.config.ts           # Test configuration
├── next.config.ts             # Next.js config (security headers)
└── package.json
```

---

## Architecture Layers

### 1. Presentation Layer

**Landing Page** — Server-rendered public page with sections:
- HeroSection (client) — Full-screen hero with CTA buttons
- MassScheduleSection (client) — Weekly mass schedule from Zustand store
- AboutSection (client) — Parish history and features
- EventsSection (server) — Upcoming events fetched from database
- ContactSection (client) — Contact info cards
- Header/Footer — Navigation, branding

**Calendar** (`/calendario`) — Protected, requires authentication:
- CalendarGrid — Monthly grid with event display
- EventForm — Create/edit event dialog
- EventDetail — View event with edit/delete (owner or admin)

**Admin Dashboard** (`/admin`) — Protected, requires admin role:
- AdminSidebar — Navigation (Dashboard, Users, Events)
- UserTable — CRUD for user roles and activation
- AdminEventList — Event management with delete

### 2. Authentication Layer

```
┌─────────────────────────────────────────────────┐
│                  Middleware                       │
│  (auth.config.ts — edge-safe, no Node.js deps)  │
│  Protects: /admin/* (admin), /calendario/* (auth)│
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│               Auth.js (next-auth v5)             │
│  auth.ts — Credentials provider + Prisma + bcrypt│
│  JWT strategy (no DB sessions)                   │
│  Callbacks: jwt (role, id) → session (role, id)  │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                  Prisma / SQLite                 │
│  User model: id, name, email, passwordHash,      │
│  role ("admin"|"user"), isActive                 │
└─────────────────────────────────────────────────┘
```

**Key design decision:** Auth config is split into two files:
- `auth.config.ts` — Edge-compatible (used by middleware). No Prisma/fs imports.
- `auth.ts` — Full config with Prisma adapter and bcrypt (server-side only).

### 3. Data Layer

**Database:** SQLite via Prisma 7 with `@prisma/adapter-better-sqlite3`.

**Models:**

```
User
├── id: String (cuid)
├── name: String
├── email: String (unique)
├── passwordHash: String
├── role: String ("admin" | "user")
├── isActive: Boolean
├── createdAt: DateTime
├── updatedAt: DateTime
└── events: Event[] (relation)

Event
├── id: String (cuid)
├── title: String
├── description: String
├── date: String (YYYY-MM-DD)
├── startTime: String? (HH:MM)
├── endTime: String? (HH:MM)
├── location: String?
├── createdBy: User (relation)
├── createdById: String
├── createdAt: DateTime
└── updatedAt: DateTime
```

**Prisma v7 specifics:**
- `prisma.config.ts` at project root defines datasource URL
- PrismaClient requires `adapter` parameter (not `datasourceUrl`)
- `prisma generate` and `prisma db push` must be run separately

### 4. API Layer

| Method | Route                     | Auth      | Purpose                         |
|--------|---------------------------|-----------|----------------------------------|
| GET    | /api/eventos              | Public    | List events (by month/year or upcoming) |
| POST   | /api/eventos              | User      | Create event (checks isActive)   |
| PUT    | /api/eventos/[id]         | Owner/Admin | Update event                   |
| DELETE | /api/eventos/[id]         | Owner/Admin | Delete event                   |
| POST   | /api/auth/register        | Public    | Register new user                |
| PATCH  | /api/admin/users/[id]     | Admin     | Update user role/status          |
| *      | /api/auth/[...nextauth]   | Public    | Auth.js handlers                 |

**Authorization model:**
- Events: owner can edit/delete their own; admin can edit/delete any
- Users: only admin can modify roles and activation status
- Registration: creates users with role="user", isActive=true

### 5. State Management

- **Server state:** Prisma queries in server components and API routes
- **Client state (Zustand):** UI-only concerns
  - `isMobileMenuOpen` / `toggleMobileMenu` / `closeMobileMenu`
  - `massSchedule` — Static weekly mass schedule data

---

## Security

### Application Security
- **Security headers** via `next.config.ts` and `vercel.json`:
  X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **Input validation** on registration API: email regex, type guards, length limits
- **Password hashing:** bcryptjs with salt rounds = 10
- **Route protection:** Middleware redirects unauthenticated/unauthorized users
- **Authorization checks** on every mutating API endpoint

### Development Security
- **Pre-commit hooks (Husky):** ESLint (0 warnings), Vitest (all tests pass), gitleaks (secret scan)
- **CI pipeline:** Same checks + build verification + gitleaks-action on PRs
- **.gitignore:** Covers .env*, *.db, *.pem, *.key, *.p12, *.pfx, *.crt

---

## Color Palette

| Name  | Hex     | Usage                    |
|-------|---------|--------------------------|
| Navy  | #1A3268 | Primary text, headings   |
| Royal | #2968A9 | Links, accents, badges   |
| Gold  | #C9A84C | Buttons, CTAs, highlights|
| Ice   | #EAF3FA | Section backgrounds      |

---

## Testing

- **Framework:** Vitest + React Testing Library + jsdom
- **Coverage threshold:** 80% (statements, branches, functions, lines)
- **Test location:** `src/__tests__/` mirroring source structure
- **Coverage excludes:** shadcn/ui components, layouts, pages, prisma.ts
- **Mocking strategy:**
  - Prisma is mocked for API route tests
  - next-auth/react mocked for component tests
  - next/navigation, next/image, next/link mocked in test setup
  - Dialog components mocked for portal-based components
