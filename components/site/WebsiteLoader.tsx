"use client";

import { useEffect, useRef, useState } from "react";

// Edit these to your own roles. The loader lands on your name after the last one.
const ROLES = ["Designer", "Developer", "Creator"];

const MIN_DURATION = 1800; // minimum ms the loader stays up
const EXIT_MS = 900; // ms the reveal ripple takes to cross the screen
const UNMOUNT_MS = 1000; // ms after exit starts until the loader unmounts
const SPACING = 26; // px between dots
const LINE_H = 40; // px height of one roller line
const RING_SPEED = 220; // px per second the ripple travels

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function WebsiteLoader() {
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const exitStartRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLSpanElement>(null);
  const mutedRef = useRef<HTMLSpanElement>(null);

  // Lock scroll while the loader is visible
  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  // Progress + phase control
  useEffect(() => {
    let raf = 0;
    let exitTimer = 0;
    let doneTimer = 0;
    let loaded = document.readyState === "complete";
    let finished = false;
    const start = performance.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      progressRef.current = 100;
      setProgress(100);
      exitTimer = window.setTimeout(() => {
        exitStartRef.current = performance.now();
        setPhase("exit");
        doneTimer = window.setTimeout(() => setPhase("done"), UNMOUNT_MS);
      }, 500);
    };

    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad);

    const tick = (now: number) => {
      const t = Math.min((now - start) / MIN_DURATION, 1);
      // hold at 92% until the page has actually loaded
      const target = easeOutCubic(t) * (loaded ? 100 : 92);
      const next = Math.max(progressRef.current, target);
      progressRef.current = next;
      setProgress(next);

      if (t >= 1 && loaded) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // Dot field: canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const primary = primaryRef.current
      ? getComputedStyle(primaryRef.current).color
      : "rgb(59,130,246)";
    const muted = mutedRef.current
      ? getComputedStyle(mutedRef.current).color
      : "rgb(120,120,120)";

    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const t = now / 1000;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.hypot(cx, cy);
      const fillR = (progressRef.current / 100) * maxR;

      // Reveal: a ripple edge travels outward, opening a hole in the background
      let exitR = -1;
      if (exitStartRef.current !== null) {
        const e = Math.min((now - exitStartRef.current) / EXIT_MS, 1);
        exitR = easeInOutCubic(e) * maxR * 1.1;
        if (maskRef.current) {
          const m = `radial-gradient(circle at 50% 50%, transparent ${exitR}px, #000 ${exitR + 1}px)`;
          maskRef.current.style.maskImage = m;
          maskRef.current.style.webkitMaskImage = m;
        }
      }

      const cycle = maxR + 200;
      const ring1 = reduce ? -999 : (t * RING_SPEED) % cycle;
      const ring2 = reduce ? -999 : (t * RING_SPEED + cycle / 2) % cycle;

      ctx.clearRect(0, 0, w, h);

      const kx = Math.ceil(cx / SPACING);
      const ky = Math.ceil(cy / SPACING);
      let currentColor = "";

      for (let j = -ky; j <= ky; j++) {
        for (let k = -kx; k <= kx; k++) {
          const dx = k * SPACING;
          const dy = j * SPACING;

          // Quiet zone around the roller text
          if (Math.abs(dx) < 132 && Math.abs(dy) < 46) continue;

          const d = Math.hypot(dx, dy);
          if (exitR >= 0 && d < exitR - 2) continue; // inside the revealed hole

          const wave =
            Math.exp(-Math.pow((d - ring1) / 40, 2)) +
            Math.exp(-Math.pow((d - ring2) / 40, 2));
          const edge = exitR >= 0 ? Math.exp(-Math.pow((d - exitR) / 50, 2)) : 0;
          const boost = Math.min(1, wave + edge);
          const lit = d < fillR;

          const color = lit || boost > 0.25 ? primary : muted;
          if (color !== currentColor) {
            ctx.fillStyle = color;
            currentColor = color;
          }
          ctx.globalAlpha = Math.min(1, (lit ? 0.5 : 0.22) + boost * 0.5);
          ctx.beginPath();
          ctx.arc(cx + dx, cy + dy, 1.4 + boost * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (phase === "done") return null;

  const exiting = phase === "exit";
  const roleIndex =
    progress >= 100 ? ROLES.length : Math.min(ROLES.length - 1, Math.floor((progress / 100) * ROLES.length));

  const lineStyle = { height: LINE_H, lineHeight: `${LINE_H}px` };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading website"
      className={`fixed inset-0 z-[9999] text-text-main ${
        exiting ? "pointer-events-none" : ""
      }`}
    >
      {/* Colour probes: read the theme's real colours for the canvas */}
      <span ref={primaryRef} aria-hidden className="hidden text-primary" />
      <span ref={mutedRef} aria-hidden className="hidden text-text-muted" />

      {/* Background (gets a growing hole cut in it on exit) */}
      <div
        ref={maskRef}
        aria-hidden
        className="absolute inset-0 bg-[rgb(var(--page-bg))]"
      />

      {/* Dot field */}
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0" />

      {/* Role roller */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? "scale(0.96)" : "scale(1)",
          transition: "opacity 300ms ease-out, transform 300ms ease-out",
        }}
      >
        <div
          className="overflow-hidden whitespace-nowrap text-[32px] font-bold tracking-tight"
          style={{ height: LINE_H }}
        >
          <div
            style={{
              transform: `translateY(-${roleIndex * LINE_H}px)`,
              transition: "transform 600ms cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          >
            {ROLES.map((role) => (
              <div key={role} className="text-center" style={lineStyle}>
                {role}
              </div>
            ))}
            <div className="text-center" style={lineStyle}>
              idcare19<span className="text-primary">.me</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs font-semibold tabular-nums text-primary">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}