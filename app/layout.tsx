import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GlobalPopupWrapper } from "@/components/layout/controls/GlobalPopupWrapper";
import { TopNoticeBar } from "@/components/layout/controls/TopNoticeBar";
import { AiAssistant } from "@/components/site/AiAssistant";
import { AnalyticsTracker } from "@/components/site/AnalyticsTracker";
import { GlobalSearch } from "@/components/site/GlobalSearch";
import { SiteDataProvider } from "@/components/site/SiteDataProvider";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { getSiteData } from "@/src/lib/site-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://portfolio-delta-dusky-86.vercel.app";

const gaMeasurementId = "G-TV1QZVQRL8";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();
  const owner = siteData.owner;
  const emailHref =
    siteData.socials.find((item) => item.label.toLowerCase() === "email")?.href ?? "mailto:personal@idcare19.me";

  return {
    metadataBase: new URL(siteUrl),
    applicationName: `${owner.name} | ${owner.username}`,
    title: `${owner.name} (${owner.username}) | ${owner.role}`,
    description: owner.tagline,
    generator: "Next.js",
    category: "portfolio",
    creator: owner.name,
    publisher: owner.name,
    keywords: [
      owner.name,
      owner.username,
      owner.role,
      owner.location,
      "Full Stack Developer",
      "Next.js Developer",
      "Premium Portfolio",
      "Web Developer",
      "React Developer",
      "Node.js Developer",
    ],
    authors: [{ name: owner.name, url: emailHref }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${owner.name} (${owner.username}) | ${owner.role}`,
      description: owner.tagline,
      url: siteUrl,
      type: "website",
      locale: "en_IN",
      siteName: `${owner.name} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${owner.name} (${owner.username}) | ${owner.role}`,
      description: owner.tagline,
    },
    icons: {
      icon: [{ url: "/projects/logo.png", type: "image/png" }],
      shortcut: ["/projects/logo.png"],
      apple: [{ url: "/projects/logo.png" }],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getSiteData();
  const shouldShowPopup = Boolean(siteData.websiteControl?.popupAnnouncement?.enabled);
  const hasTopNotice = Boolean(siteData.websiteControl?.topNoticeBar?.enabled);

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <SiteDataProvider data={siteData}>
          <ThemeProvider>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>

            <TopNoticeBar />
            <AnalyticsTracker />
            <div className={hasTopNotice ? "pt-20 sm:pt-16" : undefined}>{children}</div>
            {shouldShowPopup ? <GlobalPopupWrapper /> : null}
            <GlobalSearch />
            <AiAssistant />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </SiteDataProvider>
      </body>
    </html>
  );
}
