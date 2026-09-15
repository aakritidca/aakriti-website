# Aakriti Designs & Constructions — Website + Admin CMS

A premium construction/architecture company website with a secure internal
admin panel, built with Next.js 15, TypeScript, Tailwind CSS v4, Prisma, and
NextAuth. Deployable to Vercel with Postgres + Blob storage.

## Stack

- **Framework:** Next.js 15 (App Router, Server Components, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL via Prisma ORM (designed for Vercel Postgres)
- **Image storage:** Vercel Blob
- **Auth:** NextAuth v5 (Credentials provider, JWT sessions, role-based access)
- **Forms:** Server Actions + Zod validation

## Project structure

```
src/
  app/
    (public site)              → /, /projects, /projects/[slug], /services, /about, /contact
    admin/login                → public login page (outside auth check)
    admin/(dashboard)/         → all protected admin pages, wrapped in one layout
      page.tsx                 → dashboard home (KPIs, recent projects)
      projects/                → project list, new, edit, actions
      services/                → services CRUD
      company/                 → site-wide content editor (hero text, about, contact info)
      users/                   → user management (Super Admin / Admin only)
      settings/                → category management (Super Admin / Admin only)
    api/admin/upload/          → image upload endpoint (Vercel Blob)
    api/auth/[...nextauth]/    → NextAuth route handler
    sitemap.ts, robots.ts      → SEO
  components/
    ui/                        → design system primitives (Button, Badge, Field, etc.)
    public/                    → Navbar, Footer, ProjectCard, Gallery, Filters
    admin/                     → AdminSidebar, ImageUploader, ConfirmDialog
  lib/
    auth.ts                    → NextAuth config
    prisma.ts                  → Prisma client singleton
    data/                      → data access functions (projects, content)
  middleware.ts                → protects /admin/* and /api/admin/* server-side
prisma/
  schema.prisma                → database schema
  seed.ts                      → creates admin user, categories, services, sample projects
```

## 1. Local development setup

### Prerequisites
- Node.js 20+
- A PostgreSQL database (a free Neon or Supabase instance works fine for
  local dev if you don't want to install Postgres locally — or use Vercel
  Postgres itself)
- A Vercel account (for Blob storage — see step 3)

### Install dependencies

```bash
npm install
```

This automatically runs `prisma generate` via the `postinstall` script.

### Configure environment variables

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

You need, at minimum, to fill in:

- `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` — your Postgres connection strings
- `BLOB_READ_WRITE_TOKEN` — from a Vercel Blob store (see step 3 below; you can create
  one even before deploying, just for local development)
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev

### Run database migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables in your Postgres database.

### Seed the database

This creates your first admin login, the standard categories (Residential,
Commercial, etc.), the service list from your business card, and 6 sample
projects with placeholder photos so the site isn't empty:

```bash
npm run db:seed
```

By default this creates an admin user:
- **Email:** `admin@aakriti.example`
- **Password:** `ChangeMe123!`

To use your own credentials instead, set these before seeding:

```bash
SEED_ADMIN_EMAIL="you@aakriti.com" SEED_ADMIN_PASSWORD="a-real-password" npm run db:seed
```

**Change this password immediately after your first login**, either by adding
a new admin user via `/admin/users` and deleting the seed account, or by
updating it directly in the database.

### Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin/login` for the admin panel.

---

## 2. Deploying to Vercel

### Step A — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step B — Import the project into Vercel

1. Go to vercel.com/new and import your GitHub repo.
2. Framework preset should auto-detect as **Next.js** — leave defaults.
3. **Don't deploy yet** — first set up storage (next steps), then add env vars.

### Step C — Add Vercel Postgres

1. In your Vercel project, go to the **Storage** tab → **Create Database** → **Postgres**.
2. Once created, Vercel automatically adds `POSTGRES_PRISMA_URL` and
   `POSTGRES_URL_NON_POOLING` (and a few others) to your project's environment
   variables — you don't need to copy these manually.

### Step D — Add Vercel Blob

1. In the same **Storage** tab → **Create Database** → **Blob**.
2. This automatically adds `BLOB_READ_WRITE_TOKEN` to your environment variables.

### Step E — Add remaining environment variables

In **Project Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `AUTH_SECRET` | Output of `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` (update after you know your final domain) |
| `NEXT_PUBLIC_SITE_URL` | Same as above |

### Step F — Deploy

Trigger a deploy (push to `main`, or click **Deploy** in the Vercel dashboard).
The build runs `prisma generate && next build` automatically.

### Step G — Run migrations against production

After the first successful deploy, run migrations against your production database.
The easiest way is locally, pointed at the production database URL:

```bash
# Pull the real env vars Vercel generated
vercel env pull .env.production.local

# Run migrations using those production credentials
npx dotenv -e .env.production.local -- npx prisma migrate deploy
```

(If you don't have `vercel` CLI installed: `npm i -g vercel`, then `vercel login`
and `vercel link` first.)

### Step H — Seed production data

```bash
SEED_ADMIN_EMAIL="you@aakriti.com" SEED_ADMIN_PASSWORD="a-strong-password" \
  npx dotenv -e .env.production.local -- npx tsx prisma/seed.ts
```

### Step I — Log in and change your password

Visit `https://your-domain.vercel.app/admin/login`, sign in, then go to
**Users** and create your real account (or update the seed account's
credentials directly).

---

## 3. Managing content day-to-day

Once deployed, your team never needs to touch code:

- **Add a project:** `/admin/projects/new` — fill in details, drag-and-drop
  photos, choose a cover image, then **Save Draft** or **Publish**.
- **Edit/reorder photos:** open any project's edit page — drag thumbnails to
  reorder, click "Set as cover" on any image.
- **Unpublish a project:** from the projects list, use the row menu → Unpublish.
  It stays saved but disappears from the public site.
- **Update services, company info, contact details:** `/admin/services` and
  `/admin/company`.
- **Add categories:** `/admin/settings` (Super Admin / Admin only).
- **Add team members:** `/admin/users` (Super Admin / Admin only). Choose a
  role: Super Admin, Admin, or Editor (Editors can't manage users/settings).

---

## 4. Contact form

The contact form on `/contact` currently validates and logs submissions to
the server console. To actually receive emails, wire up an email provider —
the code is already structured for this in `src/app/contact/actions.ts`. A
common choice is Resend:

```bash
npm install resend
```

Then uncomment and complete the example in `submitContactForm()`, adding
`RESEND_API_KEY` and `CONTACT_FORM_RECIPIENT` to your environment variables.

---

## 5. Customization notes

- **Colors/fonts:** edit the design tokens in `src/app/globals.css` (the
  `:root` and `@theme inline` blocks). The palette is currently warm stone
  neutrals with a deep teal accent drawn from the Aakriti business card.
- **Homepage hero image / other stock photography:** several pages currently
  use Unsplash placeholder photography (`images.unsplash.com`). Replace these
  `src` URLs with your own uploaded project photos once real photography is
  available — or just add real projects via the admin panel, since the
  homepage automatically pulls featured projects from the database.
- **Categories:** seeded with Residential, Commercial, Industrial,
  Infrastructure, Renovation, Interior, Other — manage further via
  `/admin/settings`.

---

## 6. Known limitations / next steps

- The contact form stub logs to console rather than sending email — see
  section 4 above to wire up a real provider.
- Google Maps embed on the Contact page is optional and blank until you add
  a `mapEmbedUrl` in `/admin/company` (use Google Maps' "Embed a map" share option).
- Image optimization relies on Next.js's built-in `<Image>` component, which
  works automatically with Vercel Blob and Unsplash URLs already allow-listed
  in `next.config.ts`. If you add another image host, add its domain there too.
