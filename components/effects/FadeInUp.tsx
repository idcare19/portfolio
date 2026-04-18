"use client";

import { ScrollReveal } from "@/components/effects/ScrollReveal";

type FadeInUpProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FadeInUp({ children, className, delay }: FadeInUpProps) {
  return (
    <ScrollReveal className={className} delay={delay} y={24}>
      {children}
    </ScrollReveal>
  );
}
