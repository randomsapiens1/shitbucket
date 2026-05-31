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
  expires_at timestamptz,
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

-- ============================================
-- COLLABORATIVE EDITING
-- Run this section after the initial schema above
-- ============================================

-- 6. Accepted collaborators
create table public.idea_collaborators (
  id uuid default gen_random_uuid() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_email text not null,
  invited_by uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  unique(idea_id, user_id)
);

-- 7. Pending invite links
create table public.collab_invites (
  id uuid default gen_random_uuid() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  idea_title text not null,
  inviter_email text not null,
  inviter_id uuid references auth.users(id) on delete cascade not null,
  token text unique not null,
  accepted_at timestamptz,
  created_at timestamptz default now()
);

-- RLS on new tables
alter table public.idea_collaborators enable row level security;
alter table public.collab_invites enable row level security;

-- idea_collaborators: owner + collaborator can read; only owner can delete
-- Note: uses invited_by (not a subquery into ideas) to avoid RLS infinite recursion
create policy "Idea owner and collaborator can read collaborators"
  on public.idea_collaborators for select
  using (
    user_id = auth.uid()
    or invited_by = auth.uid()
  );

create policy "Idea owner can delete collaborators"
  on public.idea_collaborators for delete
  using (idea_id in (select id from public.ideas where user_id = auth.uid()));

-- collab_invites: inviter manages; anyone can read (needed for unauthenticated invite preview)
create policy "Inviter can manage own invites"
  on public.collab_invites for all
  using (inviter_id = auth.uid());

create policy "Anyone can read collab invites"
  on public.collab_invites for select
  using (true);

-- Allow collaborators to read and update shared ideas (existing owner policies remain)
create policy "Collaborators can read shared ideas"
  on public.ideas for select
  using (id in (select idea_id from public.idea_collaborators where user_id = auth.uid()));

create policy "Collaborators can update shared ideas"
  on public.ideas for update
  using (id in (select idea_id from public.idea_collaborators where user_id = auth.uid()));

-- Full row data needed for Realtime payloads
alter table public.ideas replica identity full;

-- Add ideas to the Realtime publication (run in Supabase dashboard > Database > Replication if needed)
-- alter publication supabase_realtime add table public.ideas;

-- Indexes
create index idea_collaborators_user_id_idx on public.idea_collaborators(user_id);
create index idea_collaborators_idea_id_idx on public.idea_collaborators(idea_id);
create index collab_invites_token_idx on public.collab_invites(token);

-- RPC: securely accept an invite (SECURITY DEFINER bypasses RLS to read auth.users)
create or replace function accept_collab_invite(p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.collab_invites;
  v_user_email text;
  v_already_collab boolean;
begin
  -- Idempotent: if already a collaborator on the idea tied to this token, succeed silently
  select exists(
    select 1 from public.idea_collaborators ic
    join public.collab_invites ci on ci.idea_id = ic.idea_id
    where ci.token = p_token and ic.user_id = auth.uid()
  ) into v_already_collab;

  if v_already_collab then
    return;
  end if;

  -- Validate token (unused only)
  select * into v_invite
  from public.collab_invites
  where token = p_token and accepted_at is null;

  if not found then
    raise exception 'this invite link has already been used or is invalid';
  end if;

  -- Fetch the accepting user's email from auth
  select email into v_user_email
  from auth.users
  where id = auth.uid();

  insert into public.idea_collaborators (idea_id, user_id, user_email, invited_by)
  values (v_invite.idea_id, auth.uid(), v_user_email, v_invite.inviter_id)
  on conflict (idea_id, user_id) do nothing;

  update public.collab_invites
  set accepted_at = now()
  where id = v_invite.id;
end;
$$;
