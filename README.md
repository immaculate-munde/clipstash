# 📋 Clipstash

A cross-device clipboard app built with Next.js 14 and Supabase.

## Features

- 🔐 **Auth** — Email/password sign up & sign in via Supabase Auth
- 📋 **My Clips** — Permanent personal clipboard synced across devices
- 🔑 **Guest Mode** — Share a 6-char code, no account needed
- 🌙 **Light/Dark theme** — Persisted to localStorage
- 🏷 **Labels** — Tag clips for easy searching
- 🔍 **Search** — Instant client-side filter
- 🗑 **Manual delete** — Clips never expire unless you delete them
- ⌨️ **Shortcuts** — `⌘↵` to add clip, `⌘K` to focus textarea

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

Run this SQL in your [Supabase SQL Editor](https://supabase.com/dashboard):

```sql
create table clips (
  id           uuid        default gen_random_uuid() primary key,
  session_code text,
  user_id      uuid        references auth.users(id) on delete cascade,
  content      text        not null,
  label        text,
  created_at   timestamptz default now()
);

create index on clips(session_code);
create index on clips(user_id);

alter table clips enable row level security;

create policy "Anyone can read clips"   on clips for select using (true);
create policy "Anyone can insert clips" on clips for insert with check (true);
create policy "Delete own clips"        on clips for delete using (
  user_id is null or auth.uid() = user_id
);
```

### 3. Configure environment

Your `.env.local` is already pre-filled with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://slvxehyxkclflqihvqvh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Run dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Entry point → renders AppShell
│   └── globals.css         # Design tokens (CSS vars), animations
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx    # Main client shell — auth, routing, state
│   │   ├── Topbar.tsx      # Top navigation bar
│   │   └── Sidebar.tsx     # Left sidebar / mobile bottom bar
│   │
│   ├── clips/
│   │   ├── MyClipsView.tsx # Authenticated user's clipboard
│   │   ├── GuestView.tsx   # Guest session clipboard
│   │   ├── ClipsList.tsx   # Searchable list of clips
│   │   ├── ClipCard.tsx    # Individual clip card
│   │   ├── AddClipForm.tsx # Textarea + add button
│   │   ├── StatsRow.tsx    # Stats (total, today, chars)
│   │   └── SettingsView.tsx
│   │
│   ├── auth/
│   │   └── AuthView.tsx    # Login + signup form
│   │
│   └── ui/
│       ├── Button.tsx      # Button primitive
│       ├── Input.tsx       # Input primitive
│       ├── Card.tsx        # Card wrapper
│       ├── Toast.tsx       # Toast notifications
│       └── Misc.tsx        # Badge, Divider, Skeleton, EmptyState
│
├── hooks/
│   ├── useClips.ts         # useMyClips + useGuestClips
│   ├── useTheme.ts         # Dark/light theme toggle
│   └── useToast.ts         # Toast queue management
│
├── lib/
│   ├── supabase.ts         # Supabase client + DB helpers
│   └── utils.ts            # genSessionCode, formatClipTime, etc.
│
└── types/
    └── index.ts            # Clip, Theme, Toast, ActiveView types
```

## Deploy

### Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
```

Add your env vars in the Vercel dashboard under **Settings → Environment Variables**.

### Netlify

```bash
npm run build
# Deploy the .next folder via Netlify CLI or drag-drop
```
