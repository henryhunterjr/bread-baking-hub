import { Helmet } from 'react-helmet-async';

interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  author: string;
  publicationYear: number;
  rating: number;
  amazonUrl?: string;
  landingPageUrl?: string;
  coverImage: string;
  tags: string[];
  difficulty: string;
  format: string;
}

interface BookSEOProps {
  book: Book;
  canonical?: string;
}

export const BookSEO = ({ book, canonical }: BookSEOProps) => {
  const canonicalUrl = canonical || `https://bakinggreatbread.com/books/${book.id}`;
  
  // Generate structured data for book
  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "description": book.description,
    "author": {
      "@type": "Person",
      "name": book.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Baking Great Bread Publishing"
    },
    "datePublished": book.publicationYear.toString(),
    "genre": book.category,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": book.rating,
      "bestRating": 5,
      "ratingCount": 150
    },
    "offers": book.amazonUrl ? {
      "@type": "Offer",
      "price": "19.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": book.amazonUrl
    } : undefined,
    "image": book.coverImage,
    "url": canonicalUrl,
    "keywords": book.tags.join(", "),
    "inLanguage": "en-US",
    "format": book.format === "Digital" ? "EBook" : "Paperback"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://bakinggreatbread.com/#organization",
    "name": "Baking Great Bread",
    "url": "https://bakinggreatbread.com",
    "logo": "https://bakinggreatbread.com/assets/logo.png",
    "sameAs": [
      "https://www.youtube.com/@bakinggreatbread",
      "https://www.instagram.com/bakinggreatbread"
    ]
  };

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{book.title} by {book.author} | Baking Great Bread Books</title>
      <meta name="description" content={`${book.description} Learn ${book.category.toLowerCase()} baking with this ${book.difficulty.toLowerCase()} level guide.`} />
      <meta name="keywords" content={`${book.tags.join(', ')}, ${book.author}, bread baking, ${book.category}, ${book.difficulty} baking`} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="book" />
      <meta property="og:title" content={`${book.title} by ${book.author}`} />
      <meta property="og:description" content={book.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Baking Great Bread" />
      <meta property="og:image" content={book.coverImage} />
      <meta property="og:image:alt" content={`Cover of ${book.title} by ${book.author}`} />
      <meta property="book:author" content={book.author} />
      <meta property="book:release_date" content={book.publicationYear.toString()} />
      <meta property="book:tag" content={book.tags.join(', ')} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${book.title} by ${book.author}`} />
      <meta name="twitter:description" content={book.description} />
      <meta name="twitter:image" content={book.coverImage} />
      <meta name="twitter:image:alt" content={`Cover of ${book.title}`} />
      
      {/* Additional meta tags */}
      <meta name="author" content={book.author} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="theme-color" content="#d4a574" />
      
      {/* Book-specific meta tags */}
      <meta name="book:author" content={book.author} />
      <meta name="book:genre" content={book.category} />
      <meta name="book:publication_year" content={book.publicationYear.toString()} />
      <meta name="book:rating" content={book.rating.toString()} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bookSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
    </Helmet>
  );
};