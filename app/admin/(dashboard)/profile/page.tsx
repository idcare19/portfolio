"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProfileEditor } from "@/components/admin/editors/ProfileEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function ProfileAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update profile content from admin");
    if (result.ok) notify("success", "Profile changes committed to GitHub");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Profile Management" description="Edit profile info, bio, image, resume, and social links." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading profile...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? <ProfileEditor data={data} onChange={setData as any} /> : null}
      <div>
        <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}