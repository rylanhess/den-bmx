import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Official DEN BMX merchandise store. Shop t-shirts, hats, gear, and more at store.bmxdenver.com',
  openGraph: {
    title: 'Shop - BMX Denver',
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
    title: 'Shop - BMX Denver',
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
      {/* Back Button - Mobile Only - Above Hero */}
      <div className="relative z-10 container mx-auto px-4 pt-4 md:hidden">
        <Link 
          href="/"
          className="inline-block bg-black text-[#00ff0c] font-black px-4 sm:px-6 py-3 border-4 border-[#00ff0c] rounded-xl active:bg-[#00ff0c] active:text-black transition-all transform active:scale-95 min-h-[44px] flex items-center justify-center"
        >
          ← BACK TO HOME
        </Link>
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
            className="inline-block bg-[#00ff0c] hover:bg-white text-black hover:text-black font-black px-12 py-6 border-4 border-black rounded-xl transition-colors transform hover:scale-110 text-3xl md:text-4xl shadow-2xl"
          >
            <ShoppingBagIcon className="w-8 h-8 inline mr-3" />
            SHOP NOW
          </a>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-0 md:py-0 max-w-6xl relative z-10">
        {/* Hero - Professional Punk */}
        <div className="text-center mb-12">
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-6 text-center">
            FEATURED ITEMS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* BMX Sweatshirt */}
            <a
              href="https://store.bmxdenver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-black border-4 border-[#00ff0c] rounded-xl hover:border-white transition-all overflow-hidden transform hover:scale-105 cursor-pointer"
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src="/BMX_sweatshirt.jpg"
                  alt="BMX Crewneck Sweatshirt - Retro 3D BMX Rider Graphic"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
              </div>
            </a>

            {/* BMX Denver Hoodie */}
            <a
              href="https://store.bmxdenver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-black border-4 border-[#00ff0c] rounded-xl hover:border-white transition-all overflow-hidden transform hover:scale-105 cursor-pointer"
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src="/bmx-denver-hoodie-mountain-gear-logo-fleece-pullover.jpg"
                  alt="BMX Denver Hoodie - Mountain Gear Logo Fleece Pullover"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
              </div>
            </a>

            {/* DEN BMX T-Shirt */}
            <a
              href="https://store.bmxdenver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-black border-4 border-[#00ff0c] rounded-xl hover:border-white transition-all overflow-hidden transform hover:scale-105 cursor-pointer"
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src="/DEN_BMX_tshirt.jpg"
                  alt="DEN BMX T-Shirt - Color Splash Graphic Tee"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
              </div>
            </a>

            {/* Send It Kid Tee */}
            <a
              href="https://store.bmxdenver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-black border-4 border-[#00ff0c] rounded-xl hover:border-white transition-all overflow-hidden transform hover:scale-105 cursor-pointer"
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src="/sendit_kid.jpg"
                  alt="Toddler Tee - Neon SEND IT Skate Skull Shirt"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
              </div>
            </a>
          </div>
        </div>
        {/* Store Info Card */}
        <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 md:p-8 mb-12 backdrop-blur-sm">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            OFFICIAL MERCH!
          </h2>
          <p className="text-white text-xl leading-relaxed font-bold mb-4">
            Get your DEN BMX gear at{' '}
            <strong className="text-2xl text-[#00ff0c]">store.bmxdenver.com</strong>
          </p>
          <p className="text-white text-lg leading-relaxed font-bold">
            T-shirts, hats, stickers, and more!
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}

