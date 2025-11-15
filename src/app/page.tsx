import Link from 'next/link';
import ThisWeeksEvents from '@/components/ThisWeeksEvents';
import DataRefreshBanner from '@/components/DataRefreshBanner';
import TracksShowcase from '@/components/TracksShowcase';
import AlertsBanner from '@/components/AlertsBanner';
import Image from 'next/image';
import { 
  FlagIcon, 
  HeartIcon, 
  CurrencyDollarIcon,
  EnvelopeIcon,
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
  HandRaisedIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  CircleStackIcon
} from '@heroicons/react/24/solid';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Alert Bar - Shows real cancellations and weather updates */}
      <AlertsBanner />

      {/* Data Refresh Status Banner */}
      <DataRefreshBanner />

      {/* Logo Section */}
      <div className="flex justify-center px-4 py-4 sm:py-6">
            <Image
              src="/DEN_BMX_FINAL_Green.png"
              alt="DEN BMX Logo"
              width={300}
              height={300}
              className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] h-auto shadow-2xl"
              priority
            />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        {/* Hero Section - Professional Punk */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block bg-black border-4 border-[#00ff0c] p-4 sm:p-6 md:p-8 shadow-2xl mb-4 sm:mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-[#00ff0c] mb-2 tracking-wider" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              DEN<span className="text-white">BMX</span>
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-black mb-2 bg-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 inline-block border-4 border-[#00ff0c]">
            DENVER METRO BMX RACING
          </p>
          <p className="text-[#00ff0c] text-base sm:text-lg md:text-xl font-bold mt-3 sm:mt-4 px-4 flex items-center justify-center gap-2">
            <FlagIcon className="w-5 h-5" />
            MILE HIGH • DACONO • COUNTY LINE BMX
          </p>
        </div>

        {/* This Week's Events */}
        <div className="mb-12">
          <ThisWeeksEvents />
        </div>

        {/* Tracks Showcase */}
        <TracksShowcase />

        {/* Action Buttons - Professional Punk Style - Mobile Optimized */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          <Link href="/donate" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <HeartIcon className="w-10 h-10 sm:w-12 sm:h-12" />
              <CircleStackIcon className="w-10 h-10 sm:w-12 sm:h-12" />
              <CurrencyDollarIcon className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="text-xl sm:text-2xl mb-2">DONATE NOW</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">BUY A BIKE TUBE • $15</div>
          </Link>

          <Link href="/tracks" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <FlagIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">TRACK INFO</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">3 TRACKS • FULL DETAILS</div>
          </Link>

          <Link href="/new-rider" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <BoltIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">NEW RIDER?</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">START HERE • GET INFO</div>
          </Link>

          <Link href="/contact" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <EnvelopeIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">CONTACT ME</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">GET IN TOUCH • SAY HI</div>
          </Link>

          <Link href="/volunteer" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <WrenchScrewdriverIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">VOLUNTEER</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">HELP OUT • GET INVOLVED</div>
          </Link>

          <Link href="/merch" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <ShoppingBagIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">MERCH</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">STORE • COMING SOON</div>
          </Link>

          <Link href="/about" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <HandRaisedIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">ABOUT</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">MEET THE OPERATORS</div>
          </Link>

        </div>

        {/* Status Badge */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block bg-black border-4 border-[#00ff0c] px-4 sm:px-6 md:px-8 py-3 sm:py-4">
            <p className="text-[#00ff0c] text-sm sm:text-base md:text-lg font-black flex items-center justify-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5" />
              SITE UNDER CONSTRUCTION
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 sm:py-8 text-center relative z-10">
        <div className="bg-black border-4 border-[#00ff0c] px-4 sm:px-6 py-3 sm:py-4 inline-block">
          <p className="text-[#00ff0c] font-black text-sm sm:text-base md:text-lg flex items-center justify-center gap-2">
            <BoltIcon className="w-5 h-5" />
            DEN BMX • DENVER METRO BMX SCHEDULES
          </p>
        </div>
      </footer>
    </div>
  );
}
