import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import ServiceWorkerRegistration from "./sw-register";
import SiteNavigation from "@/components/SiteNavigation";
import SponsorshipStrip from "@/components/SponsorshipStrip";
import NewsletterModalTrigger from "@/components/NewsletterModalTrigger";
import ColoradoShellGate from "@/components/ColoradoShellGate";
import ColoradoThemeSync from "@/components/ColoradoThemeSync";
import { isColoradoExperience } from "@/lib/coloradoTheme";
import { siteMetadata } from "@/lib/siteMetadata";
import { headers } from "next/headers";
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
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  const pathname = headersList.get('x-pathname') ?? '';
  const params = new URLSearchParams();
  if (headersList.get('x-co-contact') === '1') {
    params.set('co', '1');
  }
  return siteMetadata(isColoradoExperience(host, pathname, params));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  const pathname = headersList.get('x-pathname') ?? '';
  const params = new URLSearchParams();
  if (headersList.get('x-co-contact') === '1') {
    params.set('co', '1');
  }
  const isColorado = isColoradoExperience(host, pathname, params);
  const favicon = isColorado
    ? '/logos/BMX_CO_TAB_ICON-32.png?v=1'
    : '/logos/MARK_ONLY_icon_tab.png?v=5';
  const appleIcon = isColorado
    ? '/logos/BMX_CO_TAB_ICON-192.png?v=1'
    : '/logos/MARK_ONLY_icon_tab.png?v=5';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={favicon} type="image/png" />
        <link rel="icon" href={favicon} sizes="32x32" type="image/png" />
        <link rel="shortcut icon" href={favicon} type="image/png" />
        <link rel="apple-touch-icon" href={appleIcon} />
        {isColorado && <meta name="theme-color" content="#002868" />}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased${isColorado ? ' theme-colorado-day' : ''}`}
      >
        <Suspense fallback={null}>
          <ColoradoThemeSync />
        </Suspense>
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={null}>
            <SiteNavigation />
          </Suspense>
          {!isColorado && <SponsorshipStrip />}
          <main className="flex-1">
            {children}
          </main>
          <Suspense fallback={null}>
            <ColoradoShellGate />
          </Suspense>
        </div>
        <ServiceWorkerRegistration />
        {!isColorado && <NewsletterModalTrigger />}
        <Analytics />
      </body>
    </html>
  );
}
