import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { portfolioData } from "@/data/portfolio";

export function ProjectsSection() {
  return (
    <AnimatedSection id="projects" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Projects"
          title={<span className="text-sweep">Featured work</span>}
          description="Fast, clean project cards with minimal motion and better performance."
        />

        <p className="-mt-4 mb-8 text-center text-sm text-slate-500">
          <span className="text-slate-700">Motion style:</span>{" "}
          <span className="text-sweep font-semibold">lightweight text animation</span>
        </p>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {portfolioData.projects.map((project) => (
            <div key={project.title}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
