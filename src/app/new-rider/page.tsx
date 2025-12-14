import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FlagIcon,
  LinkIcon
} from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'New Rider',
  description: 'Everything you need to know to get started with BMX racing in Denver. Learn about USA BMX membership, what to bring, and track information for Mile High, Dacono, and County Line BMX.',
};

export default function NewRiderPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image - Color BMX Racing Photo */}
      <div 
        className="fixed inset-0 z-0 w-full h-full" 
        style={{ 
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/side-view-people-riding-bicycled-sunny-day%20(1).jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 w-full h-full bg-black/50" />
      </div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-6xl relative z-10">
        {/* Back Button - Mobile Only */}
        <Link 
          href="/"
          className="md:hidden inline-block mb-6 sm:mb-8 bg-black text-[#00ff0c] font-black px-4 sm:px-6 py-3 border-4 border-[#00ff0c] rounded-xl active:bg-[#00ff0c] active:text-black transition-all transform active:scale-95 min-h-[44px] flex items-center justify-center"
        >
          ← BACK TO HOME
        </Link>
        {/* Hero - Professional Punk */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-4 border-[#00ff0c] rounded-xl p-8 mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              NEW RIDERS
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
        </div>

        {/* Quick Start Card */}
        <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 md:p-8 mb-12 backdrop-blur-sm">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            YOUR FIRST DAY IS FREE
          </h2>
          <p className="text-white text-xl leading-relaxed font-bold">
            <strong className="text-2xl text-[#00ff0c]">USA BMX</strong> offers your first day at the track COMPLETELY FREE. No membership needed - just SHOW UP, sign a waiver, and TRY IT OUT. Track gate fee $5-10. THAT&apos;S IT.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* USA BMX Membership */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              USA BMX MEMBERSHIP
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                After your FREE first day, you&apos;ll need a <span className="text-[#00ff0c] text-2xl">USA BMX MEMBERSHIP</span> to keep racing. Memberships are ANNUAL and give you access to ALL USA BMX tracks NATIONWIDE.
              </p>
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 space-y-3 backdrop-blur-sm">
                <p className="font-black text-[#00ff0c] text-2xl">MEMBERSHIP TYPES & PRICES:</p>
                <ul className="space-y-3 ml-4 text-white font-bold text-lg">
                  <li className="border-l-4 border-[#00ff0c] pl-3"><strong className="text-[#00ff0c]">Race (Annual):</strong> ~$60 - Full racing privileges</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3"><strong className="text-[#00ff0c]">Race Plus:</strong> ~$90 - Includes insurance</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3"><strong className="text-[#00ff0c]">Strider (Ages 2-5):</strong> ~$30 - Balance bikes</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3"><strong className="text-[#00ff0c]">One-Day License:</strong> ~$10 - Try before you buy</li>
                </ul>
              </div>
              <p className="pt-2">
                <a 
                  href="https://www.usabmx.com/membership" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00ff0c] text-black hover:bg-white px-6 py-3 border-4 border-black font-black text-lg transition-colors"
                >
                  <LinkIcon className="w-5 h-5" /> SIGN UP NOW
                </a>
              </p>
            </div>
          </section>

          {/* What to Bring */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              WHAT TO BRING
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-black text-[#00ff0c] mb-4">REQUIRED GEAR</h3>
                <ul className="space-y-3 text-white font-bold text-lg">
                  <li className="border-l-4 border-[#00ff0c] pl-3">
                    <span><strong className="text-[#00ff0c]">HELMET:</strong> Full-face or 3/4 shell</span>
                  </li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">
                    <span><strong className="text-[#00ff0c]">LONG PANTS:</strong> Denim or riding pants</span>
                  </li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">
                    <span><strong className="text-[#00ff0c]">LONG SLEEVES:</strong> Shirt or jersey</span>
                  </li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">
                    <span><strong className="text-[#00ff0c]">CLOSED SHOES:</strong> Athletic shoes OK</span>
                  </li>
                </ul>
                <p className="text-sm text-white mt-4 font-bold bg-black/50 border-2 border-[#00ff0c] p-2">
                  Most tracks have loaner helmets
                </p>
              </div>
              <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-black text-[#00ff0c] mb-4">+ RECOMMENDED</h3>
                <ul className="space-y-3 text-white font-bold text-lg">
                  <li className="border-l-4 border-[#00ff0c] pl-3">
                    <span><strong className="text-[#00ff0c]">GLOVES:</strong> BMX or cycling</span>
                  </li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">
                    <span><strong className="text-[#00ff0c]">PADS:</strong> Elbow/Knee protection</span>
                  </li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">
                    <span><strong className="text-[#00ff0c]">WATER:</strong> Stay hydrated</span>
                  </li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">
                    <span><strong className="text-[#00ff0c]">SUNSCREEN:</strong> Colorado sun</span>
                  </li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">
                    <span><strong className="text-[#00ff0c]">CHAIR/CANOPY:</strong> Race comfort</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Strider Riders */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              STRIDER RIDERS (AGES 2-5)
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                <span className="text-[#00ff0c] text-2xl">STRIDER RACES</span> are for YOUNG KIDS on balance bikes (no pedals). Races are 25-50 feet long and are FUN, LOW-PRESSURE intro to BMX.
              </p>
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 space-y-3 backdrop-blur-sm">
                <p className="font-black text-[#00ff0c] text-2xl">WHAT TO KNOW:</p>
                <ul className="space-y-2 ml-4 text-white font-bold text-lg">
                  <li className="border-l-4 border-[#00ff0c] pl-3">Races are SHORT & NON-COMPETITIVE - ALL ABOUT FUN</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Kids get TROPHIES just for participating</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">No starting gate - kids push off themselves</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Parents can WALK alongside younger riders</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Special $30/year Strider membership</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Kids transition to pedal bikes around age 4-5</li>
                </ul>
              </div>
              <p className="pt-2">
                <a 
                  href="https://www.usabmx.com/page/strider_cup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00ff0c] text-black hover:bg-white px-6 py-3 border-4 border-black font-black text-lg transition-colors"
                >
                  <LinkIcon className="w-5 h-5" /> LEARN MORE
                </a>
              </p>
            </div>
          </section>

          {/* How Racing Works */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              HOW BMX RACING WORKS
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-black text-[#00ff0c] mb-3">RACE FORMAT</h3>
                <p className="leading-relaxed mb-3 text-white font-bold text-lg">
                  BMX races are SHORT, INTENSE SPRINTS around a dirt track with JUMPS, BERMS, and STRAIGHTAWAYS. 
                  Races last 30-45 seconds with 8 riders at a time.
                </p>
                <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-4">
                  <ol className="space-y-2 ml-4 list-decimal text-[#00ff0c] font-bold">
                    <li><strong>MOTOS (Qualifying):</strong> Race 3 times against different riders</li>
                    <li><strong>POINTS:</strong> 1st = 1pt, 2nd = 2pts, etc</li>
                    <li><strong>MAIN EVENTS:</strong> Top riders advance to FINALS</li>
                    <li><strong>AWARDS:</strong> Trophies/medals for top finishers</li>
                  </ol>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                  <p className="font-black text-[#00ff0c] text-xl mb-3">AGE GROUPS</p>
                  <ul className="space-y-1 text-white font-bold">
                    <li>• Strider (2-5)</li>
                    <li>• 5 & Under, 6, 7, 8, 9, 10</li>
                    <li>• 11-12, 13-14, 15-16</li>
                    <li>• 17-24, 25-30, 31-35...</li>
                    <li>• Masters classes (36+)</li>
                  </ul>
                </div>
                <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                  <p className="font-black text-[#00ff0c] text-xl mb-3">SKILL LEVELS</p>
                  <ul className="space-y-1 text-white font-bold">
                    <li>• <strong className="text-[#00ff0c]">NOVICE:</strong> 0-50 pts (beginners)</li>
                    <li>• <strong className="text-[#00ff0c]">INTERMEDIATE:</strong> 51-150 pts</li>
                    <li>• <strong className="text-[#00ff0c]">EXPERT:</strong> 151+ pts</li>
                    <li>• <strong className="text-[#00ff0c]">PRO:</strong> Elite racers</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                  <p className="font-black text-[#00ff0c] text-xl mb-2">PRACTICE NIGHT</p>
                  <p className="text-white font-bold">
                    Weekday evenings • Lap the track 1-2 hours • Learn & build skills • $5-10
                  </p>
                </div>
                <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                  <p className="font-black text-[#00ff0c] text-xl mb-2">RACE DAY</p>
                  <p className="text-white font-bold">
                    Usually Sundays • Motos & main events • Register 1-2hrs before • $15-25
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Track-Specific Info */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              DENVER METRO TRACKS
            </h2>
            <div className="space-y-6">
              {/* Mile High BMX */}
              <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-3xl font-black text-[#00ff0c] mb-2">MILE HIGH BMX</h3>
                <p className="text-white font-black text-xl mb-3">Lakewood, CO</p>
                <div className="space-y-2 text-white font-bold">
                  <p>Crown Hill Park, 10th & Kipling</p>
                  <p>Practice THU 6-8PM • Races SUN</p>
                  <p>Practice $5 • Race $20</p>
                  <a 
                    href="https://www.facebook.com/MileHighBmx/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-[#00ff0c] px-4 py-2 border-4 border-[#00ff0c] rounded-xl font-black hover:bg-[#00ff0c] hover:text-black transition-colors mt-2"
                  >
                    <LinkIcon className="w-5 h-5" /> FACEBOOK
                  </a>
                </div>
              </div>

              {/* Dacono BMX */}
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-3xl font-black text-[#00ff0c] mb-2">DACONO BMX</h3>
                <p className="text-white font-black text-xl mb-3">Dacono, CO</p>
                <div className="space-y-2 text-white font-bold">
                  <p>Carbon Valley Park, 2776 WCR 26</p>
                  <p>Practice WED 6-8PM • Races SUN</p>
                  <p>Practice $5 • Race $15-20</p>
                  <a 
                    href="https://www.facebook.com/DaconoBMXTrack/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-[#00ff0c] px-4 py-2 border-4 border-[#00ff0c] rounded-xl font-black hover:bg-[#00ff0c] hover:text-black transition-colors mt-2"
                  >
                    <LinkIcon className="w-5 h-5" /> FACEBOOK
                  </a>
                </div>
              </div>

              {/* County Line BMX */}
              <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-3xl font-black text-[#00ff0c] mb-2">COUNTY LINE BMX</h3>
                <p className="text-white font-black text-xl mb-3">Highlands Ranch, CO</p>
                <div className="space-y-2 text-white font-bold">
                  <p>Redstone Park, 9691 Redstone Dr</p>
                  <p>Practice WED 6-8PM • Races SUN</p>
                  <p>Practice $5 • Race $15-20</p>
                  <a 
                    href="https://www.facebook.com/CountyLineBMX/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-[#00ff0c] px-4 py-2 border-4 border-[#00ff0c] rounded-xl font-black hover:bg-[#00ff0c] hover:text-black transition-colors mt-2"
                  >
                    <LinkIcon className="w-5 h-5" /> FACEBOOK
                  </a>
                </div>
              </div>

              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-4 mt-4 backdrop-blur-sm">
                <p className="text-white font-black">
                  IMPORTANT: Schedules & fees CAN change. ALWAYS check track Facebook before visiting. Weather affects schedules.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              FAQS
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-4 backdrop-blur-sm">
                <h3 className="text-lg font-black text-[#00ff0c] mb-2">NEED YOUR OWN BIKE?</h3>
                <p className="text-white font-bold">YES. Some tracks have loaners. Find used bikes on Facebook/Craigslist.</p>
              </div>
              <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-4 backdrop-blur-sm">
                <h3 className="text-lg font-black text-[#00ff0c] mb-2">WHAT AGE TO START?</h3>
                <p className="text-white font-bold">Kids as young as 2. No upper limit - adults race too.</p>
              </div>
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-4 backdrop-blur-sm">
                <h3 className="text-lg font-black text-[#00ff0c] mb-2">IS IT DANGEROUS?</h3>
                <p className="text-white font-bold">Has risks like any sport, but SAFE with proper gear. Start slow.</p>
              </div>
              <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-4 backdrop-blur-sm">
                <h3 className="text-lg font-black text-[#00ff0c] mb-2">HOW MUCH $$$?</h3>
                <p className="text-white font-bold">Bike $150-300, helmet $50-100, gear $50. Then $60/year + $5-25/week.</p>
              </div>
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-4 md:col-span-2 backdrop-blur-sm">
                <h3 className="text-lg font-black text-[#00ff0c] mb-2">NEED TO JUMP?</h3>
                <p className="text-white font-bold">NO. Beginners can ROLL over jumps. You&apos;ll learn naturally.</p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              HELPFUL RESOURCES
            </h2>
            <div className="space-y-4">
              <a 
                href="https://www.usabmx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl hover:bg-gray-800/90 transition-colors backdrop-blur-sm"
              >
                <div>
                  <p className="font-black text-[#00ff0c] text-xl">USA BMX OFFICIAL</p>
                  <p className="text-white font-bold">Membership, rules, results & MORE</p>
                </div>
                <LinkIcon className="w-6 h-6 text-[#00ff0c]" />
              </a>
              
              <a 
                href="https://www.usabmx.com/tracks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl hover:bg-gray-700/90 transition-colors backdrop-blur-sm"
              >
                <div>
                  <p className="font-black text-[#00ff0c] text-xl">TRACK FINDER</p>
                  <p className="text-white font-bold">Find BMX tracks EVERYWHERE</p>
                </div>
                <LinkIcon className="w-6 h-6 text-[#00ff0c]" />
              </a>

              <a 
                href="https://www.usabmx.com/page/rulebook" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl hover:bg-gray-800/90 transition-colors backdrop-blur-sm"
              >
                <div>
                  <p className="font-black text-[#00ff0c] text-xl">RULEBOOK</p>
                  <p className="text-white font-bold">Official rules & regulations</p>
                </div>
                <LinkIcon className="w-6 h-6 text-[#00ff0c]" />
              </a>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-8 text-center">
            <h2 className="text-5xl font-black text-[#00ff0c] mb-4">
              READY TO START
            </h2>
            <p className="text-white text-2xl font-black mb-6">
              Head to ANY Denver metro track - FIRST DAY IS FREE
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-[#00ff0c] hover:bg-white text-black font-black py-4 px-12 border-4 border-black transition-colors text-2xl"
            >
              <FlagIcon className="w-6 h-6" />
              SEE THIS WEEK&apos;S EVENTS
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
