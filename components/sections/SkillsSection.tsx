"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkillCard } from "@/components/ui/SkillCard";
import { renderSkillIcon } from "@/lib/skill-icons";

export function SkillsSection() {
  const portfolioData = useSiteDataContext();
  const section = useSectionData("skills");
  const data = section.data as Record<string, any>;
  const skillItems =
    section.items.length > 0
      ? section.items.filter((item: any) => item?.name)
      : portfolioData.skillsDetailed;
  const skillNames = skillItems.map((item: any) => item.name).filter(Boolean);
  const skillsA = skillNames.slice(0, 5);
  const skillsB = skillNames.slice(5);
  const movingSkills = skillItems.concat(skillItems);
  const learningItems = Array.isArray(data.learningItems) ? data.learningItems : portfolioData.learningPhase;

  function renderSkillPill(skill: { name: string; icon?: string }, key: string) {
    return (
      <span
        key={key}
        className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs font-medium text-text-main"
      >
        {renderSkillIcon((skill as any).iconKey || skill.icon, (skill as any).iconColor)}
        {skill.name}
      </span>
    );
  }

  return (
    <AnimatedSection id="skills" className="bg-page-bg py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow={data.eyebrow || "Skills"}
          title={data.title || "Comfortable across the stack"}
          description={data.description || "Core tools and technologies I use to design, develop, and ship production-ready web products."}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SkillCard title="Core Skills" items={skillsA} delay={0.03} />
          <SkillCard title="Frameworks & Workflow" items={skillsB} delay={0.08} />
        </div>

        <div className="mt-4">
          <SkillCard title={data.learningTitle || "Currently in Learning Phase"} items={learningItems} delay={0.12} />
        </div>

        <div className="mt-6 space-y-2 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] py-2">
            <div className="marquee-track flex gap-2 whitespace-nowrap px-2 sm:gap-3 sm:px-3">
              {movingSkills.map((skill, index) => renderSkillPill(skill, `skill-moving-a-${skill.name}-${index}`))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] py-2">
            <div className="marquee-track-reverse flex gap-2 whitespace-nowrap px-2 sm:gap-3 sm:px-3">
              {movingSkills.map((skill, index) => renderSkillPill(skill, `skill-moving-b-${skill.name}-${index}`))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
