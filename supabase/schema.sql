-- Tables
create table if not exists projects (
  id bigserial primary key,
  title text not null,
  cover_bg text default '#0b122b',
  cover_img_url text,
  slug text unique not null,
  status text check (status in ('published','draft','coming_soon')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists articles (
  id bigserial primary key,
  title text not null,
  slug text unique not null,
  summary text,
  content_html text,
  cover_img_url text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists comments (
  id bigserial primary key,
  article_id bigint references articles(id) on delete cascade not null,
  name text not null,
  email text,
  text text not null,
  is_approved boolean default false,
  created_at timestamptz default now()
);

create table if not exists contributions (
  id bigserial primary key,
  name text not null,
  email text not null,
  message text not null,
  file_url text,
  created_at timestamptz default now()
);

create table if not exists questions (
  id bigserial primary key,
  name text not null,
  email text not null,
  question text not null,
  created_at timestamptz default now()
);

create table if not exists policies (
  id bigserial primary key,
  type text check (type in ('terms','privacy')) not null,
  file_url text not null,
  updated_at timestamptz default now()
);

create table if not exists about (
  id bigserial primary key,
  body_html text,
  photo_url text,
  updated_at timestamptz default now()
);

-- updated_at triggers
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated on projects;
create trigger trg_projects_updated before update on projects for each row execute function set_updated_at();

drop trigger if exists trg_articles_updated on articles;
create trigger trg_articles_updated before update on articles for each row execute function set_updated_at();

drop trigger if exists trg_about_updated on about;
create trigger trg_about_updated before update on about for each row execute function set_updated_at();

-- Storage buckets (public)
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('policies', 'policies', true) on conflict (id) do nothing;
