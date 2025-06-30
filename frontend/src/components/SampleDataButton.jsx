import { useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import toast from "react-hot-toast";

const SampleDataButton = () => {
	const [loading, setLoading] = useState(false);
	const { createProduct } = useProductStore();

	const sampleProducts = [
		{
			name: "Sample T-Shirt",
			description: "A comfortable cotton t-shirt",
			price: 25.99,
			image: "/tshirts.jpg",
			category: "t-shirts",
			isFeatured: true
		},
		{
			name: "Sample Jeans",
			description: "Classic blue jeans",
			price: 59.99,
			image: "/jeans.jpg",
			category: "jeans",
			isFeatured: true
		},
		{
			name: "Sample Shoes",
			description: "Comfortable running shoes",
			price: 89.99,
			image: "/shoes.jpg",
			category: "shoes",
			isFeatured: false
		}
	];

	const addSampleData = async () => {
		setLoading(true);
		try {
			for (const product of sampleProducts) {
				await createProduct(product);
			}
			toast.success("Sample products added successfully!");
		} catch {
			toast.error("Failed to add sample products");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			<button
				onClick={addSampleData}
				disabled={loading}
				className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-emerald-700 disabled:opacity-50"
			>
				{loading ? "Adding..." : "Add Sample Products"}
			</button>
		</div>
	);
};

export default SampleDataButton;
