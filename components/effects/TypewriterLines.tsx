"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type TypewriterLinesProps = {
  text: string;
  className?: string;
  typeSpeedMs?: number;
  holdMs?: number;
};

export function TypewriterLines({
  text,
  className,
  typeSpeedMs = 95,
  holdMs = 1800,
}: TypewriterLinesProps) {
  const prefersReducedMotion = useReducedMotion();
  const disableTypewriter = prefersReducedMotion;
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting">("typing");

  useEffect(() => {
    if (disableTypewriter) {
      return;
    }

    setCharCount(0);
    setPhase("typing");
  }, [disableTypewriter, text]);

  useEffect(() => {
    if (disableTypewriter) {
      return;
    }

    const deleteSpeedMs = Math.max(120, Math.round(typeSpeedMs * 0.72));

    if (phase === "typing") {
      if (charCount >= text.length) {
        setPhase("hold");
        return;
      }

      const timer = window.setTimeout(() => {
        setCharCount((value) => Math.min(value + 1, text.length));
      }, typeSpeedMs);

      return () => window.clearTimeout(timer);
    }

    if (phase === "hold") {
      const holdTimer = window.setTimeout(() => {
        setPhase("deleting");
      }, holdMs);

      return () => window.clearTimeout(holdTimer);
    }

    if (phase === "deleting") {
      if (charCount <= 0) {
        setPhase("typing");
        return;
      }

      const timer = window.setTimeout(() => {
        setCharCount((value) => Math.max(value - 1, 0));
      }, deleteSpeedMs);

      return () => window.clearTimeout(timer);
    }
  }, [charCount, disableTypewriter, holdMs, phase, text, typeSpeedMs]);

  if (disableTypewriter) {
    return (
      <span className={className}>
        <span className="block min-h-[1.05em] leading-[1.05]">{text}</span>
      </span>
    );
  }

  const animatedText = text.slice(0, charCount);
  const showCaret = phase === "typing" || phase === "hold" || phase === "deleting";

  return (
    <span className={className}>
      <span className="block min-h-[1.05em] leading-[1.05]">
        {animatedText}
        {showCaret ? <span className="typing-caret" aria-hidden /> : null}
      </span>
    </span>
  );
}
