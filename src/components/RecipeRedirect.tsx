import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RecipeRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect old pumpkin recipe URL to new one
    if (slug === 'pumpkin-shaped-sourdough-loaf') {
      navigate('/recipes/festive-pumpkin-sourdough-loaf', { replace: true });
    }
  }, [slug, navigate]);

  return null;
};

export default RecipeRedirect;