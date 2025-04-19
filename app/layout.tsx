import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { ThemeProvider } from "@/hooks/use-theme";
import { Providers } from './Providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuickMart - Fresh Groceries Delivered',
  description: 'Get fresh groceries and daily essentials delivered to your doorstep in minutes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <Providers>
                <NextTopLoader showSpinner={false} />
                <div className="flex min-h-screen  flex-col">
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                </div>
              </Providers>
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}