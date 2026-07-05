import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { ViewCounter } from "@/components/site/ViewCounter";
import { LikeButton } from "@/components/site/LikeButton";
import { ShareButtons } from "@/components/site/ShareButtons";
import { getPublicProjectBySlug, getPublicProjects } from "@/lib/public-projects";
import { slugify } from "@/lib/content-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string };

function sectionList(items: string[]) {
  return items.filter(Boolean).map((item) => <li key={item}>• {item}</li>);
}

function projectLinkButton(href: string, label: string, icon?: React.ReactNode) {
  if (!href) return null;
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main">
      {icon}
      {label}
    </a>
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.metaTitle || project.title,
    description: project.metaDescription || project.shortDescription || project.longDescription,
    keywords: project.keywords,
    openGraph: {
      title: project.metaTitle || project.title,
      description: project.metaDescription || project.shortDescription || project.longDescription,
      images: [{ url: project.openGraphImage || project.coverImage || project.image }],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getPublicProjects();
  const relatedProjects = allProjects
    .filter((item) => item.id !== project.id)
    .map((item) => ({
      item,
      score:
        Number(item.category === project.category) * 3 +
        Number(item.projectType === project.projectType) * 2 +
        item.techStack.filter((tech) => project.techStack.includes(tech)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.order - b.item.order)
    .slice(0, 3)
    .map(({ item }) => item);

  const currentIndex = allProjects.findIndex((item) => item.id === project.id);
  const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;
  const gallery = project.galleryImages.length ? project.galleryImages : project.uiScreenshots.length ? project.uiScreenshots : project.image ? [project.image] : [];
  const confidential = project.confidentialProject;
  const liveUrlHidden = confidential ? "Live URL withheld due to confidentiality agreement." : "";

  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap space-y-10">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-semibold text-text-main">{project.category}</span>
              {project.projectType ? <span className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-semibold text-text-muted">{project.projectType}</span> : null}
              {project.status ? <span className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-semibold text-text-muted">{project.status}</span> : null}
              {project.featured ? <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Featured</span> : null}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-text-main sm:text-5xl">{project.title}</h1>
            {project.subtitle ? <p className="text-lg font-medium text-text-muted">{project.subtitle}</p> : null}
            <p className="text-base leading-7 text-text-muted">{project.fullDescription || project.longDescription || project.shortDescription}</p>

            {confidential ? (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                Some project details are withheld due to confidentiality agreements.
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {projectLinkButton(project.liveDemoUrl, "View Live Project", <ExternalLink className="h-4 w-4" />)}
              {!project.liveDemoUrl && liveUrlHidden ? (
                <span className="rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-muted">{liveUrlHidden}</span>
              ) : null}
              {!confidential ? projectLinkButton(project.githubUrl, "GitHub", <Github className="h-4 w-4" />) : null}
              {!confidential ? projectLinkButton(project.documentationUrl || project.caseStudyUrl || "", "Documentation") : null}
              {!confidential ? projectLinkButton(project.figmaUrl, "Figma") : null}
              {!confidential ? projectLinkButton(project.demoVideoUrl, "Demo Video") : null}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-text-muted">
              <span>{project.readingTimeMinutes} min read</span>
              {project.duration ? <span>{project.duration}</span> : null}
              {project.startDate ? <span>{project.startDate}{project.endDate ? ` - ${project.endDate}` : ""}</span> : null}
            </div>

            <div className="space-y-3">
              <ViewCounter targetType="project" targetSlug={project.slug || slugify(project.title)} />
              <LikeButton targetType="project" targetSlug={project.slug || slugify(project.title)} />
              <ShareButtons title={project.title} path={`/projects/${project.slug}`} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[32px] border border-[rgb(var(--border))] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.coverImage || project.image || gallery[0] || ""} alt={project.title} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6">
            <h2 className="text-xl font-semibold text-text-main">Project Information</h2>
            <dl className="mt-4 grid gap-4 text-sm text-text-muted">
              <div className="flex justify-between gap-4"><dt>Company</dt><dd className="text-text-main">{project.company || "-"}</dd></div>
              <div className="flex justify-between gap-4"><dt>My Role</dt><dd className="text-text-main">{project.myRole || "-"}</dd></div>
              <div className="flex justify-between gap-4"><dt>Team Size</dt><dd className="text-text-main">{project.teamSize || "-"}</dd></div>
              <div className="flex justify-between gap-4"><dt>Industry</dt><dd className="text-text-main">{project.industry || "-"}</dd></div>
            </dl>
          </div>

          <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6">
            <h2 className="text-xl font-semibold text-text-main">Technology Used</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => <span key={tech} className="rounded-full border border-[rgb(var(--border))] px-3 py-1.5 text-sm text-text-main">{tech}</span>)}
            </div>
            <div className="mt-4 grid gap-3 text-sm text-text-muted">
              {project.frontend ? <p><span className="font-semibold text-text-main">Frontend:</span> {project.frontend}</p> : null}
              {project.backend ? <p><span className="font-semibold text-text-main">Backend:</span> {project.backend}</p> : null}
              {project.database ? <p><span className="font-semibold text-text-main">Database:</span> {project.database}</p> : null}
              {project.cloudHosting ? <p><span className="font-semibold text-text-main">Cloud / Hosting:</span> {project.cloudHosting}</p> : null}
              {project.apisServicesUsed ? <p><span className="font-semibold text-text-main">APIs / Services:</span> {project.apisServicesUsed}</p> : null}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6">
          <h2 className="text-xl font-semibold text-text-main">Project Description</h2>
          <p className="mt-3 text-sm leading-7 text-text-muted">{project.fullDescription || project.longDescription || project.shortDescription}</p>
        </section>

        {project.keyFeatures.length || project.keyResponsibilities.length || project.skillsApplied.length ? (
          <section className="grid gap-6 lg:grid-cols-3">
            {project.keyFeatures.length ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Key Features</h2><ul className="mt-4 space-y-2 text-sm text-text-muted">{sectionList(project.keyFeatures)}</ul></div> : null}
            {project.keyResponsibilities.length ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Responsibilities</h2><ul className="mt-4 space-y-2 text-sm text-text-muted">{sectionList(project.keyResponsibilities)}</ul></div> : null}
            {project.skillsApplied.length ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Skills Applied</h2><ul className="mt-4 space-y-2 text-sm text-text-muted">{sectionList(project.skillsApplied)}</ul></div> : null}
          </section>
        ) : null}

        {gallery.length ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-main">Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {gallery.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={image} src={image} alt={`${project.title} gallery`} className="w-full rounded-[24px] object-cover shadow-[0_12px_28px_rgba(15,23,42,0.10)]" />
              ))}
            </div>
          </section>
        ) : null}

        {project.demoVideoUrl ? (
          <section className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6">
            <h2 className="text-xl font-semibold text-text-main">Demo Video</h2>
            <a className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary" href={project.demoVideoUrl} target="_blank" rel="noreferrer">
              Watch demo <ArrowRight className="h-4 w-4" />
            </a>
          </section>
        ) : null}

        {relatedProjects.length ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-main">Related Projects</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedProjects.map((item) => (
                <Link key={item.id} href={`/projects/${item.slug}`} className="rounded-3xl border border-[rgb(var(--border))] bg-white p-4 transition hover:-translate-y-1">
                  <p className="text-sm font-semibold text-text-main">{item.title}</p>
                  <p className="mt-2 text-sm text-text-muted">{item.shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="flex flex-wrap justify-between gap-4">
          {previousProject ? <Link href={`/projects/${previousProject.slug}`} className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main"><ArrowLeft className="h-4 w-4" /> Previous Project</Link> : <span />}
          {nextProject ? <Link href={`/projects/${nextProject.slug}`} className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main">Next Project <ArrowRight className="h-4 w-4" /></Link> : null}
        </section>
      </div>
    </main>
  );
}
