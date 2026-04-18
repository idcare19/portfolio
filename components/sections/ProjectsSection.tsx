import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/effects/Stagger";
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
          description="Premium cards with hover zoom, animated border glow, and action overlays."
        />

        <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {portfolioData.projects.map((project) => (
            <StaggerItem key={project.title}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
