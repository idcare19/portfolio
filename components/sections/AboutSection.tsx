
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  BriefcaseBusiness,
  Code2,
  Lightbulb,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { Badge } from "@/components/ui/Badge";

const highlights = [
  {
    icon: Target,
    title: "Product-focused thinking",
    description: "Building solutions around real user and business needs.",
  },
  {
    icon: Code2,
    title: "Full-stack development",
    description: "Working across interfaces, APIs and data systems.",
  },
  {
    icon: Lightbulb,
    title: "Continuous learning",
    description: "Exploring new technologies and better engineering practices.",
  },
];

export function AboutSection() {
  const section = useSectionData("about");
  const data = section.data as Record<string, any>;
  const reduceMotion = useReducedMotion();

  const intro = String(data.intro || "");
  const title = String(data.title || "Building with purpose.");
  const description = String(data.description || "");
  const eyebrow = String(data.eyebrow || "About me");

  return (
    <AnimatedSection
      id="about"
      className="relative overflow-hidden bg-[rgb(var(--page-bg))] py-24 sm:py-32"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 top-20 h-[450px] w-[450px] rounded-full bg-blue-500/[0.06] blur-[130px]" />
        <div className="absolute -right-48 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/[0.06] blur-[130px]" />
      </div>

      <div className="section-wrap relative z-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          {/* MAIN ABOUT PANEL */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[30px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:p-10"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/[0.09] blur-[90px]" />

            <div className="relative">
              <div className="mb-8 flex items-center justify-between gap-3">
                <Badge className="border border-primary/20 bg-primary/10 text-primary">
                  <Sparkles className="mr-1.5 inline h-3 w-3" />
                  {eyebrow}
                </Badge>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                  ABOUT / INTRODUCTION
                </span>
              </div>

              {/* SINGLE TITLE */}
              <h2 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-[-0.045em] text-text-main sm:text-5xl">
                {title}
              </h2>

              {intro ? (
                <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-8 text-text-muted sm:text-lg">
                  {intro}
                </p>
              ) : description ? (
                <p className="mt-7 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
                  {description}
                </p>
              ) : null}

              <div className="mt-10 flex items-center gap-3 border-t border-[rgb(var(--border))] pt-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BriefcaseBusiness size={19} />
                </span>

                <div>
                  <p className="text-sm font-bold text-text-main">
                    Approach to engineering
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Think. Design. Build. Improve.
                  </p>
                </div>

                <ArrowDownRight
                  className="ml-auto text-text-muted"
                  size={20}
                />
              </div>
            </div>
          </motion.div>

          {/* CORE PHILOSOPHY */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="rounded-[30px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-7"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">
                  Core philosophy
                </p>

                <h3 className="mt-2 text-xl font-bold text-text-main">
                  What drives me
                </h3>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap size={20} />
              </span>
            </div>

            <div className="mt-7 space-y-5">
              {highlights.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={
                      reduceMotion ? false : { opacity: 0, x: 15 }
                    }
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex gap-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] text-primary transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10">
                      <Icon size={18} />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-text-main">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
    