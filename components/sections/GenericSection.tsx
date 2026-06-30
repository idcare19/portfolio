"use client";

import type { SiteSectionBlock } from "@/src/types/site-data";
import { GenericCards } from "@/components/sections/custom/GenericCards";
import { GenericFaq } from "@/components/sections/custom/GenericFaq";
import { GenericGallery } from "@/components/sections/custom/GenericGallery";
import { GenericStats } from "@/components/sections/custom/GenericStats";
import { GenericTestimonials } from "@/components/sections/custom/GenericTestimonials";
import { GenericTimeline } from "@/components/sections/custom/GenericTimeline";

function GenericText({ section }: { section: SiteSectionBlock }) {
  const title = String(section.data?.title || section.label || section.id);
  const eyebrow = String(section.data?.eyebrow || "");
  const description = String(section.data?.description || "");
  const body = String(section.data?.body || section.data?.content || "");
  return (
    <section id={section.id} className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[rgb(var(--border))] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p> : null}
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-text-muted">{description}</p> : null}
        {body ? <div className="prose prose-slate mt-6 max-w-none whitespace-pre-wrap text-text-main">{body}</div> : null}
      </div>
    </section>
  );
}

export function GenericSection({ section }: { section: SiteSectionBlock }) {
  if (section.enabled === false || section.showOnHomepage === false) return null;
  const template = String(section.template || "text").toLowerCase();
  const shared = {
    section,
    className: "mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8",
  };

  switch (template) {
    case "cards":
      return (
        <section id={section.id} className={shared.className}>
          <GenericCards items={section.items || []} onChange={() => undefined} />
        </section>
      );
    case "faq":
      return (
        <section id={section.id} className={shared.className}>
          <GenericFaq items={section.items || []} onChange={() => undefined} />
        </section>
      );
    case "gallery":
      return (
        <section id={section.id} className={shared.className}>
          <GenericGallery items={section.items || []} onChange={() => undefined} />
        </section>
      );
    case "stats":
      return (
        <section id={section.id} className={shared.className}>
          <GenericStats items={section.items || []} onChange={() => undefined} />
        </section>
      );
    case "timeline":
      return (
        <section id={section.id} className={shared.className}>
          <GenericTimeline items={section.items || []} onChange={() => undefined} />
        </section>
      );
    case "testimonials":
      return (
        <section id={section.id} className={shared.className}>
          <GenericTestimonials items={section.items || []} onChange={() => undefined} />
        </section>
      );
    default:
      return <GenericText section={section} />;
  }
}
