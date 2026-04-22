import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import { ArrowUpRight, CalendarDays, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function CompletedProjectsSection() {
  const completedProjects = portfolioData.completedProjects || [];

  if (completedProjects.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="completed" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Projects I Worked On"
          title="Completed work and what I delivered"
          description="A clear record of finished projects and the exact work I handled in each."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {completedProjects.map((project, index) => (
            <FadeInUp key={`${project.title}-${index}`} delay={index * 0.06}>
              <article className="glass h-full rounded-3xl p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </span>
                  {project.timeline ? (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {project.timeline}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-lg font-semibold text-slate-900">{project.title}</h3>
                {project.role ? <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700">{project.role}</p> : null}
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{project.workDone}</p>

                {project.link ? (
                  <Link
                    href={project.link}
                    target={project.link.startsWith("http") ? "_blank" : undefined}
                    rel={project.link.startsWith("http") ? "noreferrer" : undefined}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    View project <ArrowUpRight className="h-3.5 w-3.5" />
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
