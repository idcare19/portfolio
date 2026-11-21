
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SCENE_SETTINGS } from "./scene-config";

interface SceneInteraction {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

interface UseSceneInteractionOptions {
  enabled?: boolean;
  sensitivity?: number;
  maxRotation?: number;
}

export function useSceneInteraction({
  enabled = true,
  sensitivity = SCENE_SETTINGS.mouseSensitivity,
  maxRotation = SCENE_SETTINGS.maxMouseRotation,
}: UseSceneInteractionOptions = {}): SceneInteraction {
  const [interaction, setInteraction] = useState<SceneInteraction>({
    mouseX: 0,
    mouseY: 0,
    scrollProgress: 0,
  });

  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  const updateInteraction = useCallback(() => {
    frameRef.current = null;

    setInteraction((previous) => {
      const next = {
        mouseX: pointerRef.current.x,
        mouseY: pointerRef.current.y,
        scrollProgress: scrollRef.current,
      };

      if (
        previous.mouseX === next.mouseX &&
        previous.mouseY === next.mouseY &&
        previous.scrollProgress === next.scrollProgress
      ) {
        return previous;
      }

      return next;
    });
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(updateInteraction);
  }, [updateInteraction]);

  useEffect(() => {
    if (!enabled) {
      setInteraction({
        mouseX: 0,
        mouseY: 0,
        scrollProgress: 0,
      });
      return;
    }

    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    const handlePointerMove = (event: PointerEvent) => {
      if (!isFinePointer) return;

      const normalizedX =
        (event.clientX / window.innerWidth - 0.5) * 2;

      const normalizedY =
        (event.clientY / window.innerHeight - 0.5) * 2;

      pointerRef.current = {
        x: normalizedX * maxRotation * sensitivity * 10,
        y: -normalizedY * maxRotation * sensitivity * 10,
      };

      scheduleUpdate();
    };

    const handlePointerLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
      scheduleUpdate();
    };

    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      scrollRef.current =
        scrollableHeight > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
          : 0;

      scheduleUpdate();
    };

    if (isFinePointer) {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      window.addEventListener("blur", handlePointerLeave);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [enabled, maxRotation, sensitivity, scheduleUpdate]);

  return interaction;
}
