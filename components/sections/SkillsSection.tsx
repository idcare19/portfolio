
"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Database,
  Layers3,
  Terminal,
  Wrench,
  Sparkles,
  BrainCircuit,
  GraduationCap,
} from "lucide-react";

import {
  useSectionData,
  useSiteDataContext,
} from "@/components/site/SiteDataProvider";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
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
  isEnabled?: boolean;
};

function normalizeCategory(category?: string) {
  const value = (category || "").trim().toLowerCase();

  if (!value) return "Other Skills";

  if (["frontend", "ui", "client"].includes(value)) return "Frontend";

  if (["backend", "server", "api"].includes(value)) return "Backend";

  if (["database", "db", "data"].includes(value)) return "Database";

  if (["tools", "tooling", "devops", "cms"].includes(value)) return "Tools";

  if (
    ["frameworks", "workflow", "frameworks & workflow"].includes(value)
  ) {
    return "Frameworks & Workflow";
  }

  if (["core", "core skills"].includes(value)) return "Core Skills";

  if (["currently learning", "learning"].includes(value)) {
    return "Currently Learning";
  }

  return category?.trim() || "Other Skills";
}

const categoryIcons: Record<string, typeof Code2> = {
  Frontend: Code2,
  Backend: Terminal,
  Database,
  Tools: Wrench,
  "Frameworks & Workflow": Layers3,
  "Core Skills": BrainCircuit,
  "Other Skills": Sparkles,
};

export function SkillsSection() {
  const section = useSectionData("skills");
  const siteData = useSiteDataContext();

  const data = section.data as Record<string, any>;
  const reduceMotion = useReducedMotion();

  const [activeCategory, setActiveCategory] = useState("All");

  const skills = useMemo(() => {
    const rawSkills = [
      ...(section.items || []),
      ...(siteData.skillsDetailed || []),
    ];

    return rawSkills
      .filter(
        (item: SkillItem) =>
          Boolean(item?.name || item?.title) &&
          item.isEnabled !== false
      )
      .map((item: SkillItem) => ({
        ...item,
        name: String(item.name || item.title || "").trim(),
        title: String(item.title || item.name || "").trim(),
        category: normalizeCategory(item.category),
      }))
      .filter((item: SkillItem) => item.name)
      .filter(
        (item: SkillItem, index: number, list: SkillItem[]) =>
          list.findIndex(
            (entry) =>
              String(entry.name).trim().toLowerCase() ===
              String(item.name).trim().toLowerCase()
          ) === index
      )
      .sort(
        (a: SkillItem, b: SkillItem) =>
          Number(a.order ?? 0) - Number(b.order ?? 0)
      );
  }, [section.items, siteData.skillsDetailed]);

  const groups = useMemo(() => {
    const map = new Map<string, SkillItem[]>();

    skills.forEach((skill: SkillItem) => {
      const category = normalizeCategory(skill.category);
      const current = map.get(category) || [];

      current.push(skill);
      map.set(category, current);
    });

    return Array.from(map.entries()).map(([title, items]) => ({
      title,
      items,
    }));
  }, [skills]);

  const categories = useMemo(
    () => ["All", ...groups.map((group) => group.title)],
    [groups]
  );

  const visibleGroups =
    activeCategory === "All"
      ? groups
      : groups.filter((group) => group.title === activeCategory);

  const learningItems = Array.isArray(data.learningItems)
    ? data.learningItems
    : [];

  const resumeUrl = String(siteData.owner?.resumeUrl || "").trim();

  const totalSkills = skills.length;

  return (
    <AnimatedSection
      id="skills"
      className="relative overflow-hidden bg-[rgb(var(--page-bg))] py-24 sm:py-32"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-10 h-[400px] w-[400px] rounded-full bg-blue-500/[0.07] blur-[120px]" />

        <div className="absolute -left-40 bottom-10 h-[400px] w-[400px] rounded-full bg-violet-500/[0.06] blur-[120px]" />
      </div>

      <div className="section-wrap relative z-10">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        {/* OVERVIEW */}
        <div className="mb-8 flex flex-col justify-between gap-5 rounded-[26px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Code2 size={23} />
            </span>

            <div>
              <p className="text-sm font-bold text-text-main">
                Technology ecosystem
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Technologies and tools I work with
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3">
              <p className="text-xl font-bold text-text-main">
                {totalSkills}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                Technologies
              </p>
            </div>

            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3">
              <p className="text-xl font-bold text-text-main">
                {groups.length}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                Categories
              </p>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => {
            const selected = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={selected}
                className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                  selected
                    ? "border-primary bg-primary text-white shadow-lg shadow-blue-500/20"
                    : "border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-muted hover:border-primary/40 hover:text-text-main"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* SKILL GROUPS */}
        <motion.div
          layout
          className="grid items-start gap-5 lg:grid-cols-2"
        >
          {visibleGroups.map((group, groupIndex) => {
            const Icon = categoryIcons[group.title] || Layers3;

            return (
              <motion.div
                layout
                key={group.title}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: groupIndex * 0.05,
                }}
                className="group rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_25px_60px_rgba(37,99,235,0.09)] sm:p-6"
              >
                {/* GROUP HEADER */}
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] text-primary">
                      <Icon size={19} />
                    </span>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted">
                        Skill category
                      </p>
                      <h3 className="mt-1 text-base font-bold text-text-main">
                        {group.title}
                      </h3>
                    </div>
                  </div>

                  <span className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3 py-1.5 text-xs font-bold tabular-nums text-text-muted">
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </div>

                {/* SKILL ITEMS */}
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {group.items.map((skill, index) => (
                    <motion.div
                      key={`${group.title}-${skill.name}`}
                      initial={
                        reduceMotion ? false : { opacity: 0, scale: 0.96 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.025,
                      }}
                      className="group/skill flex min-w-0 items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-3 transition-all duration-300 hover:border-primary/30 hover:bg-[rgb(var(--card-hover))]"
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] transition-transform duration-300 group-hover/skill:scale-105"
                        style={{
                          color: skill.iconColor || "rgb(var(--primary))",
                        }}
                      >
                        {skill.iconUrl ? (
                          <img
                            src={skill.iconUrl}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          renderIcon(
                            skill.iconKey ||
                              suggestSkillIconKey(
                                skill.title || skill.name,
                                skill.category
                              ),
                            skill.iconColor,
                            "h-5 w-5"
                          )
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-text-main">
                          {skill.title || skill.name}
                        </p>

                        {skill.summary ? (
                          <p className="mt-1 truncate text-[11px] text-text-muted">
                            {skill.summary}
                          </p>
                        ) : (
                          <p className="mt-1 text-[10px] text-text-muted">
                            {group.title}
                          </p>
                        )}
                      </div>

                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-text-muted opacity-0 transition-all duration-300 group-hover/skill:translate-x-0.5 group-hover/skill:-translate-y-0.5 group-hover/skill:opacity-100"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* LEARNING */}
        {learningItems.length > 0 ? (
          <div className="relative mt-7 overflow-hidden rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-violet-500/[0.08] blur-[90px]" />

            <div className="relative">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                    <GraduationCap size={23} />
                  </span>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                      Beyond the current stack
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-text-main">
                      {data.learningTitle || "Currently Exploring"}
                    </h3>
                  </div>
                </div>

                <span className="w-fit rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-violet-500">
                  Always Learning
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {learningItems.map((item: string, index: number) => (
                  <motion.span
                    key={`${item}-${index}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-2.5 text-xs font-semibold text-text-main transition-colors hover:border-violet-500/40"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* RESUME CTA */}
        {resumeUrl ? (
          <div className="mt-8 flex justify-center">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-6 py-3 text-sm font-bold text-text-main transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
            >
              View My Resume
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}
