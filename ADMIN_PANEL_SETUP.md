# Portfolio Admin Panel (Next.js + TypeScript + Tailwind + MongoDB)

## Stack Choice
Chosen backend: **Next.js API + MongoDB**.

Why this is best here:
- Simple deployment with your existing Next.js app.
- No vendor lock-in.
- Scales from portfolio to small product quickly.
- Easy to secure with cookie-based auth + server route guards.

---

## Folder Structure

- `app/admin/(auth)/login/page.tsx` – admin login
- `app/admin/(dashboard)/layout.tsx` – protected layout (sidebar + logout)
- `app/admin/(dashboard)/page.tsx` – dashboard stats/activity
- `app/admin/(dashboard)/profile/page.tsx`
- `app/admin/(dashboard)/projects/page.tsx`
- `app/admin/(dashboard)/skills/page.tsx`
- `app/admin/(dashboard)/services/page.tsx`
- `app/admin/(dashboard)/testimonials/page.tsx`
- `app/admin/(dashboard)/messages/page.tsx`
- `app/admin/(dashboard)/settings/page.tsx`
- `app/admin/(dashboard)/blog/page.tsx`
- `app/admin/(dashboard)/media/page.tsx`
- `app/api/admin/**` – protected auth/stats/CRUD/upload APIs
- `app/api/contact/route.ts` – saves public contact messages to DB
- `components/admin/*` – reusable cards, sidebar, headers, CRUD UI, toasts
- `lib/admin/*` – auth, db, validation, repository, resource map
- `types/admin.ts` – data models
- `scripts/seed-admin.ts` – dummy seed script

---

## Database Schema (Mongo Collections)

- `profile` (singleton)
- `settings` (singleton)
- `projects`
- `skills`
- `services`
- `testimonials`
- `messages`
- `blogs`
- `media`
- `activity`

Common fields:
- `createdAt` (ISO string)
- `updatedAt` (ISO string)

---

## Auth Flow

1. Admin opens `/admin/login`.
2. Credentials are checked in `/api/admin/auth/login`.
3. Secure HTTP-only cookie `admin_session` is set.
4. `/admin/(dashboard)/layout.tsx` verifies session server-side.
5. All `/api/admin/*` routes are guarded with `requireAdminSession()`.
6. Logout calls `/api/admin/auth/logout` to clear session cookie.

---

## Setup Steps

1. Install dependencies:
   - `npm install mongodb zod`
2. Configure `.env`:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
3. Seed dummy data (optional):
   - `npx tsx scripts/seed-admin.ts`
4. Run app:
   - `npm run dev`
5. Open:
   - `http://localhost:3000/admin/login`

---

## Main UI/UX Features Included

- Sidebar navigation + page headings
- Dashboard metrics + recent activity
- Reusable CRUD manager (tables, modals, form handling)
- Profile/settings dedicated forms
- Contact inbox with read/unread toggle
- Media upload and library list
- Loading and empty states
- Success/error toasts

---

## Security Notes

- Admin cookie is HTTP-only and SameSite=Lax.
- Server-side route guards for all admin APIs.
- Validation through Zod schemas before database writes.
- `robots` metadata on admin layout set to `noindex`.

---

## Public Portfolio Safety

- Admin is fully isolated under `/admin`.
- Existing public routes/components are untouched.
- `app/api/data/route.ts` can now consume dynamic DB data fallback safely.

