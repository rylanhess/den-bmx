import Link from 'next/link';
import ThisWeeksEvents from '@/components/ThisWeeksEvents';
import DataRefreshBanner from '@/components/DataRefreshBanner';
import TracksShowcase from '@/components/TracksShowcase';
import AlertsBanner from '@/components/AlertsBanner';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Geometric Background Shapes - Subtle punk accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64" style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)', backgroundColor: '#00ff0c'}}></div>
        <div className="absolute top-20 right-0 w-96 h-96" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)', backgroundColor: '#00ff0c'}}></div>
        <div className="absolute bottom-0 left-20 w-80 h-80" style={{clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', backgroundColor: '#00ff0c'}}></div>
        <div className="absolute bottom-40 right-40 w-40 h-40 bg-[#00ff0c] animate-float opacity-30"></div>
      </div>

      {/* Alert Bar - Shows real cancellations and weather updates */}
      <AlertsBanner />

      {/* Data Refresh Status Banner */}
      <DataRefreshBanner />

      {/* Logo Section */}
      <div className="flex justify-center m-6">
            <Image
              src="/DEN_BMX_FINAL_Green.png"
              alt="DEN BMX Logo"
              width={300}
              height={300}
              className="shadow-2xl"
              priority
            />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-6 relative z-10">
        {/* Hero Section - Professional Punk */}
        <div className="text-center mb-16">
          <div className="inline-block bg-black border-4 border-[#00ff0c] p-8 shadow-2xl mb-6">
            <h1 className="text-6xl md:text-8xl font-black text-[#00ff0c] mb-2 tracking-wider" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              DEN<span className="text-white">BMX</span>
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
          <p className="text-3xl md:text-4xl text-white font-black mb-2 bg-black px-8 py-3 inline-block border-4 border-[#00ff0c]">
            DENVER METRO BMX RACING
          </p>
          <p className="text-[#00ff0c] text-xl font-bold mt-4">
            🏁 MILE HIGH • DACONO • COUNTY LINE BMX 🏁
          </p>
        </div>

        {/* This Week's Events */}
        <div className="mb-12">
          <ThisWeeksEvents />
        </div>

        {/* Tracks Showcase */}
        <TracksShowcase />

        {/* Action Buttons - Professional Punk Style */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Link href="/donate" className="bg-black hover:bg-[#00ff0c] text-white hover:text-black font-black py-8 px-6 border-4 border-[#00ff0c] shadow-2xl block transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">💛 ₿ $</div>
            <div className="text-2xl">DONATE NOW</div>
            <div className="text-sm font-bold mt-2 bg-[#00ff0c] text-black px-3 py-1 inline-block">BUY A BIKE TUBE • $15</div>
          </Link>

          <Link href="/tracks" className="bg-black hover:bg-[#00ff0c] text-white hover:text-black font-black py-8 px-6 border-4 border-[#00ff0c] shadow-2xl block transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">🏁</div>
            <div className="text-2xl">TRACK INFO</div>
            <div className="text-sm font-bold mt-2 bg-[#00ff0c] text-black px-3 py-1 inline-block">3 TRACKS • FULL DETAILS</div>
          </Link>

          <Link href="/new-rider" className="bg-black hover:bg-[#00ff0c] text-white hover:text-black font-black py-8 px-6 border-4 border-[#00ff0c] shadow-2xl block transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">🚴</div>
            <div className="text-2xl">NEW RIDER?</div>
            <div className="text-sm font-bold mt-2 bg-[#00ff0c] text-black px-3 py-1 inline-block">START HERE • GET INFO</div>
          </Link>

          <Link href="/contact" className="bg-black hover:bg-[#00ff0c] text-white hover:text-black font-black py-8 px-6 border-4 border-[#00ff0c] shadow-2xl block transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">📧</div>
            <div className="text-2xl">CONTACT ME</div>
            <div className="text-sm font-bold mt-2 bg-[#00ff0c] text-black px-3 py-1 inline-block">GET IN TOUCH • SAY HI</div>
          </Link>
        </div>

        {/* Status Badge */}
        <div className="text-center">
          <div className="inline-block bg-black border-4 border-[#00ff0c] px-8 py-4">
            <p className="text-[#00ff0c] text-lg font-black">
              🚧 SITE UNDER CONSTRUCTION 🚧
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center relative z-10">
        <div className="bg-black border-4 border-[#00ff0c] px-6 py-4 inline-block">
          <p className="text-[#00ff0c] font-black text-lg">
            ⚡ DEN BMX ⚡ DENVER METRO BMX SCHEDULES ⚡
          </p>
        </div>
      </footer>
    </div>
  );
}
