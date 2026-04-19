"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { SectionCard } from "@/components/admin/SectionCard";
import { ProfileEditor } from "@/components/admin/editors/ProfileEditor";
import { ProjectsEditor } from "@/components/admin/editors/ProjectsEditor";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { WebsiteControlEditor } from "@/components/admin/editors/WebsiteControlEditor";
import { EmptyState } from "@/components/admin/EmptyState";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorState } from "@/components/admin/ErrorState";
import { useToast } from "@/components/admin/ToastProvider";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import type { GitHubProject, SiteData } from "@/src/types/site-data";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "profile", label: "Profile + Contact" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "services", label: "Services" },
  { key: "testimonials", label: "Testimonials" },
  { key: "journey", label: "Journey + Reviews" },
  { key: "settings", label: "SEO + Footer + Nav" },
  { key: "control", label: "Website Control" },
  { key: "github", label: "GitHub Projects" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const MANDATORY_PORTFOLIO_PROJECT: GitHubProject = {
  id: "portfolio-main",
  name: "Portfolio (Main)",
  owner: "idcare19",
  repo: "portfolio",
  branch: "main",
  contentPath: "src/data/siteData.json",
};

function ensureProjectList(data: SiteData): GitHubProject[] {
  const existing = Array.isArray(data.githubProjects) ? data.githubProjects : [];

  const hasMandatoryProject = existing.some(
    (project) =>
      project.id === MANDATORY_PORTFOLIO_PROJECT.id ||
      (project.owner === MANDATORY_PORTFOLIO_PROJECT.owner && project.repo === MANDATORY_PORTFOLIO_PROJECT.repo)
  );

  if (!hasMandatoryProject) {
    return [MANDATORY_PORTFOLIO_PROJECT, ...existing];
  }

  return existing;
}

export default function AdminDashboardPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save, switchProject, activeProjectId, setActiveProjectId } = useSiteDataEditor();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [githubToken, setGithubToken] = useState("");
  const [switchingProject, setSwitchingProject] = useState(false);
  const [pendingProjectId, setPendingProjectId] = useState("");

  const githubProjects = useMemo(() => (data ? ensureProjectList(data) : []), [data]);
  const selectedProject = useMemo(
    () => githubProjects.find((project) => project.id === (activeProjectId || data?.activeGithubProjectId)) || githubProjects[0],
    [githubProjects, activeProjectId, data?.activeGithubProjectId]
  );

  useEffect(() => {
    if (selectedProject?.id) {
      setPendingProjectId(selectedProject.id);
    }
  }, [selectedProject?.id]);

  function patch(next: SiteData) {
    setData(next);
  }

  async function handleSaveAll() {
    if (!data) return;

    const selected = selectedProject;
    const githubConfig = selected
      ? {
          token: githubToken || undefined,
          owner: selected.owner,
          repo: selected.repo,
          branch: selected.branch,
          contentPath: selected.contentPath,
        }
      : undefined;

    const result = await save(
      {
        ...data,
        githubProjects,
        activeGithubProjectId: selected?.id,
      },
      "chore: update website content from unified admin control center",
      githubConfig
    );

    if (result.ok) notify("success", "All changes saved successfully");
    else notify("error", result.error || "Save failed");
  }

  async function handleSwitchProject(nextProjectId: string) {
    if (!nextProjectId) return;
    setSwitchingProject(true);
    try {
      const result = await switchProject(nextProjectId, githubToken || undefined);
      if (!result.ok) {
        notify("error", result.error || "Failed to switch project");
        return;
      }

      setActiveProjectId(nextProjectId);
      notify("success", "Switched active GitHub project and synced content");
    } finally {
      setSwitchingProject(false);
    }
  }

  function updateProjectConfig(index: number, patchProject: Partial<GitHubProject>) {
    if (!data) return;
    const nextProjects = githubProjects.map((project, i) => (i === index ? { ...project, ...patchProject } : project));
    patch({ ...data, githubProjects: nextProjects });
  }

  function addProjectConfig() {
    if (!data) return;
    const newProject: GitHubProject = {
      id: `project-${Date.now()}`,
      name: "New Project",
      owner: "",
      repo: "",
      branch: "main",
      contentPath: "src/data/siteData.json",
    };

    patch({
      ...data,
      githubProjects: [...githubProjects, newProject],
      activeGithubProjectId: newProject.id,
    });
    setActiveProjectId(newProject.id);
    setActiveTab("github");
  }

  return (
    <div className="space-y-5 rounded-3xl bg-gradient-to-b from-slate-50/70 via-indigo-50/30 to-cyan-50/30 p-2 sm:p-3">
      <PageHeader
        title="Unified Website Control Center"
        description="Manage your entire portfolio/business website from one connected admin panel."
      />

      <div className="sticky top-2 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/75">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={addProjectConfig}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Add GitHub Project
          </button>
          <button
            onClick={handleSaveAll}
            disabled={!data || saving}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {loading ? <LoadingState message="Loading unified admin data..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {data ? (
        <>
          {activeTab === "overview" ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Projects" value={data.projectsDetailed.length} />
                <StatCard label="Skills" value={data.skillsDetailed.length} />
                <StatCard label="Services" value={data.services.length} />
                <StatCard label="Testimonials" value={data.testimonialsDetailed.length} />
                <StatCard label="Messages" value={data.contactMessages.length} />
              </div>

              <SectionCard title="Status & Activity" description="Quick health and publish indicators for your website.">
                <div className="grid gap-3 md:grid-cols-2">
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    Last updated: <span className="font-semibold">{new Date(data.updatedAt).toLocaleString()}</span>
                  </p>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    Maintenance mode: <span className="font-semibold">{data.websiteControl.maintenanceMode.enabled ? "ON" : "OFF"}</span>
                  </p>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    Active GitHub project: <span className="font-semibold">{selectedProject?.name || "Default"}</span>
                  </p>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    Content source: <span className="font-semibold">{selectedProject?.owner && selectedProject?.repo ? `${selectedProject.owner}/${selectedProject.repo}` : "Env default"}</span>
                  </p>
                </div>
              </SectionCard>
            </div>
          ) : null}

          {activeTab === "profile" ? (
            <SectionCard title="Profile, Contact & Social" description="Edit hero identity, resume, and social links.">
              <ProfileEditor data={data} onChange={patch} />
            </SectionCard>
          ) : null}

          {activeTab === "projects" ? (
            <SectionCard title="Projects" description="Manage project cards, details, tech stack, and featured order.">
              <ProjectsEditor data={data} onChange={patch} />
            </SectionCard>
          ) : null}

          {activeTab === "skills" ? (
            <SimpleArrayEditor
              title="Skills"
              description="Update detailed skill records and summarized skill chips."
              items={data.skillsDetailed}
              setItems={(items) => patch({ ...data, skillsDetailed: items as any, skills: (items as any[]).map((s) => String(s.name || "")) })}
              fields={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "category", label: "Category" },
                { key: "icon", label: "Icon" },
                { key: "level", label: "Level", type: "number" },
              ]}
              createItem={() => ({ id: `skill-${Date.now()}`, name: "", category: "Frontend", icon: "", level: 70 }) as any}
            />
          ) : null}

          {activeTab === "services" ? (
            <SimpleArrayEditor
              title="Services"
              description="Manage service offerings visible on the public website."
              items={data.services}
              setItems={(items) => patch({ ...data, services: items as any })}
              fields={[
                { key: "id", label: "ID" },
                { key: "title", label: "Title" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "icon", label: "Icon" },
              ]}
              createItem={() => ({ id: `service-${Date.now()}`, title: "", description: "", icon: "" }) as any}
            />
          ) : null}

          {activeTab === "testimonials" ? (
            <SimpleArrayEditor
              title="Testimonials"
              description="Update client reviews and testimonials displayed on your homepage."
              items={data.testimonialsDetailed}
              setItems={(items) => patch({ ...data, testimonialsDetailed: items as any })}
              fields={[
                { key: "id", label: "ID" },
                { key: "clientName", label: "Client Name" },
                { key: "roleCompany", label: "Role/Company" },
                { key: "message", label: "Message", type: "textarea" },
                { key: "image", label: "Image" },
              ]}
              createItem={() => ({ id: `testimonial-${Date.now()}`, clientName: "", roleCompany: "", message: "", image: "" }) as any}
            />
          ) : null}

          {activeTab === "journey" ? (
            <div className="space-y-4">
              <SimpleArrayEditor
                title="Experience / Timeline"
                description="Manage career journey entries for the timeline section."
                items={data.experience as any[]}
                setItems={(items) => patch({ ...data, experience: items as any })}
                fields={[
                  { key: "role", label: "Role" },
                  { key: "period", label: "Period" },
                  { key: "summary", label: "Summary", type: "textarea" },
                ] as any}
                createItem={() => ({ role: "", period: "", summary: "" } as any)}
              />

              <SimpleArrayEditor
                title="Reviews"
                description="Manage simple review cards used in public sections."
                items={data.reviews as any[]}
                setItems={(items) => patch({ ...data, reviews: items as any })}
                fields={[
                  { key: "clientName", label: "Client Name" },
                  { key: "website", label: "Website" },
                  { key: "quote", label: "Quote", type: "textarea" },
                ] as any}
                createItem={() => ({ clientName: "", website: "", quote: "" } as any)}
              />
            </div>
          ) : null}

          {activeTab === "settings" ? (
            <div className="space-y-4">
              <SectionCard title="Website Settings" description="SEO metadata, branding assets, and footer text.">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 md:col-span-2" value={data.websiteSettings.seoTitle} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, seoTitle: e.target.value } })} placeholder="SEO title" />
                  <textarea className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 md:col-span-2" rows={3} value={data.websiteSettings.metaDescription} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, metaDescription: e.target.value } })} placeholder="Meta description" />
                  <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={data.websiteSettings.favicon} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, favicon: e.target.value } })} placeholder="Favicon URL" />
                  <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={data.websiteSettings.logo} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, logo: e.target.value } })} placeholder="Logo URL" />
                  <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 md:col-span-2" value={data.websiteSettings.footerText} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, footerText: e.target.value } })} placeholder="Footer text" />
                </div>
              </SectionCard>

              <SimpleArrayEditor
                title="Navigation Links"
                description="Primary navigation links used in the website header."
                items={data.nav as any[]}
                setItems={(items) => patch({ ...data, nav: items as any })}
                fields={[
                  { key: "label", label: "Label" },
                  { key: "href", label: "Href" },
                ] as any}
                createItem={() => ({ label: "", href: "#" } as any)}
              />
            </div>
          ) : null}

          {activeTab === "control" ? <WebsiteControlEditor data={data} onChange={patch} /> : null}

          {activeTab === "github" ? (
            <SectionCard
              title="GitHub Project Connections"
              description="Add multiple GitHub repositories/content paths and switch between them from this single panel."
            >
              {githubProjects.length === 0 ? <EmptyState title="No GitHub projects configured" description="Add at least one project to enable switching." /> : null}

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  GitHub Token (optional override)
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="Leave empty to use server env token"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Token must have access to the selected repository with <span className="font-semibold">Contents: Read and write</span>
                    {" "}(and Metadata: Read).
                  </p>
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Active Project
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                    <select
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      value={pendingProjectId}
                      onChange={(e) => setPendingProjectId(e.target.value)}
                      disabled={switchingProject}
                    >
                      {githubProjects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => void handleSwitchProject(pendingProjectId)}
                      disabled={
                        switchingProject ||
                        !pendingProjectId ||
                        pendingProjectId === (selectedProject?.id || "")
                      }
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {switchingProject ? "Switching..." : "Switch"}
                    </button>
                  </div>
                </label>

                <div className="space-y-3">
                  {githubProjects.map((project, index) => (
                    <div key={project.id} className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-3">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={project.name} onChange={(e) => updateProjectConfig(index, { name: e.target.value })} placeholder="Project name" />
                        <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={project.id} onChange={(e) => updateProjectConfig(index, { id: e.target.value })} placeholder="Project id" />
                        <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={project.owner} onChange={(e) => updateProjectConfig(index, { owner: e.target.value })} placeholder="GitHub owner" />
                        <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={project.repo} onChange={(e) => updateProjectConfig(index, { repo: e.target.value })} placeholder="GitHub repo" />
                        <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={project.branch} onChange={(e) => updateProjectConfig(index, { branch: e.target.value })} placeholder="Branch" />
                        <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={project.contentPath} onChange={(e) => updateProjectConfig(index, { contentPath: e.target.value })} placeholder="Content path" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
