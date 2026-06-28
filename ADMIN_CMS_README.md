# ADMIN CMS README

This project uses a MongoDB-backed CMS for both the public website and the admin panel. The admin panel edits the same canonical site data that powers the public pages, with a few areas that are synced from GitHub or stored in separate collections.

## Admin Architecture

Canonical flow:

`Admin UI`
→ `/api/admin/site-data`
→ Repository layer
→ MongoDB
→ `/api/site-data`
→ Public React components

For most content screens, the admin UI loads the canonical site document, edits it in memory, and saves it through `/api/admin/site-data/update`. Public pages then read from `/api/site-data` or the same repository-backed loader.

## Source Of Truth

- Section content uses MongoDB `Section` collection.
- Global settings use `SiteSettings` collection.
- GitHub stats are synced external data, cached in MongoDB and refreshed through GitHub sync routes.
- Messages use the `Message` collection.
- Media entries are stored in the media library inside the site data and uploaded through the media APIs.
- Seed JSON is bootstrap only. It initializes empty storage, but should not overwrite MongoDB after data exists.

## CRUD Matrix

| Admin Page | Route | Create | Read | Update | Delete | Enable/Disable | Reorder | Public Output | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | `/admin/control` | No | Yes | No | No | No | No | Admin overview only | ✅ Working |
| Analytics | `/admin/analytics` | No | Yes | No | No | No | No | Read-only analytics dashboards | 📖 Read-only |
| Hero | `/admin/hero` | No | Yes | Yes | No | No | No | Home hero section | ✅ Working |
| About | `/admin/about` | Yes, via stats items | Yes | Yes | Yes, via stats items | Yes, via stats items | Yes, via stats items | Home About section | ✅ Working |
| Skills Content | `/admin/skills-content` | Yes | Yes | Yes | Yes | Yes | Yes | Skills section | ✅ Working |
| Projects Content | `/admin/projects-content` | Yes | Yes | Yes | Yes | Yes | Yes | Projects section + project cards | ✅ Working |
| Working Content | `/admin/working-content` | Yes | Yes | Yes | Yes | Yes | Yes | Working section | ✅ Working |
| Completed Content | `/admin/completed-content` | Yes | Yes | Yes | Yes | Yes | Yes | Completed section | ✅ Working |
| Reviews Content | `/admin/reviews-content` | Yes | Yes | Yes | Yes | Yes | Yes | Reviews/testimonials section | ✅ Working |
| Experience Content | `/admin/experience-content` | Yes | Yes | Yes | Yes | Yes | Yes | Experience / Journey section | ✅ Working |
| Services Content | `/admin/services-content` | Yes | Yes | Yes | Yes | Yes | Yes | Services section | ✅ Working |
| GitHub Content | `/admin/github-content` | No | Yes | Yes | No | No | No | GitHub section heading/content | ✅ Working |
| Contact Content | `/admin/contact-content` | Yes | Yes | Yes | Yes | Yes | Yes | Contact section + social links | ✅ Working |
| Footer Content | `/admin/footer-content` | Yes | Yes | Yes | Yes | Yes | Yes | Footer area | ✅ Working |
| Advanced Text Blocks | `/admin/text-blocks` | Yes | Yes | Yes | Yes | Yes | Yes | Multiple text-driven public fields | ⚠ Partial |
| GitHub | `/admin/github` | No | Yes | Yes | No | No | No | GitHub sync/admin settings, not public content itself | ✅ Working |
| Portfolio AI | `/admin/ai` | No | Yes | Some | No | No | No | AI answer source controls | ⚠ Partial |
| Blogs | `/admin/blogs` | Yes | Yes | Yes | Yes | Yes | Yes | `/blogs` and `/blogs/[slug]` | ✅ Working |
| Resume | `/admin/resume` | No | Yes | Yes | No | No | No | `/resume` page and resume link | ✅ Working |
| Messages | `/admin/messages` | No | Yes | Yes | Yes | No | No | Admin inbox only | ✅ Working |
| Media | `/admin/media` | Yes | Yes | Yes | Yes | No | No | Media URLs used by projects/blogs/sections | ✅ Working |
| Settings | `/admin/settings` | Yes, nav links and global config | Yes | Yes | Yes | Yes, GitHub toggles and nav visibility | Yes, nav links | Global settings + navbar + GitHub config | ✅ Working |

## Data Path Matrix

| Section | Admin Route | Data Path | Public Component | Storage |
| --- | --- | --- | --- | --- |
| Hero | `/admin/hero` | `sections.hero.data`, `owner.*` | `components/sections/HeroSection.tsx` | `Section` + `SiteSettings` |
| About | `/admin/about` | `sections.about.data`, `sections.about.items` | `components/sections/AboutSection.tsx` | `Section` |
| Skills | `/admin/skills-content` | `sections.skills.data`, `sections.skills.items`, `skillsDetailed` | `components/sections/SkillsSection.tsx` | `Section` + `Skill` |
| Projects | `/admin/projects-content` | `sections.projects.data`, `sections.projects.items`, `projectsDetailed` | `components/sections/ProjectsSection.tsx` | `Section` + `Project` |
| Working | `/admin/working-content` | `sections.working.data`, `sections.working.items` | `components/sections/WorkingProjectsSection.tsx` | `Section` |
| Completed | `/admin/completed-content` | `sections.completed.data`, `sections.completed.items` | `components/sections/CompletedProjectsSection.tsx` | `Section` |
| Reviews | `/admin/reviews-content` | `sections.reviews.data`, `sections.reviews.items`, `testimonialsDetailed` | `components/sections/ReviewsSection.tsx` | `Section` + `Testimonial` |
| Experience | `/admin/experience-content` | `sections.journey.data`, `sections.journey.items`, `experience` | `components/sections/JourneySection.tsx` | `Section` + `Experience` |
| Services | `/admin/services-content` | `sections.services.data`, `sections.services.items`, `services` | `components/sections/ServicesSection.tsx` | `Section` + `SiteSettings` |
| GitHub Content | `/admin/github-content` | `sections.github.data`, `sections.github.items` | `components/sections/GitHubDeveloperSection.tsx` | `Section` |
| Contact | `/admin/contact-content` | `sections.contact.data`, `sections.contact.items`, `socials` | `components/sections/ContactSection.tsx` | `Section` + `SiteSettings` |
| Footer | `/admin/footer-content` | `websiteSettings.footerText`, `shell.footer.*`, `socials` | footer layout/components | `SiteSettings` + `Section` |
| Advanced Text Blocks | `/admin/text-blocks` | `owner.*`, `websiteSettings.*`, `socials.*`, `sections.*.data` | multiple public sections | `Section` + `SiteSettings` |
| GitHub | `/admin/github` | `githubConfig` | `components/sections/GitHubDeveloperSection.tsx`, `components/github/*` | `SiteSettings` + GitHub cache |
| Portfolio AI | `/admin/ai` | `aiConfig`, corpus inputs from site data | `app/api/assistant/ask` and assistant UI | Mongo-backed corpus |
| Blogs | `/admin/blogs` | `blogs` | `app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx` | `Blog` |
| Resume | `/admin/resume` | `owner.resumeUrl`, resume-related settings | `/resume` page | `SiteSettings` |
| Messages | `/admin/messages` | `contactMessages` | admin inbox only | `Message` |
| Media | `/admin/media` | `mediaLibrary` | project/blog/section image pickers | site data / upload storage |
| Settings | `/admin/settings` | `websiteSettings`, `githubConfig`, `siteConnection`, `nav` | navbar, SEO, GitHub admin | `SiteSettings` + site data |

## API Matrix

| API | Method | Purpose | Used By | Status |
| --- | --- | --- | --- | --- |
| `/api/admin/site-data` | `GET` | Load canonical admin site data | Most admin pages | ✅ Working |
| `/api/admin/site-data/update` | `POST` | Save canonical site data | Most save flows | ✅ Working |
| `/api/site-data` | `GET` | Public canonical site data | Public pages and API consumers | ✅ Working |
| `/api/admin/github/stats` | `GET` | Load admin GitHub stats and repository snapshot | `/admin/github`, GitHub dashboard UI | ✅ Working |
| `/api/admin/github/sync` | `POST` | Manual GitHub sync | `/admin/github` | ✅ Working |
| `/api/github/stats` | `GET` | Public GitHub stats payload | public GitHub sections/cards | ✅ Working |
| `/api/github/update` | `POST` | GitHub content update/sync flow | GitHub CMS tools | ⚠ Partial |
| `/api/github/upload` | `POST` | Upload GitHub-related content snapshot | GitHub CMS tools | ⚠ Partial |
| `/api/contact` | `POST` | Submit contact message | Contact form | ✅ Working |
| `/api/admin/messages` | `GET`/`PATCH`/`DELETE` depending on handler | Admin message management | Messages page | ✅ Working |
| `/api/admin/upload` | `POST` | Media upload | Media page | ✅ Working |
| `/api/analytics/summary` | `GET` | Analytics summary | Admin analytics | ✅ Working |
| `/api/analytics/track` | `POST` | Client event tracking | public site | ✅ Working |
| `/api/assistant/ask` | `POST` | Portfolio AI question answering | Portfolio AI UI | ✅ Working |
| `/api/search` | `GET` | Search corpus | public search UI and AI | ✅ Working |

## Page By Page

### Dashboard

Route:
`/admin/control`

Purpose:
Admin landing page and content-source overview.

Public output:
None. Admin only.

Data source:
Site data metadata, content source summary, sync status.

CRUD support:
- Create: no
- Read: yes
- Update: no
- Delete: no
- Enable/Disable: no
- Reorder: no

Fields editable:
None.

APIs used:
- GET `/api/admin/site-data`
- GET `/api/site-data`

Persistence:
Read-only view of Mongo-backed state.

Status:
📖 Read-only

Known notes:
Shows current source and sync state only.

### Analytics

Route:
`/admin/analytics`

Purpose:
Track traffic, GitHub clicks, search usage, and other usage metrics.

Public output:
No direct public page change.

Data source:
Analytics collections/aggregation results.

CRUD support:
- Create: no
- Read: yes
- Update: no
- Delete: no
- Enable/Disable: no
- Reorder: no

Fields editable:
None.

APIs used:
- GET `/api/analytics/summary`

Persistence:
Analytics database records.

Status:
📖 Read-only

Known notes:
Report surface only.

### Hero

Route:
`/admin/hero`

Purpose:
Controls the main homepage hero copy, CTA buttons, hero badges, and shared stats.

Public output:
Homepage hero section.

Data source:
`owner.*`, `sections.hero.data`, `sections.about.items` for shared stats.

CRUD support:
- Create: no
- Read: yes
- Update: yes
- Delete: no
- Enable/Disable: no
- Reorder: no

Fields editable:
- Logo text
- Hero badge
- Heading
- Subtitle
- Description
- Primary/secondary CTA text and links
- Resume link
- Availability badges
- Shared stats

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` + `SiteSettings` collections.

Status:
✅ Working

Known notes:
Hero stats intentionally share About stats.

### About

Route:
`/admin/about`

Purpose:
Edits the about heading, intro, description, and stats list.

Public output:
Homepage About section.

Data source:
`sections.about.data`, `sections.about.items`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Eyebrow
- Title
- Description
- Intro paragraph
- Stat label/value

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` collection.

Status:
✅ Working

Known notes:
Hero pulls the same stats items.

### Skills Content

Route:
`/admin/skills-content`

Purpose:
Controls the skills section heading and the skill cards/list.

Public output:
Homepage skills section.

Data source:
`sections.skills.data`, `sections.skills.items`, `skillsDetailed`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Heading text
- Description
- Learning title
- Skill name
- Category
- Level
- Icon
- Enabled
- Order

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` and `Skill` collections.

Status:
✅ Working

Known notes:
Detailed skills data is normalized on save.

### Projects Content

Route:
`/admin/projects-content`

Purpose:
Edits projects section copy and project cards.

Public output:
Homepage projects section and `/projects`.

Data source:
`sections.projects.data`, `sections.projects.items`, `projectsDetailed`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Heading text
- Description
- Project title
- Short description
- Category
- Image
- Featured
- Order
- Live URL
- GitHub URL

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`
- `GET /api/github/images` for image picker support in some editors

Persistence:
MongoDB `Section` and `Project` collections.

Status:
✅ Working

Known notes:
Public project detail pages are derived from the same Mongo data.

### Working Content

Route:
`/admin/working-content`

Purpose:
Controls the current work section.

Public output:
Homepage working section.

Data source:
`sections.working.data`, `sections.working.items`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Heading
- Description
- Title
- Description body
- Status
- Timeline
- Link
- Enabled
- Order

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` collection.

Status:
✅ Working

Known notes:
This is a section-only dataset.

### Completed Content

Route:
`/admin/completed-content`

Purpose:
Controls completed projects / finished work content.

Public output:
Homepage completed section.

Data source:
`sections.completed.data`, `sections.completed.items`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Heading
- Description
- Title
- Role
- Timeline
- Work done
- Link
- Enabled
- Order

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` collection.

Status:
✅ Working

Known notes:
Same section CRUD pattern as Working.

### Reviews Content

Route:
`/admin/reviews-content`

Purpose:
Edits testimonials/reviews shown on the homepage.

Public output:
Homepage reviews section.

Data source:
`sections.reviews.data`, `sections.reviews.items`, `testimonialsDetailed`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Heading
- Description
- Client name
- Role/company
- Quote
- Avatar
- Enabled
- Order

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` and `Testimonial` collections.

Status:
✅ Working

Known notes:
Public review cards use normalized testimonial data.

### Experience Content

Route:
`/admin/experience-content`

Purpose:
Controls the experience timeline and heading.

Public output:
Homepage Experience / Journey section.

Data source:
`sections.journey.data`, `sections.journey.items`, `experience`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Heading
- Description
- Role
- Period
- Summary
- Enabled
- Order

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` and `Experience` collections.

Status:
✅ Working

Known notes:
Public section now has fallback heading text if admin copy is empty.

### Services Content

Route:
`/admin/services-content`

Purpose:
Controls services section heading and service cards.

Public output:
Homepage services section.

Data source:
`sections.services.data`, `sections.services.items`, `services`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Heading
- Description
- Service title
- Description
- Icon
- Price label
- CTA label
- CTA link
- Enabled
- Order

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` collection and `SiteSettings` service data.

Status:
✅ Working

Known notes:
Some service data may also be mirrored in settings depending on editor path.

### GitHub Content

Route:
`/admin/github-content`

Purpose:
Edits the public GitHub section heading and visibility copy.

Public output:
Homepage GitHub section.

Data source:
`sections.github.data`, `sections.github.items`

CRUD support:
- Create: no
- Read: yes
- Update: yes
- Delete: no
- Enable/Disable: no
- Reorder: no

Fields editable:
- Small label
- Title
- Description

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` collection.

Status:
✅ Working

Known notes:
Section now has fallback public heading text if fields are empty.

### Contact Content

Route:
`/admin/contact-content`

Purpose:
Edits the contact section copy, form labels, and social/contact links.

Public output:
Homepage contact section.

Data source:
`sections.contact.data`, `sections.contact.items`, `socials`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Heading text
- Card title/description
- Form title
- Name/email/message labels and placeholders
- Button text
- Success/error messages
- Social label/value/href/icon

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` collection and site-level socials.

Status:
✅ Working

Known notes:
Used for both contact section and social links.

### Footer Content

Route:
`/admin/footer-content`

Purpose:
Edits footer text, CTA, and footer links.

Public output:
Site footer.

Data source:
`websiteSettings.footerText`, `shell.footer.*`, `socials`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Footer text
- Copyright text
- CTA label
- CTA href
- Quick links
- Social links

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `SiteSettings` collection and site data social arrays.

Status:
✅ Working

Known notes:
Footer content spans both global settings and section-linked social data.

### Advanced Text Blocks

Route:
`/admin/text-blocks`

Purpose:
Fine-grained text editing for select site-wide labels, CTAs, and section strings.

Public output:
Multiple public components.

Data source:
`owner.*`, `websiteSettings.*`, `socials.*`, `sections.*.data`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
Depends on selected text block list.

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `Section` and `SiteSettings` collections.

Status:
⚠ Partial

Known notes:
It is powerful, but some text blocks are derived from shared content and can overlap with other editors.

### GitHub

Route:
`/admin/github`

Purpose:
Configures GitHub syncing, selected repositories, commit visibility, and token handling.

Public output:
GitHub homepage preview and `/github` page.

Data source:
`githubConfig`

CRUD support:
- Create: no
- Read: yes
- Update: yes
- Delete: no
- Enable/Disable: yes
- Reorder: no

Fields editable:
- Username
- Token
- Enabled
- Refresh interval
- Include private repos
- Include private commits
- Show lifetime commits
- Public/private display mode
- Commit count mode
- Repository selection mode
- Selected repositories
- Commit visibility include/exclude rules

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`
- GET `/api/admin/github/stats`
- POST `/api/admin/github/sync`
- POST `/api/admin/github/clear-cache`

Persistence:
MongoDB `SiteSettings` plus GitHub-synced cache.

Status:
✅ Working

Known notes:
Token is preserved unless a real new token is entered.

### Portfolio AI

Route:
`/admin/ai`

Purpose:
Controls AI answer behavior, corpus settings, and knowledge-source tuning.

Public output:
Portfolio AI assistant responses.

Data source:
`aiConfig`, public corpus generated from site data

CRUD support:
- Create: no
- Read: yes
- Update: yes
- Delete: no
- Enable/Disable: yes
- Reorder: no

Fields editable:
- Model
- Temperature
- Token/context settings
- Confidence threshold
- Enable/disable

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`
- POST `/api/assistant/ask`
- GET `/api/search`

Persistence:
MongoDB site data and generated public corpus.

Status:
⚠ Partial

Known notes:
Hybrid retrieval is available, but AI output should still be checked manually for source quality.

### Blogs

Route:
`/admin/blogs`

Purpose:
Create and manage blog posts.

Public output:
`/blogs` and `/blogs/[slug]`

Data source:
`blogs`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: yes
- Reorder: yes

Fields editable:
- Title
- Slug
- Excerpt
- Content
- Cover image
- Tags
- Category
- Status
- Featured
- SEO title
- SEO description
- Published at
- Order
- Enabled

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`
- Public page loaders from repository-backed blog collection

Persistence:
MongoDB `Blog` collection.

Status:
✅ Working

Known notes:
Blog image field is stored as `coverImage` in admin and persisted to blog thumbnail storage for public rendering.

### Resume

Route:
`/admin/resume`

Purpose:
Controls resume URL and resume-related public content.

Public output:
`/resume`

Data source:
`owner.resumeUrl`, resume settings

CRUD support:
- Create: no
- Read: yes
- Update: yes
- Delete: no
- Enable/Disable: no
- Reorder: no

Fields editable:
- Resume URL
- Resume text/settings if available

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`

Persistence:
MongoDB `SiteSettings` and site owner data.

Status:
✅ Working

Known notes:
Mostly a single-URL/content surface.

### Messages

Route:
`/admin/messages`

Purpose:
Admin inbox for submitted contact messages.

Public output:
No direct public rendering.

Data source:
`messages`

CRUD support:
- Create: no
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: no
- Reorder: no

Fields editable:
- Read/unread
- Status
- Reply metadata

APIs used:
- Contact form `/api/contact`
- Admin message APIs

Persistence:
MongoDB `Message` collection.

Status:
✅ Working

Known notes:
Read-only for incoming message creation; admin can manage them.

### Media

Route:
`/admin/media`

Purpose:
Uploads and manages reusable image URLs.

Public output:
Used by projects, blogs, and some section image fields.

Data source:
`mediaLibrary`

CRUD support:
- Create: yes
- Read: yes
- Update: yes
- Delete: yes
- Enable/Disable: no
- Reorder: no

Fields editable:
- File upload
- Media name
- URL
- Type
- Size

APIs used:
- POST `/api/admin/upload`
- Media library load/save flows

Persistence:
Media storage plus site data media library.

Status:
✅ Working

Known notes:
This is a supporting asset store rather than a content page.

### Settings

Route:
`/admin/settings`

Purpose:
Global website settings, GitHub config, and custom nav links.

Public output:
Navbar, SEO, footer/global behavior, GitHub sync settings.

Data source:
`websiteSettings`, `githubConfig`, `siteConnection`, `nav`

CRUD support:
- Create: yes, nav links
- Read: yes
- Update: yes
- Delete: yes, nav links
- Enable/Disable: yes, GitHub toggles and nav visibility
- Reorder: yes, nav links

Fields editable:
- GitHub username
- GitHub token
- Refresh interval
- Private repo/commit toggles
- Repository selection mode
- Selected repositories
- GitHub rules
- SEO title
- Meta description
- Repository owner/name
- Custom navbar links

APIs used:
- GET `/api/admin/site-data`
- POST `/api/admin/site-data/update`
- POST `/api/admin/github/refresh`

Persistence:
MongoDB `SiteSettings` collection and site nav array.

Status:
✅ Working

Known notes:
This page is the preferred place to add custom routes like `/blogs`.

## GitHub Admin Explanation

The GitHub admin area is split into two parts:

1. Public GitHub content
- `GitHub Content` edits the visible GitHub section on the homepage.
- This controls the heading, eyebrow, and description shown to visitors.

2. GitHub sync/settings
- `GitHub` controls how stats are collected and shown.
- It supports:
  - public commits
  - private commits
  - selected repositories
  - commit visibility rules
  - manual sync
  - clear cache
  - token management

Public vs private behavior:
- Public repo and commit data can be shown on the public site.
- Private commits/repos can be included only if the config enables them.
- Token handling is protected: the existing token is preserved unless the admin enters a real new one.

## Portfolio AI Explanation

Portfolio AI answers from the public corpus built from published site data and GitHub stats.

How it works:
- The assistant uses public site content and public GitHub data as its source corpus.
- If a Gemini model is configured, the assistant can use hybrid retrieval plus generation.
- If Gemini is not available, fallback retrieval still answers from indexed public content.

Safety:
- It should not expose admin-only data.
- It should not expose private tokens.
- It should not depend on seed JSON once Mongo data exists.
- Source confidence and retrieval quality should be checked before shipping changes.

## Persistence Verification

For every admin edit:

1. Save
2. Reload admin page
3. Check public page
4. Check `/api/admin/site-data`
5. Check `/api/site-data`

For CRUD sections:

- Add item
- Save
- Reload admin
- Reload public page
- Verify deleted items do not return
- Verify disabled items do not render publicly
- Verify ordering persists

## Developer Notes

- Do not add duplicate save APIs.
- Do not read directly from seed JSON at runtime.
- Do not expose tokens in public data or logs.
- Do not add hardcoded public content.
- Keep one source of truth for admin and public content.

## Production Status

### Fully Working

- Most section editors
- Blog CRUD
- Contact/messages
- Media upload
- GitHub admin settings
- Global settings and custom nav links

### Partial

- Advanced Text Blocks
- Portfolio AI
- Some GitHub update/upload helper flows

### Read-Only

- Dashboard
- Analytics

### Synced External Data

- GitHub stats and repository snapshots

### Manual Test Before Release

- Save each section and confirm persistence after refresh
- Verify navbar links, including custom `/blogs` routes
- Verify blog cover images show on list and detail pages
- Verify GitHub settings save without 500s
- Verify AI responses stay grounded in public content

