import Product from "../models/product.model.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

const mapProductToFrontend = (product) => ({
    _id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.imageUrl,
    category: product.category,
    isFeatured: product.featured,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
});

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        const mappedProducts = products.map(mapProductToFrontend);
        res.json({products: mappedProducts});
    } catch (error) {
        console.log("Error in getAllProducts:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = null;
        
        // Try to get from Redis cache
        try {
            featuredProducts = await redis.get("featured_products");
            if (featuredProducts) {
                const parsed = JSON.parse(featuredProducts);
                const mapped = parsed.map(mapProductToFrontend);
                return res.json(mapped);
            }
        } catch (redisError) {
            console.log("Redis cache miss, fetching from database");
        }
        
        // Get from database
        featuredProducts = await Product.find({ featured: true }).lean();
        if(!featuredProducts || featuredProducts.length === 0){
            return res.json([]);
        }
        
        // Try to cache in Redis
        try {
            await redis.set("featured_products", JSON.stringify(featuredProducts), "EX", 60 * 60);
        } catch (redisError) {
            console.log("Redis cache write failed, continuing without cache");
        }
        
        const mapped = featuredProducts.map(mapProductToFrontend);
        res.json(mapped);
    } catch (error) {
        console.log("Error in getFeaturedProducts:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        const mappedProducts = products.map(mapProductToFrontend);
        res.json({ products: mappedProducts });
    } catch (error) {
        console.log("Error in getProductsByCategory:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.find({}).limit(4);
        const mappedProducts = products.map(mapProductToFrontend);
        res.json({ products: mappedProducts });
    } catch (error) {
        console.log("Error in getRecommendedProducts:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const mappedProduct = mapProductToFrontend(product);
        res.json({ product: mappedProduct });
    } catch (error) {
        console.log("Error in getProductById:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, isFeatured } = req.body;
        let imageUrl = "https://via.placeholder.com/400x400?text=Product+Image";

        const newProduct = await Product.create({
            name,
            price: parseFloat(price),
            description,
            category,
            featured: isFeatured === "true" || isFeatured === true,
            imageUrl: imageUrl
        });

        const mappedProduct = mapProductToFrontend(newProduct);
        res.status(201).json({ product: mappedProduct });
    } catch (error) {
        console.log("Error in createProduct:", error);
        res.status(500).json({ message: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        product.featured = !product.featured;
        await product.save();
        
        // Try to clear Redis cache
        try {
            await redis.del("featured_products");
        } catch (redisError) {
            console.log("Redis cache clear failed, continuing without cache");
        }
        
        const mappedProduct = mapProductToFrontend(product);
        res.json({ product: mappedProduct });
    } catch (error) {
        console.log("Error in toggleFeaturedProduct:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        
        // Try to clear Redis cache
        try {
            await redis.del("featured_products");
        } catch (redisError) {
            console.log("Redis cache clear failed, continuing without cache");
        }
        
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in deleteProduct:", error);
        res.status(500).json({ message: error.message });
    }
};
