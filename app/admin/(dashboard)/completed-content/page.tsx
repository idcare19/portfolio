"use client";

import { CompletedProjectsEditor } from "@/components/admin/editors/CompletedProjectsEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { PageHeader } from "@/components/admin/PageHeader";

export default function CompletedContentAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save, resetToLastSaved } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update completed content from admin panel");
    if (result.ok) notify("success", "Completed content committed to GitHub");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Completed Content" description="Add, edit, reorder, and enrich completed projects with the same case-study fields as Projects." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading completed content...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? <CompletedProjectsEditor data={data} onChange={setData as any} /> : null}
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">
          {saving ? "Saving..." : "Save Completed Content"}
        </button>
        <button onClick={resetToLastSaved} disabled={!data || saving} className="rounded-xl border border-admin-border bg-admin-bg px-4 py-2 text-sm font-semibold text-admin-text disabled:opacity-80">
          Cancel Changes
        </button>
      </div>
    </div>
  );
}
