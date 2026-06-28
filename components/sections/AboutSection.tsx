"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { HoverCard } from "@/components/effects/HoverCard";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function AboutSection() {
  const section = useSectionData("about");
  const data = section.data as Record<string, any>;
  const stats = section.items;
  if (process.env.NODE_ENV !== "production") {
    console.debug("[section:about]", { eyebrow: data.eyebrow, title: data.title, description: data.description });
    if (data.eyebrow === undefined || data.title === undefined || data.description === undefined) {
      console.warn("[section:about] missing text fields", { eyebrow: data.eyebrow, title: data.title, description: data.description });
    }
  }
  const hasHeader = Boolean(data.eyebrow || data.title || data.description);

  return (
    <AnimatedSection id="about" className="bg-section-bg py-20">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} /> : null}

        <FadeInUp className="glass mb-6 rounded-3xl p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <p className="text-text-muted" style={{ opacity: 0.9 }}>{data.intro}</p>
        </FadeInUp>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((item: any, index) => (
            <FadeInUp key={item.label} delay={index * 0.08}>
              <HoverCard className="relative overflow-hidden p-6">
                <p className="text-sm font-medium text-text-muted" style={{ opacity: 0.85 }}>{item.label}</p>
                <p className="mt-2 text-3xl font-bold text-text-main">{item.value}</p>
              </HoverCard>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
