import Link from 'next/link';
import ThisWeeksEvents from '@/components/ThisWeeksEvents';
import DataRefreshBanner from '@/components/DataRefreshBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Alert Bar Preview */}
      <div className="bg-yellow-500 text-slate-900 px-4 py-3 text-center font-semibold">
        ⚠️ Alert Bar: Weather updates and cancellations will appear here
      </div>

      {/* Data Refresh Status Banner */}
      <DataRefreshBanner />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            DEN<span className="text-yellow-500">BMX</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-2">
            Denver Metro BMX Racing
          </p>
          <p className="text-slate-400 text-lg">
            Your unified calendar for Mile High, Dacono, and County Line BMX
          </p>
        </div>

        {/* This Week's Events - Live Data! */}
        <ThisWeeksEvents />

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/donate" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-6 px-6 rounded-lg transition-colors shadow-lg block">
            <div className="text-2xl mb-2">💛</div>
            <div>Donate via Bitcoin</div>
            <div className="text-sm opacity-75 mt-1">Buy my son a bike tube • $15 suggested</div>
          </Link>

          <Link href="/tracks" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-6 px-6 rounded-lg transition-colors shadow-lg border border-slate-600 block">
            <div className="text-2xl mb-2">🏁</div>
            <div>Track Pages</div>
            <div className="text-sm text-slate-400 mt-1">Mile High • Dacono • County Line</div>
          </Link>

          <Link href="/new-rider" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-6 px-6 rounded-lg transition-colors shadow-lg border border-slate-600 block">
            <div className="text-2xl mb-2">🚴</div>
            <div>New Rider?</div>
            <div className="text-sm text-slate-400 mt-1">What to bring, fees, waivers</div>
          </Link>
        </div>

        {/* Status Badge */}
        <div className="text-center">
          <div className="inline-block bg-slate-800 border border-slate-600 rounded-full px-6 py-3">
            <p className="text-slate-300 text-sm">
              🚧 Currently building the scraper (Step 9 of 22) • Full site coming soon
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-slate-500 text-sm">
        <p>DEN BMX • Centralizing Denver metro BMX schedules for families and riders</p>
      </footer>
    </div>
  );
}
