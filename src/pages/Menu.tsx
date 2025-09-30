import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MenuHeader from '@/components/menu/MenuHeader';
import CategoryNavigation from '@/components/menu/CategoryNavigation';
import MenuCard from '@/components/menu/MenuCard';
import CustomizationModal from '@/components/menu/CustomizationModal';
import CartSummary from '@/components/menu/CartSummary';
import { menuData, MenuItem } from '@/data/menuData';
import { useCartStore } from '@/store/useCartStore';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('featured');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleCustomize = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleQuickAdd = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleViewCart = () => {
    // TODO: Implement cart view/checkout
    console.log('View cart clicked');
  };

  const currentItems = menuData[activeCategory] || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Menu - Wing It Hub</title>
        <meta name="description" content="Explore our delicious wing menu with buffalo, BBQ, and specialty flavors. Order now!" />
      </Helmet>

      <MenuHeader />
      <CategoryNavigation 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      {activeCategory === 'featured' && (
        <section className="px-5 py-8 bg-zinc-900">
          <h2 className="text-3xl font-bold text-center text-orange-500 mb-3">
            🌟 What Everyone's Talking About
          </h2>
          <p className="text-center text-zinc-400 mb-6 italic">
            These are the wings that made us famous. Don't leave without trying at least one.
          </p>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5 py-8 max-w-7xl mx-auto">
        {currentItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onCustomize={handleCustomize}
            onQuickAdd={handleQuickAdd}
          />
        ))}
      </div>

      <CustomizationModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <CartSummary onViewCart={handleViewCart} />
      
      {/* Add padding at bottom to prevent content being hidden behind cart */}
      <div className="h-20"></div>
    </div>
  );
};

export default Menu;