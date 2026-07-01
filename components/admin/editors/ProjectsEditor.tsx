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
  isEnabled: true,
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
  status: "Planning",
  projectType: "Personal",
  published: false,
};

const GROUPS = [
  "General",
  "Problem & Solution",
  "Features",
  "Tech",
  "Media",
  "Links",
  "Timeline",
  "SEO",
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function csv(value?: string[] | string) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

function toList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

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
        isEnabled: project.isEnabled,
      })),
    });
  }

  function moveProject(id: string, direction: -1 | 1) {
    const index = data.projectsDetailed.findIndex((project) => project.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= data.projectsDetailed.length) return;

    const nextProjects = [...data.projectsDetailed];
    const [moved] = nextProjects.splice(index, 1);
    nextProjects.splice(nextIndex, 0, moved);
    const normalized = nextProjects.map((project, idx) => ({
      ...project,
      order: idx + 1,
    }));
    syncProjects(normalized);
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

  function duplicateProject(project: ProjectItem) {
    const id = `project-${Date.now()}`;
    const copy = {
      ...project,
      id,
      slug: project.slug ? `${project.slug}-copy` : "",
      title: `${project.title} Copy`,
      order: data.projectsDetailed.length + 1,
      published: false,
      draft: true,
    };
    syncProjects([...data.projectsDetailed, copy]);
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

  function renderListInput(value: string[] | undefined, patchKey: keyof ProjectItem, placeholder: string) {
    return (
      <textarea
        className="min-h-24 rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2"
        value={csv(value)}
        onChange={(e) => updateActive({ [patchKey]: toList(e.target.value) } as Partial<ProjectItem>)}
        placeholder={placeholder}
      />
    );
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
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveProject(project.id, -1)}
                  className="text-xs font-semibold text-admin-text-muted disabled:opacity-40"
                  disabled={data.projectsDetailed[0]?.id === project.id}
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveProject(project.id, 1)}
                  className="text-xs font-semibold text-admin-text-muted disabled:opacity-40"
                  disabled={data.projectsDetailed[data.projectsDetailed.length - 1]?.id === project.id}
                >
                  Down
                </button>
                <button type="button" onClick={() => removeProject(project.id)} className="text-xs font-semibold text-rose-600">
                  Delete
                </button>
              </div>
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
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.title} onChange={(e) => updateActive({ title: e.target.value, slug: active.slug || slugify(e.target.value) })} placeholder="Project title" />
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.slug || ""} onChange={(e) => updateActive({ slug: slugify(e.target.value) })} placeholder="Slug" />
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.subtitle || ""} onChange={(e) => updateActive({ subtitle: e.target.value })} placeholder="Subtitle" />
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.featuredBadge || ""} onChange={(e) => updateActive({ featuredBadge: e.target.value })} placeholder="Featured badge" />
            <select className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.status || "Planning"} onChange={(e) => updateActive({ status: e.target.value })}>
              {["Upcoming", "Planning", "In Progress", "Completed", "Archived"].map((value) => <option key={value}>{value}</option>)}
            </select>
            <select className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.projectType || "Personal"} onChange={(e) => updateActive({ projectType: e.target.value })}>
              {["Personal", "Client", "Internship", "Open Source"].map((value) => <option key={value}>{value}</option>)}
            </select>
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.category} onChange={(e) => updateActive({ category: e.target.value })} placeholder="Category" />
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={(active.tags || []).join(", ")} onChange={(e) => updateActive({ tags: toList(e.target.value) })} placeholder="Tags" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.shortDescription} onChange={(e) => updateActive({ shortDescription: e.target.value })} placeholder="Short description" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={5} value={active.fullDescription || active.longDescription} onChange={(e) => updateActive({ fullDescription: e.target.value, longDescription: e.target.value })} placeholder="Full description / markdown" />
            <label className="inline-flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={active.featured} onChange={(e) => updateActive({ featured: e.target.checked })} /> Featured</label>
            <label className="inline-flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={active.published !== false} onChange={(e) => updateActive({ published: e.target.checked, draft: !e.target.checked })} /> Published</label>
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.myRole || ""} onChange={(e) => updateActive({ myRole: e.target.value })} placeholder="My role" />
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.timeline || ""} onChange={(e) => updateActive({ timeline: e.target.value })} placeholder="Timeline / date" />

            <button type="button" onClick={() => duplicateProject(active)} className="rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm font-semibold text-admin-text">Duplicate Project</button>
            <button type="button" onClick={() => updateActive({ slug: slugify(active.title) })} className="rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm font-semibold text-admin-text">Regenerate Slug</button>

            <select
              aria-label="Project image from uploaded media"
              className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2"
              value={active.image}
              onChange={(e) => updateActive({ image: e.target.value })}
            >
              <option value="">Select image from public/projects</option>
              {imageOptions.map((url) => (
                <option key={url} value={url}>{url}</option>
              ))}
            </select>
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" value={active.image} onChange={(e) => updateActive({ image: e.target.value })} placeholder="Or paste custom image URL/path" />
            {active.image ? (
              <div className="md:col-span-2 overflow-hidden rounded-xl border border-admin-border bg-admin-bg p-3">
                <p className="mb-2 text-xs font-medium text-admin-text-muted">Preview</p>
                <img src={active.image} alt={active.title || "Project image"} className="h-44 w-full rounded-lg object-cover" loading="lazy" />
              </div>
            ) : null}
            <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" value={active.liveDemoUrl} onChange={(e) => updateActive({ liveDemoUrl: e.target.value })} placeholder="Live demo URL" />
            <div className="grid gap-2 md:col-span-2 md:grid-cols-2">
              <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.githubUrl} onChange={(e) => updateActive({ githubUrl: e.target.value })} placeholder="GitHub URL" />
              <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.backendRepo || ""} onChange={(e) => updateActive({ backendRepo: e.target.value })} placeholder="Backend repository URL" />
              <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.apiDocumentationUrl || active.documentationUrl || ""} onChange={(e) => updateActive({ apiDocumentationUrl: e.target.value, documentationUrl: e.target.value })} placeholder="API documentation URL" />
              <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.figmaUrl || ""} onChange={(e) => updateActive({ figmaUrl: e.target.value })} placeholder="Figma design URL" />
              <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.caseStudyUrl || ""} onChange={(e) => updateActive({ caseStudyUrl: e.target.value })} placeholder="Case study URL" />
              <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.demoVideoUrl || ""} onChange={(e) => updateActive({ demoVideoUrl: e.target.value })} placeholder="Demo video URL" />
            </div>
            <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={(active.galleryImages || []).join(", ")} onChange={(e) => updateActive({ galleryImages: toList(e.target.value) })} placeholder="Gallery images (comma separated URLs)" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={(active.uiScreenshots || []).join(", ")} onChange={(e) => updateActive({ uiScreenshots: toList(e.target.value) })} placeholder="UI screenshots (comma separated URLs)" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={(active.techStack || []).join(", ")} onChange={(e) => updateActive({ techStack: toList(e.target.value) })} placeholder="Tech stack (comma separated)" />
            <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={2} value={(active.techBadges || []).join(", ")} onChange={(e) => updateActive({ techBadges: toList(e.target.value) })} placeholder="Tech badges (comma separated)" />

            <section className="md:col-span-2 space-y-2 rounded-2xl border border-admin-border p-3">
              <h4 className="text-sm font-semibold text-admin-text">Problem &amp; Solution</h4>
              <textarea className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" rows={3} value={active.problemStatement || active.problem || ""} onChange={(e) => updateActive({ problemStatement: e.target.value, problem: e.target.value })} placeholder="Problem statement" />
              <textarea className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" rows={3} value={active.solution || ""} onChange={(e) => updateActive({ solution: e.target.value })} placeholder="Solution" />
              <textarea className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" rows={2} value={active.targetUsers || ""} onChange={(e) => updateActive({ targetUsers: e.target.value })} placeholder="Target users" />
              <textarea className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" rows={2} value={active.businessValue || ""} onChange={(e) => updateActive({ businessValue: e.target.value })} placeholder="Business value" />
              <textarea className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" rows={2} value={active.impact || ""} onChange={(e) => updateActive({ impact: e.target.value })} placeholder="Impact" />
            </section>

            <section className="md:col-span-2 space-y-2 rounded-2xl border border-admin-border p-3">
              <h4 className="text-sm font-semibold text-admin-text">Features</h4>
              {renderListInput(active.keyFeatures, "keyFeatures", "Key features")}
              {renderListInput(active.coreModules, "coreModules", "Core modules")}
              {renderListInput(active.futureRoadmap, "futureRoadmap", "Future roadmap")}
              <textarea className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" rows={2} value={active.challengesFaced || active.challenges || ""} onChange={(e) => updateActive({ challengesFaced: e.target.value, challenges: e.target.value })} placeholder="Challenges faced" />
              <textarea className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" rows={2} value={active.learnings || active.lessonsLearned || ""} onChange={(e) => updateActive({ learnings: e.target.value, lessonsLearned: e.target.value })} placeholder="Learnings" />
            </section>

            <section className="md:col-span-2 space-y-2 rounded-2xl border border-admin-border p-3">
              <h4 className="text-sm font-semibold text-admin-text">Tech</h4>
              <div className="grid gap-2 md:grid-cols-2">
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.frontend || ""} onChange={(e) => updateActive({ frontend: e.target.value })} placeholder="Frontend" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.backend || ""} onChange={(e) => updateActive({ backend: e.target.value })} placeholder="Backend" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.database || active.databaseSchema || ""} onChange={(e) => updateActive({ database: e.target.value, databaseSchema: e.target.value })} placeholder="Database" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.authentication || ""} onChange={(e) => updateActive({ authentication: e.target.value })} placeholder="Authentication" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.hosting || ""} onChange={(e) => updateActive({ hosting: e.target.value })} placeholder="Hosting" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.apisIntegrations || active.apiFlow || ""} onChange={(e) => updateActive({ apisIntegrations: e.target.value, apiFlow: e.target.value })} placeholder="APIs & integrations" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.aiMlUsed || ""} onChange={(e) => updateActive({ aiMlUsed: e.target.value })} placeholder="AI/ML used" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" rows={2} value={active.architectureNotes || active.folderStructure || ""} onChange={(e) => updateActive({ architectureNotes: e.target.value, folderStructure: e.target.value })} placeholder="Architecture notes" />
              </div>
            </section>

            <section className="md:col-span-2 space-y-2 rounded-2xl border border-admin-border p-3">
              <h4 className="text-sm font-semibold text-admin-text">Timeline</h4>
              <div className="grid gap-2 md:grid-cols-2">
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.startDate || ""} onChange={(e) => updateActive({ startDate: e.target.value })} placeholder="Start date" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.endDate || ""} onChange={(e) => updateActive({ endDate: e.target.value })} placeholder="Completion date" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.duration || ""} onChange={(e) => updateActive({ duration: e.target.value })} placeholder="Duration" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.teamSize || ""} onChange={(e) => updateActive({ teamSize: e.target.value })} placeholder="Team size" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.myRole || ""} onChange={(e) => updateActive({ myRole: e.target.value })} placeholder="My role" />
                <input type="number" min={0} max={100} className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={Number((active as any).currentProgress || 0)} onChange={(e) => updateActive({ ...(active as any), currentProgress: Number(e.target.value || 0) } as Partial<ProjectItem>)} placeholder="Current progress %" />
              </div>
            </section>

            <section className="md:col-span-2 space-y-2 rounded-2xl border border-admin-border p-3">
              <h4 className="text-sm font-semibold text-admin-text">SEO</h4>
              <div className="grid gap-2 md:grid-cols-2">
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.slug || ""} onChange={(e) => updateActive({ slug: slugify(e.target.value) })} placeholder="Slug" />
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={(active as any).seoTitle || ""} onChange={(e) => updateActive({ ...(active as any), seoTitle: e.target.value } as Partial<ProjectItem>)} placeholder="SEO title" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={2} value={(active as any).seoDescription || ""} onChange={(e) => updateActive({ ...(active as any), seoDescription: e.target.value } as Partial<ProjectItem>)} placeholder="SEO description" />
              </div>
            </section>

            <input type="number" className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.order} onChange={(e) => updateActive({ order: Number(e.target.value || 0) })} placeholder="Order" />
            <label className="inline-flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={active.isEnabled !== false} onChange={(e) => updateActive({ isEnabled: e.target.checked })} /> Enabled</label>
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
                {renderListInput(active.responsibilities, "responsibilities", "Responsibilities")}
                {renderListInput(active.features, "features", "Features")}
                {renderListInput(active.screenshots, "screenshots", "Screenshot URLs")}
                <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" value={active.architectureDiagram || ""} onChange={(e) => updateActive({ architectureDiagram: e.target.value })} placeholder="Architecture diagram URL" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.databaseSchema || ""} onChange={(e) => updateActive({ databaseSchema: e.target.value })} placeholder="Database schema" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.apiFlow || ""} onChange={(e) => updateActive({ apiFlow: e.target.value })} placeholder="API flow" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.folderStructure || ""} onChange={(e) => updateActive({ folderStructure: e.target.value })} placeholder="Folder structure" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.challenges || ""} onChange={(e) => updateActive({ challenges: e.target.value })} placeholder="Challenges" />
                <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.lessonsLearned || ""} onChange={(e) => updateActive({ lessonsLearned: e.target.value })} placeholder="Lessons learned" />
                {renderListInput(active.futureImprovements, "futureImprovements", "Future improvements")}
              </>
            ) : null}
            <div className="md:col-span-2 rounded-2xl border border-dashed border-admin-border p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Live Preview</p>
              <h3 className="mt-2 text-lg font-semibold text-admin-text">{active.title || "Untitled Project"}</h3>
              <p className="text-sm text-admin-text-muted">{active.subtitle || active.shortDescription || "Add a subtitle or short description to preview."}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.featuredBadge ? <span className="rounded-full bg-admin-primary/10 px-3 py-1 text-xs font-semibold text-admin-primary">{active.featuredBadge}</span> : null}
                {active.status ? <span className="rounded-full border border-admin-border px-3 py-1 text-xs text-admin-text-muted">{active.status}</span> : null}
                {active.projectType ? <span className="rounded-full border border-admin-border px-3 py-1 text-xs text-admin-text-muted">{active.projectType}</span> : null}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
