create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id text primary key,
  email text unique not null,
  display_name text not null,
  bio text not null default '',
  visibility text not null default 'Public',
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id text primary key,
  user_id text references public.profiles(id) on delete set null,
  author text not null default 'Wildspotter',
  title text not null,
  category text not null,
  caption text not null,
  location text not null,
  distance text not null default '0.1 mi',
  tags text[] not null default '{}',
  emoji text not null default '🐾',
  visibility text not null default 'Public',
  delayed boolean not null default true,
  approximate boolean not null default true,
  media text,
  lat double precision not null,
  lng double precision not null,
  created_at bigint not null
);

create table if not exists public.follows (
  id text primary key default gen_random_uuid()::text,
  follower_id text not null references public.profiles(id) on delete cascade,
  target_key text not null,
  target_label text not null,
  created_at bigint not null,
  unique (follower_id, target_key)
);

create table if not exists public.nearby_messages (
  id text primary key,
  user_id text references public.profiles(id) on delete set null,
  author text not null,
  text text not null,
  room text not null default 'near-me',
  mine boolean not null default false,
  created_at bigint not null
);

alter table public.nearby_messages
  add column if not exists room text not null default 'near-me';

create table if not exists public.reports (
  id text primary key,
  post_id text references public.posts(id) on delete cascade,
  reason text not null,
  status text not null default 'open',
  created_at bigint not null
);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.follows enable row level security;
alter table public.nearby_messages enable row level security;
alter table public.reports enable row level security;

drop policy if exists "public profiles are readable" on public.profiles;
create policy "public profiles are readable"
  on public.profiles for select
  using (true);

drop policy if exists "profiles can be inserted by client" on public.profiles;
create policy "profiles can be inserted by client"
  on public.profiles for insert
  with check (true);

drop policy if exists "profiles can be updated by client" on public.profiles;
create policy "profiles can be updated by client"
  on public.profiles for update
  using (true)
  with check (true);

drop policy if exists "public posts are readable" on public.posts;
create policy "public posts are readable"
  on public.posts for select
  using (visibility in ('Public', 'Followers'));

drop policy if exists "posts can be inserted by client" on public.posts;
create policy "posts can be inserted by client"
  on public.posts for insert
  with check (true);

drop policy if exists "follows are readable" on public.follows;
create policy "follows are readable"
  on public.follows for select
  using (true);

drop policy if exists "follows can be inserted by client" on public.follows;
create policy "follows can be inserted by client"
  on public.follows for insert
  with check (true);

drop policy if exists "follows can be deleted by client" on public.follows;
create policy "follows can be deleted by client"
  on public.follows for delete
  using (true);

drop policy if exists "messages are readable" on public.nearby_messages;
create policy "messages are readable"
  on public.nearby_messages for select
  using (true);

drop policy if exists "messages can be inserted by client" on public.nearby_messages;
create policy "messages can be inserted by client"
  on public.nearby_messages for insert
  with check (true);

drop policy if exists "reports can be inserted by client" on public.reports;
create policy "reports can be inserted by client"
  on public.reports for insert
  with check (true);

insert into storage.buckets (id, name, public)
values ('sightings-media', 'sightings-media', true)
on conflict (id) do update set public = true;

drop policy if exists "sightings media is publicly readable" on storage.objects;
create policy "sightings media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'sightings-media');

drop policy if exists "sightings media can be uploaded by client" on storage.objects;
create policy "sightings media can be uploaded by client"
  on storage.objects for insert
  with check (bucket_id = 'sightings-media');

drop policy if exists "sightings media can be updated by client" on storage.objects;
create policy "sightings media can be updated by client"
  on storage.objects for update
  using (bucket_id = 'sightings-media')
  with check (bucket_id = 'sightings-media');

do $$
begin
  alter publication supabase_realtime add table public.nearby_messages;
exception
  when duplicate_object then null;
end $$;
