"use client";

import { useEffect, useRef } from "react";

import {
  brainMeshVertices,
  brainMeshFaces,
  brainWireVertices,
  brainWireFaces,
} from "./brainData";

type Point3D = [number, number, number];

type NeuralBrainProps = {
  className?: string;
  style?: React.CSSProperties;
  brainScale?: number;
  nodeSize?: number;
  nodeBrightness?: number;
  lineBrightness?: number;
  lineWidth?: number;
  pulseColor?: string;
  backgroundColor?: string;
  particleColor?: string;
  autoRotation?: boolean;
  autoRotationSpeed?: number;
  pulseEnabled?: boolean;
  pulseSpeed?: number;
  backgroundParticleCount?: number;
};

export default function NeuralBrain({
  className,
  style,
  brainScale = 1.25,
  nodeSize = 0.55,
  nodeBrightness = 1.08,
  lineBrightness = 0.55,
  lineWidth = 0.6,
  pulseColor = "#D9C7FF",
  particleColor = "#B8B4D8",
  autoRotation = true,
  autoRotationSpeed = 0.025,
  pulseEnabled = true,
  pulseSpeed = 0.7,
  backgroundParticleCount = 55,
}: NeuralBrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // ---------- Device profile ----------
    const isMobile =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const MAX_DPR = isMobile ? 1 : 2;
    const FRAME_INTERVAL = isMobile ? 1000 / 30 : 0; // 30fps cap on mobile
    const WIRE_BUCKETS = isMobile ? 4 : 6;
    const MESH_BUCKETS = 3;
    const NODE_STRIDE = isMobile ? 2 : 1; // draw every Nth node on mobile
    const DRAW_MESH = !isMobile; // mesh fill is almost invisible, skip on mobile
    const PARTICLES = isMobile
      ? Math.min(backgroundParticleCount, 20)
      : backgroundParticleCount;

    let width = 0;
    let height = 0;
    let animationId = 0;
    let lastDrawn = 0;
    let elapsed = 0;

    let yaw = 0;
    let pitch = 0;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velocityX = 0;
    let velocityY = 0;

    let pointerX = -10000;
    let pointerY = -10000;

    const MAX_PITCH = 1.13;
    const INERTIA = 0.94;
    const HOVER_RADIUS = 110;
    const HOVER_STRENGTH = 0.75;

    const meshVertices = brainMeshVertices as Point3D[];
    const meshFaces = brainMeshFaces as number[][];
    const wireVertices = brainWireVertices as Point3D[];
    const wireFaces = brainWireFaces as number[][];

    // ---------- One-time precomputation ----------

    // Unique wire edges (shared edges were stroked several times before)
    const edgeSet = new Set<number>();
    const edgeList: number[] = [];
    const vCount = wireVertices.length;
    for (const face of wireFaces) {
      if (!Array.isArray(face) || face.length < 2) continue;
      for (let i = 0; i < face.length - 1; i++) {
        const a = face[i];
        const b = face[i + 1];
        if (!wireVertices[a] || !wireVertices[b]) continue;
        const key = Math.min(a, b) * vCount + Math.max(a, b);
        if (edgeSet.has(key)) continue;
        edgeSet.add(key);
        edgeList.push(a, b);
      }
    }
    const edges = Uint32Array.from(edgeList);
    const edgeCount = edges.length / 2;
    const edgeBucket = new Uint8Array(edgeCount);

    const validMeshFaces = DRAW_MESH
      ? meshFaces.filter(
          (f) =>
            Array.isArray(f) &&
            f.length >= 3 &&
            f.every((i) => Boolean(meshVertices[i]))
        )
      : [];
    const meshBucket = new Uint8Array(validMeshFaces.length);

    // Projected vertex buffers: x, y, z, perspective
    const wireProj = new Float32Array(wireVertices.length * 4);
    const meshProj = new Float32Array(
      DRAW_MESH ? meshVertices.length * 4 : 0
    );

    const particles = Array.from({ length: PARTICLES }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.2 + 0.25,
      alpha: Math.random() * 0.3 + 0.08,
      speed: Math.random() * 0.000035 + 0.000012,
      phase: Math.random() * Math.PI * 2,
    }));

    const nodePhases = Float32Array.from(
      { length: wireVertices.length },
      () => Math.random() * Math.PI * 2
    );

    // Pre-rendered glow sprites (no gradient creation inside the frame loop)
    const makeSprite = (rgb: string) => {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      grad.addColorStop(0, `rgba(${rgb}, 1)`);
      grad.addColorStop(0.3, `rgba(${rgb}, 0.32)`);
      grad.addColorStop(1, `rgba(${rgb}, 0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      return c;
    };
    const spriteDark = makeSprite("225, 232, 245");
    const spriteLight = makeSprite("37, 99, 235");

    const pulseSprite = makeSprite("215, 225, 240");

    // ---------- Theme (cached, not read per face) ----------
    let dark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
      if (reducedMotion) drawFrame(0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ---------- Sizing ----------
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // ignore tiny changes (mobile address bar show/hide)
      if (
        width &&
        Math.abs(rect.width - width) < 1 &&
        Math.abs(rect.height - height) < 1
      ) {
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) drawFrame(0);
    };

    // ---------- Projection (rotation trig computed once per frame) ----------
    let cy = 1,
      sy = 0,
      cp = 1,
      sp = 0,
      scale = 1;

    const prepareFrame = () => {
      cy = Math.cos(yaw);
      sy = Math.sin(yaw);
      cp = Math.cos(pitch);
      sp = Math.sin(pitch);
      scale = Math.min(width, height) * 0.34 * brainScale;
    };

    const projectAll = (src: Point3D[], out: Float32Array) => {
      const halfW = width / 2;
      const halfH = height / 2;
      for (let i = 0, o = 0; i < src.length; i++, o += 4) {
        const p = src[i];
        const x = p[0];
        const y = p[1];
        const z = p[2];
        const rx = x * cy - z * sy;
        const rz = x * sy + z * cy;
        const ry = y * cp - rz * sp;
        const rz2 = y * sp + rz * cp;
        const persp = 3.5 / (3.5 + rz2);
        out[o] = halfW + rx * scale * persp;
        out[o + 1] = halfH - ry * scale * persp;
        out[o + 2] = rz2;
        out[o + 3] = persp;
      }
    };

    // ---------- Draw passes ----------
    const drawParticles = (delta: number) => {
      ctx.fillStyle = particleColor;
      for (const p of particles) {
        p.y -= p.speed * delta;
        if (p.y < 0) {
          p.y = 1;
          p.x = Math.random();
        }
        const twinkle = 0.75 + Math.sin(elapsed * 0.0007 + p.phase) * 0.25;
        ctx.globalAlpha = p.alpha * twinkle;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawMesh = () => {
      projectAll(meshVertices, meshProj);

      for (let f = 0; f < validMeshFaces.length; f++) {
        const face = validMeshFaces[f];
        let z = 0;
        for (let i = 0; i < face.length; i++) z += meshProj[face[i] * 4 + 2];
        z /= face.length;
        const alpha = Math.max(0.008, Math.min(0.045, (z + 2.2) * 0.012));
        meshBucket[f] = Math.round(
          ((alpha - 0.008) / 0.037) * (MESH_BUCKETS - 1)
        );
      }

      for (let b = 0; b < MESH_BUCKETS; b++) {
        const alpha = 0.008 + (b / (MESH_BUCKETS - 1)) * 0.037;
        ctx.fillStyle = dark
          ? `rgba(20, 24, 32, ${alpha * 1.5})`
          : `rgba(226, 232, 240, ${alpha * 1.8})`;
        ctx.beginPath();
        for (let f = 0; f < validMeshFaces.length; f++) {
          if (meshBucket[f] !== b) continue;
          const face = validMeshFaces[f];
          ctx.moveTo(meshProj[face[0] * 4], meshProj[face[0] * 4 + 1]);
          for (let i = 1; i < face.length; i++) {
            ctx.lineTo(meshProj[face[i] * 4], meshProj[face[i] * 4 + 1]);
          }
          ctx.closePath();
        }
        ctx.fill();
      }
    };

    const drawWireframe = () => {
      for (let e = 0; e < edgeCount; e++) {
        const z =
          (wireProj[edges[e * 2] * 4 + 2] +
            wireProj[edges[e * 2 + 1] * 4 + 2]) /
          2;
        const a = Math.max(0.035, Math.min(0.5, (z + 2.5) * 0.13));
        edgeBucket[e] = Math.round(
          ((a - 0.035) / 0.465) * (WIRE_BUCKETS - 1)
        );
      }

      ctx.lineWidth = Math.max(0.35, lineWidth);

      for (let b = 0; b < WIRE_BUCKETS; b++) {
        const depthAlpha = 0.035 + (b / (WIRE_BUCKETS - 1)) * 0.465;
        ctx.strokeStyle = dark
          ? `rgba(110, 120, 140, ${depthAlpha * lineBrightness})`
          : `rgba(71, 85, 105, ${depthAlpha * lineBrightness * 1.3})`;
        ctx.beginPath();
        for (let e = 0; e < edgeCount; e++) {
          if (edgeBucket[e] !== b) continue;
          const a = edges[e * 2] * 4;
          const c = edges[e * 2 + 1] * 4;
          ctx.moveTo(wireProj[a], wireProj[a + 1]);
          ctx.lineTo(wireProj[c], wireProj[c + 1]);
        }
        ctx.stroke();
      }
    };

    const drawNodes = () => {
      const sprite = dark ? spriteDark : spriteLight;
      const baseAlpha = Math.min(1, 0.4 * nodeBrightness);
      const hoverEnabled = !isMobile && pointerX > -1000;

      // glows
      for (let i = 0; i < wireVertices.length; i += NODE_STRIDE) {
        const o = i * 4;
        const x = wireProj[o];
        const y = wireProj[o + 1];
        const persp = wireProj[o + 3];

        let hover = 0;
        if (hoverEnabled) {
          const dx = pointerX - x;
          const dy = pointerY - y;
          const d2 = dx * dx + dy * dy;
          if (d2 < HOVER_RADIUS * HOVER_RADIUS) {
            hover = (1 - Math.sqrt(d2) / HOVER_RADIUS) * HOVER_STRENGTH;
          }
        }

        const breathing = isMobile
          ? 1
          : 0.9 + Math.sin(elapsed * 0.0012 + nodePhases[i]) * 0.1;
        const radius =
          Math.max(0.3, nodeSize * persp) * breathing * (1 + hover * 0.8);
        const glowRadius = radius * (4 + hover * 5);

        ctx.globalAlpha = Math.min(1, baseAlpha + hover * 0.35);
        ctx.drawImage(
          sprite,
          x - glowRadius,
          y - glowRadius,
          glowRadius * 2,
          glowRadius * 2
        );
      }
      ctx.globalAlpha = 1;

      // cores: one batched path
      ctx.fillStyle = dark
        ? `rgba(235, 240, 248, ${Math.min(1, nodeBrightness)})`
        : `rgba(37, 99, 235, ${Math.min(1, nodeBrightness)})`;
      ctx.beginPath();
      for (let i = 0; i < wireVertices.length; i += NODE_STRIDE) {
        const o = i * 4;
        const r = Math.max(0.3, nodeSize * wireProj[o + 3]);
        ctx.moveTo(wireProj[o] + r, wireProj[o + 1]);
        ctx.arc(wireProj[o], wireProj[o + 1], r, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const drawEnergyPulse = (time: number) => {
      if (!pulseEnabled || wireVertices.length === 0) return;

      const progress =
        ((time * 0.00009 * pulseSpeed) % 1) * wireVertices.length;
      const index = Math.floor(progress) % wireVertices.length;
      const nextIndex = (index + 1) % wireVertices.length;
      const mix = progress - Math.floor(progress);

      const a = index * 4;
      const b = nextIndex * 4;
      const x = wireProj[a] + (wireProj[b] - wireProj[a]) * mix;
      const y = wireProj[a + 1] + (wireProj[b + 1] - wireProj[a + 1]) * mix;

      const radius = 42;
      ctx.drawImage(pulseSprite, x - radius, y - radius, radius * 2, radius * 2);

      ctx.fillStyle = pulseColor;
      if (!isMobile) {
        ctx.shadowColor = pulseColor;
        ctx.shadowBlur = 16;
      }
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawFrame = (delta: number, time = 0) => {
      ctx.clearRect(0, 0, width, height);

      drawParticles(delta);
      prepareFrame();
      projectAll(wireVertices, wireProj);

      if (DRAW_MESH) drawMesh();
      drawWireframe();
      drawNodes();
      drawEnergyPulse(time);
    };

    // ---------- Loop ----------
    let firstFrameShown = false;

    const render = (time: number) => {
      animationId = requestAnimationFrame(render);

      if (lastDrawn !== 0 && time - lastDrawn < FRAME_INTERVAL - 1) return;

      const delta = Math.min(lastDrawn === 0 ? 16.67 : time - lastDrawn, 50);
      lastDrawn = time;
      elapsed += delta;

      const step = delta / 16.67;

      if (autoRotation && !dragging) {
        yaw += autoRotationSpeed * 0.001 * delta;
      }

      if (!dragging) {
        yaw += velocityX * step;
        pitch += velocityY * step;
        const decay = Math.pow(INERTIA, step);
        velocityX *= decay;
        velocityY *= decay;
      }

      pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch));

      drawFrame(delta, time);

      if (!firstFrameShown) {
        firstFrameShown = true;
        canvas.style.opacity = "1";
      }
    };

    const startLoop = () => {
      cancelAnimationFrame(animationId);
      lastDrawn = 0;
      animationId = requestAnimationFrame(render);
    };

    const stopLoop = () => cancelAnimationFrame(animationId);

    // ---------- Pointer ----------
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      velocityX = 0;
      velocityY = 0;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isMobile) {
        const rect = canvas.getBoundingClientRect();
        pointerX = event.clientX - rect.left;
        pointerY = event.clientY - rect.top;
      }

      if (!dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      velocityX = dx * 0.0008;
      velocityY = dy * 0.0008;

      yaw += dx * 0.006;
      pitch += dy * 0.006;

      lastX = event.clientX;
      lastY = event.clientY;

      if (reducedMotion) drawFrame(0);
    };

    const onPointerUp = () => {
      dragging = false;
      canvas.style.cursor = "grab";
    };

    const onPointerLeave = () => {
      if (!dragging) {
        pointerX = -10000;
        pointerY = -10000;
      }
    };

    // ---------- Visibility ----------
    let isIntersecting = false;
    let started = false;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (!started || reducedMotion) return;
        if (isIntersecting && !document.hidden) startLoop();
        else stopLoop();
      },
      { rootMargin: "100px" }
    );

    const onVisibilityChange = () => {
      if (!started || reducedMotion) return;
      if (document.hidden || !isIntersecting) stopLoop();
      else startLoop();
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Start after the page has painted so the hero text/UI is never blocked
    const begin = () => {
      started = true;
      if (reducedMotion) {
        drawFrame(0);
        canvas.style.opacity = "1";
        return;
      }
      if (isIntersecting && !document.hidden) startLoop();
    };

    let idleId = 0;
    let timeoutId = 0;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (win.requestIdleCallback) {
      idleId = win.requestIdleCallback(begin, { timeout: 600 });
    } else {
      timeoutId = window.setTimeout(begin, 150);
    }

    return () => {
      stopLoop();
      if (idleId && win.cancelIdleCallback) win.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);

      themeObserver.disconnect();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [
    brainScale,
    nodeSize,
    nodeBrightness,
    lineBrightness,
    lineWidth,
    pulseColor,
    autoRotation,
    autoRotationSpeed,
    pulseEnabled,
    pulseSpeed,
    backgroundParticleCount,
    particleColor,
  ]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "transparent",
        touchAction: "pan-y",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label="Interactive animated neural brain visualization"
        role="img"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 0.6s ease",
        }}
      />
    </div>
  );
}