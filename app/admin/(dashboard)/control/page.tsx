"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { WebsiteControlEditor } from "@/components/admin/editors/WebsiteControlEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function ControlAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update website control panel settings");
    if (result.ok) notify("success", "Website control settings committed to GitHub");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Website Control Panel" description="Manage popup, maintenance mode, top notice bar, and version/update badge." />
      {loading ? <p className="text-sm text-slate-600">Loading website controls...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? <WebsiteControlEditor data={data} onChange={setData as any} /> : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : "Save Website Controls"}</button>
    </div>
  );
}
