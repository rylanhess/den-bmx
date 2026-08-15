import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import ServiceWorkerRegistration from "./sw-register";
import ColoradoNavigation from "@/components/ColoradoNavigation";
import ColoradoShell from "@/components/ColoradoShell";
import ColoradoAdBanner from "@/components/ads/ColoradoAdBanner";
import ColoradoAdCycleShell from "@/components/ads/ColoradoAdCycleShell";
import ColoradoThemeSync from "@/components/ColoradoThemeSync";
import JsonLd from "@/components/JsonLd";
import { siteMetadata } from "@/lib/siteMetadata";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/structuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#002868',
};

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const favicon = '/logos/cbmx_tab_icon-32.png?v=20260802';
  const appleIcon = '/logos/cbmx_tab_icon-192.png?v=20260802';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={favicon} type="image/png" />
        <link rel="icon" href={favicon} sizes="32x32" type="image/png" />
        <link rel="shortcut icon" href={favicon} type="image/png" />
        <link rel="apple-touch-icon" href={appleIcon} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased theme-colorado-day`}
      >
        <Suspense fallback={null}>
          <ColoradoThemeSync />
        </Suspense>
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
        <ColoradoAdCycleShell enabled>
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={null}>
            <ColoradoNavigation />
          </Suspense>
          <ColoradoAdBanner />
          <main className="flex-1">
            {children}
          </main>
          <ColoradoShell />
        </div>
        </ColoradoAdCycleShell>
        <ServiceWorkerRegistration />
        <Analytics />
      </body>
    </html>
  );
}
