import type { Metadata } from 'next';
import Image from 'next/image';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Official Merch! | DEN BMX Store',
  description: 'Official DEN BMX merchandise store. Shop t-shirts, hats, gear, and more at store.bmxdenver.com',
  openGraph: {
    title: 'Official Merch! | DEN BMX Store',
    description: 'Shop official DEN BMX merchandise at store.bmxdenver.com',
    url: 'https://bmxdenver.com/shop',
    siteName: 'DEN BMX',
    images: [
      {
        url: '/paint-splash-tshirt-neon-green-drip-art-tee.jpg',
        width: 1200,
        height: 1200,
        alt: 'DEN BMX Official Merch - Paint Splash T-Shirt',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official Merch! | DEN BMX Store',
    description: 'Shop official DEN BMX merchandise at store.bmxdenver.com',
    images: ['/paint-splash-tshirt-neon-green-drip-art-tee.jpg'],
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Images - Responsive: Single Rider (Mobile) / Two Riders (Desktop) */}
      <div 
        className="fixed inset-0 z-0 w-full h-full" 
        style={{ 
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {/* Mobile: Single Rider (Vertical) */}
        <div 
          className="md:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/black-white-portrait-athlete-participating-olympic-championship-sports.jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
        {/* Desktop: Two Riders (Landscape) */}
        <div 
          className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/black-white-portrait-athlete-participating-olympic-championship-sports%20(1).jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 w-full h-full bg-black/50" />
      </div>
      {/* Hero Section with Logo and Shop Now Button */}
      <section className="relative z-10 flex flex-col justify-center items-center px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center">
          <Image
            src="/logos/DEN_BMX_FINAL_Green.png"
            alt="DEN BMX Logo"
            width={400}
            height={400}
            className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-auto shadow-2xl mx-auto mb-6"
            priority
          />
          <a
            href="https://store.bmxdenver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#00ff0c] hover:bg-white text-black hover:text-black font-black px-12 py-6 border-4 border-black transition-colors transform hover:scale-110 text-3xl md:text-4xl shadow-2xl"
          >
            <ShoppingBagIcon className="w-8 h-8 inline mr-3" />
            SHOP NOW
          </a>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-6xl relative z-10">

        {/* Store Info Card */}
        <div className="bg-black border-4 border-[#00ff0c] p-8 md:p-12 text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-[#00ff0c] mb-4">
            OFFICIAL MERCH!
          </h1>
          <p className="text-white text-xl md:text-2xl font-bold mb-6">
            Get your DEN BMX gear at{' '}
            <span className="text-2xl md:text-3xl text-[#00ff0c]">store.bmxdenver.com</span>
          </p>
          <p className="text-white text-lg md:text-xl font-bold">
            T-shirts, hats, stickers, and more!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

