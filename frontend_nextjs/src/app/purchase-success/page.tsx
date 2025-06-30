'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useCartStore } from '@/stores/useCartStore';
import api from '@/lib/api';

function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCartStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<{ orderId: string } | null>(null);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const handleSuccessfulPurchase = async () => {
      if (!sessionId) {
        router.push('/cart');
        return;
      }

      try {
        const response = await api.post('/payments/checkout-success', {
          sessionId,
        });
        
        setOrderDetails(response.data);
        clearCart();
      } catch (error) {
        console.error('Error confirming purchase:', error);
        router.push('/cart');
      } finally {
        setIsLoading(false);
      }
    };

    handleSuccessfulPurchase();
  }, [sessionId, router, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="text-center">
          <CardHeader className="pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </motion.div>
            <CardTitle className="text-2xl text-green-700">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              Thank you for your purchase! Your order has been confirmed and is being processed.
            </p>
            
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Package className="h-4 w-4 mr-2" />
                <span>You will receive an email confirmation shortly</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Download className="h-4 w-4 mr-2" />
                <span>Track your order in your account dashboard</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Link href="/account/orders">
                <Button size="lg" className="w-full">
                  View Order Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <PurchaseSuccessContent />
    </Suspense>
  );
}
