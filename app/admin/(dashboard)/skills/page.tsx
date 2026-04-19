"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

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
      {loading ? <p className="text-sm text-slate-600">Loading skills...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <SimpleArrayEditor
          title="Skills"
          description="Frontend, Backend, Database, and Tools."
          items={data.skillsDetailed}
          setItems={(items) => setData?.({ ...data, skillsDetailed: items, skills: items.map((s) => s.name) } as any)}
          fields={[
            { key: "id", label: "ID" },
            { key: "name", label: "Skill Name" },
            { key: "category", label: "Category" },
            { key: "icon", label: "Icon" },
            { key: "level", label: "Level", type: "number" }
          ]}
          createItem={() => ({ id: `skill-${Date.now()}`, name: "", category: "Frontend", icon: "", level: 70 }) as any}
        />
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : "Save Skills"}</button>
    </div>
  );
}
