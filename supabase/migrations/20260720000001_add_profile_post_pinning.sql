alter table public.profile_posts
  add column if not exists pinned boolean not null default false;

create index if not exists profile_posts_user_pinned_created_idx
  on public.profile_posts (user_id, pinned desc, created_at desc);

notify pgrst, 'reload schema';
