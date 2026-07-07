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
import { BlogsSection } from "@/components/sections/BlogsSection";
import { GitHubDeveloperSection } from "./GitHubDeveloperSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { CompaniesSection } from "@/components/sections/CompaniesSection";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { OpenSourceSection } from "@/components/sections/OpenSourceSection";
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
    case "faq":
      return <FaqSection section={section} />;
    case "achievements":
      return <AchievementsSection section={section} />;
    case "companies":
      return <CompaniesSection section={section} />;
    case "certificates":
      return <CertificatesSection section={section} />;
    case "open-source":
      return <OpenSourceSection section={section} />;
    case "contact":
      return <ContactSection />;
    case "blogs":
      return <BlogsSection />;
    case "github":
      return <GitHubDeveloperSection />;
    default:
      return <GenericSection section={section} />;
  }
}
