<<<<<<< HEAD
import { redirect } from "next/navigation";

export default function SkillsRedirectPage() {
  redirect("/admin/text-blocks");
=======
"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { skillIconOptions } from "@/lib/skill-icons";

export default function SkillsAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update skills from admin panel");
    if (result.ok) notify("success", "Skills updated in GitHub data file");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Skills Management" description="Manage skill categories, icons, and levels." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading skills...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      <section className="rounded-2xl border border-admin-border bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-admin-text">Skill Icon Docs</h2>
        <p className="mt-1 text-sm text-admin-text-muted">
          In the <span className="font-semibold text-admin-text">Icon Key</span> field, use a supported icon name like
          `SiHtml5`, `SiReact`, `SiGithub`, `SiMongodb`, or `SiTailwindcss`.
        </p>
        <p className="mt-2 text-sm text-admin-text-muted">
          Supported keys: <code>{skillIconOptions.join(", ")}</code>
        </p>
      </section>
      {data ? (
        <SimpleArrayEditor
          title="Skills"
          description="Frontend, Backend, Database, and Tools with icon key, icon color, level, state, and ordering."
          items={data.skillsDetailed}
          setItems={(items) => setData?.({ ...data, skillsDetailed: items, skills: items.filter((s: any) => s.isEnabled !== false).map((s: any) => s.name) } as any)}
          fields={[
            { key: "id", label: "ID" },
            { key: "name", label: "Skill Name", required: true },
            { key: "category", label: "Category" },
            { key: "iconKey", label: "Icon Key" },
            { key: "iconColor", label: "Icon Color" },
            { key: "level", label: "Level", type: "number" },
            { key: "order", label: "Order", type: "number" },
            { key: "isEnabled", label: "Enabled", type: "checkbox" }
          ]}
          createItem={() => ({ id: `skill-${Date.now()}`, name: "", category: "Frontend", icon: "", iconKey: "SiReact", iconColor: "#61dafb", level: 70, order: data.skillsDetailed.length + 1, isEnabled: true }) as any}
        />
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Skills"}</button>
    </div>
  );
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
}
