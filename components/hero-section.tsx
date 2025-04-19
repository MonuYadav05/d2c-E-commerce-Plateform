"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Truck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-background to-accent/30 pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Hero Content */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span 
              className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Quick Delivery In 10 Minutes
            </motion.span>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Fresh Groceries <br />
              <span className="text-primary">Delivered</span> To Your Door
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-lg max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Shop from a wide variety of fresh fruits, vegetables, dairy products, and daily essentials with super-fast delivery.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button size="lg" asChild>
                <Link href="/categories">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative hidden md:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="aspect-square relative rounded-full bg-secondary/50 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg"
                alt="Fresh groceries" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            {/* Feature badges */}
            <motion.div 
              className="absolute -left-8 top-1/4 bg-background shadow-lg rounded-lg p-3 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Quick Delivery</p>
                <p className="text-xs text-muted-foreground">In 10-30 minutes</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -right-4 bottom-1/4 bg-background shadow-lg rounded-lg p-3 flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="bg-primary/10 p-2 rounded-full">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">On orders above ₹499</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom wave pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-background" style={{ 
        clipPath: "polygon(0% 0%, 5% 40%, 10% 30%, 15% 60%, 20% 40%, 25% 60%, 30% 30%, 35% 70%, 40% 20%, 45% 100%, 50% 70%, 55% 90%, 60% 85%, 65% 60%, 70% 80%, 75% 40%, 80% 60%, 85% 30%, 90% 70%, 95% 20%, 100% 60%, 100% 100%, 0% 100%)" 
      }} />
    </div>
  );
};