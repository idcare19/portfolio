"use client";

import { AboutSection } from "@/components/sections/AboutSection";
import { CompletedProjectsSection } from "@/components/sections/CompletedProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { WorkingProjectsSection } from "@/components/sections/WorkingProjectsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { GitHubDeveloperSection } from "@/components/sections/GitHubDeveloperSection";
import { GenericSection } from "@/components/sections/GenericSection";
import type { SiteSectionBlock } from "@/src/types/site-data";

type Props = {
  section: SiteSectionBlock;
};

export function DynamicSectionRenderer({ section }: Props) {
  if (section.enabled === false || section.showOnHomepage === false) {
    return null;
  }
  switch (section.renderer) {
    case "hero":
      return <HeroSection />;
    case "about":
      return <AboutSection />;
    case "skills":
      return <SkillsSection />;
    case "projects":
      return <ProjectsSection />;
    case "working":
      return <WorkingProjectsSection />;
    case "completed":
      return <CompletedProjectsSection />;
    case "reviews":
      return <ReviewsSection />;
    case "journey":
      return <JourneySection />;
    case "education":
      return <EducationSection />;
    case "services":
      return <ServicesSection />;
    case "contact":
      return <ContactSection />;
    case "github":
      return <GitHubDeveloperSection />;
    default:
      return <GenericSection section={section} />;
  }
}
