"use client";

import { motion, useReducedMotion } from "framer-motion";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function SplitText({ text, className, delay = 0 }: SplitTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block overflow-hidden align-baseline">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`${char}-${charIndex}`}
              className="inline-block"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28, filter: "blur(10px)" }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + wordIndex * 0.06 + charIndex * 0.015,
              }}
            >
              {char}
            </motion.span>
          ))}
          <span className="inline-block w-[0.35em]">&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
