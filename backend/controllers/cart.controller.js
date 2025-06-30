import Product from "../models/product.model.js";


export const getCartItems = async (req, res) => {
    try {
        const user = req.user;
        if (!user.cartItems || user.cartItems.length === 0) {
            return res.status(200).json([]);
        }
        
        // Populate cart items with product details
        const populatedUser = await user.populate('cartItems.product');
        
        const cartItemsWithDetails = populatedUser.cartItems.map(item => {
            if (!item.product) {
                return null; // If product not found, return null
            }
            return {
                _id: item._id || item.product._id, // Use item._id if available, otherwise product._id
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                },
                quantity: item.quantity
            };
        });
        
        // Filter out any null products
        const filteredCartItems = cartItemsWithDetails.filter(item => item !== null);
        res.json(filteredCartItems);
    } catch (error) {
        console.log("There is an error in the getCartItems section:", error);
        res.status(500).json({ message: error.message });
    }
};


export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ product: productId, quantity: 1 });
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
        }
        
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in removeFromCart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const user = req.user;
        user.cartItems = [];
        await user.save();
        res.json({ message: "All items removed from cart" });
    } catch (error) {
        console.log("There is an error in the removeAllFromCart section:", error);
        res.status(500).json({ message: error.message });
    }
}; 

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        
        if (existingItem) {
            if (quantity <= 0) {
                // If quantity is 0 or less, remove the item from the cart
                user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
            } else {
                // Update the quantity of the existing item
                existingItem.quantity = quantity;
            }
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        console.log("There is an error in the updateQuantity section:", error);
        res.status(500).json({ message: error.message });
    }
}