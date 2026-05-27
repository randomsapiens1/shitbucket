-- ============================================
-- SHITBUCKET DATABASE SCHEMA
-- Run this in Supabase SQL Editor (supabase.com > your project > SQL Editor)
-- ============================================

-- 1. Ideas table
create table public.ideas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  thought text default '',
  thoughts jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  links jsonb default '[]'::jsonb,
  fields jsonb default '[]'::jsonb,
  tasks jsonb default '[]'::jsonb,
  pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Shared links table
create table public.shared_links (
  id uuid default gen_random_uuid() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  token text unique not null,
  created_at timestamptz default now()
);

-- 3. Row Level Security (your ideas are yours only)
alter table public.ideas enable row level security;
alter table public.shared_links enable row level security;

-- Users can only see/edit their own ideas
create policy "Users can read own ideas"
  on public.ideas for select
  using (auth.uid() = user_id);

create policy "Users can insert own ideas"
  on public.ideas for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ideas"
  on public.ideas for update
  using (auth.uid() = user_id);

create policy "Users can delete own ideas"
  on public.ideas for delete
  using (auth.uid() = user_id);

-- Shared links: owner can manage, anyone can read (for public sharing)
create policy "Users can manage own shared links"
  on public.shared_links for all
  using (
    idea_id in (select id from public.ideas where user_id = auth.uid())
  );

create policy "Anyone can read shared links"
  on public.shared_links for select
  using (true);

-- 4. Index for fast lookups
create index ideas_user_id_idx on public.ideas(user_id);
create index ideas_updated_at_idx on public.ideas(updated_at desc);
create index shared_links_token_idx on public.shared_links(token);

-- 5. Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger ideas_updated_at
  before update on public.ideas
  for each row execute function update_updated_at();
