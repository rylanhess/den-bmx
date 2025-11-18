import type { Metadata } from 'next';
import Image from 'next/image';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';

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
      {/* Hero Section with Logo and Shop Now Button */}
      <section className="flex flex-col justify-center items-center px-4 py-8 sm:py-12 md:py-16 bg-black">
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
        <div className="bg-[#00ff0c] border-4 border-black p-8 md:p-12 text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-black mb-4">
            OFFICIAL MERCH!
          </h1>
          <p className="text-black text-xl md:text-2xl font-bold mb-6">
            Get your DEN BMX gear at{' '}
            <span className="text-2xl md:text-3xl">store.bmxdenver.com</span>
          </p>
          <p className="text-black text-lg md:text-xl font-bold">
            T-shirts, hats, stickers, and more!
          </p>
        </div>

        {/* Additional CTA */}
        <div className="bg-black border-4 border-[#00ff0c] p-8 text-center">
          <p className="text-[#00ff0c] text-xl md:text-2xl font-black mb-6">
            REP DEN BMX • SUPPORT THE TRACKS
          </p>
          <a
            href="https://store.bmxdenver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#00ff0c] hover:bg-white text-black font-black px-10 py-5 border-4 border-black transition-colors transform hover:scale-110 text-xl md:text-2xl"
          >
            <ShoppingBagIcon className="w-6 h-6 inline mr-2" />
            VISIT STORE →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center relative z-10">
        <div className="bg-black border-4 border-[#00ff0c] px-6 py-4 inline-block">
          <p className="text-[#00ff0c] font-black text-lg flex items-center justify-center gap-2">
            <ShoppingBagIcon className="w-5 h-5" />
            DEN BMX OFFICIAL MERCH
          </p>
          <p className="text-white font-bold text-sm mt-1">store.bmxdenver.com</p>
        </div>
      </footer>
    </div>
  );
}

