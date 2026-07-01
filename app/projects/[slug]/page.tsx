import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { ViewCounter } from "@/components/site/ViewCounter";
import { LikeButton } from "@/components/site/LikeButton";
import { ShareButtons } from "@/components/site/ShareButtons";
import { getPublicProjectBySlug, getPublicProjects } from "@/lib/public-projects";
import { slugify } from "@/lib/content-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.metaTitle || project.title,
    description: project.metaDescription || project.shortDescription || project.longDescription,
    openGraph: {
      title: project.metaTitle || project.title,
      description: project.metaDescription || project.shortDescription || project.longDescription,
      images: project.banner || project.image ? [{ url: project.banner || project.image }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();

  const relatedProjects = (await getPublicProjects())
    .filter((item) => item.id !== project.id)
    .slice(0, 3);

  const gallery = project.galleryImages.length ? project.galleryImages : project.image ? [project.image] : [];

  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap space-y-10">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{project.category}</p>
            <h1 className="text-4xl font-bold tracking-tight text-text-main sm:text-5xl">{project.title}</h1>
            {project.subtitle ? <p className="text-lg font-medium text-text-muted">{project.subtitle}</p> : null}
            <p className="text-base leading-7 text-text-muted">{project.longDescription || project.shortDescription}</p>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-semibold text-text-main">{project.status}</span>
              {project.featured ? <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Featured</span> : null}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.liveDemoUrl ? (
                <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">
                  <ExternalLink className="h-4 w-4" />
                  Live
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main">
                  <Github className="h-4 w-4" />
                  Code
                </a>
              ) : null}
              {project.backendRepo ? (
                <a href={project.backendRepo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main">
                  Backend Repo
                </a>
              ) : null}
              {project.documentationUrl ? (
                <a href={project.documentationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main">
                  Documentation
                </a>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-text-muted">
              <span>{project.readingTimeMinutes} min read</span>
              {project.duration ? <span>{project.duration}</span> : null}
              {project.startDate ? <span>{project.startDate}{project.endDate ? ` - ${project.endDate}` : ""}</span> : null}
            </div>

            {project.tags.length ? (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => <span key={tag} className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-semibold text-text-muted">{tag}</span>)}
              </div>
            ) : null}

            <div className="space-y-3">
              <ViewCounter targetType="project" targetSlug={project.slug || slugify(project.title)} />
              <LikeButton targetType="project" targetSlug={project.slug || slugify(project.title)} />
              <ShareButtons title={project.title} path={`/projects/${project.slug}`} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[32px] border border-[rgb(var(--border))] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.coverImage || project.banner || project.image || gallery[0] || ""} alt={project.title} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6">
            <h2 className="text-xl font-semibold text-text-main">Tech Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full border border-[rgb(var(--border))] px-3 py-1.5 text-sm text-text-main">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6">
            <h2 className="text-xl font-semibold text-text-main">Project Info</h2>
            <dl className="mt-4 grid gap-4 text-sm text-text-muted">
              <div className="flex justify-between gap-4"><dt>Client</dt><dd className="text-text-main">{project.client || "-"}</dd></div>
              <div className="flex justify-between gap-4"><dt>Company</dt><dd className="text-text-main">{project.company || "-"}</dd></div>
              <div className="flex justify-between gap-4"><dt>Role</dt><dd className="text-text-main">{project.role || "-"}</dd></div>
              <div className="flex justify-between gap-4"><dt>Team Size</dt><dd className="text-text-main">{project.teamSize || "-"}</dd></div>
            </dl>
          </div>
        </section>

        {project.problemStatement || project.solution || project.targetUsers || project.businessValue || project.impact ? (
          <section className="grid gap-6 lg:grid-cols-2">
            {project.problemStatement ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Problem Statement</h2><p className="mt-3 text-sm leading-6 text-text-muted">{project.problemStatement}</p></div> : null}
            {project.solution ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Solution</h2><p className="mt-3 text-sm leading-6 text-text-muted">{project.solution}</p></div> : null}
            {project.targetUsers ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Target Users</h2><p className="mt-3 text-sm leading-6 text-text-muted">{project.targetUsers}</p></div> : null}
            {project.businessValue ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Business Value</h2><p className="mt-3 text-sm leading-6 text-text-muted">{project.businessValue}</p></div> : null}
            {project.impact ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6 lg:col-span-2"><h2 className="text-xl font-semibold text-text-main">Impact</h2><p className="mt-3 text-sm leading-6 text-text-muted">{project.impact}</p></div> : null}
          </section>
        ) : null}

        {project.features.length ? (
          <section className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6">
            <h2 className="text-xl font-semibold text-text-main">Features</h2>
            <ul className="mt-4 grid gap-2 text-sm text-text-muted md:grid-cols-2">
              {project.features.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>
        ) : null}

        {project.responsibilities.length ? (
          <section className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6">
            <h2 className="text-xl font-semibold text-text-main">Responsibilities</h2>
            <ul className="mt-4 grid gap-2 text-sm text-text-muted md:grid-cols-2">
              {project.responsibilities.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>
        ) : null}

        {project.achievements.length ? (
          <section className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6">
            <h2 className="text-xl font-semibold text-text-main">Achievements</h2>
            <ul className="mt-4 grid gap-2 text-sm text-text-muted md:grid-cols-2">
              {project.achievements.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>
        ) : null}

        {(project.keyFeatures.length || project.coreModules.length || project.futureRoadmap.length) ? (
          <section className="grid gap-6 lg:grid-cols-3">
            {project.keyFeatures.length ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Key Features</h2><ul className="mt-4 space-y-2 text-sm text-text-muted">{project.keyFeatures.map((item) => <li key={item}>• {item}</li>)}</ul></div> : null}
            {project.coreModules.length ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Core Modules</h2><ul className="mt-4 space-y-2 text-sm text-text-muted">{project.coreModules.map((item) => <li key={item}>• {item}</li>)}</ul></div> : null}
            {project.futureRoadmap.length ? <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-6"><h2 className="text-xl font-semibold text-text-main">Future Roadmap</h2><ul className="mt-4 space-y-2 text-sm text-text-muted">{project.futureRoadmap.map((item) => <li key={item}>• {item}</li>)}</ul></div> : null}
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

        {relatedProjects.length ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-main">Related Projects</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedProjects.map((item) => (
                <Link key={item.id} href={`/projects/${item.slug}`} className="rounded-3xl border border-[rgb(var(--border))] bg-white p-4">
                  <p className="text-sm font-semibold text-text-main">{item.title}</p>
                  <p className="mt-2 text-sm text-text-muted">{item.shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
