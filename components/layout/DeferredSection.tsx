"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type DeferredSectionProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  rootMargin?: string;
};

export function DeferredSection({
  children,
  id,
  className,
  rootMargin = "120px 0px",
}: DeferredSectionProps) {
  const [visible, setVisible] = useState(false);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible) {
      return;
    }

    const target = placeholderRef.current;
    if (!target) {
      setVisible(true);
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0);
        if (isVisible) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [rootMargin, visible]);

  if (!visible) {
    return <div id={id} ref={placeholderRef} className={cn("deferred-section", className)} aria-hidden="true" />;
  }

  return <div id={id} className={className}>{children}</div>;
}
