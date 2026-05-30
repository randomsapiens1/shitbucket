# 🪣 shitbucket

> "Dump your ideas. Brew them over time."

Shitbucket is a lightweight, mobile-first idea capture tool designed to help you dump raw thoughts quickly and track their "brewing" progress over time. It's built for speed, privacy, and simplicity.

---

## ✨ Features

- **🚀 Quick Capture:** Dump ideas in seconds with a 500-character limit.
- **🧪 Brew Progress:** Automatic progress score (0–100%) based on idea completeness (thoughts, tags, tasks, links, custom fields).
- **🏷️ Organization:** Tagging system, checklist tasks, and multiple notes (thoughts) per idea.
- **🔗 Sharing:** Generate unique, public read-only links for any idea.
- **⏳ Auto-Cleanup:** Support for expiring ideas that delete themselves after a set time.
- **📱 PWA & Mobile:** Installable as a Progressive Web App or wrap it with Capacitor for native mobile.
- **🛡️ Secure:** Powered by Supabase Auth and Row-Level Security (RLS).
- **🌑 Dark Mode:** Optimized for low-light dumping.

---

## 🛠️ Setup (15 minutes, $0)

### Step 1: Supabase (database + auth)

1. Create a free account at [supabase.com](https://supabase.com).
2. Create a **New Project** named `shitbucket`.
3. Go to **SQL Editor** and run the contents of `supabase-schema.sql`.
4. Go to **Settings > API** and copy your **Project URL** and `anon` **public key**.

### Step 2: Local setup

```bash
# Clone the repository
git clone https://github.com/yourusername/shitbucket.git
cd shitbucket

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
```

Edit `.env.local` and paste your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Run development server

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) to see the app.

### Step 4: Configure Supabase Auth

1. In Supabase, go to **Authentication > URL Configuration**.
2. Set **Site URL** to `http://localhost:3000` (development) and add your production URL later.
3. Under **Authentication > Providers**, ensure **Email** is enabled.

---

## 🏗️ Project structure

```
shitbucket/
├── public/           # PWA manifest, service worker, and assets
├── src/
│   ├── app/          # Next.js App Router (pages and layouts)
│   ├── components/   # UI components (Auth, Bucket, List, Detail)
│   ├── lib/          # Utilities, Supabase client, and DB logic
│   └── ...
├── supabase-schema.sql # Database schema and RLS policies
├── capacitor.config.json # Capacitor configuration for mobile
└── package.json      # Dependencies and scripts
```

## 🚀 Tech Stack

- **Next.js 16** (React 18)
- **Supabase** (Postgres DB + Auth + RLS)
- **Tailwind CSS** (Styling)
- **Capacitor** (Native Mobile Bridge)
- **Vercel** (Hosting)

## 🍻 Brewing Stages

| Stage | Range | Emoji |
|---|---|---|
| raw | 0–19% | ★☆☆☆☆ |
| maybe | 20–44% | ★★☆☆☆ |
| cooking | 45–69% | ★★★☆☆ |
| slaps | 70–94% | ★★★★☆ |
| gold | 95–100% | ★★★★★ |

---

Total cost to run: **$0** (on free tiers)
