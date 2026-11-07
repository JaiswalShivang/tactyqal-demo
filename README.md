# Tactyqal Labs — The Builder's Ticket

A production-grade Next.js 15 (App Router, TypeScript strict) application for **Tactyqal Labs** (tactyqal.com) delivering:

1. A total homepage redesign following the "Builder's Ticket" creative thesis
2. A native blog backend + CMS with REST API, Prisma/PostgreSQL, and admin studio

---

## Setup

### Without a Database (default — zero config)

The app ships with an **in-memory data driver** pre-seeded with all 6 blog posts. No database configuration is required. Simply:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. The blog and admin studio work out of the box.

> **How it persists:** The memory driver lives on `globalThis` server-side so it survives Next.js HMR reloads. The admin UI also caches the latest post list in `localStorage` and re-syncs on every load — so edits you make in the admin appear immediately in the blog and homepage even on serverless platforms where server memory may reset between requests.

The `X-Data-Source: memory` response header (visible in the Admin API Inspector) confirms which driver is active.

---

### With PostgreSQL

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Set `DATABASE_URL` in `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/tactyqal"
   ```

3. Run migrations and seed:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. Start the app:
   ```bash
   npm run dev
   ```

The `X-Data-Source: prisma` header will now appear on API responses.

---

## Authentication

The mutating API endpoints (`POST`, `PUT`, `DELETE /api/posts`) are **open by default** so reviewers can test without configuration.

To protect them, set `ADMIN_TOKEN` in `.env.local`:
```
ADMIN_TOKEN="your-secret-token"
```

When set, mutating routes require:
```
Authorization: Bearer your-secret-token
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | No | — | PostgreSQL connection string. If unset, uses memory driver |
| `ADMIN_TOKEN` | No | — | Bearer token for mutating API routes. If unset, routes are open |
| `NEXT_PUBLIC_FOUNDER_VIDEO_URL` | No | — | YouTube nocookie embed URL for the Founder Masterclass video |

---

## API Reference

Base URL: `http://localhost:3000`

All responses follow the envelope: `{ data, error, meta }`

### GET /api/posts

List posts with optional filtering.

```bash
# All published posts
curl http://localhost:3000/api/posts

# Search + filter by category
curl "http://localhost:3000/api/posts?q=startup&category=Ideas&page=1&limit=10"

# Include drafts
curl "http://localhost:3000/api/posts?published=false"
```

**Query params:** `q`, `category`, `published` (true/false), `page`, `limit`

---

### POST /api/posts

Create a new post.

```bash
curl -X POST http://localhost:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "My First Post",
    "excerpt": "A short summary of this article.",
    "content": "## Introduction\n\nFull markdown content here.",
    "category": "Strategy",
    "tags": ["startup", "ideas"],
    "published": true
  }'
```

Returns `201` with the created post. Slug is auto-generated from title (deduplicated with `-2`, `-3`, etc.). `readTime` is computed from content word count at ~200 wpm.

---

### GET /api/posts/:id

Fetch a single post by ID or slug.

```bash
curl http://localhost:3000/api/posts/elevator-pitch-for-business-entrepreneurs
curl http://localhost:3000/api/posts/cmXXXXXXXXXX
```

Returns `404` with a clear message if not found.

---

### PUT /api/posts/:id

Partially update a post. Only provided fields are updated. Slug is regenerated only if `title` changes (unless `slug` is explicitly provided). `readTime` is recomputed if `content` changes.

```bash
curl -X PUT http://localhost:3000/api/posts/elevator-pitch-for-business-entrepreneurs \
  -H 'Content-Type: application/json' \
  -d '{ "published": false }'
```

---

### DELETE /api/posts/:id

Delete a post. Returns `200 { data: { id, deleted: true } }`.

```bash
curl -X DELETE http://localhost:3000/api/posts/my-post-slug
```

---

### GET /api/health

Check API status and active data driver.

```bash
curl http://localhost:3000/api/health
```

Response includes `{ status, dataSource, latency }`.

---

## Data Source Behaviour

| Scenario | Driver | Persistence |
|---|---|---|
| `DATABASE_URL` unset | Memory (globalThis) | Survives HMR, resets on cold start |
| `DATABASE_URL` set | Prisma + PostgreSQL | Full persistence |

The admin UI uses `localStorage` as a client-side mirror so the post list stays current across page loads regardless of which server driver is active.

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed the 6 blog posts
npm run db:studio    # Prisma Studio GUI
```

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import to Vercel
3. Add `DATABASE_URL` (Neon, Supabase, or Railway PostgreSQL) in environment variables
4. Set `ADMIN_TOKEN` and `NEXT_PUBLIC_FOUNDER_VIDEO_URL`
5. Deploy

### Railway

1. Create a PostgreSQL database in Railway
2. Create a new service from your GitHub repo
3. Set environment variables from Railway dashboard
4. Deploy

---

## Typography Notes

Display font: **Dangrek** (Google Fonts, loaded via `next/font`). The CSS also defines `@font-face` stubs for **Bontang** and **BDO Grotesk** — licensed typefaces that can be dropped into `/public/fonts/` as `.woff2` files and they activate automatically with no other configuration.

---

## Architecture Overview

```
app/
  page.tsx                 — Homepage (client shell, server-rendered sections)
  layout.tsx               — Root layout with fonts and metadata
  globals.css              — Design tokens, Tailwind layers, perforated edges
  opengraph-image.tsx      — OG image (Edge runtime)
  sitemap.ts               — Dynamic sitemap including blog slugs
  not-found.tsx            — 404 page

  api/
    health/route.ts        — Health check + data source ping
    posts/
      route.ts             — GET list, POST create
      [id]/route.ts        — GET one, PUT update, DELETE

  blog/
    page.tsx               — Blog index (server, passes to BlogListClient)
    BlogListClient.tsx     — Blog list with search + category filter (client)
    [slug]/
      page.tsx             — Post page with metadata + JSON-LD
      BlogPostClient.tsx   — Post reader with TOC, progress bar, related

  admin/blog/
    page.tsx               — Admin page shell
    AdminStudioClient.tsx  — Full CMS (client): posts table, editor, API Inspector

components/
  Header.tsx               — Sticky header + mobile "ticket menu"
  Footer.tsx               — Footer + giant wordmark hover fill
  TicketIntro.tsx          — 1.2s ticket print intro (session-once)
  CustomCursor.tsx         — Desktop cursor ring
  MarqueeTicker.tsx        — Opposing marquee tapes
  sections/
    HeroSection.tsx        — Asymmetric split hero + 3D ticket card
    StudentProjectsSection — FLIP-animated filterable bento grid
    BlueprintSection.tsx   — SVG path blueprint + expandable phases
    WhyParentsSection.tsx  — Asymmetric 7+1 bento + video modal
    FreeToolsSection.tsx   — 8 tool cartridges + scored quiz modal
    StudentVoicesSection   — Staggered rotated sticky-ticket quotes
    HomepageBlogSection    — Client-side blog preview (localStorage cache)
    PricingSection.tsx     — Pricing vault + contact
    FAQSection.tsx         — Accessible accordion

lib/
  types.ts                 — Shared TypeScript types
  blog-store.ts            — Resilient data layer (Prisma + memory drivers)
  memory-store.ts          — In-memory store on globalThis (HMR-safe)
  prisma.ts                — Prisma singleton (safe for dev HMR)
  tools-data.ts            — 8 tool definitions + 3-question quiz + scoring

prisma/
  schema.prisma            — Post model with indexes
  seed.ts                  — Seeds all 6 blog posts
```
