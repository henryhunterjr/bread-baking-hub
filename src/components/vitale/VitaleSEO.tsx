import { Helmet } from 'react-helmet-async';

export const VitaleSEO = () => {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Vitale Sourdough Starter",
    "description": "Professional dehydrated sourdough starter - baking bread in just 3 days. $14 sachet builds two starters. Monthly tested, guaranteed to work.",
    "image": ["/lovable-uploads/154d14c0-76bd-47e3-b378-282823bda6fd.png"],
    "brand": {
      "@type": "Brand",
      "name": "Vitale's Sourdough Co."
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "14.00",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Person",
        "name": "Henry Hunter"
      }
    },
    "category": "Food & Beverages",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  };

  return (
    <Helmet>
      <title>Vitale Sourdough Starter - Baking Bread in 3 Days | BakingGreatBread.blog</title>
      <meta name="description" content="Get Vitale starter - baking bread in just 3 days. $14 sachet builds two starters. Professionally dehydrated, monthly tested, guaranteed to work." />
      <meta name="keywords" content="sourdough starter, vitale, dehydrated starter, bread baking, Henry Hunter, 3 day bread" />
      
      {/* Open Graph */}
      <meta property="og:title" content="Vitale Sourdough Starter - Baking Bread in 3 Days" />
      <meta property="og:description" content="Professional dehydrated sourdough starter. $14 sachet builds two starters. Start baking in just 3 days!" />
      <meta property="og:image" content="/lovable-uploads/154d14c0-76bd-47e3-b378-282823bda6fd.png" />
      <meta property="og:url" content="https://bakinggreatbread.blog/vitale-starter" />
      <meta property="og:type" content="product" />
      <meta property="og:site_name" content="Baking Great Bread at Home" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Vitale Sourdough Starter - Baking Bread in 3 Days" />
      <meta name="twitter:description" content="Professional dehydrated sourdough starter. $14 sachet builds two starters." />
      <meta name="twitter:image" content="/lovable-uploads/154d14c0-76bd-47e3-b378-282823bda6fd.png" />
      
      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};