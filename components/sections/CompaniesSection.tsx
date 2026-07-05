"use client";

import type { SiteSectionBlock } from "@/src/types/site-data";

export function CompaniesSection({ section }: { section: SiteSectionBlock }) {
  const items = (section?.items || []).filter((item: any) => item.isEnabled !== false).sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0));
  return (
    <section id="companies" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[rgb(var(--border))] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{String(section.data?.eyebrow || "Experience")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{String(section.data?.title || "Companies Worked With")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: any, index: number) => (
            <div key={item.companyName || index} className="rounded-3xl border border-[rgb(var(--border))] p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{item.relationshipType || "Collaboration"}</div>
              <h3 className="mt-2 text-xl font-semibold text-text-main">{item.companyName || "Company"}</h3>
              <p className="mt-2 text-sm leading-7 text-text-muted">{item.description || ""}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
