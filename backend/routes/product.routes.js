import express from 'express';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { 
    getAllProducts, 
    getFeaturedProducts, 
    getProductsByCategory, 
    getRecommendedProducts,
    getProductById,
    createProduct,
    toggleFeaturedProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendation", getRecommendedProducts);
router.get("/:id", getProductById);
router.post("/", protectRoute, adminRoute, upload.single('image'), createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;