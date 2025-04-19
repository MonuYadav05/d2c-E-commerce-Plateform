"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatter, getImageUrl } from "@/lib/utils";

type WishlistItem = {
    id: string;
    product: {
        id: string;
        name: string;
        price: number;
        discount: number | null;
        images: { id: string; url: string }[];
    };
};

export default function WishlistPage() {
    const { items, removeItem } = useWishlist();
    const { addItem: addToCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async (productId: string) => {
        try {
            setIsLoading(true);
            await addToCart(productId, 1);
            await removeItem(productId);
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setIsLoading(false);
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
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="container mx-auto px-4 py-24 md:py-32">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>
            </div>

            <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

            {items.length === 0 ? (
                <div className="text-center py-16 space-y-6">
                    <div className="flex justify-center">
                        <Heart className="h-24 w-24 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
                    <p className="text-muted-foreground">
                        Add items to your wishlist to save them for later
                    </p>
                    <Button className="mt-4" size="lg" asChild>
                        <Link href="/">
                            Browse Products
                        </Link>
                    </Button>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {items.map((item) => (
                        <motion.div key={item.id} variants={itemVariants}>
                            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md flex flex-col">
                                <div className="relative block">
                                    <Link href={`/product/${item.product.id}`}>
                                        <div className="aspect-[4/3] relative">
                                            <img
                                                src={getImageUrl(item.product.images)}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                            />
                                        </div>
                                    </Link>
                                    {item.product.discount && (
                                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                                            {Math.round(item.product.discount * 100)}% OFF
                                        </div>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeItem(item.product.id);
                                        }}
                                    >
                                        <Heart className="h-4 w-4 fill-current" />
                                    </Button>
                                </div>
                                <CardContent className="p-4 flex-grow">
                                    <Link href={`/product/${item.product.id}`}>
                                        <h3 className="font-medium hover:text-primary transition-colors">
                                            {item.product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-lg font-semibold">
                                            {formatter.format(item.product.price * (1 - (item.product.discount || 0)))}
                                        </span>
                                        {item.product.discount && (
                                            <span className="text-sm text-muted-foreground line-through">
                                                {formatter.format(item.product.price)}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button
                                        className="w-full gap-2"
                                        onClick={() => handleAddToCart(item.product.id)}
                                        disabled={isLoading}
                                    >
                                        <ShoppingCart className="h-4 w-4" /> Move to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}