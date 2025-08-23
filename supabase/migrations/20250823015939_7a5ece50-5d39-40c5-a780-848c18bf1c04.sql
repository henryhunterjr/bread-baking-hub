-- Enable trigram extension for improved text search performance
create extension if not exists pg_trgm;

-- Create trigram indexes for faster partial text search on blog posts and recipes
create index if not exists idx_blog_posts_title_trgm
  on public.blog_posts using gin (title gin_trgm_ops);

create index if not exists idx_recipes_title_trgm
  on public.recipes using gin (title gin_trgm_ops);