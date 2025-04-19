"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { ProductCard } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";

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

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  
  // Fetch products based on search query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would use the API with filters
        const response = await fetch(`/api/products?q=${queryParam}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchProducts();
    fetchCategories();
  }, [queryParam]);
  
  // Apply filters and sorting to products
  const filteredProducts = products
    .filter(product => !onlyDiscounted || !!product.discount)
    .filter(product => 
      selectedCategories.length === 0 || 
      selectedCategories.includes(product.category.id)
    )
    .filter(product => 
      product.price >= priceRange[0] && 
      product.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return (a.price * (1 - (a.discount || 0))) - (b.price * (1 - (b.discount || 0)));
      } else if (sortBy === "price-high") {
        return (b.price * (1 - (b.discount || 0))) - (a.price * (1 - (a.discount || 0)));
      }
      // Default: sort by relevance (we'll just use the original order)
      return 0;
    });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  const toggleCategoryFilter = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Find min and max prices for the range slider
  const minPrice = Math.min(...products.map(p => p.price * (1 - (p.discount || 0))));
  const maxPrice = Math.max(...products.map(p => p.price));
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <h1 className="text-3xl font-bold mb-2">
        {queryParam 
          ? `Search results for "${queryParam}"`
          : "Search Products"
        }
      </h1>
      <p className="text-muted-foreground mb-8">
        {isLoading 
          ? "Searching for products..."
          : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
        }
      </p>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <Input
          type="search"
          placeholder="Search products..."
          className="max-w-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit">
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block space-y-6">
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategoryFilter(category.id)}
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <Slider
              defaultValue={[minPrice, maxPrice]}
              min={minPrice}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-6"
            />
            <div className="flex items-center justify-between text-sm">
              <span>{formatter.format(priceRange[0])}</span>
              <span>{formatter.format(priceRange[1])}</span>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-3">Other Filters</h3>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="discount"
                checked={onlyDiscounted}
                onCheckedChange={(checked) => 
                  setOnlyDiscounted(checked as boolean)
                }
              />
              <Label 
                htmlFor="discount"
                className="text-sm cursor-pointer"
              >
                Only show discounted items
              </Label>
            </div>
          </div>
        </div>
        
        {/* Products */}
        <div className="lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Mobile Filter Toggle */}
            <Button 
              variant="outline" 
              className="flex items-center gap-2 lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            
            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <Label htmlFor="sort-by" className="text-sm whitespace-nowrap">
                Sort by:
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by" className="w-[180px]">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-card rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mobile-category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategoryFilter(category.id)}
                      />
                      <Label 
                        htmlFor={`mobile-category-${category.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  defaultValue={[minPrice, maxPrice]}
                  min={minPrice}
                  max={maxPrice}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-6"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>{formatter.format(priceRange[0])}</span>
                  <span>{formatter.format(priceRange[1])}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Other Filters</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="mobile-discount"
                    checked={onlyDiscounted}
                    onCheckedChange={(checked) => 
                      setOnlyDiscounted(checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor="mobile-discount"
                    className="text-sm cursor-pointer"
                  >
                    Only show discounted items
                  </Label>
                </div>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}