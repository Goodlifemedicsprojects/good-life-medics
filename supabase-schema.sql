-- ============================================
-- GOOD LIFE MEDICS — Supabase Database Schema
-- Safe to run multiple times (idempotent)
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ---- TABLES ----
create table if not exists ebooks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  type text not null check (type in ('free', 'paid')),
  drive_link text,
  price numeric(10,2),
  cover_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists subscribers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  ebook_title text,
  source text default 'popup',
  created_at timestamptz default now()
);

create table if not exists newsletter_signups (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz default now()
);

create table if not exists site_config (
  id integer primary key default 1,
  whatsapp_number text,
  creator_email text,
  creator_photo_url text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

insert into site_config (id) values (1) on conflict do nothing;

-- ---- ROW LEVEL SECURITY ----
alter table ebooks enable row level security;
alter table subscribers enable row level security;
alter table newsletter_signups enable row level security;
alter table site_config enable row level security;

-- Drop existing policies first to avoid conflicts
drop policy if exists "Public can read ebooks" on ebooks;
drop policy if exists "Public can subscribe to newsletter" on newsletter_signups;
drop policy if exists "Public can read site config" on site_config;

-- Recreate policies
create policy "Public can read ebooks"
  on ebooks for select using (true);

create policy "Public can subscribe to newsletter"
  on newsletter_signups for insert with check (true);

create policy "Public can read site config"
  on site_config for select using (true);

-- ---- INDEXES ----
create index if not exists idx_subscribers_email on subscribers(email);
create index if not exists idx_subscribers_created on subscribers(created_at desc);
create index if not exists idx_newsletter_email on newsletter_signups(email);
create index if not exists idx_ebooks_type on ebooks(type);
create index if not exists idx_ebooks_created on ebooks(created_at desc);
