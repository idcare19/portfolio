"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterHomepageItems, getHomepageButtonLabel, getHomepageDisplayConfig, shouldShowViewMore } from "@/lib/homepage-display-controls";

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
    <AnimatedSection id="working" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workingProjects.map((project, index) => (
            <div key={`${project.title}-${index}`}>
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

                {normalizeHref(project.link) ? (
                  <Link
                    href={normalizeHref(project.link)}
                    target={normalizeHref(project.link).startsWith("http") ? "_blank" : undefined}
                    rel={normalizeHref(project.link).startsWith("http") ? "noreferrer" : undefined}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
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
