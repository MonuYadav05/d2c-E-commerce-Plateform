"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type WishlistItem = {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    discount?: number | null;
    images: { id: string; url: string }[];
  };
};

type WishlistContextType = {
  items: WishlistItem[];
  addItemToWishlist: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isLoading: boolean;
  hasItem: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/wishlist");

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addItemToWishlist = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to wishlist");
      }

      await fetchWishlist();

      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      });
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast({
        variant: "destructive",
        title: "Failed to add item",
        description: "There was an error adding the item to your wishlist Login First.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }

      await fetchWishlist();

      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast({
        variant: "destructive",
        title: "Failed to remove item",
        description: "There was an error removing the item from your wishlist.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasItem = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItemToWishlist,
        removeItem,
        isLoading,
        hasItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};