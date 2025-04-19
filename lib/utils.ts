import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function getImageUrl(images: any[] | undefined, index = 0) {
  if (!images || images.length === 0) {
    return '/placeholder.png';
  }
  
  return images[index]?.url;
}

export function calculateDiscount(price: number, discount?: number | null) {
  if (!discount) return price;
  
  return price - (price * discount);
}

export function calculateCartTotal(items: any[]) {
  return items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
}