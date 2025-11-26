import Link from 'next/link';
import ThisWeeksEvents from '@/components/ThisWeeksEvents';
import TracksShowcase from '@/components/TracksShowcase';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { 
  FlagIcon, 
  HeartIcon, 
  EnvelopeIcon,
  ShoppingBagIcon,
  HandRaisedIcon,
  BoltIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
} from '@heroicons/react/24/solid';

export default function Home() {
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

      {/* Hero Section with Logo */}
      <section className="relative z-10 flex justify-center items-center px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center">
          <Image
            src="/logos/DEN_BMX_FINAL_Green.png"
            alt="DEN BMX Logo"
            width={400}
            height={400}
            className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-auto shadow-2xl mx-auto mb-6"
            priority
          />
          <div className="mt-4 sm:mt-6">
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#00ff0c] tracking-wider uppercase"
              style={{
                textShadow: '4px 4px 0px rgba(0,0,0,0.9), 2px 2px 0px rgba(0,0,0,0.7), 0 0 25px #00ff0c, 0 0 40px rgba(0,255,12,0.5)',
                letterSpacing: '0.2em',
                fontFamily: 'Arial Black, "Arial Black", Arial, sans-serif',
                transform: 'rotate(-1.5deg)',
                display: 'inline-block',
                fontWeight: 900,
                WebkitTextStroke: '1px rgba(0,0,0,0.3)'
              }}
            >
              FILL THE GATES!
            </h2>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto py-4 px-4 sm:px-6 pb-24 sm:pb-28 relative z-10">
        {/* This Week's Events */}
        <div className="mb-12">
          <ThisWeeksEvents />
        </div>

        {/* Tracks Showcase */}
        <TracksShowcase />

        {/* Action Buttons - Professional Punk Style - Mobile Only (hidden on desktop, nav bar shown instead) */}
        <div className="md:hidden max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Link href="/tracks" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <FlagIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">TRACK INFO</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">4 TRACKS • FULL DETAILS</div>
          </Link>

          <Link href="/calendar" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <CalendarIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">CALENDAR</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">ALL EVENTS • SCHEDULE</div>
          </Link>

          <Link href="/new-rider" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <BoltIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">NEW RIDER?</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">START HERE • GET INFO</div>
          </Link>

          <Link href="/volunteer" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <HeartIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">VOLUNTEER</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">HELP OUT • GET INVOLVED</div>
          </Link>

          <Link href="/track-pack" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <ArrowDownTrayIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">TRACK PACK</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">FREE TEMPLATES</div>
          </Link>

          <Link href="/shop" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <ShoppingBagIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">MERCH</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">SHOP NOW • STORE</div>
          </Link>

          <Link href="/about" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <HandRaisedIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">ABOUT</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">MEET THE OPERATORS</div>
          </Link>

          <Link href="/contact" className="bg-black active:bg-[#00ff0c] text-white active:text-black font-black py-6 sm:py-8 px-4 sm:px-6 border-4 border-[#00ff0c] shadow-2xl block transform active:scale-95 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center">
            <EnvelopeIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-2xl mb-2">CONTACT</div>
            <div className="text-xs sm:text-sm font-bold bg-[#00ff0c] text-black px-2 sm:px-3 py-1 inline-block">GET IN TOUCH • SAY HI</div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
