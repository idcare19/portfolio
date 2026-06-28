import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mx-auto mb-12 max-w-3xl text-center", className)}>
      <Badge className="mb-4">{eyebrow}</Badge>
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-text-main sm:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-text-muted">{description}</p> : null}
    </div>
  );
}
