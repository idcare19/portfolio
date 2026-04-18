import dynamic from "next/dynamic";
import { DeferredSection } from "@/components/layout/DeferredSection";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { HeroSection } from "@/components/sections/HeroSection";

const CollaborationSection = dynamic(() =>
  import("@/components/sections/CollaborationSection").then((module) => module.CollaborationSection)
);
const AboutSection = dynamic(() => import("@/components/sections/AboutSection").then((module) => module.AboutSection));
const SkillsSection = dynamic(() => import("@/components/sections/SkillsSection").then((module) => module.SkillsSection));
const ProjectsSection = dynamic(() =>
  import("@/components/sections/ProjectsSection").then((module) => module.ProjectsSection)
);
const ReviewsSection = dynamic(() => import("@/components/sections/ReviewsSection").then((module) => module.ReviewsSection));
const JourneySection = dynamic(() => import("@/components/sections/JourneySection").then((module) => module.JourneySection));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then((module) => module.ContactSection));
const DeferredFooterSection = dynamic(() =>
  import("@/components/layout/FooterSection").then((module) => module.FooterSection)
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <ScrollProgress />
      <Navbar />
      <div>
        <HeroSection />

        <DeferredSection className="min-h-[680px]">
          <CollaborationSection />
        </DeferredSection>

        <DeferredSection className="min-h-[720px]">
          <AboutSection />
        </DeferredSection>

        <DeferredSection className="min-h-[820px]">
          <SkillsSection />
        </DeferredSection>

        <DeferredSection className="min-h-[980px]">
          <ProjectsSection />
        </DeferredSection>

        <DeferredSection className="min-h-[680px]">
          <ReviewsSection />
        </DeferredSection>

        <DeferredSection className="min-h-[720px]">
          <JourneySection />
        </DeferredSection>

        <DeferredSection className="min-h-[760px]">
          <ContactSection />
        </DeferredSection>

        <DeferredSection className="min-h-[240px]">
          <DeferredFooterSection />
        </DeferredSection>
      </div>
    </main>
  );
}
