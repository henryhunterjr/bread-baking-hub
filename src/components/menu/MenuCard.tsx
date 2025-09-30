import { MenuItem } from '@/data/menuData';

interface MenuCardProps {
  item: MenuItem;
  onCustomize?: (item: MenuItem) => void;
  onQuickAdd?: (item: MenuItem) => void;
}

const MenuCard = ({ item, onCustomize, onQuickAdd }: MenuCardProps) => {
  const handleClick = () => {
    if (item.needsCustomization && onCustomize) {
      onCustomize(item);
    } else if (onQuickAdd) {
      onQuickAdd(item);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.needsCustomization && onCustomize) {
      onCustomize(item);
    } else if (onQuickAdd) {
      onQuickAdd(item);
    }
  };

  return (
    <div 
      className="bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border-2 border-transparent hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/30 hover:border-orange-500"
      onClick={handleClick}
    >
      <div className="w-full h-48 bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center text-6xl relative overflow-hidden">
        {item.popular && (
          <div className="absolute top-2 left-2 bg-yellow-500/95 text-black px-3 py-1 rounded-full text-xs font-bold z-10">
            ⭐ POPULAR
          </div>
        )}
        {item.heat && (
          <div className="absolute top-2 right-2 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
            {item.heat}
          </div>
        )}
        <span className="relative z-10">{item.emoji}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-white">{item.name}</h3>
            {item.subtitle && (
              <div className="text-sm text-orange-500 italic mt-1">{item.subtitle}</div>
            )}
          </div>
          <div className="text-xl text-orange-500 font-bold">${item.price}</div>
        </div>
        
        <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={handleButtonClick}
            className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-bold text-sm transition-all duration-300 hover:bg-orange-600 hover:scale-105"
          >
            {item.needsCustomization ? 'Build Your Order' : 'Add to Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;