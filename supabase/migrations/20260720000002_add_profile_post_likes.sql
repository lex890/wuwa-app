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

notify pgrst, 'reload schema';
