'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart, PlusCircle, ShoppingBasket, Users, TrendingUp, DollarSign, Trash2, Star, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useUserStore } from '@/stores/useUserStore';
import { useProductStore } from '@/stores/useProductStore';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart },
  { id: 'create', label: 'Create Product', icon: PlusCircle },
  { id: 'products', label: 'Manage Products', icon: ShoppingBasket },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
];

export default function AdminPage() {
  const { user, checkAuth } = useUserStore();
  const { 
    products, 
    fetchAllProducts, 
    deleteProduct, 
    toggleFeaturedProduct, 
    createProduct,
    isCreating 
  } = useProductStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null as File | null,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllProducts();
      // Fetch analytics data here
      setStats({
        totalProducts: products.length,
        totalUsers: 1250, // This would come from your analytics API
        totalSales: 3420,
        totalRevenue: 125000,
      });
    }
  }, [user, fetchAllProducts, products.length]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-6">
              You need admin privileges to access this dashboard.
            </p>
            {!user ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">Please log in with an admin account</p>
                <Link href="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">
                  Your current role: <Badge variant="secondary">{user.role}</Badge>
                </p>
                <div className="text-xs text-left bg-blue-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">To get admin access:</h3>
                  <ol className="text-gray-700 space-y-1">
                    <li>1. Go to backend folder in terminal</li>
                    <li>2. Run: <code className="bg-gray-200 px-1 rounded">node scripts/createAdmin.js</code></li>
                    <li>3. Or modify your user role in database</li>
                  </ol>
                </div>
                <Button onClick={() => router.push('/')} variant="outline" className="w-full">
                  Go Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category || !newProduct.image) {
      toast.error('Please fill in all fields and select an image');
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('image', newProduct.image);

    try {
      await createProduct(formData);
      toast.success('Product created successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
      });
      fetchAllProducts();
    } catch {
      toast.error('Failed to create product');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct({ ...newProduct, image: e.target.files[0] });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchAllProducts();
      } catch {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleToggleFeatured = async (productId: string) => {
    try {
      await toggleFeaturedProduct(productId);
      toast.success('Product updated successfully');
      fetchAllProducts();
    } catch {
      toast.error('Failed to update product');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">Orders completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Products ({products.length})</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.isFeatured && (
                <Badge className="absolute top-2 left-2 bg-blue-600">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-1">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold">${product.price}</span>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={product.isFeatured ? "default" : "outline"}
                  onClick={() => handleToggleFeatured(product._id)}
                  className="flex-1"
                >
                  {product.isFeatured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'create' && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateProduct} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="t-shirts">T-Shirts</SelectItem>
                          <SelectItem value="jeans">Jeans</SelectItem>
                          <SelectItem value="shoes">Shoes</SelectItem>
                          <SelectItem value="jackets">Jackets</SelectItem>
                          <SelectItem value="suits">Suits</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Enter product description"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="image">Product Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                      {newProduct.image && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected: {newProduct.image.name}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isCreating}
                    >
                      {isCreating ? 'Creating...' : 'Create Product'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'analytics' && (
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Detailed analytics and charts will be displayed here.</p>
                  <Button>View Analytics</Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
