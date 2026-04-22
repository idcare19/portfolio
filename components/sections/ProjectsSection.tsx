import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { portfolioData } from "@/data/portfolio";

export function ProjectsSection() {
  return (
    <AnimatedSection id="projects" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Projects"
          title="Featured work"
          description="Fast, clean project cards with minimal motion and better performance."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {portfolioData.projects.map((project, index) => (
            <FadeInUp key={project.title} delay={index * 0.06}>
              <ProjectCard project={project} />
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
