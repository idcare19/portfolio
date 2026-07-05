"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SiteSectionBlock } from "@/src/types/site-data";

export function FaqSection({ section }: { section: SiteSectionBlock }) {
  const [open, setOpen] = useState<number>(0);
  const items = useMemo(() => (section?.items || []).filter((item: any) => item.isEnabled !== false).sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0)).filter((item: any) => item.featured || true), [section?.items]);
  return (
    <section id="faq" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[rgb(var(--border))] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{String(section.data?.eyebrow || "FAQ")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{String(section.data?.title || "Frequently Asked Questions")}</h2>
        {section.data?.description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-text-muted">{String(section.data.description)}</p> : null}
        <div className="mt-8 space-y-3">
          {items.map((item: any, index: number) => (
            <button key={item.question || index} type="button" onClick={() => setOpen(open === index ? -1 : index)} className="w-full rounded-2xl border border-[rgb(var(--border))] px-4 py-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-text-main">{item.question || "Question"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${open === index ? "rotate-180" : ""}`} />
              </div>
              {open === index ? <p className="mt-3 text-sm leading-7 text-text-muted">{item.answer || ""}</p> : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
