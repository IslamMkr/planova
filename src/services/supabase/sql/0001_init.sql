-- =========================================================
-- Coach Marketplace - Baseline Schema & RLS (Supabase)
-- (ORDER FIXED: plan_assets created BEFORE plan_items)
-- =========================================================

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create extension if not exists unaccent;
create extension if not exists citext;

-- ---------- Enums ----------
do $$ begin create type role_enum as enum ('buyer','creator','admin'); exception when duplicate_object then null; end $$;
do $$ begin create type plan_status_enum as enum ('draft','pending','published','unpublished'); exception when duplicate_object then null; end $$;
do $$ begin create type plan_item_type_enum as enum ('meal','workout','checklist','text','video','pdf'); exception when duplicate_object then null; end $$;
do $$ begin create type difficulty_enum as enum ('beginner','intermediate','advanced'); exception when duplicate_object then null; end $$;
do $$ begin create type purchase_status_enum as enum ('requires_payment','succeeded','partially_refunded','refunded','failed','disputed','canceled'); exception when duplicate_object then null; end $$;
do $$ begin create type review_status_enum as enum ('visible','flagged','removed'); exception when duplicate_object then null; end $$;
do $$ begin create type refund_status_enum as enum ('requested','approved','rejected','processed','canceled'); exception when duplicate_object then null; end $$;
do $$ begin create type asset_role_enum as enum ('thumbnail','cover','video','image','pdf','audio','attachment'); exception when duplicate_object then null; end $$;
do $$ begin create type refund_reason_enum as enum ('accidental','not_as_described','quality','other'); exception when duplicate_object then null; end $$;

-- ---------- Utilities ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- Profiles ----------
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username citext unique,
  first_name text not null default '',
  last_name text not null default '',
  display_name text,
  avatar_url text,
  cover_image_url text,
  bio text,
  locale text not null default 'en',
  time_zone text not null default 'UTC',
  marketing_opt_in boolean not null default false,
  role role_enum not null default 'buyer',
  onboarding_complete boolean not null default false,
  stripe_customer_id text,
  stripe_account_id text unique,
  last_sign_in_at timestamptz,
  email_verified_at timestamptz,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles for each row execute function public.touch_updated_at();
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_locale on public.profiles(locale);

-- ---------- Taxonomy ----------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug citext unique not null,
  name_en text not null,
  name_fr text not null,
  icon text,
  created_at timestamptz not null default now()
);

-- ---------- Plans ----------
create table if not exists public.plans (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references public.profiles(user_id) on delete cascade,
  slug citext not null,
  title text not null,
  summary text,
  description text,
  primary_language text not null default 'en',
  translations_available text[] not null default '{}',
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd' check (char_length(currency)=3),
  status plan_status_enum not null default 'draft',
  is_unlisted boolean not null default false,
  featured boolean not null default false,
  category_id uuid references public.categories(id),
  difficulty difficulty_enum,
  duration_days integer check (duration_days is null or duration_days >= 0),
  tags text[] not null default '{}',
  hero_image_url text,
  trailer_video_url text,
  rating_avg numeric(3,2) not null default 0.00,
  rating_count integer not null default 0,
  search_tsv tsvector generated always as (
    to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(description,''))
  ) stored,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (creator_id, slug)
);
create trigger trg_plans_updated before update on public.plans for each row execute function public.touch_updated_at();
create index if not exists idx_plans_status on public.plans(status);
create index if not exists idx_plans_creator on public.plans(creator_id);
create index if not exists idx_plans_category on public.plans(category_id);
create index if not exists idx_plans_language on public.plans(primary_language);
create index if not exists idx_plans_tsv on public.plans using gin (search_tsv);
create index if not exists idx_plans_trgm_title on public.plans using gin (title gin_trgm_ops);

-- ---------- Plan days ----------
create table if not exists public.plan_days (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  day_number integer not null check (day_number >= 1),
  title text,
  summary text,
  available_at date,
  unique (plan_id, day_number)
);

-- ---------- Plan assets (CREATE BEFORE items) ----------
create table if not exists public.plan_assets (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  role asset_role_enum not null,
  storage_path text not null,
  content_type text,
  bytes bigint check (bytes is null or bytes >= 0),
  checksum text,
  is_public boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_plan_assets_plan on public.plan_assets(plan_id);
create index if not exists idx_plan_assets_role on public.plan_assets(role);

-- ---------- Plan items (now safe to reference assets) ----------
create table if not exists public.plan_items (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  day_number integer not null,
  item_type plan_item_type_enum not null,
  title text,
  description text,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  kcal integer check (kcal is null or kcal >= 0),
  equipment text,
  order_index integer not null default 0,
  content jsonb not null default '{}',
  media_asset_id uuid references public.plan_assets(id) on delete set null,
  constraint fk_day foreign key (plan_id, day_number)
    references public.plan_days (plan_id, day_number) on delete cascade
);
create index if not exists idx_plan_items_plan_day on public.plan_items(plan_id, day_number);
create index if not exists idx_plan_items_order on public.plan_items(plan_id, day_number, order_index);

-- ---------- Purchases ----------
create table if not exists public.purchases (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references public.profiles(user_id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  status purchase_status_enum not null default 'requires_payment',
  quantity integer not null default 1 check (quantity > 0),
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'usd' check (char_length(currency)=3),
  platform_fee_bps integer check (platform_fee_bps is null or platform_fee_bps >= 0),
  application_fee_cents integer check (application_fee_cents is null or application_fee_cents >= 0),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  stripe_charge_id text,
  stripe_refund_id text,
  stripe_balance_txn_id text,
  stripe_customer_id text,
  receipt_url text,
  invoice_url text,
  payment_method_brand text,
  payment_method_last4 text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_purchases_updated before update on public.purchases for each row execute function public.touch_updated_at();
create index if not exists idx_purchases_buyer on public.purchases(buyer_id);
create index if not exists idx_purchases_plan on public.purchases(plan_id);
create index if not exists idx_purchases_status on public.purchases(status);

-- ---------- Reviews ----------
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  buyer_id uuid not null references public.profiles(user_id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  comment text,
  helpful_count integer not null default 0,
  status review_status_enum not null default 'visible',
  flagged_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, buyer_id)
);
create trigger trg_reviews_updated before update on public.reviews for each row execute function public.touch_updated_at();
create index if not exists idx_reviews_plan on public.reviews(plan_id);
create index if not exists idx_reviews_status on public.reviews(status);

-- Keep plans.rating_* in sync
create or replace function public.recalc_plan_rating() returns trigger
language plpgsql as $$
begin
  update public.plans p
  set rating_avg = coalesce((select avg(rating)::numeric(3,2) from public.reviews r where r.plan_id = p.id and r.status='visible'), 0.00),
      rating_count = coalesce((select count(*) from public.reviews r where r.plan_id = p.id and r.status='visible'), 0)
  where p.id = coalesce(new.plan_id, old.plan_id);
  return null;
end $$;
drop trigger if exists trg_reviews_recalc on public.reviews;
create trigger trg_reviews_recalc after insert or update or delete on public.reviews
for each row execute function public.recalc_plan_rating();

-- ---------- Refund Requests ----------
create table if not exists public.refund_requests (
  id uuid primary key default uuid_generate_v4(),
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  requester_id uuid not null references public.profiles(user_id) on delete cascade,
  reason_code refund_reason_enum not null default 'other',
  reason text,
  refund_amount_cents integer check (refund_amount_cents is null or refund_amount_cents >= 0),
  stripe_refund_id text,
  status refund_status_enum not null default 'requested',
  decided_by uuid references public.profiles(user_id),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_refund_requests_updated before update on public.refund_requests for each row execute function public.touch_updated_at();
create index if not exists idx_refunds_purchase on public.refund_requests(purchase_id);
create index if not exists idx_refunds_status on public.refund_requests(status);

-- ---------- Progress ----------
create table if not exists public.progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  day_number integer not null,
  item_id uuid references public.plan_items(id) on delete set null,
  completed boolean not null default true,
  notes text,
  last_seen_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plan_id, day_number, item_id)
);
create trigger trg_progress_updated before update on public.progress for each row execute function public.touch_updated_at();

-- =========================================================
-- RLS (enable on all tables) - Least privilege
-- =========================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.plans enable row level security;
alter table public.plan_days enable row level security;
alter table public.plan_items enable row level security;
alter table public.plan_assets enable row level security;
alter table public.purchases enable row level security;
alter table public.reviews enable row level security;
alter table public.refund_requests enable row level security;
alter table public.progress enable row level security;

-- -------- Profiles --------
create policy "profiles: select own or admin" on public.profiles for select
  using ( user_id = auth.uid()
          or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin') );
create policy "profiles: insert self" on public.profiles for insert with check ( user_id = auth.uid() );
create policy "profiles: update self or admin" on public.profiles for update
  using ( user_id = auth.uid()
          or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin') );

-- -------- Categories --------
create policy "categories: public read" on public.categories for select using ( true );

-- -------- Plans --------
create policy "plans: public can read published and not unlisted" on public.plans for select
  using ( status = 'published' and is_unlisted = false );
create policy "plans: purchasers/creators/admin can read" on public.plans for select
  using (
    creator_id = auth.uid()
    or exists (select 1 from public.purchases pu where pu.plan_id = plans.id and pu.buyer_id = auth.uid() and pu.status in ('succeeded','partially_refunded','refunded'))
    or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin')
  );
create policy "plans: creator insert own" on public.plans for insert with check ( creator_id = auth.uid() );
create policy "plans: creator/admin update own" on public.plans for update
  using ( creator_id = auth.uid()
          or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin') );

-- -------- Plan days/items/assets --------
create policy "plan_days: read when plan readable" on public.plan_days for select using (
  exists (
    select 1 from public.plans p
    where p.id = plan_days.plan_id and (
      (p.status='published' and p.is_unlisted=false)
      or p.creator_id = auth.uid()
      or exists (select 1 from public.purchases pu where pu.plan_id = p.id and pu.buyer_id = auth.uid() and pu.status in ('succeeded','partially_refunded','refunded'))
      or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin')
    )
  )
);
create policy "plan_items: read when plan readable" on public.plan_items for select using (
  exists (
    select 1 from public.plans p
    where p.id = plan_items.plan_id and (
      (p.status='published' and p.is_unlisted=false)
      or p.creator_id = auth.uid()
      or exists (select 1 from public.purchases pu where pu.plan_id = p.id and pu.buyer_id = auth.uid() and pu.status in ('succeeded','partially_refunded','refunded'))
      or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin')
    )
  )
);
create policy "plan_assets: read when plan readable" on public.plan_assets for select using (
  exists (
    select 1 from public.plans p
    where p.id = plan_assets.plan_id and (
      (p.status='published' and p.is_unlisted=false and plan_assets.is_public = true)
      or p.creator_id = auth.uid()
      or exists (select 1 from public.purchases pu where pu.plan_id = p.id and pu.buyer_id = auth.uid() and pu.status in ('succeeded','partially_refunded','refunded'))
      or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin')
    )
  )
);
create policy "plan_days: creator manage" on public.plan_days for all
  using ( exists (select 1 from public.plans p where p.id = plan_days.plan_id and p.creator_id = auth.uid()) )
  with check ( exists (select 1 from public.plans p where p.id = plan_days.plan_id and p.creator_id = auth.uid()) );
create policy "plan_items: creator manage" on public.plan_items for all
  using ( exists (select 1 from public.plans p where p.id = plan_items.plan_id and p.creator_id = auth.uid()) )
  with check ( exists (select 1 from public.plans p where p.id = plan_items.plan_id and p.creator_id = auth.uid()) );
create policy "plan_assets: creator manage" on public.plan_assets for all
  using ( exists (select 1 from public.plans p where p.id = plan_assets.plan_id and p.creator_id = auth.uid()) )
  with check ( exists (select 1 from public.plans p where p.id = plan_assets.plan_id and p.creator_id = auth.uid()) );

-- -------- Purchases --------
create policy "purchases: buyer can read own" on public.purchases for select using ( buyer_id = auth.uid() );
create policy "purchases: creator read purchases of their plans" on public.purchases for select using (
  exists (select 1 from public.plans p where p.id = purchases.plan_id and p.creator_id = auth.uid())
);
create policy "purchases: admin read" on public.purchases for select using (
  exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin')
);

-- -------- Reviews --------
create policy "reviews: read visible or admin" on public.reviews for select using (
  status = 'visible' or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin')
);
create policy "reviews: verified buyer can insert" on public.reviews for insert with check (
  buyer_id = auth.uid()
  and exists (select 1 from public.purchases pu where pu.plan_id = reviews.plan_id and pu.buyer_id = auth.uid() and pu.status in ('succeeded','partially_refunded','refunded'))
);
create policy "reviews: owner can update/delete" on public.reviews for update using (buyer_id = auth.uid()) with check (buyer_id = auth.uid());
create policy "reviews: owner can delete" on public.reviews for delete using (buyer_id = auth.uid());

-- -------- Refund Requests --------
create policy "refunds: buyer create" on public.refund_requests for insert with check (
  requester_id = auth.uid()
  and exists (select 1 from public.purchases pu where pu.id = refund_requests.purchase_id and pu.buyer_id = auth.uid())
);
create policy "refunds: read own or admin" on public.refund_requests for select using (
  requester_id = auth.uid()
  or exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role='admin')
);

-- -------- Progress --------
create policy "progress: upsert own" on public.progress for insert with check (user_id = auth.uid());
create policy "progress: update own" on public.progress for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "progress: read own" on public.progress for select using (user_id = auth.uid());
