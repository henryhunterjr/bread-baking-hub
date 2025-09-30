import { useCartStore } from '@/store/useCartStore';

interface CartSummaryProps {
  onViewCart: () => void;
}

const CartSummary = ({ onViewCart }: CartSummaryProps) => {
  const { itemCount, total } = useCartStore();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 flex justify-between items-center shadow-lg z-30">
      <div className="text-white font-bold text-lg">
        <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        <span className="mx-2">|</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button
        onClick={onViewCart}
        className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20"
      >
        View Cart & Checkout
      </button>
    </div>
  );
};

export default CartSummary;