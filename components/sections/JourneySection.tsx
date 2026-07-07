"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function JourneySection() {
  const section = useSectionData("journey");
  const data = section.data as Record<string, any>;
  const experience = Array.isArray(section.items) ? section.items.filter((item: any) => item && item.isEnabled !== false) : [];
  const milestones = Array.isArray(data.milestones) ? data.milestones : [];
  const eyebrow = data.eyebrow || "Experience";
  const title = data.title || "Professional Journey";
  const description = data.description || "A timeline of roles, growth, and recent work.";
  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <AnimatedSection id="journey" className="bg-section-bg py-20">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={eyebrow} title={title} description={description} /> : null}

        <div className="mx-auto mb-5 max-w-4xl rounded-2xl border border-[rgb(var(--border))] bg-card-bg p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
            <span>Progress</span>
            <span>{experience.length} role{experience.length > 1 ? "s" : ""}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-card-hover">
            <div className="h-full rounded-full bg-gradient-to-r from-primary via-[#3B82F6] to-[#93C5FD] w-full" />
          </div>
        </div>

        {data.currentWork ? (
          <div className="mx-auto mb-5 max-w-4xl rounded-2xl border border-[rgb(var(--border))] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{data.currentWorkTitle}</p>
            <p className="mt-2 text-sm font-semibold text-text-main">{data.currentWork}</p>
            {milestones.length > 0 ? (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1D4ED8]">Ongoing Milestones</p>
                <ul className="mt-2 space-y-2">
                  {milestones.map((milestone: string, index: number) => (
                    <li key={`${milestone}-${index}`} className="flex items-start gap-2 text-sm text-text-main">
                      <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="relative mx-auto max-w-4xl border-l border-[#BFDBFE] pl-6">
          {experience.map((item: any, index: number) => (
            <div key={`${item.role}-${item.period}`} className="relative pb-7 last:pb-0">
              <span className="absolute -left-[31px] top-1.5 inline-flex h-4 w-4 rounded-full border-2 border-primary bg-white" />

              <div className="group rounded-xl border border-[rgb(var(--border))] bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#BFDBFE]">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1D4ED8]">{item.period}</div>
                <p className="text-sm font-semibold text-text-main">{item.role}</p>
                <p className="mt-2 text-sm text-text-muted">{item.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
