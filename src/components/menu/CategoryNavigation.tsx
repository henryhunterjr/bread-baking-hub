interface CategoryNavigationProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'featured', label: '🔥 You Gotta Try' },
  { id: 'wings', label: '🍗 All Wings' },
  { id: 'sides', label: '🍟 On the Side' },
  { id: 'drinks', label: '🥤 Cool Down' },
  { id: 'combos', label: '🎁 The Whole Spread' },
];

const CategoryNavigation = ({ activeCategory, onCategoryChange }: CategoryNavigationProps) => {
  return (
    <nav className="flex justify-center gap-2 md:gap-3 px-4 py-5 bg-zinc-900 sticky top-0 z-40 flex-wrap">
      {categories.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onCategoryChange(id)}
          className={`px-6 md:px-7 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 border-2 border-orange-500 ${
            activeCategory === id
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 transform -translate-y-0.5'
              : 'bg-zinc-800 text-white hover:bg-orange-500 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/40'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

export default CategoryNavigation;