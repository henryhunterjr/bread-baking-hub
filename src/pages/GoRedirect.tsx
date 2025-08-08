import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const allowedHosts = new Set([
  'vitalesourdoughco.etsy.com',
  'etsy.com',
  'sourhouse.co',
  'modkitchn.com',
  'brodandtaylor.com',
  'challengerbreadware.com',
  'wiremonkey.com',
  'hollandbowlmill.com',
  'bit.ly',
  'youtube.com',
  'youtu.be',
  'gumroad.com',
  'websim.ai',
  'bakinggreatbread.blog'
]);

const slugMap: Record<string, string> = {
  vitale: 'https://vitalesourdoughco.etsy.com',
  'fb-community': 'https://bit.ly/3srdSYS'
};

const GoRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get('s');
    const urlParam = params.get('u');

    let target = '';

    if (slug && slugMap[slug]) {
      target = slugMap[slug];
    } else if (urlParam) {
      try {
        const parsed = new URL(urlParam);
        if (allowedHosts.has(parsed.hostname) || allowedHosts.has(parsed.hostname.replace(/^www\./, ''))) {
          target = parsed.toString();
        }
      } catch (_) {
        // ignore invalid URL
      }
    }

    if (target) {
      window.location.href = target;
    } else {
      navigate('/', { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <main className="min-h-[50vh] flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Taking you to your destination…</h1>
        <p className="text-muted-foreground">If you are not redirected, <a className="text-primary underline" href="/">go back home</a>.</p>
      </div>
    </main>
  );
};

export default GoRedirect;