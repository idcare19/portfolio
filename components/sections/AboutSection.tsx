"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { HoverCard } from "@/components/effects/HoverCard";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function AboutSection() {
  const section = useSectionData("about");
  const data = section.data as Record<string, any>;
  const stats = Array.isArray(section.items) ? section.items : [];
  const hasHeader = Boolean(data.eyebrow || data.title || data.description);
  const intro = String(data.intro || "");

  return (
    <AnimatedSection id="about" className="bg-section-bg py-20">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} /> : null}

        <div className="glass mb-6 rounded-3xl p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <p className="text-text-muted" style={{ opacity: 0.9 }}>{intro}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((item: any, index) => (
            <div key={item.label}>
              <HoverCard className="relative overflow-hidden p-6">
                <p className="text-sm font-medium text-text-muted" style={{ opacity: 0.85 }}>{item.label}</p>
                <p className="mt-2 text-3xl font-bold text-text-main">{item.value}</p>
              </HoverCard>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
