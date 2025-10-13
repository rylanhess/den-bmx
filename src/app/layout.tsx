import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEN BMX - Denver Metro BMX Racing Calendar",
  description:
    "Your unified calendar for Mile High, Dacono, and County Line BMX tracks. Never miss a race day or practice session in Denver.",
  metadataBase: new URL('https://denverbmx.com'),
  openGraph: {
    title: "DEN BMX - Denver Metro BMX Racing",
    description: "🏁 Your unified calendar for Mile High, Dacono, and County Line BMX tracks. Never miss a race! 🚴",
    url: 'https://denverbmx.com',
    siteName: 'DEN BMX',
    images: [
      {
        url: '/DENBMX-og.png',
        width: 1200,
        height: 630,
        alt: 'DEN BMX - Denver Metro BMX Racing Calendar',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DEN BMX - Denver Metro BMX Racing",
    description: "🏁 Your unified calendar for Mile High, Dacono, and County Line BMX tracks. Never miss a race! 🚴",
    images: ['/DENBMX-og.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
