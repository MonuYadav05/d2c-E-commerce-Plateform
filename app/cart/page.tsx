"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatter, getImageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { seedDatabase } from "@/lib/mock-data";

export default function CartPage() {
  const { items, updateItemQuantity, removeItem, subtotal, isLoading } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const { toast } = useToast();


  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const discount = isPromoApplied ? subtotal * 0.1 : 0; // 10% discount
  const tax = (subtotal - discount) * 0.05; // 5% tax
  const total = subtotal - discount + tax + deliveryFee;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      setIsPromoApplied(true);
      toast({
        title: "Promo code applied",
        description: "10% discount has been applied to your order.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid promo code",
        description: "Please enter a valid promo code.",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 space-y-6">
          <div className="flex justify-center">
            <ShoppingCart className="h-24 w-24 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          <Button className="mt-4" size="lg" asChild>
            <Link href="/">
              Browse Products
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                {items.map((item, index) => (
                  <motion.div key={item.id} className="flex gap-4" variants={itemVariants}>
                    <div className="h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                      <img
                        src={getImageUrl(item.product.images)}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="font-medium hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-muted-foreground text-sm mb-2">
                        Unit Price: {formatter.format(item.product.price * (1 - (item.product.discount || 0)))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-medium">
                          {formatter.format(item.quantity * item.product.price * (1 - (item.product.discount || 0)))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatter.format(subtotal)}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (WELCOME10)</span>
                    <span>-{formatter.format(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span>{formatter.format(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>{formatter.format(deliveryFee)}</span>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>{formatter.format(total)}</span>
                </div>
              </div>

              {/* Promo Code */}
              {!isPromoApplied && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Promo Code</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      disabled={!promoCode}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Try "WELCOME10" for 10% off</p>
                </div>
              )}

              <Button className="w-full gap-2" size="lg" asChild>
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}