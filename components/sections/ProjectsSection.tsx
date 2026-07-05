"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import Link from "next/link";

export function ProjectsSection() {
  const section = useSectionData("projects");
  const data = section.data as Record<string, any>;
  const limitSetting = data.homepageLimit ?? data.homepageProjectsCount ?? data.homepageProjectCount ?? 6;
  const displayLimit = limitSetting === "all" ? Number.MAX_SAFE_INTEGER : Number(limitSetting || 6);
  const projects = (Array.isArray(section.items) ? section.items : [])
    .filter((item: any) => item && item.isEnabled !== false && (item.featured || item.isFeatured))
    .slice(0, displayLimit)
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
  const hasHeader = Boolean(data.eyebrow || data.title || data.description);
  const enabledCount = (Array.isArray(section.items) ? section.items : []).filter((item: any) => item && item.isEnabled !== false && (item.featured || item.isFeatured)).length;
  const showMore = enabledCount > projects.length;

  return (
    <AnimatedSection id="projects" className="bg-section-bg py-20">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} /> : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <FadeInUp key={project.title} delay={index * 0.06}>
              <ProjectCard project={project} />
            </FadeInUp>
          ))}
        </div>

        {showMore ? (
          <div className="mt-8 flex justify-center">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]">
              {String(data.homepageButtonText || data.homepageMoreButtonText || "View More Projects")}
            </Link>
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}
