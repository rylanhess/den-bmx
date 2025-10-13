import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Rider Guide | DEN BMX',
  description: 'Everything you need to know to get started with BMX racing in Denver. Learn about USA BMX membership, what to bring, and track information for Mile High, Dacono, and County Line BMX.',
};

export default function NewRiderPage() {
  return (
    <div className="min-h-screen bg-lime-400 relative overflow-hidden">
      {/* Geometric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 opacity-60" style={{clipPath: 'polygon(100% 0, 0 0, 100% 100%)'}}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400 opacity-70" style={{clipPath: 'polygon(0 100%, 100% 100%, 0 0)'}}></div>
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-purple-500 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-orange-500 animate-rotate-wild"></div>
      </div>

      {/* Header */}
      <header className="bg-black border-b-8 border-yellow-400 sticky top-0 z-20 relative">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 bg-yellow-400 text-black hover:bg-pink-500 px-6 py-3 border-4 border-black font-black transition-colors transform hover:scale-105">
            ← BACK TO HOME
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-6xl relative z-10">
        {/* Hero - WILD */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-8 border-pink-500 p-8 mb-6 animate-border-spin">
            <h1 className="text-5xl md:text-7xl font-black text-pink-500 mb-2" style={{textShadow: '4px 4px 0px #facc15'}}>
              NEW RIDER?
            </h1>
            <div className="h-2 bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 animate-color-shift"></div>
          </div>
          <p className="text-3xl text-black font-black bg-yellow-400 px-8 py-4 inline-block border-4 border-black animate-pulse-crazy">
            🚴 START YOUR BMX JOURNEY! 🚴
          </p>
        </div>

        {/* Quick Start Card - BLINKING */}
        <div className="bg-yellow-400 border-8 border-black p-6 md:p-8 mb-12 animate-pulse-crazy">
          <h2 className="text-4xl font-black text-black mb-4 animate-blink flex items-center gap-3">
            <span className="text-6xl">🎉</span>
            YOUR FIRST DAY IS FREE!
          </h2>
          <p className="text-black text-xl leading-relaxed font-bold">
            <strong className="text-2xl">USA BMX</strong> offers your first day at the track COMPLETELY FREE! No membership needed - just SHOW UP, sign a waiver, and TRY IT OUT! Track gate fee $5-10. THAT&apos;S IT!
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* USA BMX Membership */}
          <section className="bg-black border-8 border-cyan-400 p-6 md:p-8">
            <h2 className="text-4xl font-black text-cyan-400 mb-6 flex items-center gap-3 animate-pulse-crazy">
              <span className="text-6xl animate-float">🏁</span>
              USA BMX MEMBERSHIP
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-yellow-400 text-xl font-bold">
                After your FREE first day, you&apos;ll need a <span className="text-pink-500 text-2xl">USA BMX MEMBERSHIP</span> to keep racing! Memberships are ANNUAL and give you access to ALL USA BMX tracks NATIONWIDE!
              </p>
              <div className="bg-pink-500 border-4 border-black p-6 space-y-3">
                <p className="font-black text-black text-2xl">MEMBERSHIP TYPES & PRICES:</p>
                <ul className="space-y-3 ml-4 text-black font-bold text-lg">
                  <li className="border-l-4 border-yellow-400 pl-3">⚡ <strong>Race (Annual):</strong> ~$60 - Full racing privileges!</li>
                  <li className="border-l-4 border-cyan-400 pl-3">⚡ <strong>Race Plus:</strong> ~$90 - Includes insurance!</li>
                  <li className="border-l-4 border-lime-400 pl-3">⚡ <strong>Strider (Ages 2-5):</strong> ~$30 - Balance bikes!</li>
                  <li className="border-l-4 border-purple-500 pl-3">⚡ <strong>One-Day License:</strong> ~$10 - Try before you buy!</li>
                </ul>
              </div>
              <p className="pt-2">
                <a 
                  href="https://www.usabmx.com/membership" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-yellow-400 text-black hover:bg-pink-500 px-6 py-3 border-4 border-black font-black text-lg transform hover:scale-105 transition-all"
                >
                  🔗 SIGN UP NOW!
                </a>
              </p>
            </div>
          </section>

          {/* What to Bring */}
          <section className="bg-black border-8 border-orange-500 p-6 md:p-8">
            <h2 className="text-4xl font-black text-orange-500 mb-6 flex items-center gap-3 animate-blink">
              <span className="text-6xl animate-shake">🎒</span>
              WHAT TO BRING!
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-lime-400 border-4 border-black p-6">
                <h3 className="text-2xl font-black text-black mb-4">✓ REQUIRED GEAR!</h3>
                <ul className="space-y-3 text-black font-bold text-lg">
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <span className="text-2xl">🪖</span>
                    <span><strong>HELMET:</strong> Full-face or 3/4 shell!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <span className="text-2xl">👖</span>
                    <span><strong>LONG PANTS:</strong> Denim or riding pants!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <span className="text-2xl">👕</span>
                    <span><strong>LONG SLEEVES:</strong> Shirt or jersey!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <span className="text-2xl">👟</span>
                    <span><strong>CLOSED SHOES:</strong> Athletic shoes OK!</span>
                  </li>
                </ul>
                <p className="text-sm text-black mt-4 font-bold bg-yellow-400 border-2 border-black p-2">
                  💡 Most tracks have loaner helmets!
                </p>
              </div>
              <div className="bg-cyan-400 border-4 border-black p-6">
                <h3 className="text-2xl font-black text-black mb-4">+ RECOMMENDED!</h3>
                <ul className="space-y-3 text-black font-bold text-lg">
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <span className="text-2xl">🧤</span>
                    <span><strong>GLOVES:</strong> BMX or cycling!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <span className="text-2xl">🛡️</span>
                    <span><strong>PADS:</strong> Elbow/Knee protection!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <span className="text-2xl">💧</span>
                    <span><strong>WATER:</strong> Stay hydrated!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <span className="text-2xl">☀️</span>
                    <span><strong>SUNSCREEN:</strong> Colorado sun!</span>
                  </li>
                  <li className="flex items-start gap-2 border-l-4 border-black pl-3">
                    <span className="text-2xl">🪑</span>
                    <span><strong>CHAIR/CANOPY:</strong> Race comfort!</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Strider Riders */}
          <section className="bg-black border-8 border-purple-500 p-6 md:p-8">
            <h2 className="text-4xl font-black text-purple-500 mb-6 flex items-center gap-3 animate-pulse-crazy">
              <span className="text-6xl animate-float">👶</span>
              STRIDER RIDERS (AGES 2-5)!
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-yellow-400 text-xl font-bold">
                <span className="text-pink-500 text-2xl">STRIDER RACES</span> are for YOUNG KIDS on balance bikes (no pedals)! Races are 25-50 feet long and are FUN, LOW-PRESSURE intro to BMX!
              </p>
              <div className="bg-yellow-400 border-4 border-black p-6 space-y-3">
                <p className="font-black text-black text-2xl">WHAT TO KNOW:</p>
                <ul className="space-y-2 ml-4 text-black font-bold text-lg">
                  <li className="border-l-4 border-pink-500 pl-3">🎉 Races are SHORT & NON-COMPETITIVE - ALL ABOUT FUN!</li>
                  <li className="border-l-4 border-cyan-400 pl-3">🏆 Kids get TROPHIES just for participating!</li>
                  <li className="border-l-4 border-lime-400 pl-3">🚀 No starting gate - kids push off themselves!</li>
                  <li className="border-l-4 border-orange-500 pl-3">👨‍👩‍👧‍👦 Parents can WALK alongside younger riders!</li>
                  <li className="border-l-4 border-purple-500 pl-3">💰 Special $30/year Strider membership!</li>
                  <li className="border-l-4 border-pink-500 pl-3">🚴 Kids transition to pedal bikes around age 4-5!</li>
                </ul>
              </div>
              <p className="pt-2">
                <a 
                  href="https://www.usabmx.com/page/strider_cup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-pink-500 text-white hover:bg-cyan-400 hover:text-black px-6 py-3 border-4 border-black font-black text-lg transform hover:scale-105 transition-all"
                >
                  🔗 LEARN MORE!
                </a>
              </p>
            </div>
          </section>

          {/* How Racing Works */}
          <section className="bg-black border-8 border-pink-500 p-6 md:p-8 animate-pulse-crazy">
            <h2 className="text-4xl font-black text-pink-500 mb-6 flex items-center gap-3 animate-blink">
              <span className="text-6xl animate-shake">🏆</span>
              HOW BMX RACING WORKS!
            </h2>
            <div className="space-y-6">
              <div className="bg-cyan-400 border-4 border-black p-6">
                <h3 className="text-2xl font-black text-black mb-3">⚡ RACE FORMAT!</h3>
                <p className="leading-relaxed mb-3 text-black font-bold text-lg">
                  BMX races are SHORT, INTENSE SPRINTS around a dirt track with JUMPS, BERMS, and STRAIGHTAWAYS! 
                  Races last 30-45 seconds with 8 riders at a time!
                </p>
                <div className="bg-black border-2 border-yellow-400 p-4">
                  <ol className="space-y-2 ml-4 list-decimal text-yellow-400 font-bold">
                    <li><strong>MOTOS (Qualifying):</strong> Race 3 times against different riders!</li>
                    <li><strong>POINTS:</strong> 1st = 1pt, 2nd = 2pts, etc!</li>
                    <li><strong>MAIN EVENTS:</strong> Top riders advance to FINALS!</li>
                    <li><strong>AWARDS:</strong> Trophies/medals for top finishers!</li>
                  </ol>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-400 border-4 border-black p-6">
                  <p className="font-black text-black text-xl mb-3">🔢 AGE GROUPS!</p>
                  <ul className="space-y-1 text-black font-bold">
                    <li>• Strider (2-5)</li>
                    <li>• 5 & Under, 6, 7, 8, 9, 10</li>
                    <li>• 11-12, 13-14, 15-16</li>
                    <li>• 17-24, 25-30, 31-35...</li>
                    <li>• Masters classes (36+)</li>
                  </ul>
                </div>
                <div className="bg-lime-400 border-4 border-black p-6">
                  <p className="font-black text-black text-xl mb-3">⭐ SKILL LEVELS!</p>
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
                  <p className="font-black text-white text-xl mb-2">🌙 PRACTICE NIGHT!</p>
                  <p className="text-white font-bold">
                    Weekday evenings • Lap the track 1-2 hours • Learn & build skills • $5-10!
                  </p>
                </div>
                <div className="bg-orange-500 border-4 border-black p-6">
                  <p className="font-black text-white text-xl mb-2">☀️ RACE DAY!</p>
                  <p className="text-white font-bold">
                    Usually Sundays • Motos & main events • Register 1-2hrs before • $15-25!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Track-Specific Info */}
          <section className="bg-black border-8 border-yellow-400 p-6 md:p-8">
            <h2 className="text-4xl font-black text-yellow-400 mb-6 flex items-center gap-3 animate-blink">
              <span className="text-6xl">📍</span>
              DENVER METRO TRACKS!
            </h2>
            <div className="space-y-6">
              {/* Mile High BMX */}
              <div className="bg-orange-500 border-4 border-black p-6">
                <h3 className="text-3xl font-black text-black mb-2">🏁 MILE HIGH BMX</h3>
                <p className="text-white font-black text-xl mb-3">Lakewood, CO</p>
                <div className="space-y-2 text-black font-bold">
                  <p>📍 Crown Hill Park, 10th & Kipling</p>
                  <p>📅 Practice THU 6-8PM • Races SUN</p>
                  <p>💰 Practice $5 • Race $20</p>
                  <a 
                    href="https://www.facebook.com/MileHighBmx/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-black text-yellow-400 px-4 py-2 border-2 border-yellow-400 font-black hover:bg-yellow-400 hover:text-black transition-colors mt-2"
                  >
                    🔗 FACEBOOK
                  </a>
                </div>
              </div>

              {/* Dacono BMX */}
              <div className="bg-lime-400 border-4 border-black p-6">
                <h3 className="text-3xl font-black text-black mb-2">🏁 DACONO BMX</h3>
                <p className="text-black font-black text-xl mb-3">Dacono, CO</p>
                <div className="space-y-2 text-black font-bold">
                  <p>📍 Carbon Valley Park, 2776 WCR 26</p>
                  <p>📅 Practice WED 6-8PM • Races SUN</p>
                  <p>💰 Practice $5 • Race $15-20</p>
                  <a 
                    href="https://www.facebook.com/DaconoBMXTrack/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-black text-pink-500 px-4 py-2 border-2 border-pink-500 font-black hover:bg-pink-500 hover:text-black transition-colors mt-2"
                  >
                    🔗 FACEBOOK
                  </a>
                </div>
              </div>

              {/* County Line BMX */}
              <div className="bg-purple-500 border-4 border-black p-6">
                <h3 className="text-3xl font-black text-white mb-2">🏁 COUNTY LINE BMX</h3>
                <p className="text-white font-black text-xl mb-3">Highlands Ranch, CO</p>
                <div className="space-y-2 text-white font-bold">
                  <p>📍 Redstone Park, 9691 Redstone Dr</p>
                  <p>📅 Practice WED 6-8PM • Races SUN</p>
                  <p>💰 Practice $5 • Race $15-20</p>
                  <a 
                    href="https://www.facebook.com/CountyLineBMX/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-black px-4 py-2 border-2 border-white font-black hover:bg-cyan-400 transition-colors mt-2"
                  >
                    🔗 FACEBOOK
                  </a>
                </div>
              </div>

              <div className="bg-yellow-400 border-4 border-black p-4 mt-4 animate-shake">
                <p className="text-black font-black">
                  ⚠️ IMPORTANT: Schedules & fees CAN change! ALWAYS check track Facebook before visiting! Weather affects schedules!
                </p>
              </div>
            </div>
          </section>

          {/* FAQs - SIMPLIFIED */}
          <section className="bg-black border-8 border-pink-500 p-6 md:p-8">
            <h2 className="text-4xl font-black text-pink-500 mb-6 flex items-center gap-3 animate-blink">
              <span className="text-6xl">❓</span>
              FAQS!
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-400 border-4 border-black p-4">
                <h3 className="text-lg font-black text-black mb-2">NEED YOUR OWN BIKE?</h3>
                <p className="text-black font-bold">YES! Some tracks have loaners. Find used bikes on Facebook/Craigslist!</p>
              </div>
              <div className="bg-cyan-400 border-4 border-black p-4">
                <h3 className="text-lg font-black text-black mb-2">WHAT AGE TO START?</h3>
                <p className="text-black font-bold">Kids as young as 2! No upper limit - adults race too!</p>
              </div>
              <div className="bg-lime-400 border-4 border-black p-4">
                <h3 className="text-lg font-black text-black mb-2">IS IT DANGEROUS?</h3>
                <p className="text-black font-bold">Has risks like any sport, but SAFE with proper gear! Start slow!</p>
              </div>
              <div className="bg-purple-500 border-4 border-black p-4">
                <h3 className="text-lg font-black text-white mb-2">HOW MUCH $$$?</h3>
                <p className="text-white font-bold">Bike $150-300, helmet $50-100, gear $50. Then $60/year + $5-25/week!</p>
              </div>
              <div className="bg-orange-500 border-4 border-black p-4 md:col-span-2">
                <h3 className="text-lg font-black text-white mb-2">NEED TO JUMP?</h3>
                <p className="text-white font-bold">NO! Beginners can ROLL over jumps! You&apos;ll learn naturally!</p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="bg-black border-8 border-cyan-400 p-6 md:p-8">
            <h2 className="text-4xl font-black text-cyan-400 mb-6 flex items-center gap-3 animate-pulse-crazy">
              <span className="text-6xl animate-rotate-wild">🔗</span>
              HELPFUL RESOURCES!
            </h2>
            <div className="space-y-4">
              <a 
                href="https://www.usabmx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-yellow-400 border-4 border-black hover:bg-pink-500 transition-colors transform hover:scale-105"
              >
                <div>
                  <p className="font-black text-black text-xl">USA BMX OFFICIAL!</p>
                  <p className="text-black font-bold">Membership, rules, results & MORE!</p>
                </div>
                <span className="text-3xl">→</span>
              </a>
              
              <a 
                href="https://www.usabmx.com/tracks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-pink-500 border-4 border-black hover:bg-cyan-400 transition-colors transform hover:scale-105"
              >
                <div>
                  <p className="font-black text-white text-xl">TRACK FINDER!</p>
                  <p className="text-white font-bold">Find BMX tracks EVERYWHERE!</p>
                </div>
                <span className="text-3xl">→</span>
              </a>

              <a 
                href="https://www.usabmx.com/page/rulebook" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-lime-400 border-4 border-black hover:bg-purple-500 transition-colors transform hover:scale-105"
              >
                <div>
                  <p className="font-black text-black text-xl">RULEBOOK!</p>
                  <p className="text-black font-bold">Official rules & regulations!</p>
                </div>
                <span className="text-3xl">→</span>
              </a>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 border-8 border-black p-8 text-center animate-pulse-crazy">
            <h2 className="text-5xl font-black text-black mb-4 animate-blink">
              READY TO START?!
            </h2>
            <p className="text-black text-2xl font-black mb-6">
              Head to ANY Denver metro track - FIRST DAY IS FREE! 🎉
            </p>
            <Link 
              href="/"
              className="inline-block bg-black hover:bg-white text-yellow-400 hover:text-black font-black py-4 px-12 border-4 border-yellow-400 transition-colors transform hover:scale-110 text-2xl"
            >
              🏁 SEE THIS WEEK&apos;S EVENTS!
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center relative z-10">
        <div className="bg-black border-4 border-yellow-400 px-6 py-4 inline-block">
          <p className="text-yellow-400 font-black text-lg">⚡ DEN BMX ⚡</p>
          <p className="text-cyan-400 font-bold text-sm mt-1">Info from USA BMX & local tracks</p>
          <p className="text-pink-500 font-bold text-sm">ALWAYS verify schedules before visiting!</p>
        </div>
      </footer>
    </div>
  );
}

