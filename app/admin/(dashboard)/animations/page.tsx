"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { AnimationEditor } from "@/components/admin/editors/AnimationEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function AnimationsAdminPage() {
  const { data, savedData, setData, save, saving, isDirty, resetToLastSaved } = useSiteDataEditor();
  const { notify } = useToast();
  const dirtySectionCount = useMemo(() => {
    const current = data?.websiteControl?.animations || {};
    const saved = savedData?.websiteControl?.animations || {};
    const sectionIds = new Set([...Object.keys(current), ...Object.keys(saved)]);
    let count = 0;
    for (const sectionId of sectionIds) {
      if (JSON.stringify(current[sectionId] || {}) !== JSON.stringify(saved[sectionId] || {})) {
        count += 1;
      }
    }
    return count;
  }, [data?.websiteControl?.animations, savedData?.websiteControl?.animations]);

  async function handleSave() {
    if (!data) return;
    const result = await save(
      {
        ...data,
        websiteControl: {
          ...data.websiteControl,
          animations: data.websiteControl?.animations || {},
        },
      },
      "chore: update website animations"
    );

    if (result.ok) {
      notify("success", "Animations saved successfully");
    } else {
      notify("error", result.error || "Save failed");
    }
  }

  function handleReset() {
    resetToLastSaved();
  }

  return (
    <div className="space-y-4 pb-28">
      <PageHeader title="Website Animations" description="Control section animations from the CMS." />
      {data ? <AnimationEditor data={data} onChange={setData as any} /> : null}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isDirty ? (
          <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-[0_14px_30px_rgba(217,119,6,0.12)]">
            Unsaved changes
          </div>
        ) : (
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-[0_14px_30px_rgba(16,185,129,0.10)]">
            All changes saved
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-3 rounded-[28px] border border-admin-border bg-white/95 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.14)] backdrop-blur">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="rounded-full border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-text-main transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Changes
          </button>
          {dirtySectionCount > 1 ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-3 text-sm font-semibold text-[#1D4ED8] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save All Animations"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Animations"}
          </button>
        </div>
      </div>
    </div>
  );
}
