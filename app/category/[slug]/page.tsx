"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number | null;
  images: { id: string; url: string }[];
  category: { id: string; name: string };
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);

        const categoriesResponse = await fetch('/api/categories');
        const categories = await categoriesResponse.json();
        const foundCategory = categories.find((c: Category) => c.slug === slug);

        if (foundCategory) {
          setCategory(foundCategory);

          // Fetch products for this category
          const productsResponse = await fetch(`/api/products?categoryId=${foundCategory.id}`);
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
        <div className="h-12 w-96 bg-muted animate-pulse rounded mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <div className="aspect-[4/3] bg-muted animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                <div className="h-6 bg-muted animate-pulse rounded w-1/3 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-24 md:py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-6">The category you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Category Hero */}
      <div
        className="relative py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${category.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <Button variant="ghost" size="sm" className="text-white mb-4" asChild>
            <Link href="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" /> All Categories
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
          <p className="text-white/80 text-lg max-w-xl">
            Explore our fresh selection of {category.name.toLowerCase()} products, sourced from local farms and providers.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Products ({products.length})</h2>

          {/* We could add sort/filter options here */}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">There are currently no products in this category.</p>
            <Button asChild>
              <Link href="/">
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}