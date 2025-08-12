import { Helmet } from 'react-helmet-async';

interface DefaultSEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

const DEFAULTS = {
  title: 'Baking Great Bread',
  description: 'Master the art of bread baking with expert recipes, troubleshooting guides, and a vibrant community led by Henry Hunter.',
  url: 'https://bread-baking-hub.vercel.app',
  image: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif',
};

export const DefaultSEO = ({ title, description, url, image }: DefaultSEOProps) => {
  const t = title ? `${title} | ${DEFAULTS.title}` : DEFAULTS.title;
  const d = description || DEFAULTS.description;
  const u = url || DEFAULTS.url;
  const i = image || DEFAULTS.image;

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={u} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:url" content={u} />
      <meta property="og:site_name" content="Baking Great Bread" />
      <meta property="og:image" content={i} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={i} />
    </Helmet>
  );
};

export default DefaultSEO;
