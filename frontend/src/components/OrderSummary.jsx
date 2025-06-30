
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import toast from "react-hot-toast";

// Initialize Stripe with better error handling
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
	? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
	: null;

// Development mode flag - set to true to disable Stripe for testing
const DISABLE_STRIPE_FOR_TESTING = true;

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		try {
			// Test mode - simulate successful payment
			if (DISABLE_STRIPE_FOR_TESTING) {
				const loadingToast = toast.loading("Processing payment...");
				
				// Simulate API delay
				await new Promise(resolve => setTimeout(resolve, 1500));
				
				toast.dismiss(loadingToast);
				toast.success("Payment successful! (Test mode)");
				
				// Redirect to success page
				window.location.href = "/purchase-success?session_id=test_session";
				return;
			}

			if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
				toast.error("Stripe is not configured. Please contact support.");
				console.error("Stripe publishable key is not configured");
				return;
			}

			if (!stripePromise) {
				toast.error("Payment system is not available. Please try again later.");
				return;
			}

			const stripe = await stripePromise;
			
			if (!stripe) {
				toast.error("Payment system failed to load. Please disable your ad blocker and try again.");
				console.error("Stripe failed to load - likely blocked by ad blocker");
				return;
			}

			// Show loading toast
			const loadingToast = toast.loading("Redirecting to payment...");

			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
			});

			const session = res.data;
			const result = await stripe.redirectToCheckout({
				sessionId: session.id,
			});

			toast.dismiss(loadingToast);

			if (result.error) {
				toast.error(result.error.message || "Payment failed. Please try again.");
				console.error("Stripe checkout error:", result.error);
			}
		} catch (error) {
			toast.error("Payment failed. Please try again.");
			console.error("Payment error:", error);
		}
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};
export default OrderSummary;
