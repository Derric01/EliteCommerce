'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Shield, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useProductStore } from '@/stores/useProductStore';
import { useUserStore } from '@/stores/useUserStore';

const categories = [
  {
    name: 'T-Shirts',
    href: '/category/t-shirts',
    image: '/tshirts.jpg',
    description: 'Premium cotton tees',
    count: '200+ items'
  },
  {
    name: 'Jeans',
    href: '/category/jeans',
    image: '/jeans.jpg',
    description: 'Designer denim',
    count: '150+ items'
  },
  {
    name: 'Shoes',
    href: '/category/shoes',
    image: '/shoes.jpg',
    description: 'Luxury footwear',
    count: '300+ items'
  },
  {
    name: 'Jackets',
    href: '/category/jackets',
    image: '/jackets.jpg',
    description: 'Premium outerwear',
    count: '100+ items'
  },
  {
    name: 'Suits',
    href: '/category/suits',
    image: '/suits.jpg',
    description: 'Formal elegance',
    count: '80+ items'
  },
  {
    name: 'Bags',
    href: '/category/bags',
    image: '/bags.jpg',
    description: 'Designer accessories',
    count: '120+ items'
  },
];

const features = [
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Carefully curated products from top brands worldwide'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over $100 with 2-day delivery'
  },
  {
    icon: Star,
    title: 'Customer Satisfaction',
    description: '4.9/5 rating from over 50,000+ happy customers'
  },
  {
    icon: TrendingUp,
    title: 'Latest Trends',
    description: 'Stay ahead with the latest fashion and lifestyle trends'
  },
];

export default function HomePage() {
  const { featuredProducts, fetchFeaturedProducts, isLoading } = useProductStore();
  const { checkAuth } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  const [floatingCards, setFloatingCards] = useState<Array<{
    id: number;
    left: string;
    top: string;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    setIsMounted(true);
    // Generate random positions and timing for floating cards after mount
    setFloatingCards([1, 2, 3, 4, 5, 6].map((i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 4 + Math.random() * 2,
      delay: Math.random() * 2,
    })));
    fetchFeaturedProducts();
    checkAuth();
  }, [fetchFeaturedProducts, checkAuth]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-4 text-sm px-3 py-1">
              ✨ New Collection Available
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              Discover Premium
              <br />
              Fashion & Style
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Elevate your wardrobe with our curated collection of premium clothing, 
              shoes, and accessories from the world&apos;s top designers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Explore Collections
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Product Cards */}
        {isMounted && floatingCards.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {floatingCards.map((card) => (
              <motion.div
                key={card.id}
                className="absolute w-20 h-20 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"
                style={{
                  left: card.left,
                  top: card.top,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: card.duration,
                  repeat: Infinity,
                  delay: card.delay,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our extensive collection across multiple categories, 
              each carefully curated to bring you the best in fashion and style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={category.href}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                        <p className="text-sm opacity-90 mb-2">{category.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of trending products that define style and quality.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !featuredProducts || featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No featured products available at the moment.</p>
              <Link href="/category/t-shirts">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(featuredProducts || []).slice(0, 8).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/product/${product._id}`}>
                    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 left-2 bg-blue-600">
                          Featured
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-2xl font-bold text-blue-600">
                          ${product.price}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose EliteStore?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to providing you with the best shopping experience, 
              quality products, and exceptional service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new collections, 
              exclusive offers, and fashion insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
