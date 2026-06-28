"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { renderSkillIcon } from "@/lib/skill-icons";
import { motion, useReducedMotion } from "framer-motion";

type SkillItem = {
  name: string;
  category?: string;
  icon?: string;
  iconKey?: string;
  iconColor?: string;
};

function groupSkills(items: SkillItem[]) {
  const core = items.filter((item) => ["frontend", "quality", "tools"].includes((item.category || "").toLowerCase()));
  const workflow = items.filter((item) => ["backend", "devops", "database", "cms"].includes((item.category || "").toLowerCase()));
  return {
    core,
    workflow,
  };
}

export function SkillsSection() {
  const section = useSectionData("skills");
  const siteData = useSiteDataContext();
  const data = section.data as Record<string, any>;
  const skills = (section.items || []).filter((item: SkillItem & { isEnabled?: boolean }) => item?.name && item.isEnabled !== false);
  const learningItems = Array.isArray(data.learningItems) ? data.learningItems : [];
  const shouldReduceMotion = useReducedMotion();
  const resumeUrl = String(siteData.owner?.resumeUrl || "").trim();
  const grouped = groupSkills(skills);
  const sections = [
    { title: "Core Skills", items: grouped.core },
    { title: "Frameworks & Workflow", items: grouped.workflow },
  ].filter((group) => group.items.length > 0);

  const buttonRow = (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
      <Button href="#projects" className="w-full sm:w-auto">
        View Projects
      </Button>
      {resumeUrl ? (
        <Button href={resumeUrl} variant="secondary" target="_blank" download className="w-full sm:w-auto">
          Download Resume
        </Button>
      ) : null}
    </div>
  );

  return (
    <AnimatedSection id="skills" className="bg-page-bg py-20">
      <div className="section-wrap">
        <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} />

        <div className="grid gap-4 lg:grid-cols-2">
          {sections.map((group, groupIndex) => (
            <FadeInUp key={group.title} delay={groupIndex * 0.08}>
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: groupIndex * 0.05 }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                className="group h-full rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all duration-500 hover:shadow-[0_18px_40px_rgba(37,99,235,0.12)]"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-text-main">{group.title}</h3>
                  <span className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
                    {group.items.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {group.items.map((skill, index) => (
                    <motion.span
                      key={`${group.title}-${skill.name}-${index}`}
                      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 8 }}
                      whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                      whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.03 }}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-3 py-2 text-sm font-medium text-text-main shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_12px_24px_rgba(37,99,235,0.12)]"
                    >
                      {renderSkillIcon(skill.iconKey || skill.icon, skill.iconColor)}
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.12}>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-6 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">Currently Learning</p>
                {data.learningTitle ? <h3 className="mt-2 text-lg font-semibold text-text-main">{data.learningTitle}</h3> : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {learningItems.map((item: string, index: number) => (
                <motion.span
                  key={`${item}-${index}`}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  className="inline-flex items-center rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1.5 text-sm font-medium text-[#1D4ED8] shadow-[0_8px_18px_rgba(37,99,235,0.08)]"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </FadeInUp>

        {buttonRow}
      </div>
    </AnimatedSection>
  );
}
