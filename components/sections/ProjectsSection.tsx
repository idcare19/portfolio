
"use client";

import { useMemo } from "react";
import { ArrowUpRight, Layers3, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import {
  useSectionData,
  useSiteDataContext,
} from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";

import {
  filterHomepageItems,
  getHomepageDisplayConfig,
  shouldShowViewMore,
  debugHomepageDisplay,
} from "@/lib/homepage-display-controls";

export function ProjectsSection() {
  const siteData = useSiteDataContext();
  const pathname = usePathname();
  const section = useSectionData("projects");

  const data = section.data as Record<string, any>;

  const homepageSettings = getHomepageDisplayConfig(
    siteData,
    "projects"
  );

  const isHomepage = pathname === "/";

  const sourceProjects = useMemo(
    () => (Array.isArray(section.items) ? section.items : []),
    [section.items]
  );

  const fullProjects = useMemo(
    () =>
      filterHomepageItems(sourceProjects, {
        showOnlyFeatured: false,
        manualItemOrder: undefined,
        limit: undefined,
        itemsLimit: undefined,
      }).map((item: any) => ({
        slug: String(item.slug || item.id || item.title || ""),
        title: String(item.title || ""),
        description: String(
          item.shortDescription || item.description || ""
        ),
        image: item.image || item.thumbnail || "",
        status: item.status || item.category || "Project",
        industry: item.industry || "",
        projectType: item.projectType || "",
        tech: Array.isArray(item.techStack)
          ? item.techStack
          : Array.isArray(item.technologies)
            ? item.technologies
            : [],
        liveUrl: item.liveDemoUrl || "",
        githubUrl: item.githubUrl || "",
        backendRepo: item.backendRepo || "",
        documentationUrl: item.documentationUrl || "",
      })),
    [sourceProjects]
  );

  const homepageProjects = useMemo(
    () =>
      filterHomepageItems(sourceProjects, {
        limit:
          homepageSettings.limit ??
          homepageSettings.itemsLimit ??
          siteData.websiteControl?.homepageProjects?.count ??
          siteData.homepageProjectSettings?.count ??
          6,
        showOnlyFeatured: homepageSettings.showOnlyFeatured,
        manualItemOrder: homepageSettings.manualItemOrder,
      }).map((item: any) => ({
        slug: String(item.slug || item.id || item.title || ""),
        title: String(item.title || ""),
        description: String(
          item.shortDescription || item.description || ""
        ),
        image: item.image || item.thumbnail || "",
        status: item.status || item.category || "Project",
        industry: item.industry || "",
        projectType: item.projectType || "",
        tech: Array.isArray(item.techStack)
          ? item.techStack
          : Array.isArray(item.technologies)
            ? item.technologies
            : [],
        liveUrl: item.liveDemoUrl || "",
        githubUrl: item.githubUrl || "",
        backendRepo: item.backendRepo || "",
        documentationUrl: item.documentationUrl || "",
      })),
    [
      sourceProjects,
      homepageSettings.limit,
      homepageSettings.itemsLimit,
      homepageSettings.showOnlyFeatured,
      homepageSettings.manualItemOrder,
      siteData.websiteControl?.homepageProjects?.count,
      siteData.homepageProjectSettings?.count,
    ]
  );

  const projects = isHomepage
    ? homepageProjects
    : fullProjects;

  const hasHeader = Boolean(
    data.eyebrow || data.title || data.description
  );

  const showMore =
    isHomepage &&
    shouldShowViewMore(fullProjects, projects, homepageSettings);

  debugHomepageDisplay(
    "projects",
    sourceProjects.length,
    projects.length,
    homepageSettings
  );

  if (projects.length === 0) {
    return null;
  }

  return (
    <AnimatedSection
      id="projects"
      className="relative overflow-hidden bg-[rgb(var(--page-bg))] py-20 sm:py-28"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-blue-500/[0.06] blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/[0.05] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(100 116 139) 1px, transparent 1px), linear-gradient(90deg, rgb(100 116 139) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="section-wrap relative z-10">
        {/* SECTION HEADER */}
        {hasHeader ? (
          <SectionHeader
            eyebrow={data.eyebrow}
            title={data.title}
            description={data.description}
          />
        ) : null}

        {/* PROJECT INTRO */}
        <div className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-[rgb(var(--border))] pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-primary">
              <Layers3 size={19} />
            </span>

            <div>
              <p className="text-sm font-bold text-text-main">
                Selected Work
              </p>
              <p className="text-xs text-text-muted">
                A collection of things I've built
              </p>
            </div>
          </div>

          <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
            {projects.length} Projects
          </span>
        </div>

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={`${project.slug}-${index}`}
              project={project}
              featured={index === 0}
            />
          ))}
        </div>

        {/* VIEW MORE */}
        {showMore ? (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
              <Sparkles size={14} className="text-primary" />
              Discover more projects and experiments
            </div>

            <Link
              href={homepageSettings.fullPageUrl || "/projects"}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(37,99,235,0.3)]"
            >
              {String(
                homepageSettings.viewMoreButtonText ||
                  "Explore All Projects"
              )}

              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}
