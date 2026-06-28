<<<<<<< HEAD
import { redirect } from "next/navigation";

export default function ExperienceRedirectPage() {
  redirect("/admin/text-blocks");
=======
"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function ExperienceAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update experience from admin panel");
    if (result.ok) notify("success", "Experience updated");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Experience" description="Edit experience titles, summaries, dates, and current milestones." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading experience...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <>
          <SimpleArrayEditor
            title="Experience Entries"
            description="Role, period, and summary for the public experience timeline."
            items={data.experience as any[]}
            setItems={(items) => setData({ ...data, experience: items as any })}
            fields={[
              { key: "role", label: "Title", required: true },
              { key: "period", label: "Date / Period" },
              { key: "summary", label: "Summary", type: "textarea", required: true },
            ] as any}
            createItem={() => ({ role: "", period: "", summary: "" } as any)}
          />
          <SimpleArrayEditor
            title="Current Milestones"
            description="Dynamic milestone list shown in the currently working / experience journey area."
            items={(data.journeyNow?.ongoingMilestones || []).map((value, index) => ({ id: `milestone-${index}`, value })) as any[]}
            setItems={(items) => setData({ ...data, journeyNow: { currentWork: data.journeyNow?.currentWork || "", ongoingMilestones: items.map((item: any) => item.value) } })}
            fields={[{ key: "value", label: "Milestone", type: "textarea", required: true }] as any}
            createItem={() => ({ id: `milestone-${Date.now()}`, value: "" }) as any}
          />
        </>
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Experience"}</button>
    </div>
  );
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
}
