
"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import {
  useSectionData,
  useSiteDataContext,
} from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  filterHomepageItems,
  getHomepageDisplayConfig,
  shouldShowViewMore,
  debugHomepageDisplay,
} from "@/lib/homepage-display-controls";

import { renderIcon } from "@/lib/skill-icons";

function normalizeHref(value?: string) {
  const href = String(value || "").trim();

  if (!href || href.toLowerCase() === "none") return "";

  return href;
}

function isExternalLink(href: string) {
  return /^https?:\/\//i.test(href);
}

export function CompletedProjectsSection() {
  const section = useSectionData("completed");
  const siteData = useSiteDataContext();
  const pathname = usePathname();

  const data = section.data as Record<string, any>;

  const homepageSettings = getHomepageDisplayConfig(
    siteData,
    "completed"
  );

  const isHomepage = pathname === "/";

  const fullProjects = filterHomepageItems(section.items || [], {
    showOnlyFeatured: false,
    manualItemOrder: undefined,
    limit: undefined,
    itemsLimit: undefined,
  });

  const homepageProjects = filterHomepageItems(section.items || [], {
    ...homepageSettings,
    limit: homepageSettings.limit ?? homepageSettings.itemsLimit ?? 6,
    showOnlyFeatured: homepageSettings.showOnlyFeatured,
  });

  const completedProjects = isHomepage
    ? homepageProjects
    : fullProjects;

  const showMore =
    isHomepage &&
    shouldShowViewMore(
      fullProjects,
      completedProjects,
      homepageSettings
    );

  debugHomepageDisplay(
    "completed",
    (section.items || []).length,
    completedProjects.length,
    homepageSettings
  );

  if (completedProjects.length === 0) {
    return null;
  }

  return (
    <AnimatedSection
      id="completed"
      className="relative overflow-hidden bg-[rgb(var(--background))] py-16 transition-colors duration-300 sm:py-20"
    >
      <div className="section-wrap relative">

        {/* Header */}
        <SectionHeader
          eyebrow={data.eyebrow || "Portfolio"}
          title={data.title || "Completed Projects"}
          description={data.description}
        />

        {/* Project count */}
        <div className="mb-7 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-text-muted">
            <FolderKanban className="h-4 w-4" />
            <span>Selected work</span>
          </div>

          <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1.5 text-xs font-semibold text-text-muted">
            {completedProjects.length} Projects
          </span>
        </div>

        {/* Project cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {completedProjects.map((project: any, index: number) => {
            const externalHref = normalizeHref(project.link);
            const external = isExternalLink(externalHref);

            return (
              <article
                key={
                  project.id ??
                  project.slug ??
                  `${project.title}-${index}`
                }
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgb(var(--primary))] hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)] sm:p-6"
              >
                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: "rgb(var(--primary))" }}
                />

                {/* Card top */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[rgb(var(--border))] transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background:
                        "color-mix(in srgb, rgb(var(--primary)) 9%, rgb(var(--card-bg)))",
                      color: project.iconColor || "rgb(var(--primary))",
                    }}
                  >
                    {project.iconUrl ? (
                      <img
                        src={project.iconUrl}
                        alt=""
                        loading="lazy"
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      renderIcon(
                        project.icon,
                        project.iconColor,
                        "h-5 w-5"
                      )
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    <CheckCircle2
                      className="h-3.5 w-3.5"
                      style={{ color: "rgb(var(--primary))" }}
                    />
                    Completed
                  </span>
                </div>

                {/* Project details */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold tracking-tight text-text-main transition-colors duration-200 group-hover:text-[rgb(var(--primary))]">
                    {project.title || "Untitled Project"}
                  </h3>

                  {project.role && (
                    <p
                      className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: "rgb(var(--primary))" }}
                    >
                      {project.role}
                    </p>
                  )}

                  {project.timeline && (
                    <div className="mt-3 inline-flex items-center gap-2 text-xs text-text-muted">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{project.timeline}</span>
                    </div>
                  )}

                  <p className="mt-4 text-sm leading-7 text-text-muted">
                    {project.workDone || "Project details coming soon."}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-3 border-t border-[rgb(var(--border))] pt-5 mt-6">
                  {project.slug && (
                    <Link
                      href={`/completed-projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-2.5"
                      style={{ color: "rgb(var(--primary))" }}
                    >
                      View project
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}

                  {externalHref && (
                    <Link
                      href={externalHref}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted transition-colors duration-200 hover:text-text-main"
                    >
                      External link
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}

                  {!project.slug && !externalHref && (
                    <span className="text-xs font-medium text-text-muted">
                      Project details
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* View more */}
        {showMore && (
          <div className="mt-10 flex justify-center">
            <Link
              href={homepageSettings.fullPageUrl || "/completed-projects"}
              className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "rgb(var(--primary))" }}
            >
              {homepageSettings.viewMoreButtonText || "View More"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
