"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ui/ProjectCard";

type Project = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  status: string;
  category: string;
  techStack: string[];
  industry?: string;
  projectType?: string;
  liveDemoUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
};

const SORT_OPTIONS = [
  { value: "featured", label: "Featured first" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export function ProjectsCatalog({ initialProjects }: { initialProjects: Project[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [type, setType] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [sort, setSort] = useState("featured");

  const categories = useMemo(() => {
    const values = new Set<string>(["all"]);
    const statuses = new Set<string>(["all"]);
    const industries = new Set<string>(["all"]);
    const types = new Set<string>(["all"]);
    initialProjects.forEach((project) => {
      if (project.category) values.add(project.category);
      if (project.status) values.add(project.status);
      if (project.industry) industries.add(project.industry);
      if (project.projectType) types.add(project.projectType);
      if (project.status) statuses.add(project.status);
    });
    return { categories: Array.from(values), statuses: Array.from(statuses), industries: Array.from(industries), types: Array.from(types) };
  }, [initialProjects]);

  const projects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = initialProjects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        [project.title, project.shortDescription, project.status, project.category, ...(project.techStack || [])]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesFilter = filter === "all" || project.category === filter || project.status === filter;
      const matchesStatus = status === "all" || project.status === status;
      const matchesIndustry = industry === "all" || project.industry === industry;
      const matchesType = type === "all" || project.projectType === type;
      const matchesFeatured = featured === "all" || (featured === "yes" ? project.featured : !project.featured);
      return matchesQuery && matchesFilter && matchesStatus && matchesIndustry && matchesType && matchesFeatured;
    });

    return filtered.sort((a, b) => {
      if (sort === "newest") return b.order - a.order;
      if (sort === "oldest") return a.order - b.order;
      return Number(b.featured) - Number(a.featured) || a.order - b.order;
    });
  }, [featured, filter, industry, initialProjects, query, sort, status, type]);

  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap space-y-10">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Projects</p>
          <h1 className="text-4xl font-bold tracking-tight text-text-main sm:text-5xl">Selected work and public case studies</h1>
          <p className="mt-4 text-base text-text-muted">All enabled projects are rendered from the CMS section data. Search, filter, and sort the live portfolio archive here.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="rounded-2xl border border-[rgb(var(--border))] bg-white px-4 py-3 text-sm text-text-main"
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-2xl border border-[rgb(var(--border))] bg-white px-4 py-3 text-sm text-text-main">
            {categories.categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All categories" : category}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-[rgb(var(--border))] bg-white px-4 py-3 text-sm text-text-main">
            {categories.statuses.map((item) => <option key={item} value={item}>{item === "all" ? "All statuses" : item}</option>)}
          </select>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="rounded-2xl border border-[rgb(var(--border))] bg-white px-4 py-3 text-sm text-text-main">
            {categories.industries.map((item) => <option key={item} value={item}>{item === "all" ? "All industries" : item}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-2xl border border-[rgb(var(--border))] bg-white px-4 py-3 text-sm text-text-main">
            {categories.types.map((item) => <option key={item} value={item}>{item === "all" ? "All project types" : item}</option>)}
          </select>
          <select value={featured} onChange={(e) => setFeatured(e.target.value)} className="rounded-2xl border border-[rgb(var(--border))] bg-white px-4 py-3 text-sm text-text-main">
            <option value="all">All featured states</option>
            <option value="yes">Featured only</option>
            <option value="no">Not featured</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border border-[rgb(var(--border))] bg-white px-4 py-3 text-sm text-text-main md:col-span-2 xl:col-span-1">
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {projects.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  slug: project.slug,
                  title: project.title,
                  description: project.shortDescription,
                  image: project.image,
                  status: project.status,
                  tech: project.techStack,
                  industry: project.industry,
                  projectType: project.projectType,
                  liveUrl: project.liveDemoUrl,
                  githubUrl: project.githubUrl || "#",
                  backendRepo: undefined,
                  documentationUrl: undefined,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-[rgb(var(--border))] bg-white p-8 text-center text-sm text-text-muted">No projects matched your search.</p>
        )}

        <div className="flex justify-center">
          <Link href="/" className="rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
