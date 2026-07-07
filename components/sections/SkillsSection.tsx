"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { renderSkillIcon } from "@/lib/skill-icons";

type SkillItem = {
  title?: string;
  name: string;
  category?: string;
  icon?: string;
  iconKey?: string;
  iconColor?: string;
  order?: number;
  summary?: string;
};

function normalizeCategory(category?: string) {
  const value = (category || "").trim().toLowerCase();
  if (!value) return "Other Skills";
  if (["frontend", "ui", "client"].includes(value)) return "Frontend";
  if (["backend", "server", "api"].includes(value)) return "Backend";
  if (["database", "db", "data"].includes(value)) return "Database";
  if (["tools", "tooling", "devops", "cms"].includes(value)) return "Tools";
  if (["frameworks", "workflow", "frameworks & workflow"].includes(value)) return "Frameworks & Workflow";
  if (["core", "core skills"].includes(value)) return "Core Skills";
  if (["currently learning", "learning"].includes(value)) return "Currently Learning";
  return category?.trim() || "Other Skills";
}

function groupSkills(items: SkillItem[]) {
  const groups = new Map<string, SkillItem[]>();
  for (const item of items) {
    const label = normalizeCategory(item.category);
    const list = groups.get(label) || [];
    list.push(item);
    groups.set(label, list);
  }
  return groups;
}

export function SkillsSection() {
  const section = useSectionData("skills");
  const siteData = useSiteDataContext();
  const data = section.data as Record<string, any>;
  const rawSkills = [...(section.items || []), ...(siteData.skillsDetailed || [])];
  const skills = rawSkills
    .filter((item: SkillItem & { isEnabled?: boolean }) => Boolean(item?.name || item?.title) && item.isEnabled !== false)
    .map((item) => ({
      ...item,
      name: String(item.name || item.title || "").trim(),
      title: String(item.title || item.name || "").trim(),
    }))
    .filter((item) => item.name)
    .filter((item, index, list) => list.findIndex((entry) => String(entry.name).trim().toLowerCase() === String(item.name).trim().toLowerCase()) === index)
    .sort((a: SkillItem, b: SkillItem) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const learningItems = Array.isArray(data.learningItems) ? data.learningItems : [];
  const resumeUrl = String(siteData.owner?.resumeUrl || "").trim();
  const grouped = groupSkills(skills);
  const sections = Array.from(grouped.entries())
    .map(([title, items]) => ({ title, items }))
    .sort((a, b) => a.title.localeCompare(b.title));

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
            <div key={group.title} className="group h-full rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all duration-500 hover:shadow-[0_18px_40px_rgba(37,99,235,0.12)]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-text-main">{group.title}</h3>
                  <span className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
                    {group.items.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {group.items.map((skill, index) => (
                    <span
                      key={`${group.title}-${skill.name}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-3 py-2 text-sm font-medium text-text-main shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_12px_24px_rgba(37,99,235,0.12)]"
                    >
                      {renderSkillIcon(skill.iconKey || skill.icon, skill.iconColor)}
                      {skill.title || skill.name}
                    </span>
                  ))}
                </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">Currently Learning</p>
                {data.learningTitle ? <h3 className="mt-2 text-lg font-semibold text-text-main">{data.learningTitle}</h3> : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {learningItems.map((item: string, index: number) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1.5 text-sm font-medium text-[#1D4ED8] shadow-[0_8px_18px_rgba(37,99,235,0.08)]"
                >
                  {item}
                </span>
              ))}
            </div>
        </div>

        {buttonRow}
      </div>
    </AnimatedSection>
  );
}
