create extension if not exists pg_trgm;
create extension if not exists pgcrypto;

alter database current set row_security = on;

create table if not exists public.profiles (
  id uuid primary key,
  email text not null,
  niche text[] default '{}',
  region text default null,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  r2_key text not null,
  url text not null,
  duration_s int not null,
  has_audio boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists videos_user_id_idx on public.videos(user_id);

create table if not exists public.analysis (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  status text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  error_code text
);
create index if not exists analysis_video_id_idx on public.analysis(video_id);

create table if not exists public.analysis_result (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null unique references public.analysis(id) on delete cascade,
  radar jsonb not null default '{}'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  warnings jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb
);
create index if not exists analysis_result_scores_gin on public.analysis_result using gin (scores jsonb_path_ops);

create table if not exists public.trends_cache (
  id bigserial primary key,
  platform text not null,
  region text not null,
  hours int not null,
  query text default null,
  payload jsonb not null,
  cached_at timestamptz not null default now()
);
create index if not exists trends_cache_lookup_idx
  on public.trends_cache(platform, region, hours, coalesce(query,''));

create table if not exists public.kits (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analysis(id) on delete cascade,
  title text not null,
  caption text not null,
  hashtags text[] not null default '{}',
  music_keywords text[] not null default '{}',
  best_time text default null,
  created_at timestamptz not null default now()
);
alter table public.kits add column if not exists search_tsv tsvector;
create index if not exists kits_search_tsv_gin on public.kits using gin (search_tsv);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_id_idx on public.notifications(user_id);

create or replace function public.kits_tsvector_update() returns trigger language plpgsql as $$
begin
  new.search_tsv :=
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.caption, '')), 'B') ||
    setweight(to_tsvector('simple', array_to_string(coalesce(new.hashtags, '{}'), ' ')), 'C');
  return new;
end $$;

drop trigger if exists kits_tsvector_update_trigger on public.kits;
create trigger kits_tsvector_update_trigger
  before insert or update of title, caption, hashtags
  on public.kits
  for each row execute function public.kits_tsvector_update();

alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.analysis enable row level security;
alter table public.analysis_result enable row level security;
alter table public.kits enable row level security;
alter table public.notifications enable row level security;

drop policy if exists profiles_user_is_owner on public.profiles;
create policy profiles_user_is_owner
  on public.profiles
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists videos_user_is_owner on public.videos;
create policy videos_user_is_owner
  on public.videos
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists analysis_user_is_owner on public.analysis;
create policy analysis_user_is_owner
  on public.analysis
  using (exists (
    select 1 from public.videos v
    where v.id = analysis.video_id and v.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.videos v
    where v.id = analysis.video_id and v.user_id = auth.uid()
  ));

drop policy if exists analysis_result_user_is_owner on public.analysis_result;
create policy analysis_result_user_is_owner
  on public.analysis_result
  using (exists (
    select 1 from public.analysis a
    join public.videos v on v.id = a.video_id
    where a.id = analysis_result.analysis_id and v.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.analysis a
    join public.videos v on v.id = a.video_id
    where a.id = analysis_result.analysis_id and v.user_id = auth.uid()
  ));

drop policy if exists kits_user_is_owner on public.kits;
create policy kits_user_is_owner
  on public.kits
  using (exists (
    select 1 from public.analysis a
    join public.videos v on v.id = a.video_id
    where a.id = kits.analysis_id and v.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.analysis a
    join public.videos v on v.id = a.video_id
    where a.id = kits.analysis_id and v.user_id = auth.uid()
  ));

drop policy if exists notifications_user_is_owner on public.notifications;
create policy notifications_user_is_owner
  on public.notifications
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index if not exists kits_caption_trgm on public.kits using gin (caption gin_trgm_ops);
