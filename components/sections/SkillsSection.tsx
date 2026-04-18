"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkillCard } from "@/components/ui/SkillCard";
import { portfolioData } from "@/data/portfolio";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  SiCss,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMysql,
  SiPhotopea,
  SiPhp,
  SiReact,
  SiTestinglibrary,
  SiWordpress,
} from "react-icons/si";

const skillIconMap: Record<string, { icon: ReactNode; tone: string }> = {
  "HTML/CSS": {
    icon: (
      <span className="inline-flex items-center gap-0.5">
        <SiHtml5 className="h-3.5 w-3.5 text-orange-600" />
        <SiCss className="h-3.5 w-3.5 text-blue-600" />
      </span>
    ),
    tone: "",
  },
  JavaScript: { icon: <SiJavascript className="h-3.5 w-3.5 text-amber-500" />, tone: "" },
  PHP: { icon: <SiPhp className="h-3.5 w-3.5 text-indigo-600" />, tone: "" },
  MySQL: { icon: <SiMysql className="h-3.5 w-3.5 text-blue-600" />, tone: "" },
  WordPress: { icon: <SiWordpress className="h-3.5 w-3.5 text-sky-700" />, tone: "" },
  "Git & GitHub": {
    icon: (
      <span className="inline-flex items-center gap-0.5">
        <SiGit className="h-3.5 w-3.5 text-orange-600" />
        <SiGithub className="h-3.5 w-3.5 text-slate-800" />
      </span>
    ),
    tone: "",
  },
  "Design (Photoshop)": { icon: <SiPhotopea className="h-3.5 w-3.5 text-blue-600" />, tone: "" },
  Laravel: { icon: <SiLaravel className="h-3.5 w-3.5 text-red-600" />, tone: "" },
  React: { icon: <SiReact className="h-3.5 w-3.5 text-cyan-600" />, tone: "" },
  Testing: { icon: <SiTestinglibrary className="h-3.5 w-3.5 text-rose-600" />, tone: "" },
};

export function SkillsSection() {
  const skillsA = portfolioData.skills.slice(0, 5);
  const skillsB = portfolioData.skills.slice(5);
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatedSection id="skills" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Skills"
          title="Comfortable across the stack"
          description="Core tools and technologies I use to design, develop, and ship production-ready web products."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SkillCard title="Core Skills" items={skillsA} delay={0.03} />
          <SkillCard title="Frameworks & Workflow" items={skillsB} delay={0.08} />
        </div>

        <div className="mt-4">
          <SkillCard title="Currently in Learning Phase" items={portfolioData.learningPhase} delay={0.12} />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 py-2">
          <motion.div
            className="flex gap-3 whitespace-nowrap px-3 sm:gap-4 sm:px-4"
            animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            {portfolioData.skills.concat(portfolioData.skills).map((skill, index) => (
              <motion.span
                key={`${skill}-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                animate={prefersReducedMotion ? undefined : { y: [0, -2, 0], scale: [1, 1.02, 1] }}
                transition={{ duration: 1.9, repeat: Infinity, delay: (index % 8) * 0.08 }}
              >
                {(() => {
                  const skillIcon = skillIconMap[skill] ?? { icon: <SiGithub className="h-3.5 w-3.5 text-slate-700" />, tone: "" };
                  return <span className={skillIcon.tone}>{skillIcon.icon}</span>;
                })()}
                {skill}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="mt-2 flex gap-3 whitespace-nowrap px-3 sm:gap-4 sm:px-4"
            animate={prefersReducedMotion ? undefined : { x: ["-50%", "0%"] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            {portfolioData.skills.concat(portfolioData.skills).map((skill, index) => (
              <motion.span
                key={`reverse-${skill}-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700"
                animate={prefersReducedMotion ? undefined : { y: [0, 2, 0] }}
                transition={{ duration: 2.1, repeat: Infinity, delay: (index % 6) * 0.1 }}
              >
                {(() => {
                  const skillIcon = skillIconMap[skill] ?? { icon: <SiGithub className="h-3.5 w-3.5 text-slate-700" />, tone: "" };
                  return <span className={skillIcon.tone}>{skillIcon.icon}</span>;
                })()}
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
