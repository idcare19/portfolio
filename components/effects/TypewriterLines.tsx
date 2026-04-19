"use client";

import { useEffect, useState } from "react";

type TypewriterLinesProps = {
  lines: [string, string];
  className?: string;
  typeSpeedMs?: number;
  holdMs?: number;
};

export function TypewriterLines({
  lines,
  className,
  typeSpeedMs = 44,
  holdMs = 1400,
}: TypewriterLinesProps) {
  const [firstCount, setFirstCount] = useState(0);
  const [secondCount, setSecondCount] = useState(0);
  const [phase, setPhase] = useState<"line1" | "line2" | "hold">("line1");

  const firstLine = lines[0];
  const secondLine = lines[1];

  const firstText = firstLine.slice(0, firstCount);
  const secondText = secondLine.slice(0, secondCount);

  useEffect(() => {
    if (phase === "line1") {
      if (firstCount >= firstLine.length) {
        setPhase("line2");
        return;
      }

      const timer = window.setTimeout(() => {
        setFirstCount((value) => value + 1);
      }, typeSpeedMs);

      return () => window.clearTimeout(timer);
    }

    if (phase === "line2") {
      if (secondCount >= secondLine.length) {
        setPhase("hold");
        return;
      }

      const timer = window.setTimeout(() => {
        setSecondCount((value) => value + 1);
      }, typeSpeedMs);

      return () => window.clearTimeout(timer);
    }

    if (phase === "hold") {
      const holdTimer = window.setTimeout(() => {
        setFirstCount(0);
        setSecondCount(0);
        setPhase("line1");
      }, holdMs);

      return () => window.clearTimeout(holdTimer);
    }
  }, [firstCount, firstLine.length, holdMs, phase, secondCount, secondLine.length, typeSpeedMs]);

  const showCaretOnFirst = phase === "line1";
  const showCaretOnSecond = phase === "line2" || phase === "hold";

  return (
    <span className={className}>
      <span className="block min-h-[1.05em] leading-[1.05]">
        {firstText}
        {showCaretOnFirst ? <span className="typing-caret" aria-hidden /> : null}
      </span>
      <span className="block min-h-[1.05em] leading-[1.05]">
        {secondText}
        {showCaretOnSecond ? <span className="typing-caret" aria-hidden /> : null}
      </span>
    </span>
  );
}
