"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Truck, ShieldCheck, RefreshCw, Package } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatter } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number | null;
  stock: number;
  images: { id: string; url: string }[];
  category: { id: string; name: string };
};

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, isLoading: isCartLoading } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (product) {
      await addItem(product.id, quantity);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const discountedPrice = product?.price 
    ? product.price * (1 - (product.discount || 0)) 
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="aspect-square rounded-lg" />
            <div className="flex mt-4 gap-2">
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 md:py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <motion.div 
            className="rounded-lg overflow-hidden bg-accent/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={product.images[selectedImage]?.url || "/placeholder.png"}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </motion.div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <motion.div
                  key={image.id}
                  className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} - image ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-2">
            <Link href={`/category/${product.category.id}`} className="text-sm text-primary hover:underline">
              {product.category.name}
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">4.9 (120 reviews)</span>
          </div>
          
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold">{formatter.format(discountedPrice)}</span>
            {product.discount && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatter.format(product.price)}
                </span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                  {Math.round(product.discount * 100)}% OFF
                </span>
              </>
            )}
          </div>
          
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">On orders above ₹499</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Quality Guarantee</p>
                <p className="text-xs text-muted-foreground">Fresh and high quality</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">Within 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Secure Packaging</p>
                <p className="text-xs text-muted-foreground">Safe delivery</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={increaseQuantity}
                disabled={product.stock <= quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="ml-4 text-sm text-muted-foreground">
                {product.stock} items available
              </span>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            className="w-full h-12 text-lg gap-2" 
            onClick={handleAddToCart}
            disabled={isCartLoading}
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}