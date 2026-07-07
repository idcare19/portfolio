"use client";

import { SectionAnimated } from "@/components/effects/SectionAnimated";
import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
};

export function AnimatedSection({ id, className, children }: AnimatedSectionProps) {
  return (
    <SectionAnimated sectionId={id} className={cn("relative py-20 md:py-24", className)}>
      {children}
    </SectionAnimated>
  );
}
