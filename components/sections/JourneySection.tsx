"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import { motion } from "framer-motion";

export function JourneySection() {
  return (
    <AnimatedSection id="journey" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Experience"
          title="Timeline of roles & milestones"
          description="Hands-on roles that shaped my practical engineering and security-first development approach."
        />

        <div className="mx-auto mb-5 max-w-4xl rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span>Progress</span>
            <span>{portfolioData.experience.length} role{portfolioData.experience.length > 1 ? "s" : ""}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {portfolioData.journeyNow ? (
          <div className="mx-auto mb-5 max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Where I Am Working Right Now</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{portfolioData.journeyNow.currentWork}</p>
            {portfolioData.journeyNow.ongoingMilestones.length > 0 ? (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Ongoing Milestones</p>
                <ul className="mt-2 space-y-2">
                  {portfolioData.journeyNow.ongoingMilestones.map((milestone, index) => (
                    <li key={`${milestone}-${index}`} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="relative mx-auto max-w-4xl border-l border-blue-200/80 pl-6">
          {portfolioData.experience.map((item, index) => (
            <FadeInUp key={`${item.role}-${item.period}`} delay={index * 0.06} className="relative pb-7 last:pb-0">
              <span className="absolute -left-[31px] top-1.5 inline-flex h-4 w-4 rounded-full border-2 border-blue-500 bg-white" />

              <div className="group rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-blue-200">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">{item.period}</div>
                <p className="text-sm font-semibold text-slate-900">{item.role}</p>
                <p className="mt-2 text-sm text-slate-700">{item.summary}</p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
