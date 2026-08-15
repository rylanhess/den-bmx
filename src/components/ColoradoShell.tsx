import Link from 'next/link';

const COLORADO_CONTACT_EMAIL = 'hess.rylan@gmail.com';

export default function ColoradoShell() {
  return (
    <footer className="border-t-2 border-[#D0D7E2] bg-white py-8 mt-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid gap-6 sm:grid-cols-3 text-sm">
          <div>
            <h3 className="font-black text-[#002868] mb-2">BMX COLORADO</h3>
            <p className="text-[#4A5568]">
              Colorado&apos;s community message board for BMX racing, freestyle, and track news.
            </p>
          </div>
          <div>
            <h3 className="font-black text-[#002868] mb-2">Links</h3>
            <ul className="space-y-1 text-[#4A5568]">
              <li><Link href="/forum" className="hover:text-[#BF0A30]">Forum</Link></li>
              <li><Link href="/tracks" className="hover:text-[#BF0A30]">Tracks</Link></li>
              <li>
                <a
                  href="https://store.bmxdenver.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#BF0A30]"
                >
                  Merch Store
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-black text-[#002868] mb-2">Contact</h3>
            <ul className="space-y-1 text-[#4A5568]">
              <li><Link href="/contact" className="hover:text-[#BF0A30]">Contact Us</Link></li>
              <li>
                <a href={`mailto:${COLORADO_CONTACT_EMAIL}`} className="hover:text-[#BF0A30]">
                  {COLORADO_CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-[#6B7280] text-xs mt-6 text-center">
          © {new Date().getFullYear()} BMX Colorado
        </p>
      </div>
    </footer>
  );
}
