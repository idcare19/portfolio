"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Briefcase,
  Clock3,
  Code2,
  Database,
  Folder,
  MessageSquare,
  RotateCcw,
  Save,
  Settings,
  Shield,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { ErrorState } from "@/components/admin/ErrorState";
import { LoadingState } from "@/components/admin/LoadingState";
import { SectionCard } from "@/components/admin/SectionCard";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { ProfileEditor } from "@/components/admin/editors/ProfileEditor";
import { ProjectsEditor } from "@/components/admin/editors/ProjectsEditor";
import { WebsiteControlEditor } from "@/components/admin/editors/WebsiteControlEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { normalizeSectionControls, SECTION_DEFINITIONS } from "@/lib/section-controls";
import type { SiteData } from "@/src/types/site-data";

const tabs = [
  { key: "profile", label: "Profile", description: "Identity, contact and socials", icon: UserRound },
  { key: "projects", label: "Projects", description: "Portfolio cards and links", icon: Folder },
  { key: "working", label: "Working Projects", description: "Live projects in progress", icon: Activity },
  { key: "completed", label: "Completed Work", description: "Finished projects and contributions", icon: Briefcase },
  { key: "allData", label: "All Data", description: "Edit complete site JSON data", icon: Database },
  { key: "skills", label: "Skills", description: "Detailed and summary skill sets", icon: Code2 },
  { key: "services", label: "Services", description: "Offerings shown on website", icon: Briefcase },
  { key: "testimonials", label: "Testimonials", description: "Client quotes and avatars", icon: MessageSquare },
  { key: "journey", label: "Journey + Reviews", description: "Timeline and client reviews", icon: Clock3 },
  { key: "settings", label: "Settings", description: "SEO, navigation and branding", icon: Settings },
  { key: "control", label: "Website Control", description: "Connection and sync controls", icon: Shield },
] as const;

const reviewIconOptions = [
  { label: "Default (Code)", value: "" },
  { label: "Developer (Code)", value: "code2" },
  { label: "User", value: "user" },
  { label: "Briefcase", value: "briefcase" },
  { label: "Globe", value: "globe" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Star", value: "star" },
];

type TabKey = (typeof tabs)[number]["key"];

export default function AdminDashboardPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, saveSections } = useSiteDataEditor();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [rawDataDraft, setRawDataDraft] = useState("");
  const activeTabConfig = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const ActiveTabIcon = activeTabConfig.icon;

  const updatedAtLabel = useMemo(() => {
    if (!data?.updatedAt) return "Not saved yet";
    const parsed = new Date(data.updatedAt);
    if (Number.isNaN(parsed.getTime())) return "Not saved yet";
    return parsed.toLocaleString();
  }, [data?.updatedAt]);

  const dashboardStats = useMemo(
    () =>
      [
        {
          label: "Projects",
          value: data?.projects.length ?? 0,
          hint: "Public cards",
          icon: Folder,
        },
        {
          label: "Skills",
          value: data?.skillsDetailed.length ?? 0,
          hint: "Detailed records",
          icon: Code2,
        },
        {
          label: "Services",
          value: data?.services.length ?? 0,
          hint: "Homepage offerings",
          icon: Briefcase,
        },
        {
          label: "Testimonials",
          value: data?.testimonialsDetailed.length ?? 0,
          hint: "Client feedback",
          icon: MessageSquare,
        },
      ] as Array<{ label: string; value: number; hint: string; icon: LucideIcon }>,
    [data]
  );

  function patch(next: any) {
    setData(next);
  }

  useEffect(() => {
    if (!data) return;
    setRawDataDraft(JSON.stringify(data, null, 2));
  }, [data]);

  async function handleSaveActiveTab() {
    if (!data) return;

    const sectionsByTab: Record<TabKey, Array<keyof SiteData>> = {
      profile: ["owner", "socials"],
      projects: ["projects", "projectsDetailed"],
      working: ["workingProjects"],
      completed: ["completedProjects"],
      allData: [],
      skills: ["skills", "skillsDetailed"],
      services: ["services"],
      testimonials: ["testimonialsDetailed"],
      journey: ["experience", "reviews", "journeyNow"],
      settings: ["websiteSettings", "sectionControls", "nav"],
      control: ["websiteControl"],
    };

    const sectionKeys =
      activeTab === "allData"
        ? (Object.keys(data).filter((key) => key !== "updatedAt") as Array<keyof SiteData>)
        : sectionsByTab[activeTab];
    const payload = sectionKeys.map((section) => ({
      section,
      value: (data as any)[section],
    }));

    const result = await saveSections(payload, `chore: update ${activeTab} section from dashboard`);
    if (result.ok) notify("success", `${activeTabConfig.label} saved`);
    else notify("error", result.error || "Save failed");
  }

  function renderActiveTabContent() {
    if (!data) return null;

    if (activeTab === "profile") {
      return (
        <SectionCard title="Profile, Contact & Social" description="Edit identity, resume, and social links.">
          <ProfileEditor data={data} onChange={patch} />
        </SectionCard>
      );
    }

    if (activeTab === "projects") {
      return (
        <SectionCard title="Projects" description="Manage project cards and details.">
          <ProjectsEditor data={data} onChange={patch} />
        </SectionCard>
      );
    }

    if (activeTab === "working") {
      return (
        <SimpleArrayEditor
          title="Currently Working On"
          description="Manage the cards shown in the public 'Projects in progress' section."
          items={(data.workingProjects || []) as any[]}
          setItems={(items) => patch({ ...data, workingProjects: items as any })}
          fields={[
            { key: "title", label: "Project Title" },
            { key: "status", label: "Status" },
            { key: "timeline", label: "Timeline" },
            { key: "link", label: "Link" },
            { key: "description", label: "Description", type: "textarea" },
          ] as any}
          createItem={() => ({ title: "", description: "", status: "In Progress", timeline: "", link: "" } as any)}
        />
      );
    }

    if (activeTab === "completed") {
      return (
        <SimpleArrayEditor
          title="Projects I Worked On"
          description="Add completed projects and clearly describe what you built or delivered in each."
          items={(data.completedProjects || []) as any[]}
          setItems={(items) => patch({ ...data, completedProjects: items as any })}
          fields={[
            { key: "title", label: "Project Title" },
            { key: "timeline", label: "Completed On" },
            { key: "role", label: "Your Role" },
            { key: "link", label: "Project Link" },
            { key: "workDone", label: "What You Did", type: "textarea" },
          ] as any}
          createItem={() => ({ title: "", timeline: "", role: "", link: "", workDone: "" } as any)}
        />
      );
    }

    if (activeTab === "allData") {
      return (
        <SectionCard
          title="All Dashboard Data (JSON)"
          description="Edit every field in one place. Click Apply to load your JSON into dashboard state, then save this section."
        >
          <div className="space-y-3">
            <textarea
              className="min-h-[460px] w-full rounded-xl border border-slate-300 bg-slate-950 p-3 font-mono text-xs text-slate-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={rawDataDraft}
              onChange={(e) => setRawDataDraft(e.target.value)}
              placeholder="Paste full site data JSON..."
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(rawDataDraft);
                    if (!parsed || typeof parsed !== "object") {
                      notify("error", "JSON must be an object");
                      return;
                    }
                    patch(parsed);
                    notify("success", "JSON applied to dashboard state");
                  } catch {
                    notify("error", "Invalid JSON format");
                  }
                }}
                className="rounded-xl border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                Apply JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!data) return;
                  setRawDataDraft(JSON.stringify(data, null, 2));
                }}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Reset From Current Data
              </button>
            </div>
          </div>
        </SectionCard>
      );
    }

    if (activeTab === "skills") {
      return (
        <SimpleArrayEditor
          title="Skills"
          description="Update detailed skill records and summarized chips."
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
      );
    }

    if (activeTab === "services") {
      return (
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
      );
    }

    if (activeTab === "testimonials") {
      return (
        <SimpleArrayEditor
          title="Testimonials"
          description="Update client testimonials used in the website."
          items={data.testimonialsDetailed}
          setItems={(items) => patch({ ...data, testimonialsDetailed: items as any })}
          fields={[
            { key: "id", label: "ID" },
            { key: "clientName", label: "Client Name" },
            { key: "roleCompany", label: "Role/Company" },
            { key: "message", label: "Message", type: "textarea" },
            { key: "image", label: "Image URL" },
          ]}
          createItem={() => ({ id: `testimonial-${Date.now()}`, clientName: "", roleCompany: "", message: "", image: "" }) as any}
        />
      );
    }

    if (activeTab === "journey") {
      return (
        <div className="space-y-4">
          <SectionCard
            title="Current Work & Ongoing Milestones"
            description="Show where you are working right now and what milestones are currently in progress."
          >
            <div className="grid grid-cols-1 gap-3">
              <input
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={data.journeyNow?.currentWork || ""}
                onChange={(e) =>
                  patch({
                    ...data,
                    journeyNow: {
                      currentWork: e.target.value,
                      ongoingMilestones: data.journeyNow?.ongoingMilestones || [],
                    },
                  })
                }
                placeholder="Where you are working right now"
              />
              <textarea
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                rows={4}
                value={(data.journeyNow?.ongoingMilestones || []).join("\n")}
                onChange={(e) =>
                  patch({
                    ...data,
                    journeyNow: {
                      currentWork: data.journeyNow?.currentWork || "",
                      ongoingMilestones: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                    },
                  })
                }
                placeholder="One ongoing milestone per line"
              />
            </div>
          </SectionCard>

          <SimpleArrayEditor
            title="Experience / Timeline"
            description="Manage career journey entries."
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
            description="Manage review cards and choose the person icon shown beside each reviewer."
            items={data.reviews as any[]}
            setItems={(items) => patch({ ...data, reviews: items as any })}
            fields={[
              { key: "clientName", label: "Client Name" },
              { key: "website", label: "Website" },
              { key: "icon", label: "Person Icon", type: "select", options: reviewIconOptions },
              { key: "quote", label: "Quote", type: "textarea" },
            ] as any}
            createItem={() => ({ clientName: "", website: "", quote: "", icon: "code2" } as any)}
          />
        </div>
      );
    }

    if (activeTab === "settings") {
      const sectionControls = normalizeSectionControls(data.sectionControls);

      function updateSectionControl(sectionId: string, updater: (current: any) => any) {
        const nextSectionControls = sectionControls.map((section) =>
          section.id === sectionId ? updater(section) : section
        );
        patch({ ...data, sectionControls: nextSectionControls as any });
      }

      return (
        <div className="space-y-4">
          <SectionCard title="Website Settings" description="SEO metadata, branding assets, and footer text.">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:col-span-2" value={data.websiteSettings.seoTitle} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, seoTitle: e.target.value } })} placeholder="SEO title" />
              <textarea className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:col-span-2" rows={3} value={data.websiteSettings.metaDescription} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, metaDescription: e.target.value } })} placeholder="Meta description" />
              <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" value={data.websiteSettings.favicon} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, favicon: e.target.value } })} placeholder="Favicon URL" />
              <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" value={data.websiteSettings.logo} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, logo: e.target.value } })} placeholder="Logo URL" />
              <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:col-span-2" value={data.websiteSettings.footerText} onChange={(e) => patch({ ...data, websiteSettings: { ...data.websiteSettings, footerText: e.target.value } })} placeholder="Footer text" />
            </div>
          </SectionCard>

          <SectionCard
            title="Section Controls"
            description="Update section names and control visibility, navbar presence, and delete/restore state."
          >
            <div className="space-y-3">
              {SECTION_DEFINITIONS.map((definition) => {
                const control = sectionControls.find((item) => item.id === definition.id) || {
                  id: definition.id,
                  label: definition.label,
                  visible: true,
                  showInNav: definition.showInNavByDefault,
                  deleted: false,
                };
                const statusLabel = control.deleted ? "Deleted" : control.visible ? "Visible" : "Hidden";
                const statusClass = control.deleted
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : control.visible
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700";

                return (
                  <div key={control.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${statusClass}`}>
                            {statusLabel}
                          </span>
                          <span className="text-xs text-slate-500">{definition.href}</span>
                        </div>
                        <input
                          value={control.label}
                          onChange={(event) =>
                            updateSectionControl(control.id, (current) => ({
                              ...current,
                              label: event.target.value,
                            }))
                          }
                          disabled={control.deleted}
                          placeholder="Section label"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={control.visible && !control.deleted}
                            onChange={(event) =>
                              updateSectionControl(control.id, (current) => ({
                                ...current,
                                visible: event.target.checked,
                                showInNav: event.target.checked ? current.showInNav : false,
                              }))
                            }
                            disabled={control.deleted}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          Show Section
                        </label>
                        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={control.showInNav && control.visible && !control.deleted}
                            onChange={(event) =>
                              updateSectionControl(control.id, (current) => ({
                                ...current,
                                showInNav: event.target.checked,
                              }))
                            }
                            disabled={control.deleted || !control.visible}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          Show in Nav
                        </label>
                        {control.deleted ? (
                          <button
                            type="button"
                            onClick={() =>
                              updateSectionControl(control.id, (current) => ({
                                ...current,
                                deleted: false,
                                visible: true,
                                showInNav: current.showInNav || definition.showInNavByDefault,
                              }))
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (!confirm(`Delete "${control.label}" section from website view?`)) return;
                              updateSectionControl(control.id, (current) => ({
                                ...current,
                                deleted: true,
                                visible: false,
                                showInNav: false,
                              }));
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
      );
    }

    return <WebsiteControlEditor data={data} onChange={patch} />;
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 text-slate-100 shadow-lg sm:p-6">
        <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Content Studio</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Website Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200/90">
              Manage your portfolio content from one place with section-based editing, quick totals, and save controls.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                <Activity className="h-3.5 w-3.5" />
                {saving ? "Saving in progress" : "Editor ready"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/30 bg-slate-200/10 px-3 py-1 text-xs font-medium text-slate-200">
                <Clock3 className="h-3.5 w-3.5" />
                {updatedAtLabel}
              </span>
            </div>
            <p className="text-xs text-slate-300">Use each section save button below.</p>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {dashboardStats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur sm:p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-300">{stat.hint}</p>
                  </div>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-blue-100">
                    <StatIcon className="h-4 w-4" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-4 xl:h-fit">
          <section className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sections</p>
            <div className="mt-3 space-y-2">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      active
                        ? "border-blue-300 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ${
                          active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <TabIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm font-semibold ${active ? "text-blue-800" : "text-slate-900"}`}>{tab.label}</span>
                        <span className={`mt-0.5 block text-xs ${active ? "text-blue-700/80" : "text-slate-500"}`}>{tab.description}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <div className="space-y-4">
          {loading ? <LoadingState message="Loading dashboard data..." /> : null}
          {error ? <ErrorState message={error} /> : null}

          {data ? (
            <>
              <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-blue-50/60 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <ActiveTabIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-slate-900">{activeTabConfig.label}</h2>
                      <p className="mt-1 text-sm text-slate-600">{activeTabConfig.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveActiveTab}
                    disabled={!data || saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : `Save ${activeTabConfig.label}`}
                  </button>
                </div>
              </section>

              {renderActiveTabContent()}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
