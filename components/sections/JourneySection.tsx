
"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight, BriefcaseBusiness, Radio, Sparkles } from "lucide-react";

type JourneyItem = {
  id?: string;
  role?: string;
  period?: string;
  summary?: string;
  isEnabled?: boolean;
};

export function JourneySection() {
  const section = useSectionData("journey");
  const data = section.data as Record<string, any>;

  const experience: JourneyItem[] = Array.isArray(section.items)
    ? section.items.filter(
        (item: JourneyItem) => item && item.isEnabled !== false,
      )
    : [];

  const milestones: string[] = Array.isArray(data.milestones)
    ? data.milestones.filter(
        (item: unknown): item is string => typeof item === "string",
      )
    : [];

  const eyebrow = data.eyebrow || "Experience";
  const title = data.title || "Professional Journey";
  const description =
    data.description ||
    "A timeline of roles, growth, and the work shaping my journey.";

  const currentWork = data.currentWork;
  const currentWorkTitle = data.currentWorkTitle || "Currently building";

  if (!experience.length && !currentWork && !milestones.length) {
    return null;
  }

  return (
    <AnimatedSection
      id="journey"
      className="relative overflow-hidden bg-section-bg py-20 sm:py-24 lg:py-28"
    >
      <div className="section-wrap relative">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {/* Section overview */}
        <div className="mx-auto mb-12 mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
          <div className="portfolio-card group relative overflow-hidden p-5 sm:p-6 shadow-sm">
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-hover))] text-primary">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-bold tracking-tight text-text-main">
                  {experience.length.toString().padStart(2, "0")}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                  Career milestones
                </p>
              </div>
            </div>
          </div>

          <div className="portfolio-card group relative overflow-hidden p-5 sm:p-6 shadow-sm">
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-hover))] text-[rgb(var(--success))]">
                <Radio className="h-5 w-5" />
                {currentWork ? (
                  <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-[rgb(var(--success))]" />
                ) : null}
              </div>

              <div>
                <p className="text-sm font-bold text-text-main">
                  {currentWork ? "In progress" : "Open to growth"}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                  Current status
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current work */}
        {currentWork ? (
          <div className="mx-auto mb-14 max-w-5xl">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[rgb(var(--primary))]/25 bg-[rgb(var(--card-bg))] p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[rgb(var(--primary))]/10"
              />
              <div
                aria-hidden="true"
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[rgb(var(--primary))]/10"
              />

              <div className="relative">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[rgb(var(--primary))]">
                    <Sparkles className="h-4 w-4" />
                    {currentWorkTitle}
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--success))]/20 bg-[rgb(var(--success))]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--success))]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[rgb(var(--success))]" />
                    Active
                  </span>
                </div>

                <p className="max-w-3xl text-lg font-semibold leading-8 text-text-main sm:text-xl sm:leading-9">
                  {currentWork}
                </p>

                {milestones.length > 0 ? (
                  <div className="mt-7 border-t border-[rgb(var(--border))] pt-6">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                      Ongoing milestones
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {milestones.map((milestone, index) => (
                        <div
                          key={`${milestone}-${index}`}
                          className="group flex items-start gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-hover))]/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgb(var(--primary))]/30"
                        >
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--primary))]/10 text-[10px] font-bold text-[rgb(var(--primary))]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm leading-6 text-text-main">
                            {milestone}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Experience timeline */}
        {experience.length > 0 ? (
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
                Career timeline
              </p>
              <span className="text-xs tabular-nums text-text-muted">
                01 — {String(experience.length).padStart(2, "0")}
              </span>
            </div>

            <div className="relative">
              {/* Timeline rail */}
              <div
                aria-hidden="true"
                className="absolute bottom-5 left-[15px] top-5 w-px bg-gradient-to-b from-[rgb(var(--primary))] via-[rgb(var(--border))] to-transparent sm:left-[23px]"
              />

              <div className="space-y-5">
                {experience.map((item, index) => (
                  <article
                    key={item.id || `${item.role}-${item.period}-${index}`}
                    className="group relative grid grid-cols-[32px_minmax(0,1fr)] gap-4 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-6"
                  >
                    {/* Timeline node */}
                    <div className="relative z-10 flex justify-center pt-6">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all duration-500 sm:h-12 sm:w-12 ${
                          index === 0
                            ? "border-[rgb(var(--primary))]/40 bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] shadow-[0_0_24px_rgba(37,99,235,0.12)]"
                            : "border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-muted group-hover:border-[rgb(var(--primary))]/40 group-hover:text-[rgb(var(--primary))]"
                        }`}
                      >
                        <span className="text-[10px] font-bold tabular-nums sm:text-xs">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </span>
                    </div>

                    {/* Timeline card */}
                    <div className="portfolio-card relative overflow-hidden p-5 sm:p-7">
                      <div className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-[rgb(var(--primary))] transition-transform duration-500 group-hover:scale-y-100" />

                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          {item.period ? (
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--primary))] sm:text-xs">
                              {item.period}
                            </p>
                          ) : null}

                          <h3 className="text-base font-bold tracking-tight text-text-main transition-colors duration-300 group-hover:text-[rgb(var(--primary))] sm:text-lg">
                            {item.role || "Professional Experience"}
                          </h3>
                        </div>

                        <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted opacity-40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[rgb(var(--primary))] group-hover:opacity-100" />
                      </div>

                      {item.summary ? (
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-text-muted">
                          {item.summary}
                        </p>
                      ) : null}

                      <div className="mt-5 flex items-center gap-2 border-t border-[rgb(var(--border))] pt-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--primary))]" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                          Journey entry {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}
