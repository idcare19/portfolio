import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkillCard } from "@/components/ui/SkillCard";
import { portfolioData } from "@/data/portfolio";
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
  const movingSkills = portfolioData.skills.concat(portfolioData.skills);

  function renderSkillPill(skill: string, key: string, tone: "blue" | "cyan") {
    const skillIcon = skillIconMap[skill] ?? { icon: <SiGithub className="h-3.5 w-3.5 text-slate-700" />, tone: "" };
    const toneClasses =
      tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-cyan-200 bg-cyan-50 text-cyan-700";

    return (
      <span
        key={key}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${toneClasses}`}
      >
        <span className={skillIcon.tone}>{skillIcon.icon}</span>
        {skill}
      </span>
    );
  }

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

        <div className="mt-6 space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/90 py-2">
            <div className="marquee-track flex gap-2 whitespace-nowrap px-2 sm:gap-3 sm:px-3">
              {movingSkills.map((skill, index) => renderSkillPill(skill, `skill-moving-a-${skill}-${index}`, "blue"))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/90 py-2">
            <div className="marquee-track-reverse flex gap-2 whitespace-nowrap px-2 sm:gap-3 sm:px-3">
              {movingSkills.map((skill, index) => renderSkillPill(skill, `skill-moving-b-${skill}-${index}`, "cyan"))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
