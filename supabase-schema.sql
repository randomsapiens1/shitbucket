-- ============================================
-- SHITBUCKET DATABASE SCHEMA (IDEMPOTENT UPDATE)
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Ideas table
create table if not exists public.ideas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  thought text default '',
  thoughts jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  links jsonb default '[]'::jsonb,
  fields jsonb default '[]'::jsonb,
  tasks jsonb default '[]'::jsonb,
  topic text default 'General',
  pinned boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Clean up old sharing table (removed in favor of collaborator-only sharing)
drop table if exists public.shared_links cascade;

-- 3. Row Level Security
alter table public.ideas enable row level security;

-- Ideas: Owner policies
do $$ begin
  drop policy if exists "Users can read own ideas" on public.ideas;
  drop policy if exists "Users can insert own ideas" on public.ideas;
  drop policy if exists "Users can update own ideas" on public.ideas;
  drop policy if exists "Users can delete own ideas" on public.ideas;
end $$;

create policy "Users can read own ideas" on public.ideas for select using (auth.uid() = user_id);
create policy "Users can insert own ideas" on public.ideas for insert with check (auth.uid() = user_id);
create policy "Users can update own ideas" on public.ideas for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own ideas" on public.ideas for delete using (auth.uid() = user_id);

-- 4. Indexes
create index if not exists ideas_user_id_idx on public.ideas(user_id);
create index if not exists ideas_updated_at_idx on public.ideas(updated_at desc);

-- 5. Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'ideas_updated_at') then
    create trigger ideas_updated_at
      before update on public.ideas
      for each row execute function update_updated_at();
  end if;
end $$;

-- ============================================
-- COLLABORATIVE EDITING
-- ============================================

-- 6. Accepted collaborators
create table if not exists public.idea_collaborators (
  id uuid default gen_random_uuid() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_email text not null,
  invited_by uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  unique(idea_id, user_id)
);

-- 7. Pending invite links
create table if not exists public.collab_invites (
  id uuid default gen_random_uuid() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  idea_title text not null,
  inviter_email text not null,
  inviter_id uuid references auth.users(id) on delete cascade not null,
  token text unique not null,
  accepted_at timestamptz,
  created_at timestamptz default now()
);

-- RLS on collaboration tables
alter table public.idea_collaborators enable row level security;
alter table public.collab_invites enable row level security;

-- Policies for collaborators
do $$ begin
  drop policy if exists "Idea owner and collaborator can read collaborators" on public.idea_collaborators;
  drop policy if exists "Idea owner can delete collaborators" on public.idea_collaborators;
  drop policy if exists "Inviter can manage own invites" on public.collab_invites;
  drop policy if exists "Anyone can read collab invites" on public.collab_invites;
  drop policy if exists "Collaborators can read shared ideas" on public.ideas;
  drop policy if exists "Collaborators can update shared ideas" on public.ideas;
end $$;

create policy "Idea owner and collaborator can read collaborators"
  on public.idea_collaborators for select
  using (user_id = auth.uid() or invited_by = auth.uid());

create policy "Idea owner can delete collaborators"
  on public.idea_collaborators for delete
  using (idea_id in (select id from public.ideas where user_id = auth.uid()));

-- CRITICAL SECURITY FIX: Only the actual owner of an idea can create an invite for it.
create policy "Inviter can manage own invites"
  on public.collab_invites for all
  using (
    inviter_id = auth.uid() 
    and idea_id in (select id from public.ideas where user_id = auth.uid())
  );

-- RPC: securely fetch invite details without a public select policy
create or replace function get_invite_by_token(p_token text)
returns table (
  idea_id uuid,
  idea_title text,
  inviter_email text,
  accepted_at timestamptz,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select ci.idea_id, ci.idea_title, ci.inviter_email, ci.accepted_at, ci.created_at
  from public.collab_invites ci
  where ci.token = p_token;
end;
$$;

create policy "Collaborators can read shared ideas"
  on public.ideas for select
  using (id in (select idea_id from public.idea_collaborators where user_id = auth.uid()));

create policy "Collaborators can update shared ideas"
  on public.ideas for update
  using (id in (select idea_id from public.idea_collaborators where user_id = auth.uid()));

-- Realtime payloads
alter table public.ideas replica identity full;

-- Indexes for collaboration
create index if not exists idea_collaborators_user_id_idx on public.idea_collaborators(user_id);
create index if not exists idea_collaborators_idea_id_idx on public.idea_collaborators(idea_id);
create index if not exists collab_invites_token_idx on public.collab_invites(token);

-- RPC: securely accept an invite
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
