"use client";

import type { SiteSectionBlock } from "@/src/types/site-data";

export function CertificatesSection({ section }: { section: SiteSectionBlock }) {
  const items = (section?.items || []).filter((item: any) => item.isEnabled !== false).sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0));
  return (
    <section id="certificates" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[rgb(var(--border))] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{String(section.data?.eyebrow || "Credentials")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{String(section.data?.title || "Certificates")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: any, index: number) => (
            <div key={item.certificateTitle || index} className="overflow-hidden rounded-3xl border border-[rgb(var(--border))]">
              <div className="aspect-[16/10] bg-slate-100" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-text-main">{item.certificateTitle || "Certificate"}</h3>
                <p className="mt-1 text-sm text-text-muted">{item.issuer || ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
