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

notify pgrst, 'reload schema';
