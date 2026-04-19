"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectsEditor } from "@/components/admin/editors/ProjectsEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function ProjectsAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update projects from admin panel");
    if (result.ok) notify("success", "Project changes committed to GitHub");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Projects Management" description="Add, edit, reorder, and feature projects with full details." />
      {loading ? <p className="text-sm text-slate-600">Loading projects...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? <ProjectsEditor data={data} onChange={setData as any} /> : null}
      <div>
        <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? "Saving..." : "Save Projects"}
        </button>
      </div>
    </div>
  );
}
