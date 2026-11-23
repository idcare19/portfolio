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
  if (["frameworks", "workflow", "frameworks & workflow"].includes(value)) {
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

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--page-bg))]";

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
          Boolean(item?.name || item?.title) && item.isEnabled !== false
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
      className="relative overflow-hidden bg-[rgb(var(--page-bg))] py-16 sm:py-24"
    >
      <div className="section-wrap relative z-10">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        {/* OVERVIEW */}
        <div className="mb-6 flex flex-col justify-between gap-5 rounded-[26px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Code2 size={23} />
            </span>

            <div>
              <p className="text-base font-semibold text-text-main">
                Technology ecosystem
              </p>
              <p className="mt-0.5 text-sm text-text-muted">
                Technologies and tools I work with
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="min-w-[96px] rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3">
              <p className="text-2xl font-bold tabular-nums text-text-main">
                {totalSkills}
              </p>
              <p className="text-xs text-text-muted">Technologies</p>
            </div>

            <div className="min-w-[96px] rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3">
              <p className="text-2xl font-bold tabular-nums text-text-main">
                {groups.length}
              </p>
              <p className="text-xs text-text-muted">Categories</p>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div
          role="group"
          aria-label="Filter skills by category"
          className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => {
            const selected = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={selected}
                className={`shrink-0 whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${FOCUS_RING} ${
                  selected
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                    : "border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-muted hover:border-primary/40 hover:text-text-main"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* SKILL GROUPS */}
        <div className="grid items-start gap-5 lg:grid-cols-2">
          {visibleGroups.map((group) => {
            const Icon = categoryIcons[group.title] || Layers3;

            return (
              <motion.div
                key={group.title}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)] sm:p-6"
              >
                {/* GROUP HEADER */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] text-primary">
                      <Icon size={19} />
                    </span>
                    <h3 className="text-lg font-semibold text-text-main">
                      {group.title}
                    </h3>
                  </div>

                  <span
                    className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-2.5 py-1 text-sm font-semibold tabular-nums text-text-muted"
                    aria-label={`${group.items.length} skills`}
                  >
                    {group.items.length}
                  </span>
                </div>

                {/* SKILL ITEMS */}
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {group.items.map((skill) => (
                    <div
                      key={`${group.title}-${skill.name}`}
                      className="group/skill flex min-w-0 items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-3 transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgb(var(--border))] ${
                          skill.iconUrl
                            ? "bg-white"
                            : "bg-[rgb(var(--card-bg))]"
                        }`}
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
                        <p className="truncate text-sm font-semibold text-text-main">
                          {skill.title || skill.name}
                        </p>
                        {skill.summary ? (
                          <p className="mt-0.5 truncate text-xs text-text-muted">
                            {skill.summary}
                          </p>
                        ) : null}
                      </div>

                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="shrink-0 text-text-muted opacity-0 transition-opacity duration-200 group-hover/skill:opacity-100"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* LEARNING */}
        {learningItems.length > 0 ? (
          <div className="mt-6 rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap size={23} />
              </span>
              <h3 className="text-xl font-semibold text-text-main">
                {data.learningTitle || "Currently Exploring"}
              </h3>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {learningItems.map((item: string, index: number) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-2.5 text-sm font-medium text-text-main transition-colors hover:border-primary/40"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* RESUME CTA */}
        {resumeUrl ? (
          <div className="mt-8 flex justify-center">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex min-h-12 items-center gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-6 py-3 text-sm font-semibold text-text-main transition-colors duration-200 hover:border-primary/40 hover:text-primary ${FOCUS_RING}`}
            >
              View My Resume
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}