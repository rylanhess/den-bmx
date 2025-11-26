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

