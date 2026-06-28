import { notFound } from "next/navigation";
import { LikeButton } from "@/components/site/LikeButton";
import { ShareButtons } from "@/components/site/ShareButtons";
import { ViewCounter } from "@/components/site/ViewCounter";
import { getPublishedProjects } from "@/lib/portfolio/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProjectDetail = {
  id: string;
  slug?: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  category: string;
  image: string;
  liveDemoUrl: string;
  githubUrl: string;
  overview?: string;
  problem?: string;
  solution?: string;
  myRole?: string;
  responsibilities?: string[];
  features?: string[];
  screenshots?: string[];
  architectureDiagram?: string;
  databaseSchema?: string;
  apiFlow?: string;
  folderStructure?: string;
  challenges?: string;
  lessonsLearned?: string;
  futureImprovements?: string[];
  timeline?: string;
  tags?: string[];
  readingTimeMinutes?: number;
  outcome?: string;
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = (await getPublishedProjects()) as ProjectDetail[];
  const project = projects.find((item) => (item.slug || item.id) === slug);

  if (!project) notFound();

  const relatedProjects = projects
    .filter((item) => item.id !== project.id)
    .map((item) => ({
      ...item,
      score: (item.tags || []).filter((tag) => (project.tags || []).includes(tag)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const detailBlocks = [
    { label: "Overview", value: project.overview || project.shortDescription },
    { label: "Problem", value: project.problem || project.longDescription },
    { label: "Solution", value: project.solution },
    { label: "My Role", value: project.myRole },
    { label: "Architecture Diagram", value: project.architectureDiagram },
    { label: "Database Schema", value: project.databaseSchema },
    { label: "API Flow", value: project.apiFlow },
    { label: "Folder Structure", value: project.folderStructure },
    { label: "Challenges", value: project.challenges },
    { label: "Lessons Learned", value: project.lessonsLearned },
    { label: "Outcome", value: project.outcome },
  ].filter((item) => item.value);

  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap space-y-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{project.category || "Case Study"}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-text-main sm:text-5xl">{project.title}</h1>
            <p className="mt-5 text-base leading-7 text-text-muted">{project.longDescription || project.shortDescription}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-text-muted">
              <span>{project.readingTimeMinutes || 1} min read</span>
              {project.timeline ? <span>{project.timeline}</span> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.liveDemoUrl ? <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">Live Demo</a> : null}
              {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[rgb(var(--border))] px-5 py-2 text-sm font-semibold text-text-main">GitHub</a> : null}
              <ViewCounter targetType="project" targetSlug={project.slug || project.id} />
              <LikeButton targetType="project" targetSlug={project.slug || project.id} />
            </div>
            <div className="mt-4">
              <ShareButtons title={project.title} path={`/projects/${project.slug || project.id}`} />
            </div>
          </div>
          {project.image ? <img src={project.image} alt={project.title} className="w-full rounded-[28px] object-cover shadow-[0_18px_40px_rgba(15,23,42,0.12)]" /> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-text-main">Tech Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack?.map((tech: string) => (
                <span key={tech} className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1.5 text-sm text-text-main">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {project.features?.length ? (
            <section className="glass rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-text-main">Features</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-text-muted">
                {project.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </section>
          ) : null}
        </div>

        {project.responsibilities?.length ? (
          <section className="glass rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-text-main">Responsibilities</h2>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              {project.responsibilities.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ) : null}

        {detailBlocks.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {detailBlocks.map((block) => (
              <section key={block.label} className="glass rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-text-main">{block.label}</h2>
                <p className="mt-4 text-sm leading-7 text-text-muted">{block.value}</p>
              </section>
            ))}
          </div>
        ) : null}

        {project.futureImprovements?.length ? (
          <section className="glass rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-text-main">Future Improvements</h2>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              {project.futureImprovements.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ) : null}

        {project.screenshots?.length ? (
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold text-text-main">Screenshots</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {project.screenshots.map((image) => <img key={image} src={image} alt={`${project.title} screenshot`} className="w-full rounded-[24px] object-cover shadow-[0_12px_28px_rgba(15,23,42,0.10)]" />)}
            </div>
          </section>
        ) : null}

        {relatedProjects.length ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-main">Related Projects</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedProjects.map((item) => (
                <a key={item.id} href={`/projects/${item.slug || item.id}`} className="glass rounded-3xl p-4">
                  <p className="text-sm font-semibold text-text-main">{item.title}</p>
                  <p className="mt-2 text-sm text-text-muted">{item.shortDescription}</p>
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
