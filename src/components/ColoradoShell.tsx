import Link from 'next/link';

export default function ColoradoShell() {
  return (
    <footer className="border-t-2 border-[#00ff0c]/30 bg-black py-8 mt-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid gap-6 sm:grid-cols-3 text-sm">
          <div>
            <h3 className="font-black text-[#00ff0c] mb-2">BMX COLORADO</h3>
            <p className="text-gray-400">
              Colorado&apos;s community message board for BMX racing, freestyle, and track news.
            </p>
          </div>
          <div>
            <h3 className="font-black text-[#00ff0c] mb-2">Links</h3>
            <ul className="space-y-1 text-gray-400">
              <li><Link href="/forum" className="hover:text-[#00ff0c]">Forum</Link></li>
              <li><Link href="/tracks" className="hover:text-[#00ff0c]">Tracks</Link></li>
              <li><a href="https://www.bmxdenver.com/denver-bmx-races" className="hover:text-[#00ff0c]">Denver Calendar</a></li>
              <li><a href="https://store.bmxdenver.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff0c]">Merch Store</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-black text-[#00ff0c] mb-2">Contact</h3>
            <ul className="space-y-1 text-gray-400">
              <li><Link href="/contact" className="hover:text-[#00ff0c]">Contact Us</Link></li>
              <li><a href="mailto:rylan@bmxdenver.com" className="hover:text-[#00ff0c]">rylan@bmxdenver.com</a></li>
            </ul>
          </div>
        </div>
        <p className="text-gray-600 text-xs mt-6 text-center">
          © {new Date().getFullYear()} BMX Colorado · Powered by BMX Denver
        </p>
      </div>
    </footer>
  );
}
