import Link from 'next/link';
import type { Metadata } from 'next';
import {
  EnvelopeIcon
} from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Volunteer | DEN BMX',
  description: 'Volunteer to help out at Denver metro BMX tracks. Run gates, work on jumps, facility help, and big race staffing opportunities.',
};

export default function VolunteerPage() {
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
            backgroundImage: `url('/silhouette-bmx-rider-performing-stunt-against-clear-sky-sunset.jpg')`,
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
          className="md:hidden inline-block mb-6 sm:mb-8 bg-black text-[#00ff0c] font-black px-4 sm:px-6 py-3 border-4 border-[#00ff0c] active:bg-[#00ff0c] active:text-black transition-all transform active:scale-95 min-h-[44px] flex items-center justify-center"
        >
          ← BACK TO HOME
        </Link>
        {/* Hero - Professional Punk */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-4 border-[#00ff0c] p-8 mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              VOLUNTEER
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
        </div>

        {/* Intro Card */}
        <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-6 md:p-8 mb-12 backdrop-blur-sm">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            WE NEED YOUR HELP
          </h2>
          <p className="text-white text-xl leading-relaxed font-bold">
            BMX tracks run on <strong className="text-2xl text-[#00ff0c]">VOLUNTEER POWER</strong>. Without dedicated volunteers, we can&apos;t keep the tracks safe, fun, and running smoothly. Every helping hand makes a difference.
          </p>
        </div>

        {/* Volunteer Opportunities */}
        <div className="space-y-8 mb-12">
          {/* Gate Operator */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              GATE OPERATOR
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                Run the starting gate during races. This is a <span className="text-[#00ff0c] text-2xl">CRITICAL</span> role that keeps races fair and on schedule.
              </p>
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-6 space-y-3 backdrop-blur-sm">
                <p className="font-black text-[#00ff0c] text-2xl">WHAT YOU&apos;LL DO:</p>
                <ul className="space-y-3 ml-4 text-white font-bold text-lg">
                  <li className="border-l-4 border-[#00ff0c] pl-3">Operate the starting gate mechanism</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Ensure fair starts for all riders</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Work with race officials to keep events on schedule</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Help maintain gate equipment</li>
                </ul>
              </div>
              <p className="text-[#00ff0c] font-bold text-lg pt-2">
                Perfect for: People who love being in the action and want a front-row seat to the races.
              </p>
            </div>
          </section>

          {/* Track Maintenance */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              TRACK MAINTENANCE & JUMP WORK
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                Keep the track safe and fun. Help maintain jumps, berms, and track surfaces. This is <span className="text-[#00ff0c] text-2xl">ESSENTIAL</span> for rider safety.
              </p>
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-6 space-y-3 backdrop-blur-sm">
                <p className="font-black text-[#00ff0c] text-2xl">WHAT YOU&apos;LL DO:</p>
                <ul className="space-y-3 ml-4 text-white font-bold text-lg">
                  <li className="border-l-4 border-[#00ff0c] pl-3">Repair and shape jumps</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Maintain berms and corners</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Water and pack track surfaces</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">General track cleanup and improvements</li>
                </ul>
              </div>
              <p className="text-[#00ff0c] font-bold text-lg pt-2">
                Perfect for: People who love working outdoors and want to learn track building skills.
              </p>
            </div>
          </section>

          {/* Facility Help */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              FACILITY HELP
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                Keep the facilities clean, organized, and welcoming. Help with everything from <span className="text-[#00ff0c] text-2xl">CONCESSIONS</span> to <span className="text-[#00ff0c] text-2xl">SETUP</span>.
              </p>
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-6 space-y-3 backdrop-blur-sm">
                <p className="font-black text-[#00ff0c] text-2xl">WHAT YOU&apos;LL DO:</p>
                <ul className="space-y-3 ml-4 text-white font-bold text-lg">
                  <li className="border-l-4 border-[#00ff0c] pl-3">Help with concessions and food service</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Set up and tear down race day equipment</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Maintain restrooms and facilities</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Organize registration areas</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">General facility maintenance</li>
                </ul>
              </div>
              <p className="text-[#00ff0c] font-bold text-lg pt-2">
                Perfect for: People who want to help but prefer less physical work.
              </p>
            </div>
          </section>

          {/* Big Race Staffing */}
          <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8">
            <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
              BIG RACE STAFFING
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p className="text-white text-xl font-bold">
                Help make <span className="text-[#00ff0c] text-2xl">MAJOR EVENTS</span> happen. Big races need extra hands for everything from registration to awards.
              </p>
              <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-6 space-y-3 backdrop-blur-sm">
                <p className="font-black text-[#00ff0c] text-2xl">WHAT YOU&apos;LL DO:</p>
                <ul className="space-y-3 ml-4 text-white font-bold text-lg">
                  <li className="border-l-4 border-[#00ff0c] pl-3">Help with race registration and check-in</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Assist with awards ceremonies</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Support race officials and timing</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">Help coordinate vendor areas</li>
                  <li className="border-l-4 border-[#00ff0c] pl-3">General event support</li>
                </ul>
              </div>
              <p className="text-[#00ff0c] font-bold text-lg pt-2">
                Perfect for: People who want to be part of exciting events and help make them memorable.
              </p>
            </div>
          </section>
        </div>

        {/* How to Get Involved */}
        <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8 mb-12">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
            HOW TO GET INVOLVED
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black text-[#00ff0c] mb-4">STEP 1: SHOW UP</h3>
              <p className="text-white font-bold text-lg leading-relaxed">
                The best way to get started is to <strong className="text-[#00ff0c]">visit your local track</strong> and talk to the track operators or volunteers. They&apos;ll show you around and explain what help is needed.
              </p>
            </div>
            <div className="bg-gray-800/90 border-4 border-[#00ff0c] p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black text-[#00ff0c] mb-4">STEP 2: CONTACT THE TRACKS</h3>
              <p className="text-white font-bold text-lg leading-relaxed mb-4">
                Reach out to your local track through their Facebook pages or contact us through the contact page. We&apos;ll connect you with the right people.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-[#00ff0c] hover:bg-white text-black hover:text-black font-black px-6 py-3 border-4 border-black transition-colors transform hover:scale-105"
              >
                <EnvelopeIcon className="w-5 h-5 inline mr-2" />
                CONTACT US NOW
              </Link>
            </div>
            <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black text-[#00ff0c] mb-4">STEP 3: START VOLUNTEERING</h3>
              <p className="text-white font-bold text-lg leading-relaxed">
                Once you&apos;re connected, you can start helping out. Most tracks need volunteers for <strong className="text-[#00ff0c]">practice nights</strong> and <strong className="text-[#00ff0c]">race days</strong>. Even a few hours makes a huge difference.
              </p>
            </div>
          </div>
        </section>

        {/* Service Hours */}
        <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8 mb-12">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
            SERVICE HOURS AVAILABLE
          </h2>
          <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-6 md:p-8 backdrop-blur-sm">
            <p className="text-white text-xl leading-relaxed font-bold mb-6">
              Need <strong className="text-2xl text-[#00ff0c]">COMMUNITY SERVICE HOURS</strong>? We&apos;ve got you covered. Volunteering at DEN BMX tracks counts toward service hour requirements for:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-black border-4 border-[#00ff0c] p-6">
                <h3 className="text-2xl font-black text-[#00ff0c] mb-4">BOY SCOUTS & GIRL SCOUTS</h3>
                <p className="text-white font-bold text-lg leading-relaxed">
                  Perfect for earning merit badges, service project hours, and community service requirements. Track operators can sign off on your service hours.
                </p>
              </div>
              <div className="bg-gray-800/90 border-4 border-[#00ff0c] p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-black text-[#00ff0c] mb-4">HIGH SCHOOL STUDENTS</h3>
                <p className="text-white font-bold text-lg leading-relaxed">
                  Many high schools require community service hours for graduation. Volunteering at BMX tracks is a fun way to meet those requirements while helping the community.
                </p>
              </div>
              <div className="bg-gray-800/90 border-4 border-[#00ff0c] p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-black text-[#00ff0c] mb-4">OVERACHIEVERS</h3>
                <p className="text-white font-bold text-lg leading-relaxed">
                  Building your resume? Need service hours for scholarships or college applications? Volunteering here shows leadership, community involvement, and dedication.
                </p>
              </div>
              <div className="bg-black border-4 border-[#00ff0c] p-6">
                <h3 className="text-2xl font-black text-[#00ff0c] mb-4">DOCUMENTATION</h3>
                <p className="text-white font-bold text-lg leading-relaxed">
                  We provide signed documentation of your volunteer hours. Track operators can verify your service time and sign any required forms for your organization or school.
                </p>
              </div>
            </div>
            <div className="bg-black border-4 border-[#00ff0c] p-6">
              <h3 className="text-2xl font-black text-[#00ff0c] mb-4">FLEXIBLE SCHEDULING</h3>
              <p className="text-white font-bold text-lg leading-relaxed">
                We understand you have busy schedules. Volunteer when it works for you - practice nights, race days, or special events. Every hour counts, and we&apos;ll track your time accurately.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-black border-4 border-[#00ff0c] p-6 md:p-8 mb-12">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-6">
            WHY VOLUNTEER
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black text-[#00ff0c] mb-3">BENEFITS</h3>
              <ul className="space-y-2 text-white font-bold text-lg">
                <li className="border-l-4 border-[#00ff0c] pl-3">Free track time for you/family</li>
                <li className="border-l-4 border-[#00ff0c] pl-3">Learn track building skills</li>
                <li className="border-l-4 border-[#00ff0c] pl-3">Be part of the BMX community</li>
                <li className="border-l-4 border-[#00ff0c] pl-3">Make new friends</li>
                <li className="border-l-4 border-[#00ff0c] pl-3">Support young riders</li>
              </ul>
            </div>
            <div className="bg-gray-800/90 border-4 border-[#00ff0c] p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black text-[#00ff0c] mb-3">SKILLS YOU&apos;LL GAIN</h3>
              <ul className="space-y-2 text-white font-bold text-lg">
                <li className="border-l-4 border-[#00ff0c] pl-3">Event management</li>
                <li className="border-l-4 border-[#00ff0c] pl-3">Equipment operation</li>
                <li className="border-l-4 border-[#00ff0c] pl-3">Track maintenance</li>
                <li className="border-l-4 border-[#00ff0c] pl-3">Team coordination</li>
                <li className="border-l-4 border-[#00ff0c] pl-3">Problem solving</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900/90 border-4 border-[#00ff0c] p-8 md:p-12 text-center backdrop-blur-sm">
          <h2 className="text-5xl md:text-6xl font-black text-[#00ff0c] mb-4">
            READY TO HELP
          </h2>
          <p className="text-white text-2xl md:text-3xl font-black mb-6">
            Every volunteer makes the tracks better. Get involved today.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-black hover:bg-white text-[#00ff0c] hover:text-black font-black py-4 px-12 border-4 border-black transition-colors transform hover:scale-110 text-2xl"
          >
            <EnvelopeIcon className="w-6 h-6 inline mr-2" />
            CONTACT US TO VOLUNTEER
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

