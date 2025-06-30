import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,
	error: null,

	setProducts: (products) => set({ products }),
	
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Product created successfully");
		} catch (error) {
			console.error("Create product error:", error);
			toast.error(error.response?.data?.message || "Failed to create product");
			set({ loading: false });
		}
	},
	
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			// Backend returns: { products: [...] }
			set({ products: response.data.products || [], loading: false });
		} catch (error) {
			console.error("Fetch all products error:", error);
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch products");
		}
	},
	
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			// Backend returns: { products: [...] }
			set({ products: response.data.products || [], loading: false });
		} catch (error) {
			console.error("Fetch products by category error:", error);
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch products");
		}
	},
	
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			console.log("Featured products response:", response.data);
			// Backend returns: [...products] (array directly)
			set({ products: response.data || [], loading: false });
		} catch (error) {
			console.error("Fetch featured products error:", error);
			set({ error: "Failed to fetch featured products", loading: false, products: [] });
			if (error.response?.status === 404) {
				console.log("No featured products found in database");
			} else {
				toast.error(error.response?.data?.message || "Failed to fetch featured products");
			}
		}
	},
	
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevState) => ({
				products: prevState.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product deleted successfully");
		} catch (error) {
			console.error("Delete product error:", error);
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to delete product");
		}
	},
	
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// Backend returns the updated product
			set((prevState) => ({
				products: prevState.products.map((product) =>
					product._id === productId 
						? { ...product, isFeatured: response.data.isFeatured } 
						: product
				),
				loading: false,
			}));
			toast.success("Product updated successfully");
		} catch (error) {
			console.error("Toggle featured product error:", error);
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to update product");
		}
	},
}));