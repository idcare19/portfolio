
"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const root = document.documentElement;

      const maxScroll = Math.max(
        root.scrollHeight - root.clientHeight,
        0,
      );

      const progress =
        maxScroll > 0
          ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
          : 0;

      progressRef.current = progress;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }

      const progressBar = barRef.current?.parentElement;

      progressBar?.setAttribute(
        "aria-valuenow",
        String(Math.round(progress * 100)),
      );
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        updateProgress();
        frameRef.current = null;
      });
    };

    updateProgress();

    window.addEventListener("scroll", requestUpdate, {
      passive: true,
    });

    window.addEventListener("resize", requestUpdate, {
      passive: true,
    });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(requestUpdate)
        : null;

    resizeObserver?.observe(document.documentElement);

    // Catch late-loading images, fonts and dynamic content.
    window.addEventListener("load", requestUpdate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("load", requestUpdate);

      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div
        ref={barRef}
        className="portfolio-scroll-progress relative h-full origin-left scale-x-0"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-white/30 opacity-40"
        />
      </div>
    </div>
  );
}
