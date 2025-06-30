import User from "../models/model.user.js";
import Order from "../models/order.model.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        console.log("Error in getUserProfile controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user._id);
        
        if (name) user.name = name;
        if (email) user.email = email;
        
        await user.save();
        
        const updatedUser = await User.findById(req.user._id).select("-password");
        res.json(updatedUser);
    } catch (error) {
        console.log("Error in updateUserProfile controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        console.log("Error in getUserOrders controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ 
            _id: id, 
            user: req.user._id 
        }).populate('products.product');
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.json(order);
    } catch (error) {
        console.log("Error in getOrderById controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
