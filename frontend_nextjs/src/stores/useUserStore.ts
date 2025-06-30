import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
}

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

interface UserState {
  user: User | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  
  // Actions
  signup: (userData: { name: string; email: string; password: string; confirmPassword: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isCheckingAuth: true,

      signup: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/signup', userData);
          set({ user: response.data.user, isLoading: false });
          toast.success('Account created successfully!');
        } catch (error: unknown) {
          set({ isLoading: false });
          const message = error && typeof error === 'object' && 'response' in error 
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Signup failed'
            : 'Signup failed';
          toast.error(message);
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          set({ user: response.data.user, isLoading: false });
          toast.success('Logged in successfully!');
        } catch (error: any) {
          set({ isLoading: false });
          console.error('Login error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            config: error.config
          });
          
          let message = 'Login failed';
          
          if (error.response?.data?.message) {
            message = error.response.data.message;
          } else if (error.message === 'Network Error') {
            message = 'Unable to connect to server. Please check if the backend is running.';
          } else if (error.code === 'ECONNREFUSED') {
            message = 'Connection refused. Backend server may not be running.';
          } else if (!error.response) {
            message = 'Network error. Please check your connection and server status.';
          }
          
          toast.error(message);
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/auth/logout');
          set({ user: null, isLoading: false });
          toast.success('Logged out successfully!');
        } catch {
          set({ isLoading: false });
          toast.error('Logout failed');
        }
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const response = await api.get('/auth/profile');
          set({ user: response.data.user, isCheckingAuth: false });
        } catch {
          set({ user: null, isCheckingAuth: false });
        }
      },

      refreshToken: async () => {
        try {
          await api.post('/auth/refresh-token');
          await get().checkAuth();
        } catch (error) {
          set({ user: null });
          throw error;
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
