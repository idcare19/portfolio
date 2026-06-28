import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Badge } from "@/components/ui/Badge";

type ProjectCardProps = {
  project: {
    title: string;
    description: string;
    image: string;
    tech: string[];
    liveUrl: string;
    githubUrl: string;
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <AnimatedCard className="p-4">
      <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))]">
        <Image
          src={project.image}
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
        <p className="mt-2 text-sm leading-6 text-text-muted">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Badge key={tech} className="px-2.5 py-1 text-[10px] tracking-[0.16em]">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {project.liveUrl !== "#" && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3.5 py-2 text-xs font-semibold text-[#1D4ED8] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#93C5FD] hover:bg-[#DBEAFE]"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live
            </Link>
          )}
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3.5 py-2 text-xs font-semibold text-text-main transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
          >
            <Github className="h-3.5 w-3.5 transition group-hover:-rotate-6" /> Code
          </Link>
        </div>
      </div>
    </AnimatedCard>
  );
}
