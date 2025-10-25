interface StructuredDataProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  publisher?: string;
  readTime?: string;
  tags?: string[];
  authorAvatar?: string;
  authorDescription?: string;
}

export const generateBlogPostingSchema = ({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  author = "Henry",
  publisher = "Baking Great Bread",
  readTime,
  tags = [],
  authorAvatar,
  authorDescription
}: StructuredDataProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image ? [image] : undefined,
    "url": url,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": author,
      "image": authorAvatar,
      "description": authorDescription
    },
    "publisher": {
      "@type": "Organization",
      "name": publisher,
      "logo": {
        "@type": "ImageObject",
        "url": "https://bakinggreatbread.com/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "keywords": tags.join(", "),
    "wordCount": readTime ? parseInt(readTime.split(' ')[0]) * 200 : undefined, // Estimate word count from read time
    "timeRequired": readTime ? `PT${readTime.split(' ')[0]}M` : undefined // ISO 8601 duration format
  };

  return JSON.stringify(schema);
};

export const generateBlogListingSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Baking Great Bread Blog",
    "description": "Expert bread baking tips, troubleshooting guides, and recipes from Henry",
    "url": "https://bakinggreatbread.com/blog",
    "author": {
      "@type": "Person",
      "name": "Henry"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Baking Great Bread"
    }
  };

  return JSON.stringify(schema);
};