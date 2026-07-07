import { ArrowUpRight, Github, Layers3, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Badge } from "@/components/ui/Badge";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="960" height="560" viewBox="0 0 960 560"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#dbeafe"/><stop offset="100%" stop-color="#eff6ff"/></linearGradient></defs><rect width="960" height="560" fill="url(#g)"/><rect x="64" y="64" width="832" height="432" rx="36" fill="#ffffff" opacity="0.72"/><path d="M260 350l106-126 76 88 56-64 132 146H260z" fill="#93c5fd"/><circle cx="365" cy="223" r="30" fill="#60a5fa"/><text x="480" y="392" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#1d4ed8">Project preview unavailable</text></svg>');

function getSafeImageSrc(src: string) {
  const value = (src || "").trim();
  if (!value) return FALLBACK_IMAGE;
  if (value.startsWith("data:image/")) return value;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) return value;
  return FALLBACK_IMAGE;
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

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const metrics = [
    { label: "Live", value: project.liveUrl ? "Yes" : "No" },
    { label: "Code", value: project.githubUrl ? "Public" : "Private" },
    { label: "Stack", value: `${project.tech.length || 0} tech` },
  ];

  return (
    <AnimatedCard className={`group h-full p-0 ${featured ? "md:col-span-2 xl:col-span-2" : ""}`}>
      <div className={`grid h-full ${featured ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
        <div className="relative overflow-hidden">
          <Image
            src={getSafeImageSrc(project.image)}
            alt={project.title}
            width={960}
            height={560}
            quality={78}
            sizes="(min-width: 1280px) 50vw, (min-width: 768px) 60vw, 92vw"
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] ${featured ? "min-h-[320px]" : "min-h-[220px] sm:min-h-[240px]"}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.52))]" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {project.status ? <Badge className="bg-white/95 text-[#1D4ED8]">{project.status}</Badge> : null}
            {featured ? <Badge className="bg-[#0F172A] text-white">Featured</Badge> : null}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/95">
              <Sparkles className="h-4 w-4" />
              {project.projectType || "Project"}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 p-4 sm:p-6">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
              <h3 className="text-lg font-semibold tracking-tight text-text-main sm:text-2xl">{project.title}</h3>
                {project.industry ? <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-muted sm:text-sm">{project.industry}</p> : null}
              </div>
              <div className="rounded-2xl bg-[#EFF6FF] p-2 text-[#1D4ED8]">
                <Layers3 className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">{project.description}</p>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">{metric.label}</p>
                  <p className="mt-1 text-sm font-semibold text-text-main">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.slice(0, 8).map((tech) => (
                <Badge key={tech} className="px-2.5 py-1 text-[10px] tracking-[0.14em]">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {project.liveUrl && project.liveUrl !== "#" ? (
              <Link href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)]">
                Live <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : null}
            {project.githubUrl && project.githubUrl !== "#" ? (
              <Link href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 text-sm font-semibold text-text-main">
                <Github className="h-4 w-4" /> Code
              </Link>
            ) : null}
            <Link href={`/projects/${project.slug}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-4 py-3 text-sm font-semibold text-text-main">
              Case Study <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
