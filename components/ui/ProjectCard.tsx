import { ExternalLink, Github } from "lucide-react";
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
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <AnimatedCard className="group p-4">
      <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))]">
        <Image
          src={getSafeImageSrc(project.image)}
          alt={project.title}
          width={960}
          height={560}
          quality={72}
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 46vw, 92vw"
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.42)] via-[rgba(15,23,42,0.08)] to-transparent transition duration-500 group-hover:from-[rgba(15,23,42,0.48)]" />
      </div>

      <div className="relative mt-4">
        <h3 className="text-lg font-semibold text-text-main">{project.title}</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
          {project.status ? <span className="rounded-full border border-[rgb(var(--border))] bg-white px-2.5 py-1 text-text-muted">{project.status}</span> : null}
          {project.projectType ? <span className="rounded-full border border-[rgb(var(--border))] bg-white px-2.5 py-1 text-text-muted">{project.projectType}</span> : null}
          {project.industry ? <span className="rounded-full border border-[rgb(var(--border))] bg-white px-2.5 py-1 text-text-muted">{project.industry}</span> : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-text-muted">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Badge key={tech} className="px-2.5 py-1 text-[10px] tracking-[0.16em]">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {project.liveUrl && project.liveUrl !== "#" ? (
            <Link href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3.5 py-2 text-xs font-semibold text-[#1D4ED8] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#93C5FD] hover:bg-[#DBEAFE]">
              <ExternalLink className="h-3.5 w-3.5" /> Live
            </Link>
          ) : null}
          {project.githubUrl && project.githubUrl !== "#" ? (
            <Link href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3.5 py-2 text-xs font-semibold text-text-main transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary">
              <Github className="h-3.5 w-3.5 transition group-hover:-rotate-6" /> Code
            </Link>
          ) : null}
          <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-3.5 py-2 text-xs font-semibold text-text-main transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary">
            View Details
          </Link>
        </div>
      </div>
    </AnimatedCard>
  );
}
