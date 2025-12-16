import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ServiceWorkerRegistration from "./sw-register";
import Navigation from "@/components/Navigation";
import SponsorshipStrip from "@/components/SponsorshipStrip";
import NewsletterModalTrigger from "@/components/NewsletterModalTrigger";
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
  title: {
    default: "Home - BMX Denver",
    template: "%s - BMX Denver",
  },
  description:
    "Your hub for all things BMX in Denver. Find racing tracks, freestyle parks, events, and everything you need for BMX racing and freestyle riding in the Denver metro area.",
  metadataBase: new URL('https://bmxdenver.com'),
  manifest: '/manifest.json',
  themeColor: '#00ff0c',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DEN BMX',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Denver BMX",
    description: "Your hub for all things BMX in Denver. Find racing tracks, freestyle parks, events, and everything you need for BMX racing and freestyle riding. 🚴",
    url: 'https://bmxdenver.com',
    siteName: 'Denver BMX',
    images: [
      {
        url: '/DENBMX-og.png?v=2',
        width: 784,
        height: 472,
        alt: 'Official Denver BMX',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DEN BMX - Denver Metro BMX",
    description: "Your hub for all things BMX in Denver. Find racing tracks, freestyle parks, events, and everything you need for BMX racing and freestyle riding. 🚴",
    images: ['/DENBMX-og.png?v=2'],
  },
  icons: {
    icon: [
      { url: '/logos/MARK_ONLY_icon_tab.png', type: 'image/png' },
      { url: '/logos/MARK_ONLY_icon_tab.png', sizes: '32x32', type: 'image/png' },
      { url: '/logos/MARK_ONLY_icon_tab.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/logos/MARK_ONLY_icon_tab.png',
    apple: '/logos/MARK_ONLY_icon_tab.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon - green mark works on both light and dark themes */}
        <link rel="icon" href="/logos/MARK_ONLY_icon_tab.png?v=5" type="image/png" />
        <link rel="icon" href="/logos/MARK_ONLY_icon_tab.png?v=5" sizes="32x32" type="image/png" />
        <link rel="shortcut icon" href="/logos/MARK_ONLY_icon_tab.png?v=5" type="image/png" />
        <link rel="apple-touch-icon" href="/logos/MARK_ONLY_icon_tab.png?v=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <SponsorshipStrip />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <ServiceWorkerRegistration />
        <NewsletterModalTrigger />
        <Analytics />
      </body>
    </html>
  );
}
