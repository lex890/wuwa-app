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

notify pgrst, 'reload schema';
