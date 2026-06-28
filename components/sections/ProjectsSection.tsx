"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";

export function ProjectsSection() {
  const portfolioData = useSiteDataContext();
  const section = useSectionData("projects");
  const data = section.data as Record<string, any>;
  const projects = section.items.length
    ? section.items.map((item: any) => ({
        title: item.title,
        description: item.shortDescription,
        image: item.image,
        tech: item.techStack,
        liveUrl: item.liveDemoUrl,
        githubUrl: item.githubUrl,
      }))
    : portfolioData.projects;

  return (
    <AnimatedSection id="projects" className="bg-section-bg py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow={data.eyebrow || "Projects"}
          title={data.title || "Featured work"}
          description={data.description || "Fast, clean project cards with minimal motion and better performance."}
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <FadeInUp key={project.title} delay={index * 0.06}>
              <ProjectCard project={project} />
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}