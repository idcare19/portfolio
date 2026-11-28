import type { SiteData } from "@/src/types/site-data";

const siteUrl = "https://www.idcare19.me";
const profileImageUrl = `${siteUrl}/idcare19.jpg`;
const description = "Abhishek (idcare19) is a full-stack developer from India building web apps and SaaS products with Next.js, React, TypeScript and Django. Open to freelance projects and remote opportunities.";

export function StructuredData({ site }: { site: SiteData }) {
  const sameAs = ["https://github.com/idcare19", "https://x.com/idcare19", "https://www.instagram.com/idcare19/", ...site.socials.filter((item) => item.isEnabled !== false && /^https:\/\//i.test(item.href)).map((item) => item.href)];
  const skills = Array.from(new Set([...(site.heroTech || []), ...(site.skills || []), ...(site.skillsDetailed || []).map((skill) => skill.name)]));
  const graph = [
    { "@type": "Person", "@id": `${siteUrl}/#person`, name: "Abhishek", alternateName: ["idcare19", "idcare19.me"], url: siteUrl, image: profileImageUrl, description, jobTitle: "Full-Stack Developer", address: { "@type": "PostalAddress", addressCountry: "IN" }, knowsAbout: skills, sameAs: Array.from(new Set(sameAs)), hasOccupation: { "@type": "Occupation", name: "Full-Stack Developer", occupationLocation: { "@type": "Country", name: "India" }, skills: skills.join(", ") } },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Abhishek (idcare19.me)", description, publisher: { "@id": `${siteUrl}/#person` }, inLanguage: "en-IN" },
    { "@type": "ProfessionalService", "@id": `${siteUrl}/#professional-service`, name: "idcare19 Web Development", url: siteUrl, description: "Web development and SaaS development by Abhishek, a full-stack developer based in India and available remotely worldwide.", provider: { "@id": `${siteUrl}/#person` }, areaServed: [{ "@type": "Country", name: "India" }, { "@type": "Place", name: "Remote worldwide" }], serviceType: ["Web development", "SaaS development"] },
    { "@type": "ProfilePage", "@id": `${siteUrl}/#profile`, url: `${siteUrl}/about`, name: "About Abhishek — Full-Stack Developer", image: profileImageUrl, mainEntity: { "@id": `${siteUrl}/#person` }, isPartOf: { "@id": `${siteUrl}/#website` } },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}
