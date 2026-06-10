create table if not exists public."wuwa-data" (
  id bigint primary key,
  created_at timestamptz not null default now(),
  name text not null,
  nickname text,
  quality_id integer,
  element_id integer,
  weapon_type integer,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public."wuwa-data"
  add column if not exists name text,
  add column if not exists nickname text,
  add column if not exists quality_id integer,
  add column if not exists element_id integer,
  add column if not exists weapon_type integer,
  add column if not exists payload jsonb,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists wuwa_data_name_idx
  on public."wuwa-data" (name);

create index if not exists wuwa_data_payload_gin_idx
  on public."wuwa-data" using gin (payload);

alter table public."wuwa-data" enable row level security;

drop policy if exists "Allow public read access" on public."wuwa-data";
create policy "Allow public read access"
  on public."wuwa-data"
  for select
  using (true);
