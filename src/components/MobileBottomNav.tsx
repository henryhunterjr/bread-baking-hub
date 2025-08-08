import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Bookmark, Search } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/recipes', label: 'Recipes', icon: BookOpen },
  { to: '/my-recipes', label: 'Saved', icon: Bookmark },
  { to: '/search-test', label: 'Search', icon: Search },
];

const MobileBottomNav = () => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <ul className="flex justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) => `flex flex-col items-center justify-center h-14 text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
              aria-label={label}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="mt-0.5">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
