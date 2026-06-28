<<<<<<< HEAD
import { redirect } from "next/navigation";

export default function TestimonialsRedirectPage() {
  redirect("/admin/reviews");
=======
"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function TestimonialsAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update testimonials from admin panel");
    if (result.ok) notify("success", "Testimonials saved to GitHub");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Testimonials Management" description="Manage client testimonials and review cards." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading testimonials...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <SimpleArrayEditor
          title="Testimonials"
          description="Client name, role, rating, and feedback."
          items={data.testimonialsDetailed}
          setItems={(items) => setData?.({ ...data, testimonialsDetailed: items } as any)}
          fields={[
            { key: "id", label: "ID" },
            { key: "clientName", label: "Client Name" },
            { key: "roleCompany", label: "Role/Company" },
            { key: "message", label: "Feedback", type: "textarea" },
            { key: "image", label: "Avatar URL" }
          ]}
          createItem={() => ({ id: `testimonial-${Date.now()}`, clientName: "", roleCompany: "", message: "", image: "" }) as any}
        />
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Testimonials"}</button>
    </div>
  );
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
}
