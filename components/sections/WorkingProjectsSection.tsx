"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight, Clock3, Code2, FlagTriangleRight, Rocket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterHomepageItems, getHomepageButtonLabel, getHomepageDisplayConfig, shouldShowViewMore } from "@/lib/homepage-display-controls";
import { renderIcon } from "@/lib/skill-icons";

function normalizeHref(value?: string) {
  const href = String(value || "").trim();
  if (!href || href.toLowerCase() === "none") return "";
  return href;
}

export function WorkingProjectsSection() {
  const section = useSectionData("working");
  const siteData = useSiteDataContext();
  const pathname = usePathname();
  const data = section.data as Record<string, any>;
  const homepageSettings = getHomepageDisplayConfig(siteData, "working");
  const workingProjects = filterHomepageItems(Array.isArray(section.items) ? section.items : [], { ...homepageSettings, itemsLimit: homepageSettings.itemsLimit ?? 6 });
  const showMore = shouldShowViewMore(Array.isArray(section.items) ? section.items : [], workingProjects, homepageSettings);

  if (workingProjects.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="working" className="bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] py-24">
      <div className="section-wrap">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workingProjects.map((project, index) => (
            <div key={`${project.title}-${index}`}>
              <article className="group h-full overflow-hidden rounded-[30px] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(239,246,255,0.72))] p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(37,99,235,0.12)]">
                <div className="flex items-center justify-between gap-3">
                  <Badge>{project.status || "In Progress"}</Badge>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-primary">
                    {project.iconUrl ? <img src={project.iconUrl} alt="" className="h-5 w-5 object-contain" /> : renderIcon(project.icon, project.iconColor, "h-5 w-5")}
                  </span>
                  {project.timeline ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-text-muted">
                      <Clock3 className="h-3.5 w-3.5" />
                      {project.timeline}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-text-main">{project.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{project.description}</p>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                      <Rocket className="h-3.5 w-3.5 text-primary" />
                      Current milestone
                    </div>
                    <p className="mt-2 text-sm text-text-main">{project.milestone || project.description}</p>
                  </div>
                  <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                      <FlagTriangleRight className="h-3.5 w-3.5 text-primary" />
                      Next milestone
                    </div>
                    <p className="mt-2 text-sm text-text-main">{project.nextMilestone || "In progress"}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(Array.isArray(project.technologies) ? project.technologies : Array.isArray(project.tech) ? project.tech : [])
                    .slice(0, 6)
                    .map((tech: string) => (
                      <Badge key={tech} className="px-2.5 py-1 text-[10px] tracking-[0.14em]">
                        {tech}
                      </Badge>
                    ))}
                </div>

                {normalizeHref(project.link) ? (
                  <Link
                    href={normalizeHref(project.link)}
                    target={normalizeHref(project.link).startsWith("http") ? "_blank" : undefined}
                    rel={normalizeHref(project.link).startsWith("http") ? "noreferrer" : undefined}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                  >
                    View update <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </article>
            </div>
          ))}
        </div>
        {pathname === "/" && showMore ? <div className="mt-8 flex justify-center"><Link href={homepageSettings.fullPageUrl || "/completed-projects"} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">{getHomepageButtonLabel(homepageSettings)}</Link></div> : null}
      </div>
    </AnimatedSection>
  );
}
