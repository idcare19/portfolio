import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import type { ReactNode } from "react";
import { ViewCounter } from "@/components/site/ViewCounter";
import { LikeButton } from "@/components/site/LikeButton";
import { ShareButtons } from "@/components/site/ShareButtons";
import { getPublicCompletedProjectBySlug, getPublicCompletedProjects } from "@/lib/completed-projects";
import { slugify } from "@/lib/content-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string };

function sectionList(items: string[]) {
  return items.filter(Boolean).map((item) => <li key={item}>• {item}</li>);
}

function projectLinkButton(href: string, label: string, icon?: ReactNode) {
  if (!href) return null;
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main">
      {icon}
      {label}
    </a>
  );
}

function isConfidential(project: { confidentialProject?: boolean; confidential?: boolean; isConfidential?: boolean }) {
  return Boolean(project.confidentialProject || project.confidential || project.isConfidential);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicCompletedProjectBySlug(slug);
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

export default async function CompletedProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getPublicCompletedProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getPublicCompletedProjects();
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
  const confidential = isConfidential(project);
  const liveUrlHidden = confidential ? "Live URL withheld due to confidentiality agreement." : "";

  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap space-y-10">
        <Link href="/completed-projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Completed Projects
        </Link>
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-semibold text-text-main">{project.category}</span>
              {project.projectType ? <span className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-semibold text-text-muted">{project.projectType}</span> : null}
              {project.status ? <span className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-semibold text-text-muted">{project.status}</span> : null}
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
            </div>
            <div className="space-y-3">
              <ViewCounter targetType="project" targetSlug={project.slug || slugify(project.title)} />
              <LikeButton targetType="project" targetSlug={project.slug || slugify(project.title)} />
              <ShareButtons title={project.title} path={`/completed-projects/${project.slug}`} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[32px] border border-[rgb(var(--border))] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.coverImage || project.image || gallery[0] || ""} alt={project.title} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {!confidential && relatedProjects.length ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-main">Related Projects</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedProjects.map((item) => (
                <Link key={item.id} href={`/completed-projects/${item.slug}`} className="rounded-3xl border border-[rgb(var(--border))] bg-white p-4 transition hover:-translate-y-1">
                  <p className="text-sm font-semibold text-text-main">{item.title}</p>
                  <p className="mt-2 text-sm text-text-muted">{item.shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="flex flex-wrap justify-between gap-4">
          {previousProject ? <Link href={`/completed-projects/${previousProject.slug}`} className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main"><ArrowLeft className="h-4 w-4" /> Previous Project</Link> : <span />}
          {nextProject ? <Link href={`/completed-projects/${nextProject.slug}`} className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main">Next Project <ArrowRight className="h-4 w-4" /></Link> : null}
        </section>
      </div>
    </main>
  );
}
