
"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  ArrowUpRight,
  GraduationCap,
  BookOpen,
  Sparkles,
} from "lucide-react";

type EducationItem = {
  id?: string;
  school: string;
  degree: string;
  period: string;
  description: string;
};

export function EducationSection() {
  const section = useSectionData("education");
  const data = section.data as Record<string, any>;

  const items = Array.isArray(section.items)
    ? (section.items as EducationItem[])
    : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <AnimatedSection
      id="education"
      className="relative overflow-hidden bg-page-bg py-20 sm:py-24 lg:py-28"
    >
      <div className="section-wrap relative">
        <SectionHeader
          eyebrow={data.eyebrow || "Education"}
          title={data.title || "Academic Background"}
          description={
            data.description ||
            "The foundation behind my learning, skills, and professional growth."
          }
        />

        {/* Education overview */}
        <div className="mx-auto mb-10 mt-10 flex max-w-5xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-hover))] text-[rgb(var(--primary))]">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-text-main">
                Learning journey
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Academic milestones and qualifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold tracking-tight text-text-main">
              {String(items.length).padStart(2, "0")}
            </span>
            <span className="max-w-20 text-[10px] font-bold uppercase leading-4 tracking-[0.15em] text-text-muted">
              Education entries
            </span>
          </div>
        </div>

        {/* Education cards */}
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={item.id || `${item.school}-${index}`}
              className="group relative"
            >
              <AnimatedCard>
                <div className="portfolio-card relative h-full overflow-hidden p-6 sm:p-7">
                  {/* Decorative number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-8 text-8xl font-black tracking-tighter text-text-main/[0.035] transition-all duration-500 group-hover:text-[rgb(var(--primary))]/[0.08]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="relative">
                    {/* Top row */}
                    <div className="mb-7 flex items-center justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-hover))] text-[rgb(var(--primary))] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[rgb(var(--primary))]/30">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      {item.period ? (
                        <Badge className="text-[10px]">
                          {item.period}
                        </Badge>
                      ) : null}
                    </div>

                    {/* Degree */}
                    <h3 className="max-w-md text-xl font-bold leading-snug tracking-tight text-text-main transition-colors duration-300 group-hover:text-[rgb(var(--primary))] sm:text-2xl">
                      {item.degree}
                    </h3>

                    {/* School */}
                    <div className="mt-3 flex items-start gap-2">
                      <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--primary))]" />

                      <p className="text-sm font-semibold text-[rgb(var(--primary))]">
                        {item.school}
                      </p>
                    </div>

                    {/* Description */}
                    {item.description ? (
                      <p className="mt-5 text-sm leading-7 text-text-muted">
                        {item.description}
                      </p>
                    ) : null}

                    {/* Bottom accent */}
                    <div className="mt-7 flex items-center justify-between border-t border-[rgb(var(--border))] pt-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-[rgb(var(--primary))]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                          Academic foundation
                        </span>
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-text-muted/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[rgb(var(--primary))]" />
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
