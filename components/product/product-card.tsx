"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatter, truncate, getImageUrl } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount: number | null;
    images: { id: string; url: string }[];
    category: { name: string };
  };
  index: number;
};

export const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addItem } = useCart();
  const { addItemToWishlist } = useWishlist();


  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addItem(product.id, 1);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addItemToWishlist(product.id);
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md flex flex-col">
        <div className="relative block">
          <Link href={'/product/' + product.id}>
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={getImageUrl(product.images)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
          </Link>
          {product.discount && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              {Math.round(product.discount * 100)}% OFF
            </div>
          )}
          <Button
            size="icon"
            variant="secondary"
            onClick={handleAddToWishlist}
            className="absolute top-2 z-50 right-2 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="flex items-center gap-1 text-amber-500 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">5.0</span>
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mb-2">{product.category.name}</p>
          <p className="text-sm text-muted-foreground mb-3">
            {truncate(product.description, 60)}
          </p>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-lg font-semibold">
              {formatter.format(product.price * (1 - (product.discount || 0)))}
            </span>
            {product.discount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatter.format(product.price)}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};