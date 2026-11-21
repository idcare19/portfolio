
import {
  ArrowUpRight,
  Github,
  Layers3,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Badge } from "@/components/ui/Badge";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="560" viewBox="0 0 960 560"><rect width="960" height="560" fill="#111827"/><rect x="60" y="60" width="840" height="440" rx="32" fill="#1e293b"/><circle cx="480" cy="245" r="65" fill="#334155"/><text x="480" y="370" text-anchor="middle" font-family="Arial" font-size="30" fill="#cbd5e1">Project Preview</text></svg>'
  );

function getSafeImageSrc(src: string) {
  const value = (src || "").trim();

  if (!value) return FALLBACK_IMAGE;

  if (
    value.startsWith("data:image/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return FALLBACK_IMAGE;
}

function isExternalUrl(value?: string) {
  return /^https?:\/\//i.test(String(value || ""));
}

type ProjectCardProps = {
  project: {
    slug: string;
    title: string;
    description: string;
    image: string;
    status?: string;
    industry?: string;
    projectType?: string;
    tech: string[];
    liveUrl: string;
    githubUrl: string;
    backendRepo?: string;
    documentationUrl?: string;
  };
  featured?: boolean;
};

export function ProjectCard({
  project,
  featured = false,
}: ProjectCardProps) {
  const technologies = Array.isArray(project.tech)
    ? project.tech.filter(Boolean)
    : [];

  const metrics = [
    {
      label: "Live Demo",
      value: project.liveUrl ? "Available" : "Private",
    },
    {
      label: "Source",
      value: project.githubUrl ? "Available" : "Private",
    },
    {
      label: "Stack",
      value: `${technologies.length} Technologies`,
    },
  ];

  const caseStudyHref = `/projects/${encodeURIComponent(project.slug)}`;

  return (
    <AnimatedCard
      className={`group relative h-full overflow-hidden rounded-[26px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-0 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_30px_80px_rgba(37,99,235,0.13)] ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div
        className={`grid h-full ${
          featured
            ? "lg:grid-cols-[1.15fr_0.85fr]"
            : "grid-cols-1"
        }`}
      >
        {/* IMAGE */}
        <Link
          href={caseStudyHref}
          aria-label={`View ${project.title} case study`}
          className={`relative block overflow-hidden bg-slate-950 ${
            featured
              ? "min-h-[260px] lg:min-h-[420px]"
              : "min-h-[220px] sm:min-h-[250px]"
          }`}
        >
          <Image
            src={getSafeImageSrc(project.image)}
            alt={`${project.title} project preview`}
            fill
            unoptimized={project.image?.startsWith("data:image/")}
            quality={85}
            sizes={
              featured
                ? "(min-width: 1024px) 60vw, 100vw"
                : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-slate-950/20 opacity-80 transition-opacity duration-500 group-hover:opacity-60" />

          {/* TOP LABELS */}
          <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {project.status ? (
                <Badge className="border border-white/20 bg-white/95 text-slate-900">
                  {project.status}
                </Badge>
              ) : null}

              {featured ? (
                <Badge className="border border-white/20 bg-blue-600 text-white">
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  Featured
                </Badge>
              ) : null}
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-xl transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary">
              <ArrowUpRight size={18} />
            </span>
          </div>

          {/* IMAGE BOTTOM */}
          <div className="absolute bottom-5 left-5 right-5">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-300">
              <Layers3 size={13} />
              {project.projectType || project.industry || "Project"}
            </p>

            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {project.title}
            </h3>
          </div>
        </Link>

        {/* CONTENT */}
        <div className="flex flex-col justify-between gap-6 p-5 sm:p-7">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                Project Overview
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] text-primary">
                <Layers3 size={15} />
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-text-main sm:text-2xl">
              {project.title}
            </h3>

            {project.industry ? (
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                {project.industry}
              </p>
            ) : null}

            <p className="mt-4 text-sm leading-7 text-text-muted">
              {project.description}
            </p>

            {/* METRICS */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="min-w-0 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-2.5"
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                    {metric.label}
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-text-main">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* TECHNOLOGIES */}
            {technologies.length > 0 ? (
              <div className="mt-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                  Built With
                </p>

                <div className="flex flex-wrap gap-2">
                  {technologies.slice(0, featured ? 10 : 7).map((tech) => (
                    <Badge
                      key={tech}
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-text-muted"
                    >
                      {tech}
                    </Badge>
                  ))}

                  {technologies.length > (featured ? 10 : 7) ? (
                    <span className="inline-flex items-center rounded-lg border border-[rgb(var(--border))] px-2.5 py-1.5 text-[10px] font-semibold text-text-muted">
                      +{technologies.length - (featured ? 10 : 7)}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center gap-2 border-t border-[rgb(var(--border))] pt-5">
            {project.liveUrl && project.liveUrl !== "#" ? (
              <Link
                href={project.liveUrl}
                target={isExternalUrl(project.liveUrl) ? "_blank" : undefined}
                rel={isExternalUrl(project.liveUrl) ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/15 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/30"
              >
                Live Demo
                <ExternalLink size={14} />
              </Link>
            ) : null}

            {project.githubUrl && project.githubUrl !== "#" ? (
              <Link
                href={project.githubUrl}
                target={isExternalUrl(project.githubUrl) ? "_blank" : undefined}
                rel={isExternalUrl(project.githubUrl) ? "noopener noreferrer" : undefined}
                aria-label="View GitHub repository"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] text-text-main transition-all hover:border-primary/40 hover:text-primary"
              >
                <Github size={17} />
              </Link>
            ) : null}

            <Link
              href={caseStudyHref}
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3 py-2.5 text-xs font-bold text-text-main transition-all hover:border-primary/40 hover:text-primary"
            >
              Case Study
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
