import Link from 'next/link';
import Image from 'next/image';

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-block mb-6">
          <div className="text-[#00ff0c] font-black text-xl hover:underline">
            ← Back to Home
          </div>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#00ff0c] mb-4" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
            GAMES
          </h1>
          <div className="h-2 bg-[#00ff0c] max-w-md mx-auto"></div>
        </div>

        {/* Games Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link 
            href="/games/excite-bmx" 
            className="bg-black border-4 border-[#00ff0c] p-6 hover:bg-[#00ff0c] hover:text-black transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-3xl mb-4">🏁</div>
              <h2 className="text-2xl font-black mb-2">EXCITE BMX</h2>
              <p className="text-sm mb-4">8-bit side-scrolling BMX racing game. Race through Denver tracks to the Grands!</p>
              <div className="text-xs font-bold bg-[#00ff0c] text-black px-3 py-1 inline-block">
                PLAY NOW →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

