import type { Metadata } from "next";
import { SeoPageContent, SeoPageJsonLd, seoPages } from "@/lib/seo-pages";
const page = seoPages.find((item) => item.slug === "full-stack-developer-india")!;
export const metadata: Metadata = { title: page.title, description: page.description, alternates: { canonical: `https://www.idcare19.me/${page.slug}`, languages: { "en-IN": `https://www.idcare19.me/${page.slug}` } }, robots: { index: true, follow: true }, openGraph: { title: page.title, description: page.description, url: `https://www.idcare19.me/${page.slug}`, images: [{ url: "/opengraph-image" }] }, twitter: { card: "summary_large_image", title: page.title, description: page.description, images: ["/opengraph-image"] } };
export default function Page() { return <><SeoPageJsonLd page={page} /><SeoPageContent page={page} /></>; }
