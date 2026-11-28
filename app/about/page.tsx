import type { Metadata } from "next";
import Link from "next/link";

import { getPortfolioData } from "@/data/portfolio";

const siteUrl = "https://www.idcare19.me";
const description = "Abhishek (idcare19) is a full-stack developer from India building web apps and SaaS products with Next.js, React, TypeScript and Django. Open to freelance projects and remote opportunities.";

export const metadata: Metadata = {
  title: "About Abhishek (idcare19) | Full-Stack Developer",
  description,
  alternates: { canonical: `${siteUrl}/about` },
};

export default async function AboutPage() {
  const site = await getPortfolioData();
  const skills = Array.from(new Set([...(site.heroTech || []), ...(site.skills || [])]));
  const projects = Array.isArray(site.sections?.projects?.items)
    ? site.sections.projects.items
    : Array.isArray((site as any).projects)
      ? (site as any).projects
      : [];
  const socials = [
    ...site.socials.filter((item) => item.isEnabled !== false && /^https?:\/\//i.test(item.href)),
    { label: "X", href: "https://x.com/idcare19" },
    { label: "Instagram", href: "https://www.instagram.com/idcare19/" },
  ];

  return (
    <main className="section-wrap py-24">
      <article className="prose prose-slate max-w-4xl dark:prose-invert">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">About / idcare19</p>
          <h1>Abhishek — Full-Stack Developer</h1>
          <p>{description}</p>
          <p>Based in India and working remotely, I am available for freelance projects and remote opportunities.</p>
        </header>

        <section aria-labelledby="what-i-do">
          <h2 id="what-i-do">What I do</h2>
          <p>I build web apps, SaaS products and business websites from interface to API to database, with a focus on clear UX, reliable systems and fast, maintainable delivery.</p>
        </section>

        <section aria-labelledby="skills">
          <h2 id="skills">Skills and technologies</h2>
          <ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </section>

        <section aria-labelledby="projects">
          <h2 id="projects">Selected projects</h2>
          <ul>
            {projects.slice(0, 12).map((project: any) => (
              <li key={project.id || project.slug || project.title}>
                <strong>{project.title}</strong>{project.description || project.shortDescription ? ` — ${project.description || project.shortDescription}` : ""}
              </li>
            ))}
          </ul>
          <p><Link href="/projects">View the complete project portfolio</Link>.</p>
        </section>

        <section aria-labelledby="connect">
          <h2 id="connect">Connect with me</h2>
          <ul>
            {socials.map((social) => <li key={social.href}><a href={social.href} rel="me noopener noreferrer">{social.label}</a></li>)}
            <li><a href={site.owner.resumeUrl} rel="noopener noreferrer">Resume</a></li>
          </ul>
        </section>
      </article>
    </main>
  );
}
