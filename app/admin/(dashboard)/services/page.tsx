"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function ServicesAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update services from admin panel");
    if (result.ok) notify("success", "Services updated in GitHub data file");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Services Management" description="Add, edit, and remove service cards." />
      {loading ? <p className="text-sm text-slate-600">Loading services...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <SimpleArrayEditor
          title="Services"
          description="Title, description and icon driven cards."
          items={data.services}
          setItems={(items) => setData?.({ ...data, services: items } as any)}
          fields={[
            { key: "id", label: "ID" },
            { key: "title", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "icon", label: "Icon" }
          ]}
          createItem={() => ({ id: `service-${Date.now()}`, title: "", description: "", icon: "" }) as any}
        />
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : "Save Services"}</button>
    </div>
  );
}
