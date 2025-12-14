'use client';

import Link from 'next/link';
import { useState } from 'react';
import NewsletterModal from './NewsletterModal';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  return (
    <footer className="bg-black border-t-4 border-[#00ff0c] relative z-10">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-[#00ff0c] font-black text-lg mb-4">DEN BMX</h3>
            <p className="text-white font-bold text-sm mb-4">
              Denver metro BMX schedules and information for Mile High, Dacono, County Line, and Twin Silo BMX tracks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#00ff0c] font-black text-lg mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tracks" className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors">
                  Tracks
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors">
                  Calendar
                </Link>
              </li>
              <li>
                <Link href="/new-rider" className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors">
                  New Rider Guide
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[#00ff0c] font-black text-lg mb-4">RESOURCES</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/track-pack" className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors">
                  Track Pack (Free Templates)
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.usabmx.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors"
                >
                  USA BMX
                </a>
              </li>
              <li>
                <a 
                  href="https://www.usabmx.com/tracks" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors"
                >
                  Track Finder
                </a>
              </li>
              <li>
                <Link href="/shop" className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <a 
                  href="https://store.bmxdenver.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors"
                >
                  Official Merch
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#00ff0c] font-black text-lg mb-4">CONTACT</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:hess.rylan@gmail.com" 
                  className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowNewsletterModal(true);
                  }}
                  className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors"
                >
                  Newsletter Signup
                </a>
              </li>
            </ul>
            <h3 className="text-[#00ff0c] font-black text-lg mb-4 mt-6">SOCIAL MEDIA</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.instagram.com/bmxdenver/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.467.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/profile.php?id=61584792913276" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Facebook Page
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/groups/1509675260286653" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Little Rippers Group
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/groups/3657619811047605" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#00ff0c] font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Track Volunteers Group
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t-4 border-[#00ff0c] pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white font-bold text-sm">
              © {currentYear} DEN BMX. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/about" className="text-white hover:text-[#00ff0c] font-bold transition-colors">
                About
              </Link>
              <span className="text-[#00ff0c]">•</span>
              <Link href="/contact" className="text-white hover:text-[#00ff0c] font-bold transition-colors">
                Contact
              </Link>
              <span className="text-[#00ff0c]">•</span>
              <a 
                href="https://www.usabmx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#00ff0c] font-bold transition-colors"
              >
                USA BMX
              </a>
            </div>
          </div>
        </div>
      </div>
      <NewsletterModal isOpen={showNewsletterModal} onClose={() => setShowNewsletterModal(false)} />
    </footer>
  );
}

