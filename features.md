# ShitBucket — Features

> "Dump your ideas. Brew them over time."

---

## Authentication

- Email/password sign up and login via Supabase Auth
- Persistent sessions with auto token refresh
- Row-level security (RLS) — users can only read and write their own ideas
- Sign-out clears session; accessible from the hamburger drawer

---

## Idea Capture (Quick Dump)

- Textarea (up to 500 characters) for rapid brain-dump entry
- Live character counter while typing
- One-tap creation — idea is saved immediately to the database
- Optional expiry date: set a deadline after which the idea auto-expires
- Optional tag chips added at dump time
- Error recovery: graceful fallback if database schema is missing `pinned`/`expires_at` columns

---

## Idea List (The Pile)

- Vertical card stack of all ideas, newest first by default
- Task completion count (☑ done/total)
- Link count (🔗) shown if present
- Expiry countdown label on cards with a set expiry
- Press-down micro-interaction: card physically sinks on tap (shadow removed + 4px translate)

---

## Pinning

- Pin any idea to surface it as a priority
- Pinned cards get a bold `#FF6A00` left border accent
- Pin/unpin via the location icon overlaid on the card (visible on hover/tap)

---

## Search & Filtering

- Full-text search across title, main thought, and tags (real-time, client-side)
- Tag filter bar: tap any tag to filter the list to matching ideas; tap again to clear
- Sort dropdown with four options:
  - Newest first (default)
  - Oldest first
  - Most brewed (highest progress score)
  - A–Z alphabetically

---

## Idea Detail View

- Full-screen detail panel slides in over the list
- Editable inline title (`text-[24px] font-extrabold`)
- Main thought/description textarea
- Context menu (⋯) for share, expiry, and delete actions

### Thoughts
- Multiple time-stamped notes/reflections attached to an idea
- Each thought shown in a cream-tinted card
- Add new thoughts; they are stored as an ordered array

### Tasks
- Checklist items with checkbox toggle
- Done items visually struck through; checkbox fills orange when complete
- Task completion ratio feeds into brew score

### Tags
- Add and remove lowercase tags
- Each tag shown as a bordered pill chip

### Links
- Add URLs with optional labels
- Auto-prefixes `https://` if missing
- Displayed as tappable bordered rows

### Custom Fields
- Fully dynamic metadata attached to an idea
- Four field types: **Text**, **Number**, **Checkbox**, **Link**
- Inline editing.

---

## Sharing

- Collaborative sharing: invite friends to work on an idea together via a secure token-based link.
- Manage collaborators: see who has joined and remove them if needed.

---

## Design System

Swiss editorial / brutalist aesthetic — physical, high-contrast, cream on black.

### Colors
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#FFF8EE` | Warm cream — page background |
| `--card` | `#FFFFFF` | White — card backgrounds |
| `--border` | `rgba(0,0,0,0.12)` | Subtle internal dividers |
| `--text` | `#0A0A0A` | Near-black body text |
| `--accent` | `#FF6A00` | Orange — CTAs, highlights |
| `--card-lime` | `#CAFF00` | Available in palette |
| `--card-pink` | `#FFB3D0` | Available in palette |
| `--card-blue` | `#B3D9FF` | Available in palette |
| `--card-yellow` | `#FFE9A0` | Available in palette |

### Hard Shadow Utilities
```
.shadow-hard     → box-shadow: 4px 4px 0px #000000
.shadow-hard-sm  → box-shadow: 3px 3px 0px #000000
.shadow-hard-lg  → box-shadow: 6px 6px 0px #000000
```

### Typography
- Monospace throughout: JetBrains Mono → IBM Plex Mono → SF Mono → system monospace
- Extrabold (`font-extrabold`) for all headings and labels
- `tracking-[0.15em]` uppercase for section labels

### Card Borders
- `border-2 border-black` on all interactive cards
- `rounded-3xl` (24px) for idea cards; `rounded-2xl` for panels and drawers

---

## Live Clock Widget

Premium light card in the header area:

- Left: logo image + "ShitBucket" wordmark
- Center/Right: current time, weekday, and month + day
- Time-of-day icon (☀ morning / ◑ afternoon / ◐ evening / ● night)
- Hydration-safe: renders placeholder until client-side clock ticks

---

## Header & Navigation

- Fixed top bar: logo image + "ShitBucket" wordmark (left), hamburger button (right)
- Logo: `/logo-shitBucket-day.png`, always light mode
- Hamburger opens a slide-in drawer from the right

---

## Hamburger Drawer (Settings)

- 280px right-side drawer over cream background
- **Account**: shows current user email with initial avatar
- **Appearance**: font size slider (12–24px, live preview)
- **Sign out**: at drawer footer with confirmation
- **Late-night easter egg**: after midnight the sign-out button switches to `"🚨 get out"` with a red pulse style

---

## PWA & Offline

- Installable as a Progressive Web App (add to home screen)
- Service worker with network-first strategy; falls back to cache for offline reading
- Full Web App Manifest: app name, icons, display mode, theme color (`#FFF8EE`)
- Apple/iOS meta tags for standalone display and status bar styling

---

## Mobile (Capacitor)

- Capacitor config for wrapping as a native iOS/Android app
- App ID: `com.rajkumar.shitbucket`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 18, Tailwind CSS 3 |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| PWA | Service Worker, Web App Manifest |
| Mobile | Capacitor |
| Fonts | JetBrains Mono (Google Fonts) |
| Deployment | Vercel |

---

## Database Schema

**`ideas`** table:
- `id`, `user_id`, `title`, `thought` (string), `thoughts` (array), `tags` (array), `links` (array), `fields` (array), `tasks` (array)
- `pinned` (boolean), `expires_at` (timestamp) — optional columns; app degrades gracefully without them
- `created_at`, `updated_at` — auto-updated via PostgreSQL trigger

**`shared_links`** table:
- `token` (random string), `idea_id` — maps public tokens to private ideas
- RLS policy allows public read so share links work without authentication
