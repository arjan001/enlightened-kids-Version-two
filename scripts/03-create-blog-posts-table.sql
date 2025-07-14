create table
  public.blog_posts (
    id uuid not null default gen_random_uuid (),
    title text not null,
    content text not null,
    author text not null,
    tags text[] null,
    image_url text null,
    is_published boolean not null default false,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null,
    excerpt text null,
    category text null,
    read_time text null,
    published_at timestamp with time zone null,
    views bigint null default '0'::bigint,
    constraint blog_posts_pkey primary key (id)
  );

alter table public.blog_posts enable row level security;

create policy "Enable read access for all users" on "public"."blog_posts" as permissive for
select
  to public using (true);

create policy "Allow authenticated users to insert" on "public"."blog_posts" as permissive for insert to authenticated
with
  check (true);

create policy "Allow authenticated users to update" on "public"."blog_posts" as permissive for
update
  to authenticated using (true);

create policy "Allow authenticated users to delete" on "public"."blog_posts" as permissive for delete to authenticated using (true);
