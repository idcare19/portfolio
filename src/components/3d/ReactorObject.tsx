
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface ReactorObjectProps {
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  translateY?: number;
  mouseX?: number;
  mouseY?: number;
  interactive?: boolean;
  className?: string;
}

export function ReactorObject({
  rotateX = -12,
  rotateY = 0,
  rotateZ = -8,
  scale = 1,
  translateY = 0,
  mouseX = 0,
  mouseY = 0,
  interactive = true,
  className = "",
}: ReactorObjectProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const motionEnabled = mounted && !reduceMotion;

  return (
    <div
      className={`reactor-scene relative isolate flex items-center justify-center ${className}`}
      aria-hidden="true"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient lighting */}
      <div className="reactor-glow reactor-glow-primary" />
      <div className="reactor-glow reactor-glow-secondary" />

      <motion.div
        className="reactor-stage relative"
        initial={false}
        animate={{
          rotateX: rotateX + (interactive ? mouseY : 0),
          rotateY: rotateY + (interactive ? mouseX : 0),
          rotateZ,
          scale,
          y: translateY,
        }}
        transition={{
          duration: motionEnabled ? 1.2 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main metallic body */}
        <motion.div
          className="reactor-core"
          animate={
            motionEnabled
              ? { rotateY: [0, 360] }
              : { rotateY: 0 }
          }
          transition={{
            duration: 28,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <div className="reactor-core-face reactor-core-front" />
          <div className="reactor-core-face reactor-core-back" />
          <div className="reactor-core-center" />
        </motion.div>

        {/* Outer chrome orbit */}
        <motion.div
          className="reactor-orbit reactor-orbit-one"
          animate={
            motionEnabled
              ? { rotateZ: [0, 360] }
              : { rotateZ: 0 }
          }
          transition={{
            duration: 24,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Inner orbit */}
        <motion.div
          className="reactor-orbit reactor-orbit-two"
          animate={
            motionEnabled
              ? { rotateZ: [360, 0] }
              : { rotateZ: 0 }
          }
          transition={{
            duration: 18,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Floating metallic particles */}
        <motion.div
          className="reactor-particle reactor-particle-one"
          animate={
            motionEnabled
              ? { y: [-12, 12, -12], opacity: [0.5, 1, 0.5] }
              : {}
          }
          transition={{ duration: 5, repeat: Infinity }}
        />

        <motion.div
          className="reactor-particle reactor-particle-two"
          animate={
            motionEnabled
              ? { y: [10, -10, 10], opacity: [0.4, 0.9, 0.4] }
              : {}
          }
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="reactor-highlight" />
      </motion.div>
    </div>
  );
}
