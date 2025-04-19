"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderTracking } from "@/components/order-tracking";
import { formatter, getImageUrl } from "@/lib/utils";

type Order = {
    id: string;
    totalAmount: number;
    status: "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED";
    createdAt: string;
    items: {
        id: string;
        quantity: number;
        price: number;
        product: {
            id: string;
            name: string;
            images: { id: string; url: string }[];
        };
    }[];
    address: {
        fullName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
    };
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/orders");
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

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

            <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

            {isLoading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-6 bg-muted rounded w-1/4 mb-4" />
                                <div className="h-4 bg-muted rounded w-1/3 mb-8" />
                                <div className="space-y-4">
                                    <div className="h-20 bg-muted rounded" />
                                    <div className="h-20 bg-muted rounded" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-16 space-y-6">
                    <div className="flex justify-center">
                        <Package className="h-24 w-24 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold">No orders yet</h2>
                    <p className="text-muted-foreground">Start shopping to create your first order</p>
                    <Button className="mt-4" size="lg" asChild>
                        <Link href="/">
                            Browse Products
                        </Link>
                    </Button>
                </div>
            ) : (
                <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {orders.map((order) => (
                        <motion.div key={order.id} variants={itemVariants}>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                        <div>
                                            <h3 className="font-medium">Order #{order.id}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{formatter.format(order.totalAmount)}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>

                                    <OrderTracking status={order.status} />

                                    <div className="space-y-4 mt-6">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                                                    <img
                                                        src={getImageUrl(item.product.images)}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <Link
                                                        href={`/product/${item.product.id}`}
                                                        className="font-medium hover:text-primary transition-colors"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <div className="text-sm text-muted-foreground">
                                                        Quantity: {item.quantity}
                                                    </div>
                                                    <div className="font-medium">
                                                        {formatter.format(item.price * item.quantity)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t">
                                        <h4 className="font-medium mb-2">Delivery Address</h4>
                                        <div className="text-sm text-muted-foreground">
                                            <p>{order.address.fullName}</p>
                                            <p>{order.address.addressLine1}</p>
                                            {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                                            <p>
                                                {order.address.city}, {order.address.state} {order.address.postalCode}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}