"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight, CalendarDays, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterHomepageItems, getHomepageDisplayConfig, shouldShowViewMore, debugHomepageDisplay } from "@/lib/homepage-display-controls";
import { renderIcon } from "@/lib/skill-icons";

function normalizeHref(value?: string) {
  const href = String(value || "").trim();
  if (!href || href.toLowerCase() === "none") return "";
  return href;
}

export function CompletedProjectsSection() {
  const section = useSectionData("completed");
  const siteData = useSiteDataContext();
  const pathname = usePathname();
  const data = section.data as Record<string, any>;
  const homepageSettings = getHomepageDisplayConfig(siteData, "completed");
  const isHomepage = pathname === "/";
  const fullProjects = filterHomepageItems(section.items || [], { showOnlyFeatured: false, manualItemOrder: undefined, limit: undefined, itemsLimit: undefined });
  const homepageProjects = filterHomepageItems(section.items || [], { ...homepageSettings, limit: homepageSettings.limit ?? homepageSettings.itemsLimit ?? 6, showOnlyFeatured: homepageSettings.showOnlyFeatured });
  const completedProjects = isHomepage ? homepageProjects : fullProjects;
  const showMore = isHomepage && shouldShowViewMore(fullProjects, completedProjects, homepageSettings);
  debugHomepageDisplay("completed", (section.items || []).length, completedProjects.length, homepageSettings);

  if (completedProjects.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="completed" className="bg-[linear-gradient(180deg,rgba(248,250,252,1),rgba(255,255,255,1))] py-24">
      <div className="section-wrap">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {completedProjects.map((project, index) => (
            <div key={`${project.title}-${index}`}>
              <article className="glass h-full rounded-[30px] p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-primary">
                      {project.iconUrl ? <img src={project.iconUrl} alt="" className="h-5 w-5 object-contain" /> : renderIcon(project.icon, project.iconColor, "h-5 w-5")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </span>
                  {project.timeline ? (
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {project.timeline}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-xl font-semibold tracking-tight text-text-main">{project.title}</h3>
                {project.role ? <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">{project.role}</p> : null}
                <p className="mt-3 text-sm leading-7 text-text-muted">{project.workDone}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {project.slug ? (
                    <Link
                      href={`/completed-projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                    >
                      View project <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                  {normalizeHref(project.link) ? (
                    <Link
                      href={normalizeHref(project.link)}
                      target={normalizeHref(project.link).startsWith("http") ? "_blank" : undefined}
                      rel={normalizeHref(project.link).startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-text-main"
                    >
                      Open external link <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </article>
            </div>
          ))}
        </div>
        {isHomepage && showMore ? <div className="mt-8 flex justify-center"><Link href={homepageSettings.fullPageUrl || "/completed-projects"} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">{homepageSettings.viewMoreButtonText || "View More"}</Link></div> : null}
      </div>
    </AnimatedSection>
  );
}
