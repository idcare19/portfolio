"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";

export function WorkingProjectsSection() {
  const section = useSectionData("working");
  const data = section.data as Record<string, any>;
  const workingProjects = section.items || [];

  if (workingProjects.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="working" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workingProjects.map((project, index) => (
            <FadeInUp key={`${project.title}-${index}`} delay={index * 0.06}>
              <article className="glass h-full rounded-3xl p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                    {project.status || "In Progress"}
                  </span>
                  {project.timeline ? (
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      <Clock3 className="h-3.5 w-3.5" />
                      {project.timeline}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-lg font-semibold text-text-main">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{project.description}</p>

                {project.link ? (
                  <Link
                    href={project.link}
                    target={project.link.startsWith("http") ? "_blank" : undefined}
                    rel={project.link.startsWith("http") ? "noreferrer" : undefined}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                  >
                    View update <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </article>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
