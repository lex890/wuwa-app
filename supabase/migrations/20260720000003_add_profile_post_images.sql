alter table public.profile_posts
  add column if not exists images jsonb,
  add column if not exists image_paths jsonb;

notify pgrst, 'reload schema';
