interface StructuredDataProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  datePublished?: string;
  author?: string;
  publisher?: string;
}

export const generateBlogPostingSchema = ({
  title,
  description,
  image,
  url,
  datePublished,
  author = "Henry",
  publisher = "Baking Great Bread"
}: StructuredDataProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image,
    "url": url,
    "datePublished": datePublished,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": publisher,
      "logo": {
        "@type": "ImageObject",
        "url": "https://bakinggreatbread.blog/wp-content/uploads/2023/logo.png"
      }
    }
  };

  return JSON.stringify(schema);
};

export const generateBlogListingSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Baking Great Bread Blog",
    "description": "Expert bread baking tips, troubleshooting guides, and recipes from Henry",
    "url": "https://bakinggreatbread.blog",
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