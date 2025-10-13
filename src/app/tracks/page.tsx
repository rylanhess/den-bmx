import type { Metadata } from "next";

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
    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
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
}: {
  readonly name: string;
  readonly location: string;
  readonly description: string;
  readonly uniqueFeatures: readonly string[];
  readonly links: readonly { readonly label: string; readonly url: string }[];
}) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div className="mb-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{name}</h2>
      <div className="flex items-center gap-2 text-gray-600">
        📍 <span>{location}</span>
      </div>
    </div>

    <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>

    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Unique Features
      </h3>
      <ul className="list-disc list-inside space-y-1">
        {uniqueFeatures.map((feature, index) => (
          <li key={index} className="text-gray-700">
            {feature}
          </li>
        ))}
      </ul>
    </div>

    <div className="border-t pt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Links</h3>
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Denver Metro BMX Tracks
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Discover the three premier BMX racing tracks in the Denver metro
            area. Each track offers unique challenges and a welcoming community
            for riders of all ages and skill levels.
          </p>
        </div>

        {/* High Elevation Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                High Elevation Racing
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                All Denver metro tracks are at high elevation (5,000+ feet).
                Riders should bring plenty of water, allow time for altitude
                adjustment, and be prepared for the unique challenge of racing
                in thinner air. Stay hydrated and listen to your body!
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

        {/* Footer Info */}
        <div className="text-center bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            New to BMX Racing?
          </h2>
          <p className="text-gray-700 mb-4">
            All tracks welcome riders of all ages and experience levels. Most
            tracks require a USA BMX membership ($80/annual or $1/day trial) and
            basic safety gear including a helmet, long sleeves, pants, and
            closed-toe shoes.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Race Calendar
          </a>
        </div>
      </div>
    </main>
  );
}

