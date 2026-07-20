alter table public.users
  add column if not exists email text,
  add column if not exists uname text,
  add column if not exists role text default 'user',
  add column if not exists verified boolean default false;

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
