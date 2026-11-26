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
import { WebsiteLoader } from "@/components/site/WebsiteLoader";
import { StructuredData } from "@/components/seo/StructuredData";
import { Navbar } from "@/components/layout/Navbar";
import { BackButton } from "@/components/layout/BackButton";
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

const siteUrl = "https://idcare19.me";

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
    authors: [{ name: owner.name, url: siteUrl }],
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
    alternates: { canonical: "/" },
    openGraph: {
      title: `${owner.name} (${owner.username}) | ${owner.role}`,
      description: owner.tagline,
      url: siteUrl,
      type: "website",
      locale: "en_IN",
      siteName: `${owner.name} Portfolio`,
      images: [{ url: "/projects/logo.png", alt: `${owner.name} portfolio` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${owner.name} (${owner.username}) | ${owner.role}`,
      description: owner.tagline,
      images: ["/projects/logo.png"],
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key="portfolio-theme-mode";var stored=localStorage.getItem(key);var dark=false;if(stored==="dark"){dark=true;}else if(stored==="light"){dark=false;}else{dark=window.matchMedia("(prefers-color-scheme: dark)").matches;}if(dark){document.documentElement.classList.add("dark");document.documentElement.dataset.theme="dark";document.documentElement.style.colorScheme="dark";}else{document.documentElement.classList.remove("dark");document.documentElement.dataset.theme="light";document.documentElement.style.colorScheme="light";}}catch(e){}})();`,
          }}
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "zjju4hmjwd");`,
          }}
        />
      </head>
      <body className="font-sans">
          <StructuredData site={siteData} />
          <WebsiteLoader />

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
            <Navbar />
            <BackButton />
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
