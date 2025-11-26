import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with DEN BMX. Contact us for questions about Denver metro BMX tracks, events, or volunteering opportunities.",
};

export default function ContactLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <>{children}</>;
}

