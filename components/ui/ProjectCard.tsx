import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 p-4 shadow-sm transition-all duration-300 ease-out md:shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:hover:-translate-y-1 md:hover:border-blue-300/70 md:hover:shadow-[0_16px_36px_rgba(59,130,246,0.16)]">

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70">
        <Image
          src={project.image}
          alt={project.title}
          width={960}
          height={560}
          quality={72}
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 46vw, 92vw"
          className="h-44 w-full object-cover transition duration-500 md:group-hover:scale-110 sm:h-52"
        />
        <div className="pointer-events-none absolute inset-0 translate-y-4 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-0 transition duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100" />
      </div>

      <div className="relative mt-4">
        <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {project.liveUrl !== "#" && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 transition-all duration-500 ease-out md:hover:scale-105 md:hover:border-blue-500 md:hover:bg-blue-100"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live
            </Link>
          )}
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-all duration-500 ease-out md:hover:scale-105 md:hover:border-blue-400 md:hover:text-blue-700"
          >
            <Github className="h-3.5 w-3.5 transition md:group-hover:-rotate-6" /> Code
          </Link>
        </div>
      </div>
    </article>
  );
}
