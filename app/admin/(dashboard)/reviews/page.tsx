"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function ReviewsAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update reviews from admin panel");
    if (result.ok) notify("success", "Reviews updated");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Reviews" description="Manage public client review cards, names, roles, and review text." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading reviews...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <SimpleArrayEditor
          title="Client Reviews"
          description="Reviewer name, role/company, quote, icon or avatar, visibility, and order."
          items={data.testimonialsDetailed}
          setItems={(items) => setData({ ...data, testimonialsDetailed: items, reviews: items.map((item: any) => ({ clientName: item.clientName, website: item.roleCompany, quote: item.message, icon: item.image })) })}
          fields={[
            { key: "id", label: "ID" },
            { key: "clientName", label: "Reviewer Name", required: true },
            { key: "roleCompany", label: "Role / Company" },
            { key: "message", label: "Review Text", type: "textarea", required: true },
            { key: "image", label: "Avatar URL" },
            { key: "isEnabled", label: "Enabled", type: "checkbox" },
            { key: "order", label: "Order", type: "number" },
          ] as any}
          createItem={() => ({ id: `review-${Date.now()}`, clientName: "", roleCompany: "", message: "", image: "", isEnabled: true, order: data.testimonialsDetailed.length + 1 }) as any}
        />
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Reviews"}</button>
    </div>
  );
}
