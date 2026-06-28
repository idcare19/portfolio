"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const FILTERS = ["All", "AI", "SaaS", "Next.js", "React", "Django", "MongoDB"];

export function ProjectsCatalog({ initialProjects }: { initialProjects: any[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const projects = useMemo(
    () =>
      activeFilter === "All"
        ? initialProjects
        : initialProjects.filter((project) =>
            [project.category, ...(project.tags || []), ...(project.techStack || [])].some(
              (value: string) => value?.toLowerCase() === activeFilter.toLowerCase()
            )
          ),
    [activeFilter, initialProjects]
  );

  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap space-y-10">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Projects</p>
          <h1 className="text-4xl font-bold tracking-tight text-text-main sm:text-5xl">Selected case studies and product work</h1>
          <p className="mt-4 text-base text-text-muted">Fixed page layout, dynamic MongoDB content. Every project here is rendered from the portfolio collection layer.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeFilter === filter ? "bg-primary text-white" : "border border-[rgb(var(--border))] text-text-main"}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="glass rounded-3xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              {project.image ? <img src={project.image} alt={project.title} className="h-52 w-full rounded-2xl object-cover" /> : null}
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{project.category || "Project"}</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-main">{project.title}</h2>
                <p className="mt-3 text-sm leading-6 text-text-muted">{project.shortDescription}</p>
                {project.timeline ? <p className="mt-2 text-xs font-medium text-primary">{project.timeline}</p> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack?.map((tech: string) => (
                    <span key={tech} className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs text-text-main">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Link href={`/projects/${project.slug || project.id}`} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                    View Case Study
                  </Link>
                  {project.liveDemoUrl ? <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold text-text-main">Live Demo</a> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
