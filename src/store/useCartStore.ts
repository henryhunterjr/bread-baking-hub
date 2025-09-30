import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  heat?: string;
  sauce?: string;
  customizations?: Record<string, any>;
}

interface CartStore {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => 
          i.id === item.id && 
          i.heat === item.heat && 
          i.sauce === item.sauce
        );

        if (existingItem) {
          set({
            items: items.map(i =>
              i === existingItem
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            )
          });
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }]
          });
        }
        
        get().calculateTotals();
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        });
        get().calculateTotals();
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
        get().calculateTotals();
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },

      calculateTotals: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        set({ total, itemCount });
      }
    }),
    {
      name: 'wing-cart-storage',
    }
  )
);