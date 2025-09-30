import { useState, useEffect } from 'react';
import { MenuItem } from '@/data/menuData';
import { useCartStore } from '@/store/useCartStore';
import { X } from 'lucide-react';

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const heatOptions = [
  { level: '🔥', name: 'Mild', description: 'Flavorful, no sweat' },
  { level: '🔥🔥', name: 'Medium', description: 'A little kick' },
  { level: '🔥🔥🔥', name: 'Hot', description: 'Bring napkins' },
  { level: '🔥🔥🔥🔥', name: 'Inferno', description: "You've been warned" },
];

const sauceOptions = [
  { name: 'Buffalo', description: 'The classic' },
  { name: 'BBQ', description: 'Sweet & smoky' },
  { name: 'Honey Garlic', description: 'Crowd pleaser' },
  { name: 'Lemon Pepper', description: 'Tangy & bright' },
  { name: 'Teriyaki', description: 'Asian twist' },
  { name: 'Mango Habanero', description: 'Sweet meets heat' },
];

const CustomizationModal = ({ item, isOpen, onClose }: CustomizationModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedHeat, setSelectedHeat] = useState<string>('');
  const [selectedSauce, setSelectedSauce] = useState<string>('');
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setSelectedHeat('');
      setSelectedSauce('');
    }
  }, [isOpen, item]);

  const handleAddToCart = () => {
    if (!item) return;
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      heat: selectedHeat,
      sauce: selectedSauce,
    });
    
    onClose();
  };

  const changeQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  if (!isOpen || !item) return null;

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-orange-500">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{item.name}</h2>
            {item.tagline && (
              <p className="text-white/90 italic mt-1">{item.tagline}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-4">How Hot You Want It?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {heatOptions.map((heat) => (
                <div
                  key={heat.name}
                  onClick={() => setSelectedHeat(heat.name)}
                  className={`p-4 rounded-xl cursor-pointer text-center transition-all duration-300 border-2 ${
                    selectedHeat === heat.name
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-transparent bg-zinc-800 hover:border-orange-500 hover:bg-zinc-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{heat.level}</div>
                  <div className="font-semibold text-sm">{heat.name}</div>
                  <div className={`text-xs mt-1 ${
                    selectedHeat === heat.name ? 'text-white' : 'text-zinc-400'
                  }`}>
                    {heat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-4">Pick Your Sauce</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sauceOptions.map((sauce) => (
                <div
                  key={sauce.name}
                  onClick={() => setSelectedSauce(sauce.name)}
                  className={`p-4 rounded-xl cursor-pointer text-center transition-all duration-300 border-2 ${
                    selectedSauce === sauce.name
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-transparent bg-zinc-800 hover:border-orange-500 hover:bg-zinc-700'
                  }`}
                >
                  <div className="font-semibold text-sm">{sauce.name}</div>
                  <div className={`text-xs mt-1 ${
                    selectedSauce === sauce.name ? 'text-white' : 'text-zinc-400'
                  }`}>
                    {sauce.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-4">How Many?</h3>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => changeQuantity(-1)}
                className="w-12 h-12 bg-orange-500 text-white text-xl font-bold rounded-lg hover:bg-orange-600 transition-colors"
              >
                -
              </button>
              <div className="text-2xl font-bold text-white min-w-[3rem] text-center">
                {quantity}
              </div>
              <button
                onClick={() => changeQuantity(1)}
                className="w-12 h-12 bg-orange-500 text-white text-xl font-bold rounded-lg hover:bg-orange-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-orange-500 text-white text-xl font-bold rounded-xl hover:bg-orange-600 transition-all duration-300 hover:scale-105"
          >
            Add to Cart - ${totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;