import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description:
    "View the full BMX racing calendar for Denver metro tracks. Find race days, practice sessions, and special events at Mile High, Dacono, and County Line BMX.",
};

export default function CalendarLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}

