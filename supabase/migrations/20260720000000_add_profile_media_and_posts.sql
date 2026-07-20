alter table public.users
  add column if not exists banner text;

create table if not exists public.profile_posts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  body text,
  image_url text,
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_posts_has_content check (
    nullif(trim(coalesce(body, '')), '') is not null
    or nullif(trim(coalesce(image_url, '')), '') is not null
  )
);

create index if not exists profile_posts_user_created_idx
  on public.profile_posts (user_id, created_at desc);

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

notify pgrst, 'reload schema';
