alter table public.users
  add column if not exists bio text;

notify pgrst, 'reload schema';
