import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { haptic } from '@/utils/haptics';

const FloatingRecipeFab = () => {
  return (
    <Link
      to="/my-recipes"
      onClick={() => haptic()}
      className="fixed md:hidden bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-warm hover:opacity-90"
      aria-label="Quick access to saved recipes"
    >
      <Plus className="h-6 w-6" aria-hidden="true" />
    </Link>
  );
};

export default FloatingRecipeFab;
