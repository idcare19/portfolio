
"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { useSceneManager } from "./SceneManagerProvider";
import type { SceneSection } from "./scene-config";

interface Section3DWrapperProps {
  section: SceneSection;
  children: ReactNode;
  className?: string;
  threshold?: number;
}

export function Section3DWrapper({
  section,
  children,
  className = "",
  threshold = 0.35,
}: Section3DWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useSceneManager();

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          setActiveSection(section);
        }
      },
      {
        threshold,
        rootMargin: "-15% 0px -15% 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [section, threshold, setActiveSection]);

  return (
    <div
      ref={sectionRef}
      className={className}
      data-scene-section={section}
    >
      {children}
    </div>
  );
}

export default Section3DWrapper;
