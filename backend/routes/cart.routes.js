import express from 'express';
import { getCartItems, addToCart, removeFromCart, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getCartItems);
router.post('/', protectRoute, addToCart);
router.delete('/', protectRoute, removeFromCart);
router.delete('/clear', protectRoute, removeAllFromCart);
router.put('/:id', protectRoute, updateQuantity);

export default router;