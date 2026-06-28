"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectItem, SiteData } from "@/src/types/site-data";

type Props = {
  data: SiteData;
  onChange: (next: SiteData) => void;
};

const emptyProject: ProjectItem = {
  id: "",
  slug: "",
  title: "",
  shortDescription: "",
  longDescription: "",
  techStack: [],
  category: "",
  image: "",
  liveDemoUrl: "",
  githubUrl: "",
  featured: false,
  order: 0,
  overview: "",
  problem: "",
  solution: "",
  myRole: "",
  responsibilities: [],
  features: [],
  screenshots: [],
  architectureDiagram: "",
  databaseSchema: "",
  apiFlow: "",
  folderStructure: "",
  challenges: "",
  lessonsLearned: "",
  futureImprovements: [],
  timeline: "",
  tags: [],
  readingTimeMinutes: 1,
};

export function ProjectsEditor({ data, onChange }: Props) {
  const [activeId, setActiveId] = useState<string>(data.projectsDetailed[0]?.id || "");
  const [githubImages, setGithubImages] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const active = data.projectsDetailed.find((p) => p.id === activeId) || null;

  function syncProjects(nextProjects: ProjectItem[]) {
    onChange({
      ...data,
      projectsDetailed: nextProjects,
      projects: nextProjects.map((project) => ({
        title: project.title,
        description: project.shortDescription,
        image: project.image,
        tech: project.techStack,
        liveUrl: project.liveDemoUrl,
        githubUrl: project.githubUrl,
      })),
    });
  }

  useEffect(() => {
    let cancelled = false;

    async function loadGithubImages() {
      try {
        const res = await fetch("/api/github/images", { cache: "no-store" });
        const payload = await res.json();
        if (!cancelled && res.ok && payload?.ok) {
          setGithubImages(
            (payload.data as Array<{ url: string }>).map((item) => item.url).filter(Boolean)
          );
        }
      } catch {
        if (!cancelled) setGithubImages([]);
      }
    }

    void loadGithubImages();
    return () => {
      cancelled = true;
    };
  }, []);

  const imageOptions = useMemo(() => {
    const fromLibrary = data.mediaLibrary.map((item) => item.url).filter(Boolean);
    const combined = [...githubImages, ...fromLibrary, ...(active?.image ? [active.image] : [])];
    return Array.from(new Set(combined));
  }, [githubImages, data.mediaLibrary, active?.image]);

  function addProject() {
    const id = `project-${Date.now()}`;
    const nextProject = {
      ...emptyProject,
      id,
      order: data.projectsDetailed.length + 1,
    };
    const nextList = [...data.projectsDetailed, nextProject];
    syncProjects(nextList);
    setActiveId(id);
  }

  function removeProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const nextList = data.projectsDetailed.filter((p) => p.id !== id);
    syncProjects(nextList);
    setActiveId(nextList[0]?.id || "");
  }

  function updateActive(patch: Partial<ProjectItem>) {
    if (!active) return;
    const nextProjects = data.projectsDetailed.map((project) => (project.id === active.id ? { ...project, ...patch } : project));
    syncProjects(nextProjects);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px,1fr]">
      <aside className="rounded-2xl border border-admin-border bg-admin-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-admin-text">Projects</h3>
          <button onClick={addProject} className="rounded-lg bg-admin-primary px-2.5 py-1 text-xs font-semibold text-white">Add</button>
        </div>
        <div className="space-y-2">
          {data.projectsDetailed.map((project) => (
            <div key={project.id} className={`rounded-xl border p-2 ${activeId === project.id ? "border-admin-primary bg-admin-primary/10" : "border-admin-border"}`}>
              <button className="w-full text-left" onClick={() => setActiveId(project.id)}>
                <p className="truncate text-sm font-medium text-admin-text">{project.title || "Untitled Project"}</p>
                <p className="text-xs text-admin-text-muted">{project.category || "No category"}</p>
              </button>
              <button onClick={() => removeProject(project.id)} className="mt-2 text-xs font-semibold text-rose-600">Delete</button>
            </div>
          ))}
          {data.projectsDetailed.length === 0 ? <p className="text-xs text-admin-text-muted">No projects yet.</p> : null}
        </div>
      </aside>

      <section className="rounded-2xl border border-admin-border bg-admin-card p-5 shadow-sm">
        {!active ? (
          <p className="text-sm text-admin-text-muted">Select a project or add a new one.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2" value={active.title} onChange={(e) => updateActive({ title: e.target.value })} placeholder="Project title" />
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2" value={active.slug || ""} onChange={(e) => updateActive({ slug: e.target.value })} placeholder="Slug" />
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2" value={active.category} onChange={(e) => updateActive({ category: e.target.value })} placeholder="Category" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={active.shortDescription} onChange={(e) => updateActive({ shortDescription: e.target.value })} placeholder="Short description" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={active.overview || ""} onChange={(e) => updateActive({ overview: e.target.value })} placeholder="Overview" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={5} value={active.longDescription} onChange={(e) => updateActive({ longDescription: e.target.value })} placeholder="Long description" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={active.problem || ""} onChange={(e) => updateActive({ problem: e.target.value })} placeholder="Problem" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={active.solution || ""} onChange={(e) => updateActive({ solution: e.target.value })} placeholder="Solution" />
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2" value={active.myRole || ""} onChange={(e) => updateActive({ myRole: e.target.value })} placeholder="My role" />
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2" value={active.timeline || ""} onChange={(e) => updateActive({ timeline: e.target.value })} placeholder="Timeline / date" />
            <select
              aria-label="Project image from uploaded media"
              className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2"
              value={active.image}
              onChange={(e) => updateActive({ image: e.target.value })}
            >
              <option value="">Select image from public/projects</option>
              {imageOptions.map((url) => (
                <option key={url} value={url}>{url}</option>
              ))}
            </select>
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" value={active.image} onChange={(e) => updateActive({ image: e.target.value })} placeholder="Or paste custom image URL/path" />
            {active.image ? (
              <div className="md:col-span-2 overflow-hidden rounded-xl border border-admin-border bg-admin-bg p-3">
                <p className="mb-2 text-xs font-medium text-admin-text-muted">Preview</p>
                <img src={active.image} alt={active.title || "Project image"} className="h-44 w-full rounded-lg object-cover" loading="lazy" />
              </div>
            ) : null}
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2" value={active.liveDemoUrl} onChange={(e) => updateActive({ liveDemoUrl: e.target.value })} placeholder="Live demo URL" />
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2" value={active.githubUrl} onChange={(e) => updateActive({ githubUrl: e.target.value })} placeholder="GitHub URL" />
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" value={active.techStack.join(", ")} onChange={(e) => updateActive({ techStack: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Tech stack (comma separated)" />
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" value={(active.tags || []).join(", ")} onChange={(e) => updateActive({ tags: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Tags / filters (comma separated)" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={(active.responsibilities || []).join(", ")} onChange={(e) => updateActive({ responsibilities: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Responsibilities (comma separated)" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={(active.features || []).join(", ")} onChange={(e) => updateActive({ features: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Features (comma separated)" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={(active.screenshots || []).join(", ")} onChange={(e) => updateActive({ screenshots: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Screenshot URLs (comma separated)" />
            <input className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" value={active.architectureDiagram || ""} onChange={(e) => updateActive({ architectureDiagram: e.target.value })} placeholder="Architecture diagram URL" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={active.databaseSchema || ""} onChange={(e) => updateActive({ databaseSchema: e.target.value })} placeholder="Database schema" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={active.apiFlow || ""} onChange={(e) => updateActive({ apiFlow: e.target.value })} placeholder="API flow" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={active.folderStructure || ""} onChange={(e) => updateActive({ folderStructure: e.target.value })} placeholder="Folder structure" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={active.challenges || ""} onChange={(e) => updateActive({ challenges: e.target.value })} placeholder="Challenges" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={active.lessonsLearned || ""} onChange={(e) => updateActive({ lessonsLearned: e.target.value })} placeholder="Lessons learned" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2 md:col-span-2" rows={3} value={(active.futureImprovements || []).join(", ")} onChange={(e) => updateActive({ futureImprovements: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Future improvements (comma separated)" />
            <label className="inline-flex items-center gap-2 text-sm text-admin-text">
              <input type="checkbox" checked={active.featured} onChange={(e) => updateActive({ featured: e.target.checked })} /> Featured
            </label>
            <input type="number" className="rounded-xl border border-admin-border bg-admin-input text-admin-text px-3 py-2" value={active.order} onChange={(e) => updateActive({ order: Number(e.target.value || 0) })} placeholder="Order" />
            
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-4 flex w-full items-center justify-between rounded-lg border border-admin-border bg-admin-secondary px-4 py-3 text-left text-admin-text md:col-span-2"
            >
              <span className="font-semibold">Advanced Settings</span>
              <svg className={`h-5 w-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showAdvanced ? (
              <>
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={(active.responsibilities || []).join(", ")} onChange={(e) => updateActive({ responsibilities: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Responsibilities (comma separated)" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={(active.features || []).join(", ")} onChange={(e) => updateActive({ features: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Features (comma separated)" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={(active.screenshots || []).join(", ")} onChange={(e) => updateActive({ screenshots: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Screenshot URLs (comma separated)" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" value={active.architectureDiagram || ""} onChange={(e) => updateActive({ architectureDiagram: e.target.value })} placeholder="Architecture diagram URL" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.databaseSchema || ""} onChange={(e) => updateActive({ databaseSchema: e.target.value })} placeholder="Database schema" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.apiFlow || ""} onChange={(e) => updateActive({ apiFlow: e.target.value })} placeholder="API flow" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.folderStructure || ""} onChange={(e) => updateActive({ folderStructure: e.target.value })} placeholder="Folder structure" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.challenges || ""} onChange={(e) => updateActive({ challenges: e.target.value })} placeholder="Challenges" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.lessonsLearned || ""} onChange={(e) => updateActive({ lessonsLearned: e.target.value })} placeholder="Lessons learned" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={(active.futureImprovements || []).join(", ")} onChange={(e) => updateActive({ futureImprovements: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Future improvements (comma separated)" />
              </>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
