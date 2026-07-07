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
  if (!eyebrow && !title && !description) {
    return null;
  }

  return (
    <div className={cn("mx-auto mb-12 max-w-3xl text-center sm:mb-14", className)}>
      {eyebrow ? <Badge className="mb-4">{eyebrow}</Badge> : null}
      {title ? <h2 className="text-3xl font-semibold tracking-[-0.05em] text-text-main sm:text-5xl">{title}</h2> : null}
      {description ? <p className="mt-4 text-sm leading-7 text-text-muted sm:text-base">{description}</p> : null}
    </div>
  );
}
