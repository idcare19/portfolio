"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function EducationSection() {
  const section = useSectionData("education");
  const data = section.data as Record<string, any>;
  const items = section.items as Array<{ id?: string; school: string; degree: string; period: string; description: string }>;

  if (items.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="education" className="bg-page-bg py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow={data.eyebrow || "Education"}
          title={data.title || "Academic foundation"}
          description={data.description || "Education, training, and practical study that shaped the work I do today."}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item, index) => (
            <FadeInUp key={item.id || `${item.school}-${index}`} delay={index * 0.05}>
              <AnimatedCard>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-text-main">{item.degree}</p>
                    <p className="mt-1 text-sm text-primary">{item.school}</p>
                  </div>
                  {item.period ? <Badge className="text-[10px]">{item.period}</Badge> : null}
                </div>
                {item.description ? <p className="mt-4 text-sm leading-6 text-text-muted" style={{ opacity: 0.9 }}>{item.description}</p> : null}
              </AnimatedCard>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}