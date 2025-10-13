import Link from 'next/link';
import ThisWeeksEvents from '@/components/ThisWeeksEvents';
import DataRefreshBanner from '@/components/DataRefreshBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-600 relative overflow-hidden">
      {/* Geometric Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 opacity-80" style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)'}}></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-pink-400 opacity-60" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'}}></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-cyan-400 opacity-70" style={{clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'}}></div>
        <div className="absolute bottom-40 right-40 w-40 h-40 bg-lime-400 animate-float"></div>
      </div>

      {/* Alert Bar - BLINKING */}
      <div className="bg-yellow-400 text-black px-4 py-3 text-center font-black border-b-8 border-black animate-blink relative z-10">
        <span className="text-2xl">⚠️</span> WEATHER UPDATES AND CANCELLATIONS WILL APPEAR HERE <span className="text-2xl">⚠️</span>
      </div>

      {/* Data Refresh Status Banner */}
      <DataRefreshBanner />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Hero Section - WILD */}
        <div className="text-center mb-16 animate-pulse-crazy">
          <div className="inline-block bg-black border-8 border-yellow-400 p-8 shadow-2xl mb-6 animate-border-spin">
            <h1 className="text-6xl md:text-8xl font-black text-yellow-400 mb-2 tracking-wider" style={{textShadow: '4px 4px 0px #ff00ff, 8px 8px 0px #00ffff'}}>
              DEN<span className="text-pink-500 animate-blink">BMX</span>
            </h1>
            <div className="h-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 animate-color-shift"></div>
          </div>
          <p className="text-3xl md:text-4xl text-white font-black mb-2 bg-black px-8 py-3 inline-block border-4 border-cyan-400">
            DENVER METRO BMX RACING
          </p>
          <p className="text-yellow-300 text-xl font-bold mt-4 animate-shake">
            🏁 MILE HIGH • DACONO • COUNTY LINE BMX 🏁
          </p>
        </div>

        {/* This Week's Events */}
        <div className="mb-12">
          <ThisWeeksEvents />
        </div>

        {/* Action Buttons - ATTENTION GRABBING */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Link href="/donate" className="bg-gradient-to-br from-yellow-400 to-pink-500 hover:from-pink-500 hover:to-yellow-400 text-black font-black py-8 px-6 border-8 border-black shadow-2xl block transform hover:scale-110 transition-all animate-pulse-crazy">
            <div className="text-5xl mb-3 animate-float">💛 ₿ $</div>
            <div className="text-2xl">DONATE NOW</div>
            <div className="text-sm font-bold mt-2 bg-black text-yellow-400 px-3 py-1 inline-block">BUY A BIKE TUBE • $15</div>
          </Link>

          <Link href="/tracks" className="bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-blue-600 hover:to-cyan-400 text-white font-black py-8 px-6 border-8 border-black shadow-2xl block transform hover:scale-110 transition-all">
            <div className="text-5xl mb-3 animate-rotate-wild">🏁</div>
            <div className="text-2xl">TRACK INFO</div>
            <div className="text-sm font-bold mt-2 bg-black text-cyan-400 px-3 py-1 inline-block">3 TRACKS • FULL DETAILS</div>
          </Link>

          <Link href="/new-rider" className="bg-gradient-to-br from-lime-400 to-green-600 hover:from-green-600 hover:to-lime-400 text-black font-black py-8 px-6 border-8 border-black shadow-2xl block transform hover:scale-110 transition-all">
            <div className="text-5xl mb-3 animate-shake">🚴</div>
            <div className="text-2xl">NEW RIDER?</div>
            <div className="text-sm font-bold mt-2 bg-black text-lime-400 px-3 py-1 inline-block">START HERE • GET INFO</div>
          </Link>
        </div>

        {/* Status Badge - BLINKING */}
        <div className="text-center">
          <div className="inline-block bg-black border-8 border-pink-500 px-8 py-4 animate-blink">
            <p className="text-yellow-400 text-lg font-black">
              🚧 SITE UNDER CONSTRUCTION 🚧
            </p>
          </div>
        </div>
      </main>

      {/* Footer - LOUD */}
      <footer className="container mx-auto px-4 py-8 text-center relative z-10">
        <div className="bg-black border-4 border-yellow-400 px-6 py-4 inline-block">
          <p className="text-yellow-400 font-black text-lg">
            ⚡ DEN BMX ⚡ DENVER METRO BMX SCHEDULES ⚡
          </p>
        </div>
      </footer>
    </div>
  );
}
