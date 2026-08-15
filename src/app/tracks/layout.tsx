import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracks",
  description:
    "Colorado BMX race tracks. Find track information, schedules, and community message boards.",
};

export default function TracksLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}
