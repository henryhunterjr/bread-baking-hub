-- Allow anonymous users to read published blog posts for social media crawlers
-- Remove the blocking policy that prevents anon access
DROP POLICY "Block anon direct access to blog_posts" ON blog_posts;

-- Update the existing policy to allow anon access to published posts
DROP POLICY "Anyone can view published blog posts" ON blog_posts;

-- Create new policy that allows both authenticated and anonymous users to view published posts
CREATE POLICY "Published posts are publicly accessible" 
ON blog_posts FOR SELECT 
USING (is_draft = false AND published_at IS NOT NULL);