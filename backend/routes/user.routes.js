import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
    getUserProfile, 
    updateUserProfile, 
    getUserOrders, 
    getOrderById 
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', protectRoute, getUserProfile);
router.put('/profile', protectRoute, updateUserProfile);
router.get('/orders', protectRoute, getUserOrders);
router.get('/orders/:id', protectRoute, getOrderById);

export default router;
