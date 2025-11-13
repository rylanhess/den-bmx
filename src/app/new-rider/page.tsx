import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FlagIcon,
  SparklesIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  SunIcon,
  CubeIcon,
  UserIcon,
  TrophyIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';

export const metadata: Metadata = {
  title: 'New Rider Guide | DEN BMX',
  description: 'Everything you need to know to get started with BMX racing in Denver. Learn about USA BMX membership, what to bring, and track information for Mile High, Dacono, and County Line BMX.',
};

export default function NewRiderPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <header className="bg-black border-b-4 border-[#00ff0c] sticky top-0 z-20 relative">
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
              NEW RIDER?
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
          <p className="text-3xl text-white font-black bg-black px-8 py-4 inline-block border-4 border-[#00ff0c] flex items-center gap-2">
            <FlagIcon className="w-8 h-8" />
            START YOUR BMX JOURNEY!
          </p>
        </div>

        {/* Quick Start Card */}
        <div className="bg-[#00ff0c] border-4 border-black p-6 md:p-8 mb-12">
          <h2 className="text-4xl font-black text-black mb-4 flex items-center gap-3">
            <SparklesIcon className="w-16 h-16" />
            YOUR FIRST DAY IS FREE!
          </h2>
          <p className="text-black text-xl leading-relaxed font-bold">
            <strong className="text-2xl">USA BMX</strong> offers your first day at the track COMPLETELY FREE! No membership needed - just SHOW UP, sign a waiver, and TRY IT OUT! Track gate fee $5-10. THAT&apos;S IT!
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* USA BMX Membership */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <FlagIcon className="w-16 h-16" />
              USA BMX MEMBERSHIP
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                After your FREE first day, you&apos;ll need a <span className="text-[#00ff0c] text-2xl">USA BMX MEMBERSHIP</span> to keep racing! Memberships are ANNUAL and give you access to ALL USA BMX tracks NATIONWIDE!
              </p>
              <div className="bg-[#00ff0c] border-4 border-black p-6 space-y-3">
                <p className="font-black text-black text-2xl">MEMBERSHIP TYPES & PRICES:</p>
                <ul className="space-y-3 ml-4 text-black font-bold text-lg">
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> <strong>Race (Annual):</strong> ~$60 - Full racing privileges!</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> <strong>Race Plus:</strong> ~$90 - Includes insurance!</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> <strong>Strider (Ages 2-5):</strong> ~$30 - Balance bikes!</li>
                  <li className="border-l-4 border-black pl-3 flex items-center gap-2"><BoltIcon className="w-5 h-5" /> <strong>One-Day License:</strong> ~$10 - Try before you buy!</li>
                </ul>
              </div>
              <p className="pt-2">
                <a 
                  href="https://www.usabmx.com/membership" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00ff0c] text-black hover:bg-white px-6 py-3 border-4 border-black font-black text-lg transform hover:scale-105 transition-all"
                >
                  <LinkIcon className="w-5 h-5" /> SIGN UP NOW!
                </a>
              </p>
            </div>
          </section>

          {/* What to Bring */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <AcademicCapIcon className="w-16 h-16" />
              WHAT TO BRING!
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#00ff0c] border-4 border-black p-6">
                <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-2"><CheckCircleIcon className="w-6 h-6" /> REQUIRED GEAR!</h3>
                <ul className="space-y-3 text-black font-bold text-lg">
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <ShieldCheckIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span><strong>HELMET:</strong> Full-face or 3/4 shell!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <UserIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span><strong>LONG PANTS:</strong> Denim or riding pants!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <UserIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span><strong>LONG SLEEVES:</strong> Shirt or jersey!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <UserIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span><strong>CLOSED SHOES:</strong> Athletic shoes OK!</span>
                  </li>
                </ul>
                <p className="text-sm text-black mt-4 font-bold bg-white border-2 border-black p-2 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  Most tracks have loaner helmets!
                </p>
              </div>
              <div className="bg-white border-4 border-black p-6">
                <h3 className="text-2xl font-black text-black mb-4">+ RECOMMENDED!</h3>
                <ul className="space-y-3 text-black font-bold text-lg">
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <ShieldCheckIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span><strong>GLOVES:</strong> BMX or cycling!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <ShieldCheckIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span><strong>PADS:</strong> Elbow/Knee protection!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <BoltIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span><strong>WATER:</strong> Stay hydrated!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <SunIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span><strong>SUNSCREEN:</strong> Colorado sun!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <CubeIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span><strong>CHAIR/CANOPY:</strong> Race comfort!</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Strider Riders */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <UserIcon className="w-16 h-16" />
              STRIDER RIDERS (AGES 2-5)!
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-[#00ff0c] text-xl font-bold">
                <span className="text-[#00ff0c] text-2xl">STRIDER RACES</span> are for YOUNG KIDS on balance bikes (no pedals)! Races are 25-50 feet long and are FUN, LOW-PRESSURE intro to BMX!
              </p>
              <div className="bg-[#00ff0c] border-4 border-black p-6 space-y-3">
                <p className="font-black text-black text-2xl">WHAT TO KNOW:</p>
                <ul className="space-y-2 ml-4 text-black font-bold text-lg">
                  <li className="border-l-4 border-[#00ff0c] pl-3 flex items-center gap-2"><SparklesIcon className="w-5 h-5" /> Races are SHORT & NON-COMPETITIVE - ALL ABOUT FUN!</li>
                  <li className="border-l-4 border-white pl-3 flex items-center gap-2"><TrophyIcon className="w-5 h-5" /> Kids get TROPHIES just for participating!</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3 flex items-center gap-2"><FlagIcon className="w-5 h-5" /> No starting gate - kids push off themselves!</li>
                  <li className="border-l-4 border-orange-500 pl-3 flex items-center gap-2"><UserIcon className="w-5 h-5" /> Parents can WALK alongside younger riders!</li>
                  <li className="border-l-4 border-purple-500 pl-3 flex items-center gap-2"><CurrencyDollarIcon className="w-5 h-5" /> Special $30/year Strider membership!</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3 flex items-center gap-2"><FlagIcon className="w-5 h-5" /> Kids transition to pedal bikes around age 4-5!</li>
                </ul>
              </div>
              <p className="pt-2">
                <a 
                  href="https://www.usabmx.com/page/strider_cup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00ff0c] text-white hover:bg-white hover:text-black px-6 py-3 border-4 border-black font-black text-lg transform hover:scale-105 transition-all"
                >
                  <LinkIcon className="w-5 h-5" /> LEARN MORE!
                </a>
              </p>
            </div>
          </section>

          {/* How Racing Works */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8 animate-pulse-crazy">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <TrophyIcon className="w-16 h-16" />
              HOW BMX RACING WORKS!
            </h2>
            <div className="space-y-6">
              <div className="bg-white border-4 border-black p-6">
                <h3 className="text-2xl font-black text-black mb-3 flex items-center gap-2"><BoltIcon className="w-6 h-6" /> RACE FORMAT!</h3>
                <p className="leading-relaxed mb-3 text-black font-bold text-lg">
                  BMX races are SHORT, INTENSE SPRINTS around a dirt track with JUMPS, BERMS, and STRAIGHTAWAYS! 
                  Races last 30-45 seconds with 8 riders at a time!
                </p>
                <div className="bg-black border-2 border-yellow-400 p-4">
                  <ol className="space-y-2 ml-4 list-decimal text-[#00ff0c] font-bold">
                    <li><strong>MOTOS (Qualifying):</strong> Race 3 times against different riders!</li>
                    <li><strong>POINTS:</strong> 1st = 1pt, 2nd = 2pts, etc!</li>
                    <li><strong>MAIN EVENTS:</strong> Top riders advance to FINALS!</li>
                    <li><strong>AWARDS:</strong> Trophies/medals for top finishers!</li>
                  </ol>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#00ff0c] border-4 border-black p-6">
                  <p className="font-black text-black text-xl mb-3 flex items-center gap-2"><UserIcon className="w-6 h-6" /> AGE GROUPS!</p>
                  <ul className="space-y-1 text-black font-bold">
                    <li>• Strider (2-5)</li>
                    <li>• 5 & Under, 6, 7, 8, 9, 10</li>
                    <li>• 11-12, 13-14, 15-16</li>
                    <li>• 17-24, 25-30, 31-35...</li>
                    <li>• Masters classes (36+)</li>
                  </ul>
                </div>
                <div className="bg-[#00ff0c] border-4 border-black p-6">
                  <p className="font-black text-black text-xl mb-3 flex items-center gap-2"><SparklesIcon className="w-6 h-6" /> SKILL LEVELS!</p>
                  <ul className="space-y-1 text-black font-bold">
                    <li>• <strong>NOVICE:</strong> 0-50 pts (beginners)</li>
                    <li>• <strong>INTERMEDIATE:</strong> 51-150 pts</li>
                    <li>• <strong>EXPERT:</strong> 151+ pts</li>
                    <li>• <strong>PRO:</strong> Elite racers!</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-500 border-4 border-black p-6">
                  <p className="font-black text-white text-xl mb-2 flex items-center gap-2"><CalendarIcon className="w-6 h-6" /> PRACTICE NIGHT!</p>
                  <p className="text-white font-bold">
                    Weekday evenings • Lap the track 1-2 hours • Learn & build skills • $5-10!
                  </p>
                </div>
                <div className="bg-white border-4 border-black p-6">
                  <p className="font-black text-white text-xl mb-2 flex items-center gap-2"><FlagIcon className="w-6 h-6" /> RACE DAY!</p>
                  <p className="text-white font-bold">
                    Usually Sundays • Motos & main events • Register 1-2hrs before • $15-25!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Track-Specific Info */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <MapPinIcon className="w-16 h-16" />
              DENVER METRO TRACKS!
            </h2>
            <div className="space-y-6">
              {/* Mile High BMX */}
              <div className="bg-white border-4 border-black p-6">
                <h3 className="text-3xl font-black text-black mb-2 flex items-center gap-2"><FlagIcon className="w-8 h-8" /> MILE HIGH BMX</h3>
                <p className="text-white font-black text-xl mb-3">Lakewood, CO</p>
                <div className="space-y-2 text-black font-bold">
                  <p className="flex items-center gap-2"><MapPinIcon className="w-5 h-5" /> Crown Hill Park, 10th & Kipling</p>
                  <p className="flex items-center gap-2"><CalendarIcon className="w-5 h-5" /> Practice THU 6-8PM • Races SUN</p>
                  <p className="flex items-center gap-2"><CurrencyDollarIcon className="w-5 h-5" /> Practice $5 • Race $20</p>
                  <a 
                    href="https://www.facebook.com/MileHighBmx/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-[#00ff0c] px-4 py-2 border-2 border-yellow-400 font-black hover:bg-[#00ff0c] hover:text-black transition-colors mt-2"
                  >
                    <LinkIcon className="w-5 h-5" /> FACEBOOK
                  </a>
                </div>
              </div>

              {/* Dacono BMX */}
              <div className="bg-[#00ff0c] border-4 border-black p-6">
                <h3 className="text-3xl font-black text-black mb-2 flex items-center gap-2"><FlagIcon className="w-8 h-8" /> DACONO BMX</h3>
                <p className="text-black font-black text-xl mb-3">Dacono, CO</p>
                <div className="space-y-2 text-black font-bold">
                  <p className="flex items-center gap-2"><MapPinIcon className="w-5 h-5" /> Carbon Valley Park, 2776 WCR 26</p>
                  <p className="flex items-center gap-2"><CalendarIcon className="w-5 h-5" /> Practice WED 6-8PM • Races SUN</p>
                  <p className="flex items-center gap-2"><CurrencyDollarIcon className="w-5 h-5" /> Practice $5 • Race $15-20</p>
                  <a 
                    href="https://www.facebook.com/DaconoBMXTrack/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-[#00ff0c] px-4 py-2 border-2 border-pink-500 font-black hover:bg-[#00ff0c] hover:text-black transition-colors mt-2"
                  >
                    <LinkIcon className="w-5 h-5" /> FACEBOOK
                  </a>
                </div>
              </div>

              {/* County Line BMX */}
              <div className="bg-purple-500 border-4 border-black p-6">
                <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-2"><FlagIcon className="w-8 h-8" /> COUNTY LINE BMX</h3>
                <p className="text-white font-black text-xl mb-3">Highlands Ranch, CO</p>
                <div className="space-y-2 text-white font-bold">
                  <p className="flex items-center gap-2"><MapPinIcon className="w-5 h-5" /> Redstone Park, 9691 Redstone Dr</p>
                  <p className="flex items-center gap-2"><CalendarIcon className="w-5 h-5" /> Practice WED 6-8PM • Races SUN</p>
                  <p className="flex items-center gap-2"><CurrencyDollarIcon className="w-5 h-5" /> Practice $5 • Race $15-20</p>
                  <a 
                    href="https://www.facebook.com/CountyLineBMX/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 border-2 border-white font-black hover:bg-white transition-colors mt-2"
                  >
                    <LinkIcon className="w-5 h-5" /> FACEBOOK
                  </a>
                </div>
              </div>

              <div className="bg-[#00ff0c] border-4 border-black p-4 mt-4">
                <p className="text-black font-black flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
                  IMPORTANT: Schedules & fees CAN change! ALWAYS check track Facebook before visiting! Weather affects schedules!
                </p>
              </div>
            </div>
          </section>

          {/* FAQs - SIMPLIFIED */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6 flex items-center gap-3">
              <QuestionMarkCircleIcon className="w-16 h-16" />
              FAQS!
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#00ff0c] border-4 border-black p-4">
                <h3 className="text-lg font-black text-black mb-2">NEED YOUR OWN BIKE?</h3>
                <p className="text-black font-bold">YES! Some tracks have loaners. Find used bikes on Facebook/Craigslist!</p>
              </div>
              <div className="bg-white border-4 border-black p-4">
                <h3 className="text-lg font-black text-black mb-2">WHAT AGE TO START?</h3>
                <p className="text-black font-bold">Kids as young as 2! No upper limit - adults race too!</p>
              </div>
              <div className="bg-[#00ff0c] border-4 border-black p-4">
                <h3 className="text-lg font-black text-black mb-2">IS IT DANGEROUS?</h3>
                <p className="text-black font-bold">Has risks like any sport, but SAFE with proper gear! Start slow!</p>
              </div>
              <div className="bg-purple-500 border-4 border-black p-4">
                <h3 className="text-lg font-black text-white mb-2">HOW MUCH $$$?</h3>
                <p className="text-white font-bold">Bike $150-300, helmet $50-100, gear $50. Then $60/year + $5-25/week!</p>
              </div>
              <div className="bg-white border-4 border-black p-4 md:col-span-2">
                <h3 className="text-lg font-black text-white mb-2">NEED TO JUMP?</h3>
                <p className="text-white font-bold">NO! Beginners can ROLL over jumps! You&apos;ll learn naturally!</p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="bg-black border-8 border-cyan-400 p-6 md:p-8">
            <h2 className="text-4xl font-black text-white mb-6 flex items-center gap-3">
              <LinkIcon className="w-16 h-16" />
              HELPFUL RESOURCES!
            </h2>
            <div className="space-y-4">
              <a 
                href="https://www.usabmx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-[#00ff0c] border-4 border-black hover:bg-[#00ff0c] transition-colors transform hover:scale-105"
              >
                <div>
                  <p className="font-black text-black text-xl">USA BMX OFFICIAL!</p>
                  <p className="text-black font-bold">Membership, rules, results & MORE!</p>
                </div>
                <LinkIcon className="w-6 h-6" />
              </a>
              
              <a 
                href="https://www.usabmx.com/tracks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-[#00ff0c] border-4 border-black hover:bg-white transition-colors transform hover:scale-105"
              >
                <div>
                  <p className="font-black text-white text-xl">TRACK FINDER!</p>
                  <p className="text-white font-bold">Find BMX tracks EVERYWHERE!</p>
                </div>
                <LinkIcon className="w-6 h-6" />
              </a>

              <a 
                href="https://www.usabmx.com/page/rulebook" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-[#00ff0c] border-4 border-black hover:bg-purple-500 transition-colors transform hover:scale-105"
              >
                <div>
                  <p className="font-black text-black text-xl">RULEBOOK!</p>
                  <p className="text-black font-bold">Official rules & regulations!</p>
                </div>
                <LinkIcon className="w-6 h-6" />
              </a>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 border-8 border-black p-8 text-center animate-pulse-crazy">
            <h2 className="text-5xl font-black text-black mb-4 animate-blink">
              READY TO START?!
            </h2>
            <p className="text-black text-2xl font-black mb-6 flex items-center justify-center gap-2">
              Head to ANY Denver metro track - FIRST DAY IS FREE!
              <SparklesIcon className="w-6 h-6" />
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-black hover:bg-white text-[#00ff0c] hover:text-black font-black py-4 px-12 border-4 border-yellow-400 transition-colors transform hover:scale-110 text-2xl"
            >
              <FlagIcon className="w-6 h-6" />
              SEE THIS WEEK&apos;S EVENTS!
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center relative z-10">
        <div className="bg-black border-4 border-[#00ff0c] px-6 py-4 inline-block">
          <p className="text-[#00ff0c] font-black text-lg flex items-center justify-center gap-2">
            <BoltIcon className="w-5 h-5" />
            DEN BMX
          </p>
          <p className="text-white font-bold text-sm mt-1">Info from USA BMX & local tracks</p>
          <p className="text-[#00ff0c] font-bold text-sm">ALWAYS verify schedules before visiting!</p>
        </div>
      </footer>
    </div>
  );
}

