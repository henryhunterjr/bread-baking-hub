import { Star } from 'lucide-react';
import { sanitizeStructuredData } from '@/utils/sanitize';

interface Testimonial {
  quote: string;
  author: string;
  rating: number; // 1-5
}

const testimonials: Testimonial[] = [
  {
    quote: "Henry's method finally gave me consistent oven spring. My family thinks I'm a pro! The troubleshooting guide saved my sourdough starter after I thought it was ruined.",
    author: 'Marissa K., Portland (via Instagram)',
    rating: 5,
  },
  {
    quote: 'The seasonal approach clicked for me—my summer focaccia has never been better. I love how Henry explains the science behind temperature and humidity effects.',
    author: 'Daniel R., Austin (Facebook Community)',
    rating: 5,
  },
  {
    quote: 'Clear steps, zero fluff. I went from flat loaves to gorgeous ear scores in a week. My neighbors keep asking for bread now!',
    author: 'Priya S., Toronto (Email Subscriber)',
    rating: 5,
  },
  {
    quote: 'The tools guide helped me choose the right equipment. My investment in a good banneton and lame made all the difference in my bread quality.',
    author: 'James M., Seattle (YouTube Comment)',
    rating: 5,
  },
  {
    quote: 'Henry\'s podcast episodes while I bake are perfect. The timing tips and his calm explanations make even complicated techniques feel approachable.',
    author: 'Sofia L., Miami (Podcast Review)',
    rating: 5,
  },
];

export const Testimonials = ({ className = '' }: { className?: string }) => {
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: testimonials.map((t, i) => ({
      '@type': 'Review',
      position: i + 1,
      reviewBody: t.quote,
      reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
      author: { '@type': 'Person', name: t.author },
      itemReviewed: { '@type': 'Organization', name: 'Baking Great Bread' },
    })),
  };

  return (
    <section className={`w-full ${className}`} aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="text-2xl md:text-3xl font-semibold mb-4">Loved by home bakers</h2>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="px-3 py-2 rounded-full border bg-card text-sm">Used by 30k+ home bakers</div>
        <div className="px-3 py-2 rounded-full border bg-card text-sm">Private Facebook community</div>
        <div className="px-3 py-2 rounded-full border bg-card text-sm">Secure redirects</div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {testimonials.slice(0, 3).map((t, idx) => (
          <blockquote key={idx} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-1 mb-2" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
              ))}
            </div>
            <p className="text-base leading-relaxed mb-2">“{t.quote}”</p>
            <footer className="text-sm text-muted-foreground">— {t.author}</footer>
          </blockquote>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeStructuredData(reviewSchema) }}
      />
    </section>
  );
};

export default Testimonials;
