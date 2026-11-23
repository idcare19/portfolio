"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, GraduationCap } from "lucide-react";

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

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--page-bg))]";


function Sticker({
  skill,
  index,
  boardRef,
  active,
  onActivate,
  reduceMotion,
  canDrag,
}: {
  skill: SkillItem;
  index: number;
  boardRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
  onActivate: () => void;
  reduceMotion: boolean;
  canDrag: boolean;
}) {
  const peel = useMotionValue(0);
  const bodyClip = useMotionTemplate`polygon(0 0, 100% 0, 100% calc(100% - ${peel}px), calc(100% - ${peel}px) 100%, 0 100%)`;
  const dragging = useRef(false);
  const elRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // After a drop, push this sticker away from any sticker it overlaps
  // (and keep it inside the board) so they never sit on top of each other.
  const resolveOverlap = () => {
    const el = elRef.current;
    const board = boardRef.current;
    if (!el || !board) return;

    const GAP = 8;
    const others = Array.from(
      board.querySelectorAll<HTMLElement>("[data-sticker]")
    ).filter((node) => node !== el);

    const rect = el.getBoundingClientRect();
    const a = {
      l: rect.left,
      r: rect.right,
      t: rect.top,
      b: rect.bottom,
    };
    let dx = 0;
    let dy = 0;

    for (let i = 0; i < 12; i++) {
      let moved = false;

      for (const other of others) {
        const q = other.getBoundingClientRect();
        const overlapX = Math.min(a.r + GAP, q.right) - Math.max(a.l - GAP, q.left);
        const overlapY = Math.min(a.b + GAP, q.bottom) - Math.max(a.t - GAP, q.top);

        if (overlapX > 0 && overlapY > 0) {
          const acx = (a.l + a.r) / 2;
          const acy = (a.t + a.b) / 2;
          const qcx = (q.left + q.right) / 2;
          const qcy = (q.top + q.bottom) / 2;

          if (overlapX < overlapY) {
            const d = overlapX * (acx >= qcx ? 1 : -1);
            dx += d;
            a.l += d;
            a.r += d;
          } else {
            const d = overlapY * (acy >= qcy ? 1 : -1);
            dy += d;
            a.t += d;
            a.b += d;
          }
          moved = true;
        }
      }

      if (!moved) break;
    }

    // keep inside the board
    const bounds = board.getBoundingClientRect();
    if (a.l < bounds.left) dx += bounds.left - a.l;
    if (a.r > bounds.right) dx -= a.r - bounds.right;
    if (a.t < bounds.top) dy += bounds.top - a.t;
    if (a.b > bounds.bottom) dy -= a.b - bounds.bottom;

    if (dx === 0 && dy === 0) return;

    const transition = reduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 300, damping: 26 };
    animate(x, x.get() + dx, transition);
    animate(y, y.get() + dy, transition);
  };

  const setPeel = (to: number) =>
    animate(
      peel,
      to,
      reduceMotion
        ? { duration: 0 }
        : { type: "spring", stiffness: 420, damping: 26 }
    );

  const rotate = ((index * 37) % 7) - 3;
  const label = skill.title || skill.name;

  return (
    <motion.div
      ref={elRef}
      data-sticker=""
      drag={canDrag}
      dragConstraints={boardRef}
      dragElastic={0.12}
      dragMomentum={false}
      whileDrag={{ scale: 1.06 }}
      onHoverStart={() => setPeel(20)}
      onHoverEnd={() => {
        if (!dragging.current) setPeel(0);
      }}
      onTapStart={() => {
        onActivate();
        setPeel(28);
      }}
      onDragStart={() => {
        dragging.current = true;
        setPeel(34);
      }}
      onDragEnd={() => {
        dragging.current = false;
        setPeel(0);
        resolveOverlap();
      }}
      onTap={() => setPeel(0)}
      style={{
        x,
        y,
        rotate,
        zIndex: active ? 30 : 1,
        touchAction: canDrag ? "none" : "auto",
      }}
      className={`relative h-[76px] w-[76px] select-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.16)] sm:h-[96px] sm:w-[96px] ${
        canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      }`}
    >
      <motion.div
        style={{ clipPath: bodyClip, WebkitClipPath: bodyClip }}
        className="absolute inset-0 rounded-[22px] bg-white p-1.5"
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-[16px] bg-slate-100 px-1.5"
          style={{ color: skill.iconColor || "rgb(var(--primary))" }}
        >
          {skill.iconUrl ? (
            <img
              src={skill.iconUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
              loading="lazy"
              className="h-6 w-6 object-contain sm:h-7 sm:w-7"
            />
          ) : (
            renderIcon(
              skill.iconKey ||
                suggestSkillIconKey(label, skill.category),
              skill.iconColor,
              "h-6 w-6 sm:h-7 sm:w-7"
            )
          )}
          <span className="w-full truncate text-center text-[11px] font-semibold text-slate-900">
            {label}
          </span>
        </div>
      </motion.div>

      <motion.span
        aria-hidden="true"
        style={{
          width: peel,
          height: peel,
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          WebkitClipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
        className="pointer-events-none absolute bottom-0 right-0 bg-gradient-to-br from-white to-slate-300"
      />
    </motion.div>
  );
}

export function SkillsSection() {
  const section = useSectionData("skills");
  const siteData = useSiteDataContext();

  const data = section.data as Record<string, any>;
  const reduceMotion = useReducedMotion();

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSticker, setActiveSticker] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // On touch screens dragging a sticker would block page scrolling,
  // so dragging is opt-in there via the "Move stickers" button.
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const canDrag = !coarsePointer || moveMode;

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

  const allStickers = visibleGroups.flatMap((group) => group.items);
  const STICKER_LIMIT = coarsePointer ? 12 : 18;
  const stickerSkills = showAll
    ? allStickers
    : allStickers.slice(0, STICKER_LIMIT);
  const hasMoreStickers = allStickers.length > STICKER_LIMIT;

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

        {/* CATEGORY FILTERS */}
        <div
          role="group"
          aria-label="Filter skills by category"
          className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => {
            const selected = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setShowAll(false);
                }}
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

        <p className="mb-6 text-sm text-text-muted">
          {totalSkills} technologies across {groups.length} categories
        </p>

        {/* STICKER BOARD */}
        {stickerSkills.length > 0 ? (
          <div
            ref={boardRef}
            className="relative overflow-hidden rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 sm:p-10"
          >
            <div className="mb-8 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text-muted">
                  {coarsePointer
                    ? moveMode
                      ? "Drag stickers around. Tap Done to scroll again."
                      : "Tap a sticker to peel it."
                    : "Drag them around and peel a corner."}
                </p>
              </div>

              {coarsePointer ? (
                <button
                  type="button"
                  onClick={() => setMoveMode((value) => !value)}
                  aria-pressed={moveMode}
                  className={`min-h-11 shrink-0 rounded-xl border px-4 text-sm font-semibold transition-colors duration-200 ${FOCUS_RING} ${
                    moveMode
                      ? "border-primary bg-primary text-white"
                      : "border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] text-text-main"
                  }`}
                >
                  {moveMode ? "Done" : "Move stickers"}
                </button>
              ) : null}
            </div>

            <div
              aria-label="Skill stickers"
              className="flex flex-wrap justify-center gap-5 pb-2 sm:gap-8"
            >
              {stickerSkills.map((skill, index) => (
                <Sticker
                  key={`sticker-${skill.name}`}
                  skill={skill}
                  index={index}
                  boardRef={boardRef}
                  active={activeSticker === skill.name}
                  onActivate={() => setActiveSticker(skill.name)}
                  reduceMotion={Boolean(reduceMotion)}
                  canDrag={canDrag}
                />
              ))}
            </div>

            {hasMoreStickers ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll((value) => !value)}
                  aria-expanded={showAll}
                  className={`min-h-11 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-5 text-sm font-semibold text-text-main transition-colors duration-200 hover:border-primary/40 ${FOCUS_RING}`}
                >
                  {showAll ? "Show less" : `Show all ${allStickers.length}`}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

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