# Shitbucket — Features

> "Dump your ideas. Brew them over time."

## Authentication

- Email/password sign up and login via Supabase Auth
- Persistent sessions stored in localStorage with auto token refresh
- Row-level security (RLS) — users can only access their own data
- Logout clears session completely

## Idea Capture

- Quick dump textarea (up to 500 characters) for rapid idea entry
- Character counter shown while typing
- One-click creation — new idea is saved immediately

## Idea Detail View

- Editable title
- Main thought/description field
- **Tags** — add and remove lowercase tags for categorization
- **Tasks** — checklist items with checkbox toggle for completion
- **Thoughts** — multiple notes/reflections attached to an idea
- **Links** — URLs with optional labels (auto-prefixes `https://` if missing)
- **Custom Fields** — dynamic metadata with four types:
  - Text
  - Number
  - Checkbox (boolean)
  - Link

## Brew Progress System

Automatic progress score (0–100%) calculated from idea completeness:

| Signal | Points |
|---|---|
| Main thought filled | +10% |
| Each thought added (max 5) | +6% each |
| Has tags | +10% |
| Has links | +10% |
| Filled custom fields (max 3) | +5% each |
| Has tasks | +10% |
| Task completion ratio | up to +15% |

Six brewing stages with emoji indicators:

| Stage | Range | Emoji |
|---|---|---|
| raw dump | 0–14% | 💩 |
| starting to stink | 15–34% | 🦨 |
| fermenting | 35–54% | 🧪 |
| bubbling up | 55–74% | 🫧 |
| almost cooked | 75–94% | 🔥 |
| pure gold | 95–100% | ✨ |

## List View

- Card grid showing all ideas
- Brew progress bar and stage emoji on each card
- Task completion indicator (☑ X/Y tasks)
- Thought count (💭) and link count (🔗) per card
- All tags displayed inline on cards
- Live clock displayed in the top-left
- Idea count shown

## Search & Filtering

- Full-text search across title, thought content, and tags
- Tag-based filtering — click any tag to show only matching ideas
- Sorting options:
  - Newest first (default)
  - Oldest first
  - Most brewed (highest progress)
  - A–Z alphabetically

## Sharing

- Generate a unique token-based shareable link per idea (`/s/[token]`)
- Public read-only view — accessible without authentication
- Auto-copy link to clipboard on share
- Native device share sheet support via Web Share API
- Public view shows all idea details, brew progress, read-only task checklist, and tags

## Design & UX

- Dark theme with custom bucket color palette (near-black backgrounds, burnt orange accent, cream text)
- Monospace font (JetBrains Mono)
- Responsive, mobile-first layout
- Animated progress bars and smooth hover transitions
- Color-coded tags (consistent color per tag derived from hash)
- Delete with confirmation menu

## PWA & Offline

- Installable as a Progressive Web App (add to home screen)
- Service worker with network-first caching strategy for offline support
- Full PWA manifest with app icons and theme colors
- Apple/iOS meta tags for standalone display

## Mobile (Capacitor)

- Capacitor configuration for wrapping the PWA as a native iOS/Android app
- App ID: `com.rajkumar.shitbucket`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 18, Tailwind CSS 3 |
| Backend/DB | Supabase (PostgreSQL + Auth) |
| PWA | Service Worker, Web Manifest |
| Mobile | Capacitor |
| Deployment | Vercel (recommended) |

## Database

Two tables:

- **ideas** — stores all user idea data including title, thought, thoughts[], tags[], links[], fields[], tasks[], timestamps
- **shared_links** — maps unique tokens to ideas for public sharing

Auto-updated `updated_at` timestamp via PostgreSQL trigger on every idea change.
