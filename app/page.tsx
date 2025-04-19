
import { HeroSection } from '@/components/hero-section';
import { CategoryPreview } from '@/components/category-preview';
import { FeaturedProducts } from '@/components/featured-products';


export default function Home() {


  return (
    <>
      <HeroSection />
      <CategoryPreview />
      <FeaturedProducts />

      {/* Delivery Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuickMart?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-accent/10 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast Delivery</h3>
              <p className="text-muted-foreground">Get your essentials delivered within 10-30 minutes.</p>
            </div>

            <div className="text-center p-6 bg-accent/10 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-muted-foreground">Fresh produce and top-quality products guaranteed.</p>
            </div>

            <div className="text-center p-6 bg-accent/10 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">Multiple safe payment options for your convenience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Download CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="mb-6 text-primary-foreground/80">Get a better experience and exclusive offers through our mobile app.</p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-black/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.707 10.708L16.293 9.294 13 12.587 9.707 9.294 8.293 10.708 11.586 14.001 8.293 17.294 9.707 18.708 13 15.415 16.293 18.708 17.707 17.294 14.414 14.001z" />
                    <path d="M18.5 2h-13C4.12 2 3 3.12 3 4.5v15C3 20.88 4.12 22 5.5 22h13c1.38 0 2.5-1.12 2.5-2.5v-15C21 3.12 19.88 2 18.5 2zM19 19.5c0 .28-.22.5-.5.5h-13c-.28 0-.5-.22-.5-.5v-15c0-.28.22-.5.5-.5h13c.28 0 .5.22.5.5v15z" />
                  </svg>
                  App Store
                </a>
                <a href="#" className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-black/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.37 23.03L12 14.4l8.63 8.63c.32.32.74.47 1.16.47.26 0 .52-.05.76-.16.54-.24.94-.74 1.06-1.32l.01-.03V2.01c0-.73-.39-1.4-1.03-1.75-.64-.36-1.4-.3-1.98.13L12 6.4 3.39.39C2.81-.04 2.05-.1 1.41.26.77.61.38 1.28.38 2.01v20.01c0 .58.25 1.13.69 1.5.61.53 1.5.59 2.18.18.05-.02.09-.04.12-.07z" />
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://images.pexels.com/photos/6169862/pexels-photo-6169862.jpeg"
                alt="Mobile App"
                className="max-w-full md:max-w-xs rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}