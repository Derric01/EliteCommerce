import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import { connectDB } from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: "Premium T-Shirt",
    description: "High-quality cotton t-shirt with premium design and comfort.",
    price: 29.99,
    category: "tshirts", 
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    featured: true
  },
  {
    name: "Classic Jeans",
    description: "Comfortable denim jeans perfect for everyday wear.",
    price: 79.99,
    category: "jeans",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    featured: true
  },
  {
    name: "Winter Jacket",
    description: "Warm and stylish winter jacket to keep you cozy.",
    price: 149.99,
    category: "jackets",
    imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=400&fit=crop",
    featured: false
  },
  {
    name: "Running Shoes",
    description: "Comfortable running shoes for your daily exercise.",
    price: 89.99,
    category: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    featured: true
  },
  {
    name: "Business Suit",
    description: "Professional business suit for formal occasions.",
    price: 299.99,
    category: "suits",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    featured: false
  },
  {
    name: "Casual Bag",
    description: "Stylish and practical bag for everyday use.",
    price: 59.99,
    category: "bags",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    featured: false
  }
];

const createSampleProducts = async () => {
    try {
        await connectDB();
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');
        
        // Create sample products
        const createdProducts = await Product.insertMany(sampleProducts);
        
        console.log('✅ Sample products created successfully!');
        console.log('='.repeat(60));
        
        createdProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   Category: ${product.category}`);
            console.log(`   Price: $${product.price}`);
            console.log(`   Featured: ${product.featured ? 'Yes' : 'No'}`);
            console.log('   ' + '-'.repeat(40));
        });
        
        console.log(`\\nTotal products created: ${createdProducts.length}`);
        console.log('🎉 You can now test the admin dashboard!');
        console.log('='.repeat(60));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating sample products:', error);
        process.exit(1);
    }
};

createSampleProducts();
