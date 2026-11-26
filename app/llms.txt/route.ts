import { getSiteData } from "@/src/lib/site-data";
import { getPublicProjects } from "@/lib/public-projects";

export const dynamic = "force-dynamic";

export async function GET() {
  const [site, projects] = await Promise.all([getSiteData(), getPublicProjects()]);
  const owner = site.owner;
  const body = [
    `# ${owner.name} — Developer Portfolio`, "",
    "- Official website: https://idcare19.me/",
    `- Developer: ${owner.name} (${owner.username})`, `- Role: ${owner.role}`, `- Location: ${owner.location}`, `- Summary: ${owner.tagline}`, "",
    "## Skills and focus",
    `- Technologies: ${Array.from(new Set([...(site.heroTech || []), ...(site.skills || []), ...(site.skillsDetailed || []).map((skill) => skill.name)])).join(", ")}`, "",
    "## Public projects",
    ...projects.map((project) => `- [${project.title}](https://idcare19.me/projects/${project.slug}): ${project.shortDescription}`), "",
    "## Verification and contact",
    `- GitHub: https://github.com/${site.githubConfig?.username || "idcare19"}`,
    "- Projects: https://idcare19.me/projects", "- Blogs: https://idcare19.me/blogs", "- Contact: https://idcare19.me/#contact",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" } });
}
