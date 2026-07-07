"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { renderIcon, suggestSkillIconKey } from "@/lib/skill-icons";

type SkillItem = {
  title?: string;
  name: string;
  category?: string;
  icon?: string;
  iconKey?: string;
  iconColor?: string;
  iconUrl?: string;
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

  return (
    <AnimatedSection id="skills" className="bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_32%),linear-gradient(180deg,rgba(248,250,252,1),rgba(255,255,255,1))] py-24">
      <div className="section-wrap">
        <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} />

        <div className="grid gap-5 lg:grid-cols-2">
          {sections.map((group) => (
            <div key={group.title} className="group h-full rounded-[30px] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,246,255,0.76))] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(37,99,235,0.12)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">Skill group</p>
                  <h3 className="mt-2 text-lg font-semibold text-text-main">{group.title}</h3>
                </div>
                <Badge>{group.items.length}</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((skill, index) => (
                  <div
                    key={`${group.title}-${skill.name}-${index}`}
                    className="flex items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.04)]"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
                        {skill.iconUrl ? (
                          <img src={skill.iconUrl} alt={skill.title || skill.name} className="h-full w-full object-contain p-2" loading="lazy" />
                        ) : (
                          renderIcon(skill.iconKey || suggestSkillIconKey(skill.title || skill.name, skill.category), skill.iconColor, "h-4 w-4")
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text-main">{skill.title || skill.name}</p>
                        {skill.summary ? <p className="truncate text-xs text-text-muted">{skill.summary}</p> : null}
                      </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[30px] border border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgba(239,246,255,0.9),rgba(255,255,255,0.95))] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
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

          {resumeUrl ? (
            <div className="mt-6">
              <Button href={resumeUrl} variant="secondary" target="_blank" download>
                Download Resume
              </Button>
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="#projects">View Projects</Button>
        </div>
      </div>
    </AnimatedSection>
  );
}
