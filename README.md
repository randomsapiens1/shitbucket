# 🪣 shitbucket

Dump your ideas. Brew them over time.

---

## Setup (15 minutes, $0)

### Step 1: Supabase (database + auth)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**, name it `shitbucket`, set a database password, pick the closest region (Singapore for BD)
3. Wait for the project to spin up (~2 min)
4. Go to **SQL Editor** (left sidebar) and paste the contents of `supabase-schema.sql`, then click **Run**
5. Go to **Settings > API** and copy:
   - Project URL (looks like `https://xxxxx.supabase.co`)
   - `anon` public key (the long one under "Project API keys")

### Step 2: Local setup

```bash
# Clone or copy this folder to your machine
cd shitbucket

# Install dependencies
npm install

# Create your env file
cp .env.local.example .env.local

# Paste your Supabase URL and anon key into .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Create app icons

You need two PNG icons for the PWA. Quick way:
- Go to [favicon.io](https://favicon.io/emoji-favicons/bucket/) or any emoji-to-png tool
- Download a bucket emoji as 192x192 and 512x512
- Save as `public/icon-192.png` and `public/icon-512.png`

### Step 4: Run locally

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). You should see the login screen.

### Step 5: Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication > URL Configuration**
2. Set **Site URL** to `http://localhost:3000` (for dev) or your Vercel URL (for prod)
3. Under **Authentication > Providers**, make sure **Email** is enabled
4. Under Email settings, you can disable "Confirm email" for faster testing

### Step 6: Deploy to Vercel (free)

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Deploy
vercel

# Follow prompts, then add env vars:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redeploy with env vars
vercel --prod
```

Or just push to GitHub and connect it to Vercel via the dashboard.

After deploying, go back to Supabase **Authentication > URL Configuration** and update the Site URL to your Vercel URL (e.g. `https://shitbucket.vercel.app`). Also add it to the **Redirect URLs** list.

### Step 7: Add to phone home screen

1. Open your Vercel URL on your phone in Safari (iOS) or Chrome (Android)
2. **iOS**: Tap Share > "Add to Home Screen"
3. **Android**: Tap the three dots menu > "Add to Home Screen" or "Install app"
4. It now looks and behaves like a native app

---

## Project structure

```
shitbucket/
  public/
    manifest.json     # PWA config
    sw.js             # Service worker
    icon-192.png      # App icon (you create this)
    icon-512.png      # App icon (you create this)
  src/
    app/
      globals.css     # Base styles
      layout.js       # Root layout with PWA meta
      page.js         # Main page (auth gate)
      s/[token]/
        page.js       # Public shared idea page
    components/
      Auth.jsx        # Magic link login
      Bucket.jsx      # Main app (all the idea UI)
    lib/
      supabase.js     # Supabase client init
      db.js           # Database operations (CRUD)
  supabase-schema.sql # Run this in Supabase SQL Editor
  .env.local.example  # Copy to .env.local and fill in
```

## Stack

- **Next.js 14** (React framework)
- **Supabase** (Postgres database + auth + row-level security)
- **Tailwind CSS** (styling)
- **Vercel** (hosting)
- **PWA** (installable on phone)

Total cost: **$0**
