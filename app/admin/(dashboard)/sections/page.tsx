<<<<<<< HEAD
import { redirect } from "next/navigation";

export default function SectionsRedirectPage() {
  redirect("/admin/text-blocks");
=======
"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SectionManager } from "@/components/admin/SectionManager";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { buildAdminSections, saveAdminSections } from "@/lib/admin/content-manager";

export default function SectionsAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update sections from admin panel");
    if (result.ok) notify("success", "Sections updated");
    else notify("error", result.error || "Save failed");
  }

  async function handleReset() {
    const response = await fetch("/api/admin/reset", { method: "POST" });
    const payload = await response.json();
    if (response.ok && payload?.data) {
      setData(payload.data);
      notify("success", "Reset to default seed data");
    } else {
      notify("error", payload?.error || "Reset failed");
    }
  }

  const sections = data ? buildAdminSections(data) : [];

  return (
    <div className="space-y-4">
      <PageHeader title="Sections" description="Manage section order, status, renderer, layout, and visibility." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading sections...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? <SectionManager sections={sections} onChange={(nextSections) => setData(saveAdminSections(data, nextSections))} /> : null}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Sections"}</button>
        <a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-admin-border bg-admin-bg px-4 py-2 text-sm font-semibold text-admin-text">Preview Public Site</a>
        <button onClick={handleReset} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">Reset to Seed</button>
      </div>
    </div>
  );
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
}
