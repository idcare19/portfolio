import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";

export function WorkingProjectsSection() {
  const workingProjects = portfolioData.workingProjects || [];

  if (workingProjects.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="working" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Currently Working On"
          title="Projects in progress"
          description="A live snapshot of what I am building right now and where the work is headed next."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workingProjects.map((project, index) => (
            <FadeInUp key={`${project.title}-${index}`} delay={index * 0.06}>
              <article className="glass h-full rounded-3xl p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                    {project.status || "In Progress"}
                  </span>
                  {project.timeline ? (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      {project.timeline}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-lg font-semibold text-slate-900">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{project.description}</p>

                {project.link ? (
                  <Link
                    href={project.link}
                    target={project.link.startsWith("http") ? "_blank" : undefined}
                    rel={project.link.startsWith("http") ? "noreferrer" : undefined}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
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
