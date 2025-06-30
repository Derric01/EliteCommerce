import { create } from 'zustand';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  _id: string;
  quantity: number;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return apiError.response?.data?.message || 'An error occurred';
  }
  return 'An error occurred';
};

interface CartState {
  cart: CartItem[];
  isLoading: boolean;
  total: number;
  subtotal: number;
  coupon: {
    code: string;
    discountPercentage: number;
  } | null;

  // Actions
  getCartItems: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;
  getMyCoupons: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isLoading: false,
  total: 0,
  subtotal: 0,
  coupon: null,

  getCartItems: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/carts');
      set({ cart: response.data, isLoading: false });
      get().calculateTotals();
    } catch (error: unknown) {
      set({ isLoading: false });
      toast.error('Failed to fetch cart items');
      console.error('Fetch cart error:', error);
    }
  },

  addToCart: async (productId: string) => {
    try {
      await api.post('/carts', { productId });
      await get().getCartItems();
      toast.success('Product added to cart!');
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  },

  updateQuantity: async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeFromCart(id);
      return;
    }

    try {
      await api.put(`/carts/${id}`, { quantity });
      await get().getCartItems();
      toast.success('Cart updated!');
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      await api.delete(`/carts`, { data: { productId } });
      await get().getCartItems();
      toast.success('Product removed from cart!');
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  },

  clearCart: () => {
    set({ cart: [], total: 0, subtotal: 0 });
  },

  getMyCoupons: async () => {
    try {
      const response = await api.get('/coupons');
      return response.data;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return [];
    }
  },

  applyCoupon: async (code: string) => {
    try {
      const response = await api.post('/coupons/validate', { code });
      const coupon = response.data;
      set({ coupon });
      get().calculateTotals();
      toast.success(`Coupon applied! ${coupon.discountPercentage}% off`);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  },

  removeCoupon: () => {
    set({ coupon: null });
    get().calculateTotals();
    toast.success('Coupon removed');
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);

    let total = subtotal;
    if (coupon) {
      total = subtotal - (subtotal * coupon.discountPercentage) / 100;
    }

    set({ subtotal, total });
  },
}));
