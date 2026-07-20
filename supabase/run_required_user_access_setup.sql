-- Run this whole script once in Supabase SQL Editor.
-- It combines the required UserAccess/profile migrations and is safe to rerun.

-- Username login lookup.
create or replace function public.get_email_for_username(username_input text)
returns text
language sql
security definer
set search_path = public
as $$
  select email
  from public.users
  where lower(uname) = lower(trim(username_input))
  limit 1
$$;

grant execute on function public.get_email_for_username(text) to anon;
grant execute on function public.get_email_for_username(text) to authenticated;

-- User profile columns used by auth/profile pages.
alter table public.users
  add column if not exists email text,
  add column if not exists uname text,
  add column if not exists role text default 'user',
  add column if not exists verified boolean default false,
  add column if not exists avatar text,
  add column if not exists banner text,
  add column if not exists bio text;

-- Public-safe profile view used by feeds and cross-profile liked posts.
create or replace view public.user_profiles as
select
  id,
  uname,
  avatar,
  banner,
  bio,
  created
from public.users;

grant select on public.user_profiles to anon, authenticated;

-- Profile posts.
create table if not exists public.profile_posts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  body text,
  image_url text,
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  images jsonb,
  image_paths jsonb,
  pinned boolean not null default false,
  constraint profile_posts_has_content check (
    nullif(trim(coalesce(body, '')), '') is not null
    or nullif(trim(coalesce(image_url, '')), '') is not null
    or jsonb_array_length(coalesce(images, '[]'::jsonb)) > 0
  )
);

alter table public.profile_posts
  add column if not exists images jsonb,
  add column if not exists image_paths jsonb,
  add column if not exists pinned boolean not null default false;

create index if not exists profile_posts_user_created_idx
  on public.profile_posts (user_id, created_at desc);

create index if not exists profile_posts_user_pinned_created_idx
  on public.profile_posts (user_id, pinned desc, created_at desc);

alter table public.profile_posts enable row level security;

drop policy if exists "Allow public read profile posts" on public.profile_posts;
create policy "Allow public read profile posts"
  on public.profile_posts
  for select
  using (true);

drop policy if exists "Allow users to create own profile posts" on public.profile_posts;
create policy "Allow users to create own profile posts"
  on public.profile_posts
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Allow users to update own profile posts" on public.profile_posts;
create policy "Allow users to update own profile posts"
  on public.profile_posts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Allow users to delete own profile posts" on public.profile_posts;
create policy "Allow users to delete own profile posts"
  on public.profile_posts
  for delete
  using (auth.uid() = user_id);

-- Profile post likes.
create table if not exists public.profile_post_likes (
  post_id bigint not null references public.profile_posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists profile_post_likes_user_created_idx
  on public.profile_post_likes (user_id, created_at desc);

alter table public.profile_post_likes enable row level security;

drop policy if exists "Allow public read profile post likes" on public.profile_post_likes;
create policy "Allow public read profile post likes"
  on public.profile_post_likes
  for select
  using (true);

drop policy if exists "Allow users to like posts" on public.profile_post_likes;
create policy "Allow users to like posts"
  on public.profile_post_likes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Allow users to unlike posts" on public.profile_post_likes;
create policy "Allow users to unlike posts"
  on public.profile_post_likes
  for delete
  using (auth.uid() = user_id);

-- Profile media storage bucket and policies.
insert into storage.buckets (id, name, public)
values ('profile-media', 'profile-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Allow public read profile media" on storage.objects;
create policy "Allow public read profile media"
  on storage.objects
  for select
  using (bucket_id = 'profile-media');

drop policy if exists "Allow users to upload own profile media" on storage.objects;
create policy "Allow users to upload own profile media"
  on storage.objects
  for insert
  with check (
    bucket_id = 'profile-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Allow users to update own profile media" on storage.objects;
create policy "Allow users to update own profile media"
  on storage.objects
  for update
  using (
    bucket_id = 'profile-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'profile-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Allow users to delete own profile media" on storage.objects;
create policy "Allow users to delete own profile media"
  on storage.objects
  for delete
  using (
    bucket_id = 'profile-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Sync Supabase Auth users into public.users.
create or replace function public.sync_auth_user_to_public_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, uname, role, verified)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data->>'uname', '')), ''),
    'user',
    new.email_confirmed_at is not null
  )
  on conflict (id) do update
  set
    email = excluded.email,
    uname = coalesce(public.users.uname, excluded.uname),
    role = coalesce(public.users.role, excluded.role),
    verified = excluded.verified;

  return new;
end;
$$;

drop trigger if exists sync_auth_user_to_public_user on auth.users;
create trigger sync_auth_user_to_public_user
after insert or update of email, email_confirmed_at, raw_user_meta_data
on auth.users
for each row
execute function public.sync_auth_user_to_public_user();

-- Backfill users that already exist in Supabase Auth.
insert into public.users (id, email, uname, role, verified)
select
  auth_users.id,
  auth_users.email,
  nullif(trim(coalesce(auth_users.raw_user_meta_data->>'uname', '')), ''),
  'user',
  auth_users.email_confirmed_at is not null
from auth.users auth_users
on conflict (id) do update
set
  email = excluded.email,
  uname = coalesce(public.users.uname, excluded.uname),
  role = coalesce(public.users.role, excluded.role),
  verified = excluded.verified;

notify pgrst, 'reload schema';
