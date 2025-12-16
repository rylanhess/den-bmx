import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowDownTrayIcon,
  PhotoIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Track Pack',
  description: 'Free downloadable templates for track operators. Social media graphics and presentation templates branded with BMXDENVER.com to help unify our tracks.',
};

const imageTemplates = [
  {
    name: 'Facebook Square Template',
    description: 'Square format weekly schedule template for Facebook posts',
    file: '/track-pack/track_pack_weekly_scedule_fb_square_20251123.png',
    example: '/track-pack/EXAMPLE_Track_Pack_weekly_schedule_fb_square.png',
    pptxFile: '/track-pack/Track_Pack_weekly_schedule_fb_square_20251123.pptx',
  },
  {
    name: 'Facebook Vertical/Mobile Template',
    description: 'Vertical format weekly schedule template optimized for mobile Facebook posts',
    file: '/track-pack/track_pack_weekly_scedule_fb_vert_mobile_20251123.png',
    example: '/track-pack/EXAMPLE_Track_Pack_weekly_schedule_fb_vert_Mobile_20251123.png',
    pptxFile: '/track-pack/Track_Pack_weekly_schedule_fb_vert_Mobile_20251123.pptx',
  },
  {
    name: 'Instagram Story Template',
    description: 'Instagram Story format weekly schedule template',
    file: '/track-pack/track_pack_weekly_scedule_insta_story_20251123.png',
    pptxFile: undefined, // No PPTX available for Instagram Story yet
  },
];


export default function TrackPackPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
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
            backgroundImage: `url('/black-white-portrait-athlete-participating-olympic-championship-sports.jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 w-full h-full bg-black/50" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-6xl relative z-10">
        {/* Hero - Professional Punk */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-4 border-[#00ff0c] rounded-xl p-8 mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              TRACK PACK
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
        </div>

        {/* Intro Card */}
        <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 md:p-8 mb-12 backdrop-blur-sm">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            FREE TEMPLATES FOR TRACK OPERATORS
          </h2>
          <p className="text-white text-xl leading-relaxed font-bold mb-4">
            Download our <strong className="text-2xl text-[#00ff0c]">FREE TRACK PACK</strong> - a collection of professionally designed templates branded with BMXDENVER.com to help unify our tracks and make your social media communications easier.
          </p>
          <p className="text-white text-lg leading-relaxed font-bold">
            These templates are <strong className="text-xl text-[#00ff0c]">100% FREE</strong> to use, modify, and customize as you see fit. Perfect for Facebook posts, Instagram Stories, and other social media platforms.
          </p>
        </div>

        {/* Image Templates Section */}
        <div className="space-y-6 mb-12">
          {imageTemplates.map((item, index) => (
            <div
              key={index}
              className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8"
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Preview */}
                <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 flex items-center justify-center min-h-[200px] backdrop-blur-sm">
                  {item.example ? (
                    // Show both template and example side by side on desktop, stacked on mobile
                    <div className="w-full space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="relative w-full aspect-square">
                          <Image
                            src={item.file}
                            alt={`${item.name} - Template`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <div className="relative w-full aspect-square">
                          <Image
                            src={item.example}
                            alt={`${item.name} - Example`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <p className="text-white font-bold text-sm">TEMPLATE</p>
                        <p className="text-[#00ff0c] font-black text-sm">EXAMPLE</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full min-h-[200px]">
                      <Image
                        src={item.file}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <PhotoIcon className="w-8 h-8 text-[#00ff0c]" />
                    <h3 className="text-3xl font-black text-[#00ff0c]">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-white font-bold text-lg mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-white font-bold text-sm mb-6">
                    Formats:{' '}
                    <a
                      href={item.file}
                      download
                      className="text-[#00ff0c] hover:text-white transition-colors"
                    >
                      PNG
                    </a>
                    {item.pptxFile && (
                      <>
                        {', '}
                        <a
                          href={item.pptxFile}
                          download
                          className="text-[#00ff0c] hover:text-white transition-colors"
                        >
                          PPTX
                        </a>
                      </>
                    )}
                  </p>
                  <a
                    href={item.file}
                    download
                    className="inline-flex items-center gap-3 bg-[#00ff0c] hover:bg-white text-black font-black py-4 px-8 border-4 border-black transition-all transform hover:scale-110 text-xl"
                  >
                    <ArrowDownTrayIcon className="w-6 h-6" />
                    DOWNLOAD FREE
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <section className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 md:p-8 mb-12 backdrop-blur-sm">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
            HOW TO USE
          </h2>
          <div className="space-y-4">
            <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-6">
              <h3 className="text-2xl font-black text-[#00ff0c] mb-3">
                1. DOWNLOAD THE TEMPLATES
              </h3>
              <p className="text-white font-bold text-lg leading-relaxed">
                Click the download button for any template you want to use. Files will download directly to your computer.
              </p>
            </div>
            <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-6">
              <h3 className="text-2xl font-black text-[#00ff0c] mb-3">
                2. CUSTOMIZE AS NEEDED
              </h3>
              <p className="text-white font-bold text-lg leading-relaxed">
                All templates are <strong className="text-xl text-[#00ff0c]">FREE TO MODIFY</strong>. Edit text, change colors, add your track-specific information - make them your own!
              </p>
            </div>
            <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-6">
              <h3 className="text-2xl font-black text-[#00ff0c] mb-3">
                3. SHARE ON SOCIAL MEDIA
              </h3>
              <p className="text-white font-bold text-lg leading-relaxed">
                Use these templates for Facebook posts, Instagram Stories, and other social media platforms to keep your track community informed and engaged.
              </p>
            </div>
          </div>
        </section>

        {/* License Info */}
        <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8 text-center mb-12">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            COMPLETELY FREE
          </h2>
          <p className="text-white text-xl font-bold leading-relaxed">
            These templates are provided <strong className="text-2xl text-[#00ff0c]">FREE OF CHARGE</strong> to all track operators. Use them, modify them, and share them as you see fit. No restrictions, no strings attached.
          </p>
        </div>

        {/* Not What You're Looking For */}
        <section className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 md:p-8 text-center backdrop-blur-sm">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            NOT WHAT YOU&apos;RE LOOKING FOR?
          </h2>
          <p className="text-white text-xl font-bold leading-relaxed mb-6">
            Need something different? Have a specific design request or idea? <strong className="text-2xl text-[#00ff0c]">I&apos;M HERE TO HELP!</strong>
          </p>
          <p className="text-white text-lg font-bold leading-relaxed mb-8">
            Contact me via the contact page and I&apos;ll be happy to build something to suit your needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-[#00ff0c] hover:bg-white text-black font-black py-4 px-8 border-4 border-black transition-all transform hover:scale-110 text-xl"
          >
            <EnvelopeIcon className="w-6 h-6" />
            CONTACT ME
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

