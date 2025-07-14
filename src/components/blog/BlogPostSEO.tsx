import { Helmet } from 'react-helmet-async';
import { generateBlogPostingSchema } from '@/utils/structuredData';
import { BlogPost } from '@/utils/blogFetcher';

interface BlogPostSEOProps {
  post: BlogPost;
  fullContent?: string;
  canonical?: string;
  socialImageUrl?: string;
}

export const BlogPostSEO = ({ post, fullContent, canonical, socialImageUrl }: BlogPostSEOProps) => {
  // Create clean description from excerpt, removing any remaining HTML
  const cleanDescription = post.excerpt.replace(/&[^;]+;/g, '').trim();
  
  // Generate canonical URL (use provided or fall back to post link)
  const canonicalUrl = canonical || post.link;
  
  // Convert date to ISO format for structured data
  const publishedDate = new Date(post.date).toISOString();
  const modifiedDate = new Date(post.modified).toISOString();
  
  // Use socialImageUrl prop (which contains the social_image_url logic) or fallback to post image
  const finalImageUrl = socialImageUrl || post.image;
  
  // Debug logging
  console.log('BlogPostSEO - socialImageUrl:', socialImageUrl);
  console.log('BlogPostSEO - post.image:', post.image);
  console.log('BlogPostSEO - finalImageUrl:', finalImageUrl);

  // Generate JSON-LD structured data
  const structuredData = generateBlogPostingSchema({
    title: post.title,
    description: cleanDescription,
    image: finalImageUrl,
    url: canonicalUrl,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: post.author.name,
    publisher: "Baking Great Bread",
    readTime: post.readTime,
    tags: post.tags,
    authorAvatar: post.author.avatar,
    authorDescription: post.author.description
  });

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{post.title} | Baking Great Bread</title>
      <meta name="description" content={cleanDescription} />
      <meta name="keywords" content={post.tags.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Baking Great Bread" />
      {finalImageUrl && <meta property="og:image" content={finalImageUrl} />}
      {finalImageUrl && <meta property="og:image:alt" content={post.imageAlt} />}
      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDate} />
      <meta property="article:author" content={post.author.name} />
      <meta property="article:section" content="Bread Baking" />
      {post.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={cleanDescription} />
      {finalImageUrl && <meta name="twitter:image" content={finalImageUrl} />}
      {finalImageUrl && <meta name="twitter:image:alt" content={post.imageAlt} />}
      
      {/* Additional meta tags */}
      <meta name="author" content={post.author.name} />
      <meta name="publisher" content="Baking Great Bread" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData
        }}
      />
    </Helmet>
  );
};

export default BlogPostSEO;