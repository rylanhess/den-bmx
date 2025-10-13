import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BMX Tracks | DEN BMX - Denver Metro BMX Racing",
  description:
    "Discover Mile High, County Line, and Dacono BMX tracks in the Denver metro area. Find track information, schedules, and links to stay connected.",
};

const TrackLink = ({
  href,
  children,
}: {
  readonly href: string;
  readonly children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 bg-black text-yellow-400 hover:text-pink-500 font-black px-3 py-2 border-4 border-yellow-400 hover:border-pink-500 transition-colors text-sm"
  >
    🔗 {children}
  </a>
);

const TrackCard = ({
  name,
  location,
  description,
  uniqueFeatures,
  links,
  color,
}: {
  readonly name: string;
  readonly location: string;
  readonly description: string;
  readonly uniqueFeatures: readonly string[];
  readonly links: readonly { readonly label: string; readonly url: string }[];
  readonly color: string;
}) => (
  <div className={`bg-black border-8 border-${color} p-6 transform hover:scale-105 transition-transform`}>
    <div className="mb-4">
      <h2 className={`text-3xl font-black text-${color} mb-2 animate-pulse-crazy`}>{name}</h2>
      <div className={`flex items-center gap-2 text-white font-bold bg-${color} px-3 py-1 inline-block border-2 border-black`}>
        📍 <span>{location}</span>
      </div>
    </div>

    <p className="text-cyan-400 mb-4 leading-relaxed font-bold">{description}</p>

    <div className="mb-4">
      <h3 className={`text-xl font-black text-${color} mb-2 animate-blink`}>
        UNIQUE FEATURES:
      </h3>
      <ul className="space-y-2">
        {uniqueFeatures.map((feature, index) => (
          <li key={index} className="text-yellow-400 font-bold border-l-4 border-pink-500 pl-3">
            ⚡ {feature}
          </li>
        ))}
      </ul>
    </div>

    <div className={`border-t-4 border-${color} pt-4`}>
      <h3 className="text-lg font-black text-white mb-3">LINKS:</h3>
      <div className="flex flex-col gap-2">
        {links.map((link, index) => (
          <TrackLink key={index} href={link.url}>
            {link.label}
          </TrackLink>
        ))}
      </div>
    </div>
  </div>
);

export default function TracksPage() {
  const tracks = [
    {
      name: "Mile High BMX",
      location: "Wheat Ridge, CO",
      color: "orange-500",
      description:
        "Mile High BMX is home to the longest BMX track in the nation, offering riders an extended racing experience with challenging features throughout. This track is known for its technical layout and competitive racing environment, attracting riders from across the region.",
      uniqueFeatures: [
        "Longest BMX track in the United States",
        "Challenging technical layout with extended straights",
        "High-elevation racing (5,280+ feet) requires excellent conditioning",
        "Active racing community with riders of all skill levels",
      ],
      links: [
        { label: "Facebook Page", url: "https://www.facebook.com/MileHighBmx/" },
        {
          label: "USA BMX Track Info",
          url: "https://www.usabmx.com/tracks/co-mile-high%20bmx",
        },
      ],
    },
    {
      name: "County Line BMX",
      location: "Centennial, CO",
      color: "purple-500",
      description:
        "Located in David A. Lorenz Regional Park, County Line BMX is one of the only tracks in south metro Denver. Completely redesigned in January 2020, this track features modern paving and design elements. Races take place on Sundays throughout the season with gate practice available on Thursdays.",
      uniqueFeatures: [
        "Modern track design with 3 paved turns",
        "Paved start hill for consistent launches",
        "Family-friendly atmosphere welcoming all ages (3 to 60+ years)",
        "Gate practice every Thursday during season (April-October)",
        "Convenient location in South Suburban Parks & Recreation system",
      ],
      links: [
        {
          label: "Facebook Page",
          url: "https://www.facebook.com/CountyLineBMX",
        },
        {
          label: "South Suburban Parks & Rec",
          url: "https://www.ssprd.org/County-Line-BMX/fbclid/IwY2xjawNZ_CZleHRuA2FlbQIxMABicmlkETE3MGdZOEVudUZyNkVra0VKAR5n_WZdNGsOjG4Z8QTmDCNxqD2pIxUIBDfvvSbp102nMSBJUq7nh3rXq6KBFQ_aem_-M7ELp5G-2H9mIffXRtGBA",
        },
        {
          label: "USA BMX Track Info",
          url: "https://www.usabmx.com/tracks/co-county-line%20bmx",
        },
      ],
    },
    {
      name: "Dacono BMX",
      location: "Dacono, CO",
      color: "lime-400",
      description:
        "Dacono BMX offers a welcoming environment for BMX racing enthusiasts in the northern Denver metro area. This track provides competitive racing opportunities while maintaining a community-focused atmosphere that encourages new riders to join the sport.",
      uniqueFeatures: [
        "Northern metro location serving Dacono and surrounding communities",
        "Beginner-friendly while still challenging for experienced riders",
        "Strong community support and volunteer involvement",
        "Regular race schedule throughout the season",
      ],
      links: [
        {
          label: "Facebook Page",
          url: "https://www.facebook.com/DaconoBMXTrack/",
        },
        {
          label: "USA BMX Track Info",
          url: "https://www.usabmx.com/tracks/co-dacono-bmx",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-cyan-500 relative overflow-hidden">
      {/* Geometric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400 opacity-60" style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)'}}></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400 opacity-70" style={{clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'}}></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-lime-400 animate-rotate-wild"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Header - WILD */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-8 border-yellow-400 p-8 mb-6 animate-border-spin">
            <h1 className="text-5xl md:text-6xl font-black text-yellow-400 mb-2" style={{textShadow: '4px 4px 0px #ff00ff'}}>
              BMX TRACKS!
            </h1>
            <div className="h-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 animate-color-shift"></div>
          </div>
          <p className="text-2xl text-white font-black bg-black px-6 py-3 inline-block border-4 border-pink-500">
            3 PREMIER TRACKS • DENVER METRO AREA
          </p>
        </div>

        {/* High Elevation Notice - ATTENTION GRABBING */}
        <div className="bg-yellow-400 border-8 border-black p-6 mb-8 animate-pulse-crazy">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-shake">⚠️</div>
            <div>
              <h3 className="text-2xl font-black text-black mb-2">
                HIGH ELEVATION RACING!
              </h3>
              <p className="text-black font-bold text-lg">
                All Denver metro tracks are at 5,000+ feet elevation! Bring LOTS of water! 💧 Stay hydrated or DIE! ⛰️
              </p>
            </div>
          </div>
        </div>

        {/* Track Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tracks.map((track, index) => (
            <TrackCard key={index} {...track} />
          ))}
        </div>

        {/* Footer Info - WILD */}
        <div className="text-center bg-black border-8 border-pink-500 p-8 animate-pulse-crazy">
          <h2 className="text-4xl font-black text-pink-500 mb-4 animate-blink">
            NEW TO BMX RACING?
          </h2>
          <p className="text-cyan-400 mb-6 font-bold text-xl">
            All tracks welcome ALL riders! USA BMX membership required ($80/year or $1/day trial). Wear a helmet, long sleeves, pants & closed shoes!
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-black px-8 py-4 border-4 border-black hover:from-pink-500 hover:to-yellow-400 transition-colors transform hover:scale-110 text-xl"
          >
            🏁 VIEW RACE CALENDAR 🏁
          </Link>
        </div>
      </div>
    </main>
  );
}

