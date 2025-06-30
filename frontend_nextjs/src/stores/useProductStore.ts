import { create } from 'zustand';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;  // Keep as 'image' for frontend consistency
  category: string;
  isFeatured: boolean;  // Keep as 'isFeatured' for frontend consistency
  createdAt: string;
  updatedAt: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    return apiError.response?.data?.message || 'An error occurred';
  }
  return 'An error occurred';
};

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Actions
  fetchAllProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (productData: FormData) => Promise<void>;
  updateProduct: (id: string, productData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleFeaturedProduct: (id: string) => Promise<void>;
  clearCurrentProduct: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  featuredProducts: [],
  currentProduct: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  fetchAllProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/products');
      set({ products: response.data.products, isLoading: false });
    } catch (error: unknown) {
      set({ isLoading: false });
      toast.error('Failed to fetch products');
      console.error('Fetch products error:', error);
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/products/featured');
      set({ featuredProducts: response.data.products, isLoading: false });
    } catch (error: unknown) {
      set({ isLoading: false });
      toast.error('Failed to fetch featured products');
      console.error('Fetch featured products error:', error);
    }
  },

  fetchProductsByCategory: async (category: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/products/category/${category}`);
      set({ products: response.data.products, isLoading: false });
    } catch (error: unknown) {
      set({ isLoading: false });
      toast.error('Failed to fetch products by category');
      console.error('Fetch products by category error:', error);
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/products/${id}`);
      set({ currentProduct: response.data.product, isLoading: false });
    } catch (error: unknown) {
      set({ isLoading: false });
      toast.error('Failed to fetch product');
      console.error('Fetch product by ID error:', error);
    }
  },

  createProduct: async (productData: FormData) => {
    set({ isCreating: true });
    try {
      const response = await api.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({
        products: [...state.products, response.data.product],
        isCreating: false,
      }));
      toast.success('Product created successfully!');
    } catch (error: unknown) {
      set({ isCreating: false });
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: FormData) => {
    set({ isUpdating: true });
    try {
      const response = await api.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? response.data.product : product
        ),
        currentProduct: response.data.product,
        isUpdating: false,
      }));
      toast.success('Product updated successfully!');
    } catch (error: unknown) {
      set({ isUpdating: false });
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isDeleting: true });
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        featuredProducts: state.featuredProducts.filter((product) => product._id !== id),
        isDeleting: false,
      }));
      toast.success('Product deleted successfully!');
    } catch (error: unknown) {
      set({ isDeleting: false });
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  toggleFeaturedProduct: async (id: string) => {
    try {
      const response = await api.patch(`/products/${id}`);
      const updatedProduct = response.data.product;
      
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? updatedProduct : product
        ),
        featuredProducts: updatedProduct.isFeatured
          ? [...state.featuredProducts, updatedProduct]
          : state.featuredProducts.filter((product) => product._id !== id),
      }));
      
      toast.success(
        updatedProduct.isFeatured 
          ? 'Product added to featured!' 
          : 'Product removed from featured!'
      );
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
}));
