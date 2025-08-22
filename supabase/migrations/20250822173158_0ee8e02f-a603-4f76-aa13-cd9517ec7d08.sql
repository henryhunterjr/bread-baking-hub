-- Add trigram indexes for better partial string matching
create extension if not exists pg_trgm;

-- Add trigram indexes to improve search performance for partial matches
create index if not exists idx_blog_posts_title_trgm 
on public.blog_posts using gin (title gin_trgm_ops);

create index if not exists idx_recipes_title_trgm 
on public.recipes using gin (title gin_trgm_ops);

-- Add trigram indexes for content/excerpt fields  
create index if not exists idx_blog_posts_content_trgm 
on public.blog_posts using gin (content gin_trgm_ops);

-- Add composite indexes for better search performance
create index if not exists idx_blog_posts_search_composite
on public.blog_posts (is_draft, published_at desc) 
where is_draft = false and published_at is not null;

create index if not exists idx_recipes_search_composite
on public.recipes (is_public, created_at desc) 
where is_public = true;