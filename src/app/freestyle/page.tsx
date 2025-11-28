'use client';

import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  LinkIcon,
  StarIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';
import ParkFinderMap from '@/components/ParkFinderMap';

export interface Park {
  name: string;
  location: string;
  type: 'Bike Park' | 'Skate Park' | 'Pump Track' | 'BMX Track';
  googleMapsUrl: string;
  size: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  sizeRating: number; // 1-5
  quality: 'Basic' | 'Good' | 'Excellent' | 'World Class';
  qualityRating: number; // 1-5
  skillLevels: string[];
  description: string;
    coordinates: [number, number]; // [lng, lat] for map
}

const parks: Park[] = [
  {
    name: 'Valmont Bike Park',
    location: 'Boulder, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Valmont+Bike+Park+Boulder+Colorado',
    size: 'Extra Large',
    sizeRating: 5,
    quality: 'World Class',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: 'World-class 42-acre facility with over 30 jumps, cyclocross courses, and diverse terrain features. One of the premier bike parks in the region with professional-grade features.',
    coordinates: [-105.2206, 40.0331], // [lng, lat]
  },
  {
    name: 'Ruby Hill Bike Park',
    location: 'Denver, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ruby+Hill+Bike+Park+Denver+Colorado',
    size: 'Large',
    sizeRating: 4,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: '7.5-acre park featuring slopestyle courses, dirt jumps, pump tracks, and skills courses. Includes expert lines for professional riders and beginner-friendly areas.',
    coordinates: [-105.0031, 39.6806], // [lng, lat]
  },
  {
    name: 'Barnum Bike Park',
    location: 'Denver, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Barnum+Bike+Park+Denver+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Urban bike park with multiple slope lines for different skill levels and a pump track. Well-maintained with diverse features in a convenient city location.',
    coordinates: [-105.0306, 39.7206], // [lng, lat]
  },
  {
    name: 'Golden Bike Park',
    location: 'Golden, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Golden+Bike+Park+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Excellent',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Features a downhill flow trail with widened jumps and rollable options. Trails split into separate beginner, intermediate, and advanced sections with creative design.',
    coordinates: [-105.2211, 39.7556], // [lng, lat]
  },
  {
    name: 'McKay Lake Bike Park',
    location: 'Broomfield, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=McKay+Lake+Bike+Park+Broomfield+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Well-designed paved pump track perfect for skill development. Great for practicing pumping technique and building confidence.',
    coordinates: [-105.0861, 39.9206], // [lng, lat]
  },
  {
    name: 'Ulysses Skate Park',
    location: 'Golden, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ulysses+Skate+Park+Golden+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Well-maintained skate park with a variety of features catering to different skill levels. Suitable for BMX riders looking to practice tricks and jumps.',
    coordinates: [-105.2211, 39.7556], // [lng, lat]
  },
  {
    name: 'Wheat Ridge Skate Park',
    location: 'Wheat Ridge, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wheat+Ridge+Skate+Park+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Basic',
    qualityRating: 2,
    skillLevels: ['Beginner'],
    description: 'Neighborhood skate park with basic features. Good for beginners learning the fundamentals of park riding.',
    coordinates: [-105.0806, 39.7661], // [lng, lat]
  },
  {
    name: 'Anthem Pump Track',
    location: 'Broomfield, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Anthem+Pump+Track+Broomfield+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Paved pump track designed for skill development. Great for practicing pumping technique and building bike handling skills.',
    coordinates: [-105.0861, 39.9206], // [lng, lat]
  },
  {
    name: 'Revolution Pump Track',
    location: 'Superior, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Revolution+Pump+Track+Superior+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Paved pump track providing a smooth surface for practicing pumping technique. Ideal for riders looking to improve their skills.',
    coordinates: [-105.1681, 39.9506], // [lng, lat]
  },
  {
    name: 'Apple Meadows Bike Park',
    location: 'Golden, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://maps.app.goo.gl/SbwtWAvDtGp2GFY5A',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Community bike park in Golden featuring trails and bike features. Great for practicing skills and enjoying outdoor riding.',
    coordinates: [-105.2144612, 39.806185], // [lng, lat]
  },
  {
    name: 'Mile High BMX',
    location: 'Denver, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mile+High+BMX+Denver+Colorado',
    size: 'Large',
    sizeRating: 5,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: 'Home to the longest BMX track in the nation, offering riders an extended racing experience with challenging features. High-elevation racing (5,280+ feet) with technical layout and competitive racing environment.',
    coordinates: [-105.0, 39.75], // [lng, lat] - approximate Denver area
  },
  {
    name: 'Dacono BMX',
    location: 'Dacono, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dacono+BMX+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Welcoming environment for BMX racing enthusiasts in the northern Denver metro area. Community-focused atmosphere that encourages new riders to join the sport with regular race schedule throughout the season.',
    coordinates: [-104.9333, 40.0833], // [lng, lat] - approximate Dacono area
  },
  {
    name: 'County Line BMX',
    location: 'Englewood, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=County+Line+BMX+Englewood+Colorado',
    size: 'Medium',
    sizeRating: 4,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: 'Located in David A. Lorenz Regional Park, one of the only tracks in south metro Denver. Modern track design with 3 paved turns and paved start hill. Gate practice available on Thursdays during season.',
    coordinates: [-104.9878, 39.6472], // [lng, lat] - approximate Englewood area
  },
  {
    name: 'Twin Silo BMX',
    location: 'Fort Collins, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Twin+Silo+BMX+Fort+Collins+Colorado',
    size: 'Large',
    sizeRating: 4,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: 'Located in Twin Silo Park, a 54-acre modern park facility in Fort Collins. Part of the City of Fort Collins park system with excellent maintenance. Track is open to the public when not in use for racing or practices.',
    coordinates: [-105.0847, 40.5853], // [lng, lat] - approximate Fort Collins area
  },
  {
    name: 'Golden Heights Skate Park',
    location: 'Golden, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/DG52AkL7cv63MmC88',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Skate park in Golden with various features for BMX riders and skaters. Good for practicing tricks and improving skills.',
    coordinates: [-105.1845198, 39.7211103], // [lng, lat]
  },
  {
    name: 'Lakewood Skate Park',
    location: 'Lakewood, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/oSheCiAhjeaPD1Hi9',
    size: 'Small',
    sizeRating: 1,
    quality: 'Basic',
    qualityRating: 2,
    skillLevels: ['Beginner'],
    description: 'Small neighborhood skate park. Perfect for beginners learning the basics of park riding.',
    coordinates: [-105.0853, 39.7047], // [lng, lat] - approximate Lakewood area
  },
  {
    name: 'Lakewood Link Skate Park',
    location: 'Lakewood, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/E94xRYEehwRcmTJ66',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Small to medium-sized skate park with good features for skill development. Suitable for beginners and intermediate riders.',
    coordinates: [-105.0853, 39.7047], // [lng, lat] - approximate Lakewood area
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-[#00ff0c] fill-[#00ff0c]' : 'text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

const ParkCard = ({ park }: { park: Park }) => {
  return (
    <div className="bg-black border-8 border-[#00ff0c] overflow-hidden transform hover:scale-105 transition-transform">
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-3xl font-black text-[#00ff0c] mb-2">{park.name}</h2>
          <div className="flex items-center gap-2 text-white font-bold bg-[#00ff0c] px-3 py-1 inline-block border-2 border-black mb-2">
            <MapPinIcon className="w-4 h-4" />
            <span>{park.location}</span>
          </div>
          <div className="text-[#00ff0c] font-bold text-sm mb-3">
            {park.type}
          </div>
        </div>

        <p className="text-white mb-4 leading-relaxed font-bold">{park.description}</p>

        {/* Ratings */}
        <div className="mb-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-bold">Size:</span>
              <span className="text-[#00ff0c] font-black">{park.size}</span>
            </div>
            <RatingStars rating={park.sizeRating} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-bold">Quality:</span>
              <span className="text-[#00ff0c] font-black">{park.quality}</span>
            </div>
            <RatingStars rating={park.qualityRating} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-bold">Skill Levels:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {park.skillLevels.map((level) => (
                <span
                  key={level}
                  className="bg-[#00ff0c] text-black font-black px-2 py-1 text-xs border-2 border-black"
                >
                  {level}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t-4 border-[#00ff0c] pt-4">
          <a
            href={park.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black text-[#00ff0c] hover:text-white font-black px-4 py-3 border-4 border-[#00ff0c] hover:border-white transition-colors"
          >
            <LinkIcon className="w-5 h-5" />
            <span>View on Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default function FreestylePage() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
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
            backgroundImage: `url('/low-section-man-with-bicycle-performing-stunt-against-clear-sky.jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
        <div className="absolute inset-0 w-full h-full bg-black/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button - Mobile Only */}
        <Link 
          href="/"
          className="md:hidden inline-block mb-6 sm:mb-8 bg-black text-[#00ff0c] font-black px-4 sm:px-6 py-3 border-4 border-[#00ff0c] active:bg-[#00ff0c] active:text-black transition-all transform active:scale-95 min-h-[44px] flex items-center justify-center"
        >
          ← BACK TO HOME
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-4 border-[#00ff0c] p-8 mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              FREESTYLE & PRACTICE
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
          <p className="text-white font-bold text-xl max-w-3xl mx-auto">
            Find the best skate parks, bike parks, and pump tracks in the Denver metro area to practice your jumping skills and freestyle riding.
          </p>
        </div>

        {/* Park Finder Map */}
        <div className="mb-12">
          <div className="bg-black border-4 border-[#00ff0c] p-6 mb-4">
            <h2 className="text-3xl font-black text-[#00ff0c] mb-2 text-center">
              PARK FINDER MAP
            </h2>
            <p className="text-white font-bold text-center">
              <span className="hidden md:inline">Hover over the pins to see park details. Click for more information!</span>
              <span className="md:hidden">Tap the pins to see park details and get directions!</span>
            </p>
          </div>
          <ParkFinderMap parks={parks} />
        </div>

        {/* Park Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {parks.map((park) => (
            <ParkCard key={park.name} park={park} />
          ))}
        </div>

        {/* Info Box */}
        <div className="text-center bg-black border-4 border-[#00ff0c] p-8 mb-12">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            READY TO RIDE?
          </h2>
          <p className="text-white mb-6 font-bold text-xl">
            Always wear a helmet, protective gear, and check park hours before visiting. Respect other riders and follow park rules!
          </p>
          <Link
            href="/calendar"
            className="inline-block bg-[#00ff0c] hover:bg-white text-black font-black px-8 py-4 border-4 border-black transition-colors transform hover:scale-110 text-xl"
          >
            <BoltIcon className="w-5 h-5 inline mr-2" />
            VIEW RACE CALENDAR
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}

