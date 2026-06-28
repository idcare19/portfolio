"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function ResumeAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update resume link from admin panel");
    if (result.ok) notify("success", "Resume link updated");
    else notify("error", result.error || "Save failed");
  }

  const resumeUrl = data?.owner.resumeUrl ?? "";
  const hasResume = Boolean(resumeUrl.trim() && resumeUrl.trim() !== "#");

  return (
    <div className="space-y-4">
      <PageHeader
        title="Resume Management"
        description="Update the resume file URL used by the public Download Resume buttons on the site."
      />
      {loading ? <p className="text-sm text-admin-text-muted">Loading resume settings...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      {data ? (
        <section className="rounded-2xl border border-admin-border bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-admin-text">Resume Link</h2>
          <p className="mt-1 text-sm text-admin-text-muted">
            Paste a direct PDF/file URL or a public path like <code>/resume.pdf</code>. Hero and Contact section download buttons use this value.
          </p>

          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text outline-none transition focus:border-admin-primary"
              value={resumeUrl}
              onChange={(e) => setData({ ...data, owner: { ...data.owner, resumeUrl: e.target.value } })}
              placeholder="https://example.com/resume.pdf or /resume.pdf"
            />

            <div className="rounded-xl border border-admin-border bg-admin-bg px-4 py-3">
              <p className="text-sm font-medium text-admin-text">Current public status</p>
              <p className="mt-1 text-sm text-admin-text-muted">
                {hasResume ? "Download Resume is enabled on the site." : "Download Resume is currently hidden on the site."}
              </p>
              {hasResume ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#1D4ED8]"
                >
                  Preview Resume Link
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <button
        onClick={handleSave}
        disabled={!data || saving}
        className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80"
      >
        {saving ? "Saving..." : "Save Resume"}
      </button>
    </div>
  );
}
