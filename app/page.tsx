import dynamic from "next/dynamic";
import { DeferredSection } from "@/components/layout/DeferredSection";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { HeroSection } from "@/components/sections/HeroSection";
import { portfolioData } from "@/data/portfolio";
import { toSectionControlMap } from "@/lib/section-controls";

const AboutSection = dynamic(() => import("@/components/sections/AboutSection").then((module) => module.AboutSection));
const SkillsSection = dynamic(() => import("@/components/sections/SkillsSection").then((module) => module.SkillsSection));
const ProjectsSection = dynamic(() =>
  import("@/components/sections/ProjectsSection").then((module) => module.ProjectsSection)
);
const WorkingProjectsSection = dynamic(() =>
  import("@/components/sections/WorkingProjectsSection").then((module) => module.WorkingProjectsSection)
);
const CompletedProjectsSection = dynamic(() =>
  import("@/components/sections/CompletedProjectsSection").then((module) => module.CompletedProjectsSection)
);
const ReviewsSection = dynamic(() => import("@/components/sections/ReviewsSection").then((module) => module.ReviewsSection));
const JourneySection = dynamic(() => import("@/components/sections/JourneySection").then((module) => module.JourneySection));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then((module) => module.ContactSection));
const DeferredFooterSection = dynamic(() =>
  import("@/components/layout/FooterSection").then((module) => module.FooterSection)
);

export default function HomePage() {
  const sectionControls = toSectionControlMap(portfolioData.sectionControls);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <ScrollProgress />
      <Navbar />
      <div>
        <HeroSection />

        {sectionControls.about.visible && !sectionControls.about.deleted ? (
          <DeferredSection id="about" className="min-h-[720px]">
            <AboutSection />
          </DeferredSection>
        ) : null}

        {sectionControls.skills.visible && !sectionControls.skills.deleted ? (
          <DeferredSection id="skills" className="min-h-[820px]">
            <SkillsSection />
          </DeferredSection>
        ) : null}

        {sectionControls.projects.visible && !sectionControls.projects.deleted ? (
          <DeferredSection id="projects" className="min-h-[980px]">
            <ProjectsSection />
          </DeferredSection>
        ) : null}

        {sectionControls.working.visible && !sectionControls.working.deleted ? (
          <DeferredSection id="working" className="min-h-[620px]">
            <WorkingProjectsSection />
          </DeferredSection>
        ) : null}

        {sectionControls.completed.visible && !sectionControls.completed.deleted ? (
          <DeferredSection id="completed" className="min-h-[620px]">
            <CompletedProjectsSection />
          </DeferredSection>
        ) : null}

        {sectionControls.reviews.visible && !sectionControls.reviews.deleted ? (
          <DeferredSection id="reviews" className="min-h-[680px]">
            <ReviewsSection />
          </DeferredSection>
        ) : null}

        {sectionControls.journey.visible && !sectionControls.journey.deleted ? (
          <DeferredSection id="journey" className="min-h-[720px]">
            <JourneySection />
          </DeferredSection>
        ) : null}

        {sectionControls.contact.visible && !sectionControls.contact.deleted ? (
          <DeferredSection id="contact" className="min-h-[760px]">
            <ContactSection />
          </DeferredSection>
        ) : null}

        <DeferredSection className="min-h-[240px]">
          <DeferredFooterSection />
        </DeferredSection>
      </div>
    </main>
  );
}
