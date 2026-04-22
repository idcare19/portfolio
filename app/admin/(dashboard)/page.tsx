"use client";

import { useState } from "react";
import { ErrorState } from "@/components/admin/ErrorState";
import { LoadingState } from "@/components/admin/LoadingState";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { ProfileEditor } from "@/components/admin/editors/ProfileEditor";
import { ProjectsEditor } from "@/components/admin/editors/ProjectsEditor";
import { WebsiteControlEditor } from "@/components/admin/editors/WebsiteControlEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

const tabs = [
  { key: "profile", label: "Profile" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "services", label: "Services" },
  { key: "testimonials", label: "Testimonials" },
  { key: "journey", label: "Journey + Reviews" },
  { key: "settings", label: "Settings" },
  { key: "control", label: "Website Control" },
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
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  function patch(next: any) {
    setData(next);
  }

  async function handleSaveAll() {
    if (!data) return;

    const result = await save(data, "chore: update website dashboard content");
    if (result.ok) notify("success", "Website content saved");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-5 rounded-3xl bg-slate-50/80 p-2 sm:p-3">
      <PageHeader
        title="Website Dashboard"
        description="Clean editor with only the essential controls."
      />

      <div className="sticky top-2 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === tab.key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleSaveAll}
            disabled={!data || saving}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {loading ? <LoadingState message="Loading dashboard data..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {data ? (
        <>
          {activeTab === "profile" ? (
            <SectionCard title="Profile, Contact & Social" description="Edit identity, resume, and social links.">
              <ProfileEditor data={data} onChange={patch} />
            </SectionCard>
          ) : null}

          {activeTab === "projects" ? (
            <SectionCard title="Projects" description="Manage project cards and details.">
              <ProjectsEditor data={data} onChange={patch} />
            </SectionCard>
          ) : null}

          {activeTab === "skills" ? (
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
          ) : null}

          {activeTab === "journey" ? (
            <div className="space-y-4">
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
          ) : null}

          {activeTab === "settings" ? (
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
        </>
      ) : null}
    </div>
  );
}
