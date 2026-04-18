import { FooterSection } from "@/components/layout/FooterSection";
import { Navbar } from "@/components/layout/Navbar";
import { PageReveal } from "@/components/layout/PageReveal";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { AboutSection } from "@/components/sections/AboutSection";
import { CollaborationSection } from "@/components/sections/CollaborationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <ScrollProgress />
      <Navbar />
      <PageReveal>
        <HeroSection />
        <CollaborationSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ReviewsSection />
        <JourneySection />
        <ContactSection />
        <FooterSection />
      </PageReveal>
    </main>
  );
}
