'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PurchaseCancelPage() {
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
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            </motion.div>
            <CardTitle className="text-2xl text-red-700">
              Payment Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              Your payment was cancelled. No charges were made to your account.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Your items are still in your cart. You can continue shopping or try checking out again.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Link href="/cart">
                <Button size="lg" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Return to Cart
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
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
