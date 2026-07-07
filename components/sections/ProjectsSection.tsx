"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterHomepageItems, getHomepageDisplayConfig, shouldShowViewMore, debugHomepageDisplay } from "@/lib/homepage-display-controls";

export function ProjectsSection() {
  const siteData = useSiteDataContext();
  const pathname = usePathname();
  const section = useSectionData("projects");
  const data = section.data as Record<string, any>;
  const homepageSettings = getHomepageDisplayConfig(siteData, "projects");
  const isHomepage = pathname === "/";
  const fullProjects = filterHomepageItems(Array.isArray(section.items) ? section.items : [], {
    showOnlyFeatured: false,
    manualItemOrder: undefined,
    limit: undefined,
    itemsLimit: undefined,
  })
    .map((item: any) => ({
      slug: String(item.slug || item.id || item.title || ""),
      title: String(item.title || ""),
      description: String(item.shortDescription || item.description || ""),
      image: item.image || item.thumbnail || "",
      status: item.status || item.category || "Project",
      tech: Array.isArray(item.techStack) ? item.techStack : Array.isArray(item.technologies) ? item.technologies : [],
      liveUrl: item.liveDemoUrl || "",
      githubUrl: item.githubUrl || "",
      backendRepo: item.backendRepo || "",
      documentationUrl: item.documentationUrl || "",
    }));
  const homepageProjects = filterHomepageItems(Array.isArray(section.items) ? section.items : [], {
    limit: homepageSettings.limit ?? homepageSettings.itemsLimit ?? siteData.websiteControl?.homepageProjects?.count ?? siteData.homepageProjectSettings?.count ?? 6,
    showOnlyFeatured: homepageSettings.showOnlyFeatured,
    manualItemOrder: homepageSettings.manualItemOrder,
  })
    .map((item: any) => ({
      slug: String(item.slug || item.id || item.title || ""),
      title: String(item.title || ""),
      description: String(item.shortDescription || item.description || ""),
      image: item.image || item.thumbnail || "",
      status: item.status || item.category || "Project",
      tech: Array.isArray(item.techStack) ? item.techStack : Array.isArray(item.technologies) ? item.technologies : [],
      liveUrl: item.liveDemoUrl || "",
      githubUrl: item.githubUrl || "",
      backendRepo: item.backendRepo || "",
      documentationUrl: item.documentationUrl || "",
    }));
  const projects = isHomepage ? homepageProjects : fullProjects;
  const hasHeader = Boolean(data.eyebrow || data.title || data.description);
  const showMore = isHomepage && shouldShowViewMore(fullProjects, projects, homepageSettings);
  debugHomepageDisplay("projects", Array.isArray(section.items) ? section.items.length : 0, projects.length, homepageSettings);

  return (
    <AnimatedSection id="projects" className="bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_30%),linear-gradient(180deg,rgba(248,250,252,1),rgba(255,255,255,1))] py-16 sm:py-20">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} /> : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} featured={index === 0} />
          ))}
        </div>

        {isHomepage && showMore ? (
          <div className="mt-8 flex justify-center">
            <Link href={homepageSettings.fullPageUrl || "/projects"} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]">
              {String(homepageSettings.viewMoreButtonText || homepageSettings.fullPageUrl || "View More Projects")}
            </Link>
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}
