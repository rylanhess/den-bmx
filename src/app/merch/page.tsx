import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  BoltIcon,
  PaintBrushIcon,
  ArrowPathIcon,
  InboxIcon,
  EnvelopeIcon,
  FlagIcon
} from '@heroicons/react/24/solid';

export const metadata: Metadata = {
  title: 'Merch Store | DEN BMX',
  description: 'DEN BMX merchandise store. Hats, shirts, stickers, BMX gear, and Denver BMX resale items.',
};

export default function MerchPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header - Mobile Only */}
      <header className="md:hidden bg-black border-b-4 border-[#00ff0c] sticky top-0 z-20 relative">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 bg-[#00ff0c] text-black hover:bg-white px-6 py-3 border-4 border-black font-black transition-colors transform hover:scale-105">
            ← BACK TO HOME
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-6xl relative z-10">
        {/* Hero - Professional Punk */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-4 border-[#00ff0c] p-8 mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              MERCH STORE
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
          <p className="text-3xl text-white font-black bg-black px-8 py-4 inline-block border-4 border-[#00ff0c] flex items-center gap-2">
            <ShoppingBagIcon className="w-8 h-8" />
            REP DEN BMX • SUPPORT THE TRACKS
          </p>
        </div>

        {/* Store Link Card */}
        <div className="bg-[#00ff0c] border-4 border-black p-6 md:p-8 mb-12">
          <h2 className="text-4xl font-black text-black mb-4 flex items-center gap-3">
            <ShoppingBagIcon className="w-16 h-16" />
            SHOP NOW!
          </h2>
          <p className="text-black text-xl leading-relaxed font-bold mb-6">
            Check out our <strong className="text-2xl">OFFICIAL MERCH STORE</strong>! Get your DEN BMX gear including t-shirts, hats, beanies, and more!
          </p>
          <a
            href="https://store.bmxdenver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black hover:bg-white text-[#00ff0c] hover:text-black font-black px-8 py-4 border-4 border-black transition-colors transform hover:scale-110 text-2xl"
          >
            <ShoppingBagIcon className="w-6 h-6 inline mr-2" />
            VISIT STORE →
          </a>
        </div>

        {/* What's Coming */}
        <div className="space-y-8 mb-12">
          {/* Apparel */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <SparklesIcon className="w-16 h-16" />
              APPAREL
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                Show your <span className="text-[#00ff0c] text-2xl">DEN BMX PRIDE</span> with our custom apparel line!
              </p>
              <div className="bg-[#00ff0c] border-4 border-black p-6 space-y-3">
                <p className="font-black text-black text-2xl">COMING SOON:</p>
                <ul className="space-y-3 ml-4 text-black font-bold text-lg">
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> T-Shirts & Long Sleeves</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Hoodies & Sweatshirts</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Hats & Beanies</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Jerseys & Race Gear</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Custom Designs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Stickers & Accessories */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <PaintBrushIcon className="w-16 h-16" />
              STICKERS & ACCESSORIES
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                Deck out your gear with <span className="text-[#00ff0c] text-2xl">DEN BMX STICKERS</span> and accessories!
              </p>
              <div className="bg-[#00ff0c] border-4 border-black p-6 space-y-3">
                <p className="font-black text-black text-2xl">COMING SOON:</p>
                <ul className="space-y-3 ml-4 text-black font-bold text-lg">
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Vinyl Stickers (multiple sizes)</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Decals for bikes & helmets</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Patches & Pins</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Keychains & Lanyards</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Water Bottles & Drinkware</li>
                </ul>
              </div>
            </div>
          </section>

          {/* BMX Gear */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <BoltIcon className="w-16 h-16" />
              BMX GEAR
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                Essential <span className="text-[#00ff0c] text-2xl">BMX EQUIPMENT</span> and gear for riders!
              </p>
              <div className="bg-[#00ff0c] border-4 border-black p-6 space-y-3">
                <p className="font-black text-black text-2xl">COMING SOON:</p>
                <ul className="space-y-3 ml-4 text-black font-bold text-lg">
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Helmets & Protective Gear</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Gloves & Pads</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Race Numbers & Plates</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Tools & Maintenance Supplies</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Training Equipment</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Denver Resale Hub */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <ArrowPathIcon className="w-16 h-16" />
              DENVER BMX RESALE HUB
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                A <span className="text-[#00ff0c] text-2xl">COMMUNITY MARKETPLACE</span> for buying and selling BMX gear in the Denver area!
              </p>
              <div className="bg-[#00ff0c] border-4 border-black p-6 space-y-3">
                <p className="font-black text-black text-2xl">WHAT TO EXPECT:</p>
                <ul className="space-y-3 ml-4 text-black font-bold text-lg">
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Used BMX Bikes & Parts</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Gear & Equipment</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Local Pickup Options</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Community Verified Sellers</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> Support Local Riders</li>
                </ul>
              </div>
              <p className="text-[#00ff0c] font-bold text-lg pt-2">
                Help keep BMX affordable and gear in the community!
              </p>
            </div>
          </section>
        </div>

        {/* Stay Updated */}
        <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8 mb-12">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
            <InboxIcon className="w-16 h-16" />
            STAY UPDATED
          </h2>
          <div className="bg-[#00ff0c] border-4 border-black p-6">
            <p className="text-black font-bold text-xl leading-relaxed mb-4">
              Want to know when the store opens? Have ideas for merch? Want to sell gear in our resale hub?
            </p>
            <Link
              href="/contact"
              className="inline-block bg-black hover:bg-white text-[#00ff0c] hover:text-black font-black px-8 py-4 border-4 border-black transition-colors transform hover:scale-110 text-xl"
            >
              <EnvelopeIcon className="w-5 h-5 inline mr-2" />
              CONTACT US
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 border-8 border-black p-8 text-center">
          <h2 className="text-5xl font-black text-black mb-4">
            SHOP DEN BMX MERCH!
          </h2>
          <p className="text-black text-2xl font-black mb-6">
            Get your gear and rep DEN BMX!
          </p>
          <a
            href="https://store.bmxdenver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black hover:bg-white text-[#00ff0c] hover:text-black font-black py-4 px-12 border-4 border-yellow-400 transition-colors transform hover:scale-110 text-2xl mb-4"
          >
            <ShoppingBagIcon className="w-6 h-6 inline mr-2" />
            VISIT STORE →
          </a>
          <Link
            href="/"
            className="md:hidden block mt-4 inline-block bg-black hover:bg-white text-[#00ff0c] hover:text-black font-black py-4 px-12 border-4 border-yellow-400 transition-colors transform hover:scale-110 text-2xl"
          >
            <FlagIcon className="w-6 h-6 inline mr-2" />
            BACK TO HOME
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center relative z-10">
        <div className="bg-black border-4 border-[#00ff0c] px-6 py-4 inline-block">
          <p className="text-[#00ff0c] font-black text-lg flex items-center justify-center gap-2">
            <BoltIcon className="w-5 h-5" />
            DEN BMX
          </p>
          <p className="text-white font-bold text-sm mt-1">Shop now at store.bmxdenver.com</p>
        </div>
      </footer>
    </div>
  );
}

