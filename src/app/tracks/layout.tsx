import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMX Tracks | DEN BMX - Denver Metro BMX Racing",
  description:
    "Discover Mile High, County Line, and Dacono BMX tracks in the Denver metro area. Find track information, schedules, and links to stay connected.",
};

export default function TracksLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}

