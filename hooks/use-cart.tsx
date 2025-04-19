"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { calculateCartTotal } from "@/lib/utils";

type CartItem = {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    discount?: number | null;
    images: { id: string; url: string }[];
  };
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  isLoading: boolean;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart");

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      if (data && data.items) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart ");
      }

      await fetchCart();

      toast({
        title: "Item added to cart",
        description: `${quantity} item(s) added to your cart`,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        variant: "destructive",
        title: "Failed to add item",
        description: "There was an error adding the item to your cart DO Login First.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity ");
      }

      await fetchCart();
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast({
        variant: "destructive",
        title: "Failed to update item",
        description: "There was an error updating the item quantity.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      await fetchCart();

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        variant: "destructive",
        title: "Failed to remove item",
        description: "There was an error removing the item from your cart.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems: items.reduce((total, item) => total + item.quantity, 0),
        subtotal: calculateCartTotal(items),
        addItem,
        updateItemQuantity,
        removeItem,
        isLoading,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};