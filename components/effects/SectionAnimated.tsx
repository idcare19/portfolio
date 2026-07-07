"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import type { SiteData } from "@/src/types/site-data";
import { defaultAnimationConfig } from "@/lib/animation-presets";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { useIsMobile } from "@/lib/use-is-mobile";

function getVariant(preset: string, direction: string, intensity: number) {
  const move = 24 * intensity;
  switch (preset) {
    case "Fade Up": return { opacity: 0, y: move };
    case "Fade Down": return { opacity: 0, y: -move };
    case "Fade Left": return { opacity: 0, x: move };
    case "Fade Right": return { opacity: 0, x: -move };
    case "Scale":
    case "Zoom In": return { opacity: 0, scale: 0.92 };
    case "Zoom Out": return { opacity: 0, scale: 1.08 };
    case "Rotate": return { opacity: 0, rotate: direction === "left" ? -8 : 8, y: move / 2 };
    case "Flip X": return { opacity: 0, rotateX: -30 };
    case "Flip Y": return { opacity: 0, rotateY: -30 };
    case "Blur In": return { opacity: 0, filter: "blur(10px)", y: move / 2 };
    case "3D Rotate":
      return { opacity: 0, rotateX: 42, rotateY: direction === "left" ? -18 : 18, y: move / 2, scale: 0.96 };
    default: return { opacity: 0, y: move / 2 };
  }
}

export function SectionAnimated({ sectionId, children, className }: { sectionId: string; children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const siteData = useSiteDataContext();
  const config = useMemo(() => ({ ...defaultAnimationConfig(sectionId), ...(siteData.websiteControl?.animations?.[sectionId] || {}) }), [sectionId, siteData.websiteControl?.animations]);
  const deviceAllowed = (isMobile ? config.mobile !== false : config.desktop !== false) && (!isMobile || config.mobile !== false);
  const initial = reduce || !config.enabled || !deviceAllowed ? false : getVariant(config.preset, config.direction, config.intensity || 0.7);
  const transition = { duration: config.duration, delay: config.delay, ease: "easeOut" as const };
  const viewport = { once: config.once, amount: 0.18 };
  const motionProps =
    config.trigger === "Continuous"
      ? { animate: reduce ? undefined : { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, filter: "blur(0px)" } }
      : config.trigger === "On Hover"
        ? { whileHover: reduce ? undefined : { scale: 1.01 } }
        : config.trigger === "On Click"
          ? { whileTap: reduce ? undefined : { scale: 0.99 } }
        : { whileInView: reduce ? undefined : { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, filter: "blur(0px)" } };

  if (process.env.NODE_ENV === "development") {
    console.debug("[section-animation]", {
      sectionId,
      preset: config.preset,
      enabled: config.enabled,
      trigger: config.trigger,
      once: config.once,
    });
  }
  return (
    <motion.div initial={initial as any} viewport={viewport} transition={transition} className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
