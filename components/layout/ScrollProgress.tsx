"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const element = barRef.current;
      if (!element) {
        return;
      }

      const root = document.documentElement;
      const maxScroll = root.scrollHeight - root.clientHeight;
      const ratio = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
      element.style.transform = `scaleX(${ratio})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 overflow-hidden">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-400 transition-transform duration-150 ease-out"
      />
    </div>
  );
}
