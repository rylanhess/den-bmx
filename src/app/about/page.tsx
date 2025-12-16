import Link from 'next/link';
import type { Metadata } from 'next';
import {
  CameraIcon,
  EnvelopeIcon
} from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet the track operators behind Denver metro BMX tracks. Learn about the people who keep Mile High, Dacono, and County Line BMX running.',
};

export default function AboutPage() {
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
        {/* Hero - Professional Punk */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-4 border-[#00ff0c] rounded-xl p-8 mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              ABOUT US
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
        </div>

        {/* Intro Card */}
        <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 md:p-8 mb-12 backdrop-blur-sm">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            THE PEOPLE BEHIND THE TRACKS
          </h2>
          <p className="text-white text-xl leading-relaxed font-bold">
            Denver metro BMX tracks are run by <strong className="text-2xl text-[#00ff0c]">DEDICATED VOLUNTEERS</strong> and track operators who love BMX and want to share that passion with the community. These are the friendly faces you&apos;ll see at the tracks - they&apos;re here to help and make BMX accessible to everyone.
          </p>
        </div>

        {/* Mission Statement */}
        <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8 mb-12">
          {/* <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
            OUR MISSION: FILL THE GATES!
          </h2> */}
          
          {/* Image Placeholder - Ready for group rider image */}
          <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-8 flex items-center justify-center min-h-[400px] mb-6 backdrop-blur-sm">
            <div className="text-center">
              <CameraIcon className="w-24 h-24 mx-auto mb-4 text-[#00ff0c]" />
              <p className="text-white font-black text-xl">GROUP RIDER IMAGE</p>
              <p className="text-white font-bold text-sm mt-2">Coming Soon</p>
            </div>
          </div>

          {/* Mission Text */}
          <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-6 md:p-8 space-y-4 backdrop-blur-sm">
            <p className="text-white font-bold text-xl leading-relaxed">
              Our mission is to <strong className="text-2xl text-[#00ff0c]">PROMOTE BMX RACING</strong> throughout the Denver community by showcasing how exciting, accessible, and family-friendly this incredible sport truly is.
            </p>
            <p className="text-white font-bold text-xl leading-relaxed">
              We&apos;re committed to making BMX more <strong className="text-2xl text-[#00ff0c]">ACCESSIBLE</strong> to everyone, especially youth riders and the youngest competitors starting on balance bikes. Through the trials, excitement, and intensity of BMX racing, we aim to build self-confidence and character in every rider who comes through our gates.
            </p>
            <p className="text-white font-bold text-xl leading-relaxed">
              While we celebrate the <strong className="text-2xl text-[#00ff0c]">FAMILY-FRIENDLY</strong> nature of BMX, we maintain that authentic retro, grunge, and punk aesthetic that resonates with riders of all levels - from balance bike beginners to professional competitors. {/* Our goal is simple: <strong className="text-2xl text-[#00ff0c]">FILL THE GATES!</strong> */} Get more riders to the tracks, build confidence, and grow the BMX community in Denver.
            </p>
          </div>
        </section>

        {/* Track Operators Section */}
        <div className="space-y-12 mb-12">
          {/* Mile High BMX Operator */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Image Placeholder */}
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-8 flex items-center justify-center min-h-[300px] backdrop-blur-sm">
                <div className="text-center">
                  <CameraIcon className="w-24 h-24 mx-auto mb-4 text-[#00ff0c]" />
                  <p className="text-white font-black text-xl">TRACK OPERATOR PHOTO</p>
                  <p className="text-white font-bold text-sm mt-2">Coming Soon</p>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
                  MILE HIGH BMX OPERATOR
                </h2>
                <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-6 mb-4 backdrop-blur-sm">
                  <p className="text-white font-bold text-lg leading-relaxed">
                    <strong className="text-2xl text-[#00ff0c]">PLACEHOLDER:</strong> This is where we&apos;ll feature a short write-up about the Mile High BMX track operator. We want to make the tracks feel inviting and approachable, so you&apos;ll learn about their background, why they love BMX, and how they got involved with track operations.
                  </p>
                </div>
                <p className="text-white font-bold text-lg">
                  Track: <span className="text-[#00ff0c]">Mile High BMX</span> • Lakewood, CO
                </p>
              </div>
            </div>
          </section>

          {/* Dacono BMX Operator */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Content */}
              <div>
                <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
                  DACONO BMX OPERATOR
                </h2>
                <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-6 mb-4 backdrop-blur-sm">
                  <p className="text-white font-bold text-lg leading-relaxed">
                    <strong className="text-2xl text-[#00ff0c]">PLACEHOLDER:</strong> This is where we&apos;ll feature a short write-up about the Dacono BMX track operator. We want to make the tracks feel inviting and approachable, so you&apos;ll learn about their background, why they love BMX, and how they got involved with track operations.
                  </p>
                </div>
                <p className="text-white font-bold text-lg">
                  Track: <span className="text-[#00ff0c]">Dacono BMX</span> • Dacono, CO
                </p>
              </div>
              
              {/* Image Placeholder */}
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-8 flex items-center justify-center min-h-[300px] backdrop-blur-sm">
                <div className="text-center">
                  <CameraIcon className="w-24 h-24 mx-auto mb-4 text-[#00ff0c]" />
                  <p className="text-white font-black text-xl">TRACK OPERATOR PHOTO</p>
                  <p className="text-white font-bold text-sm mt-2">Coming Soon</p>
                </div>
              </div>
            </div>
          </section>

          {/* County Line BMX Operator */}
          <section className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Image Placeholder */}
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-8 flex items-center justify-center min-h-[300px] backdrop-blur-sm">
                <div className="text-center">
                  <CameraIcon className="w-24 h-24 mx-auto mb-4 text-[#00ff0c]" />
                  <p className="text-white font-black text-xl">TRACK OPERATOR PHOTO</p>
                  <p className="text-white font-bold text-sm mt-2">Coming Soon</p>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
                  COUNTY LINE BMX OPERATOR
                </h2>
                <div className="bg-gray-800/90 border-4 border-[#00ff0c] rounded-xl p-6 mb-4 backdrop-blur-sm">
                  <p className="text-white font-bold text-lg leading-relaxed">
                    <strong className="text-2xl text-[#00ff0c]">PLACEHOLDER:</strong> This is where we&apos;ll feature a short write-up about the County Line BMX track operator. We want to make the tracks feel inviting and approachable, so you&apos;ll learn about their background, why they love BMX, and how they got involved with track operations.
                  </p>
                </div>
                <p className="text-white font-bold text-lg">
                  Track: <span className="text-[#00ff0c]">County Line BMX</span> • Highlands Ranch, CO
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Community Message */}
        <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8 mb-12">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
            WELCOME TO THE TRACKS
          </h2>
          <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-6 backdrop-blur-sm">
            <p className="text-white font-bold text-xl leading-relaxed mb-4">
              We believe BMX should be <strong className="text-2xl text-[#00ff0c]">ACCESSIBLE</strong> and <strong className="text-2xl text-[#00ff0c]">WELCOMING</strong> to everyone. Our track operators are here to help, answer questions, and make sure everyone has a great time at the track.
            </p>
            <p className="text-white font-bold text-lg leading-relaxed">
              Don&apos;t be shy - come say hi. We&apos;re friendly and always happy to help new riders get started or answer questions about BMX racing.
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-8 text-center backdrop-blur-sm mb-12">
          <h2 className="text-5xl font-black text-[#00ff0c] mb-4">
            WANT TO KNOW MORE
          </h2>
          <p className="text-white text-2xl font-black mb-6">
            Have questions? Want to get involved? Reach out.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-black hover:bg-white text-[#00ff0c] hover:text-black font-black py-4 px-12 border-4 border-black rounded-xl transition-colors transform hover:scale-110 text-2xl mb-8"
          >
            <EnvelopeIcon className="w-6 h-6 inline mr-2" />
            CONTACT US
          </Link>
        </div>

        {/* Social Media Links */}
        <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-8 text-center">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
            CONNECT WITH US
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a
              href="https://www.instagram.com/bmxdenver/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-4 hover:bg-[#00ff0c] hover:text-black transition-all backdrop-blur-sm flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.467.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              <p className="text-white hover:text-black font-black text-xl">
                Instagram
              </p>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61584792913276"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-4 hover:bg-[#00ff0c] hover:text-black transition-all backdrop-blur-sm flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              <p className="text-white hover:text-black font-black text-xl">
                Facebook Page
              </p>
            </a>
            <a
              href="https://www.facebook.com/groups/1509675260286653"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-4 hover:bg-[#00ff0c] hover:text-black transition-all backdrop-blur-sm flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              <p className="text-white hover:text-black font-black text-xl">
                Little Rippers Group
              </p>
            </a>
            <a
              href="https://www.facebook.com/groups/3657619811047605"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/90 border-4 border-[#00ff0c] rounded-xl p-4 hover:bg-[#00ff0c] hover:text-black transition-all backdrop-blur-sm flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              <p className="text-white hover:text-black font-black text-xl">
                Track Volunteers Group
              </p>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

