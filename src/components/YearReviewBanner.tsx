import { X, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'yearReviewBannerDismissed2025_session';

export const YearReviewBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(DISMISS_KEY);
      if (dismissed === 'true') setIsVisible(false);
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // ignore storage errors
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white py-2.5 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <Sparkles className="h-4 w-4 flex-shrink-0 animate-pulse" />
        <p className="text-sm font-medium text-center">
          <span className="hidden sm:inline">🎉 </span>
          <a href="/year-review-2025/index.html" className="underline hover:no-underline font-semibold">
            2025 Year in Review
          </a>
          <span className="hidden sm:inline"> — See how we rose together this year!</span>
          <span className="sm:hidden"> is here!</span>
        </p>
        <Sparkles className="h-4 w-4 flex-shrink-0 animate-pulse hidden sm:block" />
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default YearReviewBanner;
