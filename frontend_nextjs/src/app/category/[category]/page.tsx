'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Star, Heart, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useProductStore } from '@/stores/useProductStore';
import { useCartStore } from '@/stores/useCartStore';

const categoryImages: { [key: string]: string } = {
  't-shirts': '/tshirts.jpg',
  'jeans': '/jeans.jpg',
  'shoes': '/shoes.jpg',
  'jackets': '/jackets.jpg',
  'suits': '/suits.jpg',
  'bags': '/bags.jpg',
};

const categoryTitles: { [key: string]: string } = {
  't-shirts': 'Premium T-Shirts',
  'jeans': 'Designer Jeans',
  'shoes': 'Luxury Footwear',
  'jackets': 'Premium Outerwear',
  'suits': 'Formal Elegance',
  'bags': 'Designer Accessories',
};

const categoryDescriptions: { [key: string]: string } = {
  't-shirts': 'Discover our collection of premium cotton t-shirts, crafted with attention to detail and designed for ultimate comfort and style.',
  'jeans': 'Explore our range of designer denim, featuring premium fabrics and modern cuts that blend comfort with contemporary fashion.',
  'shoes': 'Step into luxury with our curated selection of premium footwear, from casual sneakers to elegant dress shoes.',
  'jackets': 'Elevate your outerwear game with our collection of premium jackets, perfect for any season and occasion.',
  'suits': 'Make a statement with our formal collection of tailored suits, designed for the modern professional.',
  'bags': 'Complete your look with our designer bag collection, featuring both functionality and timeless style.',
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');

  const { products, fetchProductsByCategory, isLoading } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (category) {
      fetchProductsByCategory(category);
    }
  }, [category, fetchProductsByCategory]);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.isFeatured ? 1 : -1;
    }
  });

  const filteredProducts = sortedProducts.filter(product => {
    if (priceRange === 'all') return true;
    if (priceRange === 'under-50') return product.price < 50;
    if (priceRange === '50-100') return product.price >= 50 && product.price <= 100;
    if (priceRange === '100-200') return product.price >= 100 && product.price <= 200;
    if (priceRange === 'over-200') return product.price > 200;
    return true;
  });

  if (!category) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-80 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={categoryImages[category] || '/placeholder.jpg'}
            alt={categoryTitles[category] || category}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">
              {categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </h1>
            <p className="text-xl opacity-90">
              {categoryDescriptions[category] || 'Discover our premium collection'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter and Sort Bar */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products found
              </span>
              <Badge variant="outline">{category}</Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Price Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="over-200">Over $200</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <Button onClick={() => setPriceRange('all')}>Clear Filters</Button>
          </div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
            }
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {viewMode === 'grid' ? (
                  <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isFeatured && (
                        <Badge className="absolute top-2 left-2 bg-blue-600">
                          Featured
                        </Badge>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handleAddToCart(product._id)}
                          className="h-8 px-3 text-xs"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          ${product.price}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <div className="flex">
                      <div className="relative w-48 aspect-square overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.isFeatured && (
                          <Badge className="absolute top-2 left-2 bg-blue-600">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <Button variant="ghost" size="icon">
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-3xl font-bold text-blue-600">
                              ${product.price}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAddToCart(product._id)}
                            className="px-6"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
