# Portfolio CMS

A modern personal portfolio built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **MongoDB**.

It includes a public-facing portfolio site plus a protected admin dashboard for managing content, projects, skills, services, testimonials, blog posts, media, and site settings.

## What It Includes

- Public portfolio homepage
- About, skills, projects, services, testimonials, blogs, contact, and GitHub sections
- Search overlay for public content
- AI assistant UI for portfolio questions
- Analytics and Vercel insights
- Admin dashboard with protected access
- CRUD tools for content management
- Site settings and GitHub integration
- Contact form with database storage
- Media upload and library management

## Main Features

- Responsive portfolio UI
- Animated sections and modern layout
- Dynamic content from MongoDB
- Admin authentication with protected routes
- GitHub-driven content sync for selected data
- Public site data API with safe server-side access
- Contact form storage and notification flow
- SEO metadata and social sharing support

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MongoDB / Mongoose
- Zod
- Framer Motion
- Lucide icons
- Vercel Analytics and Speed Insights

## Project Structure

- `app/` - App Router pages, admin routes, and API routes
- `components/` - Shared UI, layout, site, and admin components
- `lib/` - Server utilities, content helpers, auth, GitHub sync, and data access
- `models/` - Mongoose models
- `src/data/siteData.json` - Seed/site content source
- `src/lib/` - Public site data helpers
- `types/` - Shared TypeScript types

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the `portfolio` folder and set the required values:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=your_database_name

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
ADMIN_SESSION_SECRET=some_long_random_secret

GITHUB_TOKEN=optional_github_token
GITHUB_OWNER=optional_repo_owner
GITHUB_REPO=optional_repo_name
GITHUB_BRANCH=main
GITHUB_CONTENT_PATH=src/data/siteData.json

NEXT_PUBLIC_SITE_URL=http://localhost:3000
VERCEL_DEPLOY_HOOK_URL=optional_deploy_hook_url


GEMINI_API_KEY=your_gemini_api_key
```

Notes:
- Keep secrets server-side only.
- Do not expose admin tokens or private GitHub credentials in client code.

### 3. Seed data, if needed

If the project includes a seed script in your workspace, you can run it to populate initial content.

```bash
npx tsx scripts/seed-admin.ts
```

## Run

### Development

```bash
npm run dev
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/admin/login`

### Production build

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Type checking

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

## Admin Dashboard

The admin area includes pages for:

- Profile
- Projects
- Skills
- Services
- Testimonials
- Text blocks
- Sections
- Settings
- Media
- Messages
- GitHub sync and stats

Admin access is protected by server-side session checks and admin API guards.

## Safety Notes

- Admin routes should remain protected.
- Keep GitHub tokens and other secrets out of client components.
- Public APIs should only return public-safe data.
- If you update content or auth flows, re-run `npm run build` to catch regressions early.

## Troubleshooting

- If build fails, check for leftover merge conflict markers like `<<<<<<< HEAD`.
- If MongoDB is unavailable, verify `MONGODB_URI` and network access.
- If GitHub sync fails, confirm token permissions and repository access.
- If admin login fails, verify `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.

## License

Private project. Add your own license if you plan to publish it.
