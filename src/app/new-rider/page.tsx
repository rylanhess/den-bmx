import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Rider Guide | DEN BMX',
  description: 'Everything you need to know to get started with BMX racing in Denver. Learn about USA BMX membership, what to bring, and track information for Mile High, Dacono, and County Line BMX.',
};

export default function NewRiderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🚴 New to BMX Racing?
          </h1>
          <p className="text-xl text-slate-300">
            Everything you need to know to get started at Denver metro BMX tracks
          </p>
        </div>

        {/* Quick Start Card */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-xl p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">🎉 Your First Day is FREE!</h2>
          <p className="text-slate-200 text-lg leading-relaxed">
            <strong>USA BMX</strong> offers your first day at the track completely free! You don&apos;t need a membership 
            for your first visit - just show up, sign a waiver, and try it out. The track may charge a small gate/practice 
            fee (typically $5-10), but no USA BMX membership is required for your trial day.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-12">
          {/* USA BMX Membership */}
          <section className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-yellow-500">🏁</span>
              USA BMX Membership
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                After your free first day, you&apos;ll need a <strong className="text-white">USA BMX membership</strong> to 
                continue riding and racing. Memberships are annual and give you access to all USA BMX tracks nationwide.
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-white">Membership Types & Prices:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Race (Annual):</strong> ~$60 - Full racing privileges at all sanctioned tracks</li>
                  <li>• <strong>Race Plus:</strong> ~$90 - Includes insurance coverage</li>
                  <li>• <strong>Strider (Ages 2-5):</strong> ~$30 - For balance bike riders</li>
                  <li>• <strong>One-Day License:</strong> ~$10 - Try racing before committing to annual</li>
                </ul>
              </div>
              <p className="pt-2">
                <a 
                  href="https://www.usabmx.com/membership" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-semibold"
                >
                  Sign up for USA BMX Membership
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </p>
            </div>
          </section>

          {/* What to Bring */}
          <section className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-yellow-500">🎒</span>
              What to Bring
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-yellow-500 mb-3">Required Safety Gear</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Helmet:</strong> Full-face or 3/4 shell (must be certified)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Long pants:</strong> Denim or riding pants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Long sleeve shirt:</strong> Or jersey</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Closed-toe shoes:</strong> Athletic shoes work fine to start</span>
                  </li>
                </ul>
                <p className="text-sm text-slate-400 mt-3 italic">
                  Most tracks have loaner helmets available for your first visit!
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-500 mb-3">Recommended Items</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">+</span>
                    <span><strong>Gloves:</strong> BMX or cycling gloves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">+</span>
                    <span><strong>Elbow/Knee pads:</strong> Especially for kids</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">+</span>
                    <span><strong>Water bottle:</strong> Stay hydrated!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">+</span>
                    <span><strong>Sunscreen:</strong> Outdoor racing in Colorado sun</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">+</span>
                    <span><strong>Chair/Canopy:</strong> For race day comfort</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Strider Riders */}
          <section className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-yellow-500">👶</span>
              Strider Riders (Ages 2-5)
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Strider races</strong> are specifically designed for young children on balance bikes 
                (bikes without pedals). These races are typically 25-50 feet long and are a fun, low-pressure introduction to BMX racing.
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                <p className="font-semibold text-white">What to Know About Strider Racing:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Races are short and non-competitive - it&apos;s all about fun!</li>
                  <li>• Kids get trophies just for participating</li>
                  <li>• No starting gate - kids push off on their own</li>
                  <li>• Parents can walk alongside younger riders</li>
                  <li>• Special $30/year Strider membership available</li>
                  <li>• Many kids transition to pedal bikes around age 4-5</li>
                </ul>
              </div>
              <p className="pt-2">
                <a 
                  href="https://www.usabmx.com/page/strider_cup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-semibold"
                >
                  Learn more about Strider racing
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </p>
            </div>
          </section>

          {/* How Racing Works */}
          <section className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-yellow-500">🏆</span>
              How BMX Racing Works
            </h2>
            <div className="space-y-6 text-slate-300">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Race Format</h3>
                <p className="leading-relaxed mb-3">
                  BMX races are short, intense sprints around a dirt track with jumps, berms, and straightaways. 
                  Races typically last 30-45 seconds and feature 8 riders at a time.
                </p>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <ol className="space-y-2 ml-4 list-decimal">
                    <li><strong>Motos (Qualifying):</strong> You race 3 times against different riders in your class</li>
                    <li><strong>Points:</strong> Earn points based on finishing position (1st = 1pt, 2nd = 2pts, etc.)</li>
                    <li><strong>Main Events:</strong> Top riders advance to finals (Main, Semi, Quarter)</li>
                    <li><strong>Awards:</strong> Trophies/medals awarded to top finishers in each class</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Age Classes & Skill Levels</h3>
                <p className="mb-3">Riders compete in classes based on age and experience level:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="font-semibold text-yellow-500 mb-2">Age Groups</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Strider (2-5 years)</li>
                      <li>• 5 & Under</li>
                      <li>• 6, 7, 8, 9, 10</li>
                      <li>• 11-12, 13-14, 15-16</li>
                      <li>• 17-24, 25-30, 31-35...</li>
                      <li>• Masters classes (36+)</li>
                    </ul>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="font-semibold text-yellow-500 mb-2">Skill Levels</p>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Novice:</strong> 0-50 national points (beginners)</li>
                      <li>• <strong>Intermediate:</strong> 51-150 points</li>
                      <li>• <strong>Expert:</strong> 151+ points</li>
                      <li>• <strong>Pro:</strong> Elite professional riders</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Practice vs. Race Day</h3>
                <div className="space-y-3">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">Practice Night</p>
                    <p className="text-sm">
                      Typically held weekday evenings. Riders can lap the track for 1-2 hours. Great for learning 
                      the track and building skills. Gate fee: $5-10.
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="font-semibold text-white mb-2">Race Day</p>
                    <p className="text-sm">
                      Usually on Sundays. Structured racing with motos and main events. Registration typically opens 
                      1-2 hours before first race. Entry fee: $15-25 (varies by track).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Track-Specific Info */}
          <section className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-yellow-500">📍</span>
              Denver Metro Track Information
            </h2>
            <div className="space-y-6">
              {/* Mile High BMX */}
              <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600">
                <h3 className="text-2xl font-bold text-yellow-500 mb-3">Mile High BMX</h3>
                <p className="text-slate-300 mb-3">Lakewood, CO</p>
                <div className="space-y-2 text-slate-300 text-sm">
                  <p><strong>Location:</strong> Crown Hill Park, 10th Ave & Kipling St, Lakewood</p>
                  <p><strong>Typical Schedule:</strong> Practice Thursdays 6-8 PM, Races Sundays</p>
                  <p><strong>Gate Fees:</strong> Practice $5, Race $20</p>
                  <p>
                    <a 
                      href="https://www.facebook.com/MileHighBmx/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-yellow-500 hover:text-yellow-400"
                    >
                      Visit Mile High BMX Facebook
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </p>
                </div>
              </div>

              {/* Dacono BMX */}
              <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600">
                <h3 className="text-2xl font-bold text-yellow-500 mb-3">Dacono BMX</h3>
                <p className="text-slate-300 mb-3">Dacono, CO</p>
                <div className="space-y-2 text-slate-300 text-sm">
                  <p><strong>Location:</strong> Carbon Valley Regional Park, 2776 WCR 26, Dacono</p>
                  <p><strong>Typical Schedule:</strong> Practice Wednesdays 6-8 PM, Races Sundays</p>
                  <p><strong>Gate Fees:</strong> Practice $5, Race $15-20</p>
                  <p>
                    <a 
                      href="https://www.facebook.com/DaconoBMXTrack/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-yellow-500 hover:text-yellow-400"
                    >
                      Visit Dacono BMX Facebook
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </p>
                </div>
              </div>

              {/* County Line BMX */}
              <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600">
                <h3 className="text-2xl font-bold text-yellow-500 mb-3">County Line BMX</h3>
                <p className="text-slate-300 mb-3">Highlands Ranch, CO</p>
                <div className="space-y-2 text-slate-300 text-sm">
                  <p><strong>Location:</strong> Redstone Park, 9691 Redstone Drive, Highlands Ranch</p>
                  <p><strong>Typical Schedule:</strong> Practice Wednesdays 6-8 PM, Races Sundays</p>
                  <p><strong>Gate Fees:</strong> Practice $5, Race $15-20</p>
                  <p>
                    <a 
                      href="https://www.facebook.com/CountyLineBMX/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-yellow-500 hover:text-yellow-400"
                    >
                      Visit County Line BMX Facebook
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mt-4">
                <p className="text-blue-300 text-sm">
                  <strong>Note:</strong> Schedules and fees can change. Always check the track&apos;s Facebook page or 
                  contact them directly before heading out. Weather can also affect schedules.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-yellow-500">❓</span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Do I need my own bike?</h3>
                <p className="text-slate-300">
                  Yes, you&apos;ll need to bring your own BMX bike. Some tracks occasionally have loaners available, 
                  but it&apos;s best to call ahead. Used BMX bikes can be found affordably on Facebook Marketplace or Craigslist.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What age can kids start?</h3>
                <p className="text-slate-300">
                  Kids as young as 2 years old can start with Strider (balance bike) racing. Most kids transition to 
                  pedal bikes around age 4-5. There&apos;s no upper age limit - adults of all ages race!
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is BMX racing dangerous?</h3>
                <p className="text-slate-300">
                  BMX has inherent risks like any action sport, but with proper safety gear and track rules, injuries are 
                  relatively uncommon. Most riders never have serious injuries. Start slow, learn the basics, and progress at your own pace.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How much does it cost to get started?</h3>
                <p className="text-slate-300">
                  Initial costs: Used bike ($150-300), helmet ($50-100), basic gear ($50). After that, membership ($60/year) 
                  and weekly practice/race fees ($5-25). It&apos;s an affordable sport compared to many youth activities!
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Do I need to know how to jump?</h3>
                <p className="text-slate-300">
                  No! Beginners can roll over all the jumps. You&apos;ll naturally learn to jump as you gain confidence. 
                  Many riders race for years and never jump - they just pump through the rollers efficiently.
                </p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-yellow-500">🔗</span>
              Helpful Resources
            </h2>
            <div className="space-y-3">
              <a 
                href="https://www.usabmx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-white">USA BMX Official Website</p>
                  <p className="text-sm text-slate-400">Membership, rules, results, and more</p>
                </div>
                <svg className="w-5 h-5 text-yellow-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a 
                href="https://www.usabmx.com/tracks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-white">Track Finder</p>
                  <p className="text-sm text-slate-400">Find BMX tracks across the country</p>
                </div>
                <svg className="w-5 h-5 text-yellow-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <a 
                href="https://www.usabmx.com/page/rulebook" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-white">USA BMX Rulebook</p>
                  <p className="text-sm text-slate-400">Official rules and regulations</p>
                </div>
                <svg className="w-5 h-5 text-yellow-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-slate-800 text-lg mb-6">
              Head to any Denver metro track on their next practice night - your first day is free!
            </p>
            <Link 
              href="/"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-yellow-500 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Check This Week&apos;s Events
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-slate-500 text-sm">
        <p>DEN BMX • Information compiled from USA BMX and local track resources</p>
        <p className="mt-2">Always verify current schedules and fees with the track before visiting</p>
      </footer>
    </div>
  );
}

