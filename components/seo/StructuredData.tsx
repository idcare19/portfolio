import type { SiteData } from "@/src/types/site-data";

const siteUrl = "https://idcare19.me";

export function StructuredData({ site }: { site: SiteData }) {
  const sameAs = ["https://github.com/idcare19", ...site.socials.filter((item) => item.isEnabled !== false && /^https:\/\//i.test(item.href)).map((item) => item.href)];
  const graph = [
    { "@type": "Person", "@id": `${siteUrl}/#person`, name: site.owner.name, url: siteUrl, description: site.owner.tagline, jobTitle: site.owner.role || "Full-Stack Developer", address: { "@type": "PostalAddress", addressCountry: "IN" }, sameAs: Array.from(new Set(sameAs)), knowsAbout: Array.from(new Set([...(site.heroTech || []), ...(site.skills || []), ...(site.skillsDetailed || []).map((skill) => skill.name)])) },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: `${site.owner.name} Portfolio`, publisher: { "@id": `${siteUrl}/#person` }, inLanguage: "en-IN" },
    { "@type": "ProfilePage", "@id": `${siteUrl}/#profile`, url: siteUrl, name: `${site.owner.name} — Developer Portfolio`, mainEntity: { "@id": `${siteUrl}/#person` }, isPartOf: { "@id": `${siteUrl}/#website` } },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}
