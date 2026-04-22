"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { HoverCard } from "@/components/effects/HoverCard";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";

export function AboutSection() {
  return (
    <AnimatedSection id="about" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="About"
          title="Building modern products with clean execution"
          description="I love transforming ideas into smooth, responsive, and practical digital experiences."
        />

        <FadeInUp className="glass mb-6 rounded-3xl p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <p className="text-slate-600">{portfolioData.about.intro}</p>
        </FadeInUp>

        <div className="grid gap-4 md:grid-cols-3">
          {portfolioData.about.stats.map((item, index) => (
            <FadeInUp key={item.label} delay={index * 0.08}>
              <HoverCard className="relative overflow-hidden p-6">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
              </HoverCard>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
