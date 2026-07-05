"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Copy, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import type { ProjectItem, SiteData } from "@/src/types/site-data";
import { CustomFieldsEditor } from "@/components/admin/CustomFieldsEditor";
import { JsonEditorPanel } from "@/components/admin/JsonEditorPanel";
import { slugify } from "@/lib/content-utils";

type Props = {
  data: SiteData;
  onChange: (next: SiteData) => void;
  publicBasePath?: string;
};

type TabKey = "visual" | "json";

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

function csv(value?: string[] | string) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

function toList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function joinList(value?: string[]) {
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : "";
}

function safeJsonStringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function ensureUniqueSlug(slug: string, index: number, seen: Map<string, number>) {
  const base = slugify(slug || "");
  if (!base) return "";
  const count = seen.get(base) || 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function normalizeProjectDraft(projects: ProjectItem[]) {
  const seen = new Map<string, number>();
  return projects.map((project, index) => {
    const title = String(project.title || "").trim();
    const baseSlug = String(project.slug || "").trim() || title;
    const slug = ensureUniqueSlug(baseSlug, index, seen) || `project-${index + 1}`;
    return {
      ...project,
      id: String(project.id || `project-${index + 1}`),
      title,
      slug,
      customFields: Array.isArray(project.customFields) ? project.customFields : [],
    };
  });
}

export function ProjectsEditor({ data, onChange, publicBasePath = "/projects" }: Props) {
  const [activeId, setActiveId] = useState<string>(data.projectsDetailed[0]?.id || "");
  const [tab, setTab] = useState<TabKey>("visual");
  const [githubImages, setGithubImages] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    basic: true,
    details: true,
    tech: true,
    responsibilities: true,
    links: true,
    media: true,
    seo: true,
    advanced: false,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const active = data.projectsDetailed.find((p) => p.id === activeId) || null;

  function syncProjects(nextProjects: ProjectItem[]) {
    const normalizedProjects = normalizeProjectDraft(nextProjects);
    onChange({
      ...data,
      projectsDetailed: normalizedProjects,
      projects: normalizedProjects.map((project) => ({
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
          setGithubImages((payload.data as Array<{ url: string }>).map((item) => item.url).filter(Boolean));
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

  function updateListField(key: keyof ProjectItem, next: string) {
    updateActive({ [key]: toList(next) } as Partial<ProjectItem>);
  }

  function updateStack(index: number, nextValue: string) {
    const next = [...(active?.techStack || [])];
    next[index] = nextValue;
    updateActive({ techStack: next.filter(Boolean) });
  }

  function addStackItem() {
    updateActive({ techStack: [...(active?.techStack || []), ""] });
  }

  function removeStackItem(index: number) {
    updateActive({ techStack: (active?.techStack || []).filter((_, i) => i !== index) });
  }

  function toggleGroup(key: string) {
    setOpenGroups((current) => ({ ...current, [key]: !current[key] }));
  }

  function regenerateSlug() {
    if (!active) return;
    const ok = window.confirm("Regenerate the slug from the current title? This will update the public URL.");
    if (!ok) return;
    updateActive({ slug: slugify(active.title || "") });
  }

  function openProjectPage() {
    if (!active?.slug || active.published === false) return;
    window.open(`${publicBasePath}/${active.slug}`, "_blank", "noopener,noreferrer");
  }

  function exportJson() {
    const blob = new Blob([safeJsonStringify(data.projectsDetailed)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "projects.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px,1fr]">
      <aside className="rounded-3xl border border-admin-border bg-admin-card p-4 shadow-sm lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-auto">
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
                <button type="button" onClick={() => moveProject(project.id, -1)} className="text-xs font-semibold text-admin-text-muted disabled:opacity-40" disabled={data.projectsDetailed[0]?.id === project.id}>Up</button>
                <button type="button" onClick={() => moveProject(project.id, 1)} className="text-xs font-semibold text-admin-text-muted disabled:opacity-40" disabled={data.projectsDetailed[data.projectsDetailed.length - 1]?.id === project.id}>Down</button>
                <button type="button" onClick={() => removeProject(project.id)} className="text-xs font-semibold text-rose-600">Delete</button>
              </div>
            </div>
          ))}
          {data.projectsDetailed.length === 0 ? <p className="text-xs text-admin-text-muted">No projects yet.</p> : null}
        </div>
      </aside>

      <section className="rounded-3xl border border-admin-border bg-admin-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setTab("visual")} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "visual" ? "bg-admin-primary text-white" : "border border-admin-border bg-admin-bg text-admin-text"}`}>Visual</button>
          <button type="button" onClick={() => setTab("json")} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "json" ? "bg-admin-primary text-white" : "border border-admin-border bg-admin-bg text-admin-text"}`}>JSON Editor</button>
        </div>

        {tab === "visual" ? (
          !active ? (
            <p className="text-sm text-admin-text-muted">Select a project or add a new one.</p>
          ) : (
            <div className="space-y-4">
              <section className="rounded-3xl border border-admin-border bg-admin-bg p-4">
                <button type="button" onClick={() => toggleGroup("basic")} className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <h4 className="text-sm font-semibold text-admin-text">Basic Information</h4>
                    <p className="mt-1 text-xs text-admin-text-muted">Core identity, visibility, and content summary.</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.basic ? "rotate-180" : ""}`} />
                </button>
                {openGroups.basic ? (
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.title} onChange={(e) => updateActive({ title: e.target.value, slug: active.slug || slugify(e.target.value) })} placeholder="Project title" />
                    <div className="space-y-2">
                      <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.slug || ""} onChange={(e) => updateActive({ slug: slugify(e.target.value) })} placeholder="Slug" />
                      <p className="text-xs text-admin-text-muted">Public page URL is generated from the slug.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:col-span-2">
                      <button type="button" onClick={openProjectPage} disabled={!active.slug || active.published === false} className="rounded-full border border-admin-border bg-white px-4 py-2 text-xs font-semibold text-admin-text disabled:opacity-50">
                        Open Project Page
                      </button>
                      <button type="button" onClick={regenerateSlug} className="rounded-full border border-admin-border bg-admin-bg px-4 py-2 text-xs font-semibold text-admin-text">
                        Regenerate Slug
                      </button>
                    </div>
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.subtitle || ""} onChange={(e) => updateActive({ subtitle: e.target.value })} placeholder="Subtitle" />
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.featuredBadge || ""} onChange={(e) => updateActive({ featuredBadge: e.target.value })} placeholder="Featured badge" />
                    <select className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.status || "Planning"} onChange={(e) => updateActive({ status: e.target.value })}>{["Upcoming", "Planning", "In Progress", "Completed", "Archived"].map((value) => <option key={value}>{value}</option>)}</select>
                    <select className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.projectType || "Personal"} onChange={(e) => updateActive({ projectType: e.target.value })}>{["Personal", "Client", "Internship", "Open Source"].map((value) => <option key={value}>{value}</option>)}</select>
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.category} onChange={(e) => updateActive({ category: e.target.value })} placeholder="Category" />
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={(active.tags || []).join(", ")} onChange={(e) => updateActive({ tags: toList(e.target.value) })} placeholder="Tags" />
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={active.shortDescription} onChange={(e) => updateActive({ shortDescription: e.target.value })} placeholder="Short description" />
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={5} value={active.fullDescription || active.longDescription} onChange={(e) => updateActive({ fullDescription: e.target.value, longDescription: e.target.value })} placeholder="Full description / markdown" />
                    <div className="flex flex-wrap gap-4 md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={active.featured} onChange={(e) => updateActive({ featured: e.target.checked })} /> Featured</label>
                      <label className="inline-flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={active.published !== false} onChange={(e) => updateActive({ published: e.target.checked, draft: !e.target.checked })} /> Published</label>
                      <label className="inline-flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={Boolean((active as any).confidentialProject)} onChange={(e) => updateActive({ confidentialProject: e.target.checked } as Partial<ProjectItem>) } /> Confidential project</label>
                    </div>
                    <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 md:col-span-2">Confidential projects hide GitHub, documentation, and sensitive media on the public site.</p>
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-admin-border bg-admin-bg p-4">
                <button type="button" onClick={() => toggleGroup("details")} className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <h4 className="text-sm font-semibold text-admin-text">Project Details</h4>
                    <p className="mt-1 text-xs text-admin-text-muted">Role, company, team size, and timeline context.</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.details ? "rotate-180" : ""}`} />
                </button>
                {openGroups.details ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.company || ""} onChange={(e) => updateActive({ company: e.target.value })} placeholder="Company / organization" />
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.myRole || ""} onChange={(e) => updateActive({ myRole: e.target.value })} placeholder="My role" />
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.teamSize || ""} onChange={(e) => updateActive({ teamSize: e.target.value })} placeholder="Team size" />
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.duration || ""} onChange={(e) => updateActive({ duration: e.target.value })} placeholder="Duration" />
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.startDate || ""} onChange={(e) => updateActive({ startDate: e.target.value })} placeholder="Start date" />
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.endDate || ""} onChange={(e) => updateActive({ endDate: e.target.value })} placeholder="End date" />
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-admin-border bg-admin-bg p-4">
                <button type="button" onClick={() => toggleGroup("tech")} className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <h4 className="text-sm font-semibold text-admin-text">Technology</h4>
                    <p className="mt-1 text-xs text-admin-text-muted">Stack, platforms, and services used to build the project.</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.tech ? "rotate-180" : ""}`} />
                </button>
                {openGroups.tech ? (
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Tech stack</p>
                        <button type="button" onClick={addStackItem} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-admin-bg px-3 py-1.5 text-xs font-semibold text-admin-text">
                          <Plus className="h-3.5 w-3.5" /> Add tag
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 rounded-2xl border border-admin-border bg-admin-input px-3 py-3">
                        {(active.techStack || []).length ? active.techStack.map((stack, index) => (
                          <div key={`${stack}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-1.5 text-sm text-admin-text">
                            <input
                              value={stack}
                              onChange={(e) => updateStack(index, e.target.value)}
                              placeholder="Technology"
                              className="min-w-24 bg-transparent outline-none"
                            />
                            <button type="button" onClick={() => removeStackItem(index)} aria-label="Remove tech tag" className="text-admin-text-muted hover:text-admin-text">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )) : <p className="text-sm text-admin-text-muted">Add technologies as chips. Example: React, Node.js, PostgreSQL.</p>}
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.frontend || ""} onChange={(e) => updateActive({ frontend: e.target.value })} placeholder="Frontend" />
                      <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.backend || ""} onChange={(e) => updateActive({ backend: e.target.value })} placeholder="Backend" />
                      <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.database || active.databaseSchema || ""} onChange={(e) => updateActive({ database: e.target.value, databaseSchema: e.target.value })} placeholder="Database" />
                      <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.hosting || ""} onChange={(e) => updateActive({ hosting: e.target.value })} placeholder="Cloud / hosting" />
                      <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" value={active.apisIntegrations || active.apiFlow || ""} onChange={(e) => updateActive({ apisIntegrations: e.target.value, apiFlow: e.target.value })} placeholder="APIs & integrations" />
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-admin-border bg-admin-bg p-4">
                <button type="button" onClick={() => toggleGroup("responsibilities")} className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <h4 className="text-sm font-semibold text-admin-text">Responsibilities</h4>
                    <p className="mt-1 text-xs text-admin-text-muted">Repeatable lists for features, responsibilities, skills, and roadmap items.</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.responsibilities ? "rotate-180" : ""}`} />
                </button>
                {openGroups.responsibilities ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {renderListInput(active.keyFeatures, "keyFeatures", "Key features")}
                    {renderListInput(active.keyResponsibilities, "keyResponsibilities", "Key responsibilities")}
                    {renderListInput(active.skillsApplied, "skillsApplied", "Skills applied")}
                    {renderListInput(active.futureRoadmap, "futureRoadmap", "Future roadmap")}
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={2} value={active.challengesFaced || active.challenges || ""} onChange={(e) => updateActive({ challengesFaced: e.target.value, challenges: e.target.value })} placeholder="Challenges faced" />
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={2} value={active.learnings || active.lessonsLearned || ""} onChange={(e) => updateActive({ learnings: e.target.value, lessonsLearned: e.target.value })} placeholder="Learnings" />
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-admin-border bg-admin-bg p-4">
                <button type="button" onClick={() => toggleGroup("links")} className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <h4 className="text-sm font-semibold text-admin-text">Links</h4>
                    <p className="mt-1 text-xs text-admin-text-muted">Helper labels keep empty links hidden on the public site.</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.links ? "rotate-180" : ""}`} />
                </button>
                {openGroups.links ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.liveDemoUrl} onChange={(e) => updateActive({ liveDemoUrl: e.target.value })} placeholder="Live project URL" />
                      <p className="mt-1 text-xs text-admin-text-muted">{active.liveDemoUrl ? "Shows as View Live Project" : "Shows a confidentiality message instead of a button."}</p>
                    </div>
                    <div>
                      <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.githubUrl} onChange={(e) => updateActive({ githubUrl: e.target.value })} placeholder="GitHub URL" />
                      <p className="mt-1 text-xs text-admin-text-muted">{active.githubUrl ? "Visible unless project is confidential." : "Hidden on public project pages."}</p>
                    </div>
                    <div>
                      <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.backendRepo || ""} onChange={(e) => updateActive({ backendRepo: e.target.value })} placeholder="Backend repository URL" />
                      <p className="mt-1 text-xs text-admin-text-muted">Optional backend code link.</p>
                    </div>
                    <div>
                      <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.apiDocumentationUrl || active.documentationUrl || ""} onChange={(e) => updateActive({ apiDocumentationUrl: e.target.value, documentationUrl: e.target.value })} placeholder="Documentation URL" />
                      <p className="mt-1 text-xs text-admin-text-muted">Optional docs or case study reference.</p>
                    </div>
                    <div>
                      <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.figmaUrl || ""} onChange={(e) => updateActive({ figmaUrl: e.target.value })} placeholder="Figma design URL" />
                      <p className="mt-1 text-xs text-admin-text-muted">Optional design handoff link.</p>
                    </div>
                    <div>
                      <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.caseStudyUrl || ""} onChange={(e) => updateActive({ caseStudyUrl: e.target.value })} placeholder="Case study URL" />
                      <p className="mt-1 text-xs text-admin-text-muted">Optional public case study or article.</p>
                    </div>
                    <div>
                      <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.demoVideoUrl || ""} onChange={(e) => updateActive({ demoVideoUrl: e.target.value })} placeholder="Demo video URL" />
                      <p className="mt-1 text-xs text-admin-text-muted">Optional video walkthrough.</p>
                    </div>
                    <div>
                      <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.confidentialNote || ""} onChange={(e) => updateActive({ confidentialNote: e.target.value })} placeholder="Confidential fallback label" />
                      <p className="mt-1 text-xs text-admin-text-muted">Shown only when live URL is withheld.</p>
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-admin-border bg-admin-bg p-4">
                <button type="button" onClick={() => toggleGroup("media")} className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <h4 className="text-sm font-semibold text-admin-text">Media</h4>
                    <p className="mt-1 text-xs text-admin-text-muted">Preview and manage the project visual assets.</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.media ? "rotate-180" : ""}`} />
                </button>
                {openGroups.media ? (
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Thumbnail / cover</label>
                        <select aria-label="Project image from uploaded media" className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.image} onChange={(e) => updateActive({ image: e.target.value })}>
                          <option value="">Select image from public/projects</option>
                          {imageOptions.map((url) => <option key={url} value={url}>{url}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Custom image URL</label>
                        <input className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.image} onChange={(e) => updateActive({ image: e.target.value })} placeholder="Or paste custom image URL/path" />
                      </div>
                    </div>
                    {active.image ? (
                      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-bg">
                        <div className="flex items-center gap-2 border-b border-admin-border px-4 py-3">
                          <ImageIcon className="h-4 w-4 text-admin-text-muted" />
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Image preview</p>
                        </div>
                        <img src={active.image} alt={active.title || "Project image"} className="h-56 w-full object-cover" loading="lazy" />
                      </div>
                    ) : null}
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={joinList(active.galleryImages)} onChange={(e) => updateListField("galleryImages", e.target.value)} placeholder="Gallery images (comma separated URLs)" />
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={3} value={joinList(active.uiScreenshots)} onChange={(e) => updateListField("uiScreenshots", e.target.value)} placeholder="UI screenshots (comma separated URLs)" />
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-admin-border bg-admin-bg p-4">
                <button type="button" onClick={() => toggleGroup("seo")} className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <h4 className="text-sm font-semibold text-admin-text">SEO</h4>
                    <p className="mt-1 text-xs text-admin-text-muted">Search and social metadata for the dedicated project page.</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.seo ? "rotate-180" : ""}`} />
                </button>
                {openGroups.seo ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={(active as any).seoTitle || ""} onChange={(e) => updateActive({ ...(active as any), seoTitle: e.target.value } as Partial<ProjectItem>)} placeholder="SEO title" />
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={active.slug || ""} onChange={(e) => updateActive({ slug: slugify(e.target.value) })} placeholder="Slug" />
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={2} value={(active as any).seoDescription || ""} onChange={(e) => updateActive({ ...(active as any), seoDescription: e.target.value } as Partial<ProjectItem>)} placeholder="SEO description" />
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-admin-border bg-admin-bg p-4">
                <button type="button" onClick={() => toggleGroup("advanced")} className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <h4 className="text-sm font-semibold text-admin-text">Advanced Settings</h4>
                    <p className="mt-1 text-xs text-admin-text-muted">Legacy fields and deep case-study structure.</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.advanced ? "rotate-180" : ""}`} />
                </button>
                {openGroups.advanced ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
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
                  </div>
                ) : null}
              </section>

              <CustomFieldsEditor
                value={Array.isArray(active.customFields) ? active.customFields : []}
                onChange={(next) => updateActive({ customFields: next })}
              />

              <div className="rounded-3xl border border-dashed border-admin-border p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Live Preview</p>
                <h3 className="mt-2 text-lg font-semibold text-admin-text">{active.title || "Untitled Project"}</h3>
                <p className="text-sm text-admin-text-muted">{active.subtitle || active.shortDescription || "Add a subtitle or short description to preview."}</p>
                {Boolean((active as any).confidentialProject || (active as any).confidential || (active as any).isConfidential) ? (
                  <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                    Some project details are withheld due to confidentiality agreements.
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {active.featuredBadge ? <span className="rounded-full bg-admin-primary/10 px-3 py-1 text-xs font-semibold text-admin-primary">{active.featuredBadge}</span> : null}
                  {active.status ? <span className="rounded-full border border-admin-border px-3 py-1 text-xs text-admin-text-muted">{active.status}</span> : null}
                  {active.projectType ? <span className="rounded-full border border-admin-border px-3 py-1 text-xs text-admin-text-muted">{active.projectType}</span> : null}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <JsonEditorPanel
              value={data.projectsDetailed}
              onApply={(next) => syncProjects(next as ProjectItem[])}
              collectionType="project"
              collectionItemRequiredPaths={["title"]}
              title="Projects JSON"
              description="Advanced admin-only editing with validation, import/export, and safe saving."
            />
          </div>
        )}
      </section>
    </div>
  );
}
