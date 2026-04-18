import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { portfolioData } from "@/data/portfolio";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const owner = portfolioData.owner;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-delta-dusky-86.vercel.app";
const emailHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "email")?.href ?? "mailto:personal@idcare19.me";
const gaMeasurementId = "G-TV1QZVQRL8";

export const metadata: Metadata = {
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
    icon: [
      { url: "/projects/logo.png", type: "image/png" },
    ],
    shortcut: [
      "/projects/logo.png",
    ],
    apple: [
      { url: "/projects/logo.png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `}
        </Script>
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
