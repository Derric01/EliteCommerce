import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	
	applyCoupon: async (code) => {
		try {
			const response = await axios.get(`/coupons/validate?code=${code}`);
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		try {
			const res = await axios.get("/carts");
			set({ cart: res.data || [] });
			get().calculateTotals();
		} catch (error) {
			// If no items in cart, backend returns 404 - that's normal
			if (error.response?.status === 404) {
				set({ cart: [] });
			} else {
				console.error("Error fetching cart:", error);
				toast.error(error.response?.data?.message || "Failed to load cart");
			}
		}
	},
	
	clearCart: async () => {
		try {
			await axios.delete("/carts");
			set({ cart: [], coupon: null, total: 0, subtotal: 0 });
			toast.success("Cart cleared");
		} catch (error) {
			console.error("Error clearing cart:", error);
		}
	},
	
	addToCart: async (product) => {
		try {
			await axios.post("/carts", { productId: product._id });
			toast.success("Product added to cart");

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add to cart");
		}
	},
	
	removeFromCart: async (productId) => {
		try {
			await axios.delete("/carts");
			set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
			get().calculateTotals();
		} catch (error) {
			console.error("Error removing from cart:", error);
		}
	},
	
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		try {
			await axios.put(`/carts/${productId}`, { quantity });
			set((prevState) => ({
				cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
			}));
			get().calculateTotals();
		} catch (error) {
			console.error("Error updating quantity:", error);
			toast.error("Failed to update quantity");
		}
	},
	
	calculateTotals: () => {
		const { cart, coupon } = get();
		// Ensure cart is always an array
		const cartArray = Array.isArray(cart) ? cart : [];
		const subtotal = cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));