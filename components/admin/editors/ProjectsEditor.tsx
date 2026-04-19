"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectItem, SiteData } from "@/src/types/site-data";

type Props = {
  data: SiteData;
  onChange: (next: SiteData) => void;
};

const emptyProject: ProjectItem = {
  id: "",
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
};

export function ProjectsEditor({ data, onChange }: Props) {
  const [activeId, setActiveId] = useState<string>(data.projectsDetailed[0]?.id || "");
  const [githubImages, setGithubImages] = useState<string[]>([]);
  const active = data.projectsDetailed.find((p) => p.id === activeId) || null;

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
    const next = { ...emptyProject, id, order: data.projectsDetailed.length + 1 };
    onChange({ ...data, projectsDetailed: [...data.projectsDetailed, next] });
    setActiveId(id);
  }

  function removeProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const nextList = data.projectsDetailed.filter((p) => p.id !== id);
    onChange({ ...data, projectsDetailed: nextList });
    setActiveId(nextList[0]?.id || "");
  }

  function updateActive(patch: Partial<ProjectItem>) {
    if (!active) return;
    onChange({
      ...data,
      projectsDetailed: data.projectsDetailed.map((p) => (p.id === active.id ? { ...p, ...patch } : p)),
      projects: data.projectsDetailed.map((p) => ({
        title: p.id === active.id ? patch.title ?? p.title : p.title,
        description: p.id === active.id ? patch.shortDescription ?? p.shortDescription : p.shortDescription,
        image: p.id === active.id ? patch.image ?? p.image : p.image,
        tech: p.id === active.id ? patch.techStack ?? p.techStack : p.techStack,
        liveUrl: p.id === active.id ? patch.liveDemoUrl ?? p.liveDemoUrl : p.liveDemoUrl,
        githubUrl: p.id === active.id ? patch.githubUrl ?? p.githubUrl : p.githubUrl
      }))
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px,1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Projects</h3>
          <button onClick={addProject} className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">Add</button>
        </div>
        <div className="space-y-2">
          {data.projectsDetailed.map((project) => (
            <div key={project.id} className={`rounded-xl border p-2 ${activeId === project.id ? "border-blue-300 bg-blue-50" : "border-slate-200"}`}>
              <button className="w-full text-left" onClick={() => setActiveId(project.id)}>
                <p className="truncate text-sm font-medium text-slate-900">{project.title || "Untitled Project"}</p>
                <p className="text-xs text-slate-500">{project.category || "No category"}</p>
              </button>
              <button onClick={() => removeProject(project.id)} className="mt-2 text-xs font-semibold text-rose-600">Delete</button>
            </div>
          ))}
          {data.projectsDetailed.length === 0 ? <p className="text-xs text-slate-500">No projects yet.</p> : null}
        </div>
      </aside>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {!active ? (
          <p className="text-sm text-slate-600">Select a project or add a new one.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input className="rounded-xl border border-slate-300 px-3 py-2" value={active.title} onChange={(e) => updateActive({ title: e.target.value })} placeholder="Project title" />
            <input className="rounded-xl border border-slate-300 px-3 py-2" value={active.category} onChange={(e) => updateActive({ category: e.target.value })} placeholder="Category" />
            <textarea className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" rows={3} value={active.shortDescription} onChange={(e) => updateActive({ shortDescription: e.target.value })} placeholder="Short description" />
            <textarea className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" rows={5} value={active.longDescription} onChange={(e) => updateActive({ longDescription: e.target.value })} placeholder="Long description" />
            <select
              aria-label="Project image from uploaded media"
              className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2"
              value={active.image}
              onChange={(e) => updateActive({ image: e.target.value })}
            >
              <option value="">Select image from public/projects</option>
              {imageOptions.map((url) => (
                <option key={url} value={url}>{url}</option>
              ))}
            </select>
            <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" value={active.image} onChange={(e) => updateActive({ image: e.target.value })} placeholder="Or paste custom image URL/path" />
            {active.image ? (
              <div className="md:col-span-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-medium text-slate-600">Preview</p>
                <img src={active.image} alt={active.title || "Project image"} className="h-44 w-full rounded-lg object-cover" loading="lazy" />
              </div>
            ) : null}
            <input className="rounded-xl border border-slate-300 px-3 py-2" value={active.liveDemoUrl} onChange={(e) => updateActive({ liveDemoUrl: e.target.value })} placeholder="Live demo URL" />
            <input className="rounded-xl border border-slate-300 px-3 py-2" value={active.githubUrl} onChange={(e) => updateActive({ githubUrl: e.target.value })} placeholder="GitHub URL" />
            <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" value={active.techStack.join(", ")} onChange={(e) => updateActive({ techStack: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} placeholder="Tech stack (comma separated)" />
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={active.featured} onChange={(e) => updateActive({ featured: e.target.checked })} /> Featured
            </label>
            <input type="number" className="rounded-xl border border-slate-300 px-3 py-2" value={active.order} onChange={(e) => updateActive({ order: Number(e.target.value || 0) })} placeholder="Order" />
          </div>
        )}
      </section>
    </div>
  );
}
