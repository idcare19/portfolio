
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

type ProjectedPoint = {
  x: number;
  y: number;
  z: number;
  perspective: number;
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
  backgroundColor = "transparent",
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

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId = 0;
    let lastTime = 0;
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

    const particles = Array.from(
      { length: backgroundParticleCount },
      () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.2 + 0.25,
        alpha: Math.random() * 0.3 + 0.08,
        speed: Math.random() * 0.000035 + 0.000012,
        phase: Math.random() * Math.PI * 2,
      })
    );

    const pulseNodes = wireVertices.map((point) => ({
      point,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rotate = (point: Point3D): Point3D => {
      const [x, y, z] = point;

      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);

      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      const rx = x * cy - z * sy;
      const rz = x * sy + z * cy;

      return [
        rx,
        y * cp - rz * sp,
        y * sp + rz * cp,
      ];
    };

    const project = (point: Point3D): ProjectedPoint => {
      const [x, y, z] = rotate(point);

      const scale =
        Math.min(width, height) * 0.34 * brainScale;

      const perspective = 3.5 / (3.5 + z);

      return {
        x: width / 2 + x * scale * perspective,
        y: height / 2 - y * scale * perspective,
        z,
        perspective,
      };
    };

    const drawParticles = (delta: number) => {
      for (const particle of particles) {
        particle.y -= particle.speed * delta;

        const twinkle =
          0.75 + Math.sin(elapsed * 0.0007 + particle.phase) * 0.25;

        if (particle.y < 0) {
          particle.y = 1;
          particle.x = Math.random();
        }

        ctx.beginPath();

        ctx.arc(
          particle.x * width,
          particle.y * height,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = particleColor;
        ctx.globalAlpha = particle.alpha * twinkle;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const drawMesh = () => {
      for (const face of meshFaces) {
        if (!Array.isArray(face) || face.length < 3) continue;

        const points = face
          .map((index) => meshVertices[index])
          .filter((point): point is Point3D => Boolean(point))
          .map(project);

        if (points.length < 3) continue;

        const depth =
          points.reduce((sum, point) => sum + point.z, 0) /
          points.length;

        const alpha = Math.max(
          0.008,
          Math.min(0.045, (depth + 2.2) * 0.012)
        );

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.closePath();

        ctx.fillStyle = `rgba(20, 24, 32, ${alpha * 1.5})`;
        ctx.fill();
      }
    };

    const drawWireframe = () => {
      for (const face of wireFaces) {
        if (!Array.isArray(face) || face.length < 2) continue;

        const points = face
          .map((index) => wireVertices[index])
          .filter((point): point is Point3D => Boolean(point))
          .map(project);

        if (points.length < 2) continue;

        const depth =
          points.reduce((sum, point) => sum + point.z, 0) /
          points.length;

        const depthAlpha = Math.max(
          0.035,
          Math.min(0.5, (depth + 2.5) * 0.13)
        );

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.strokeStyle = `rgba(110, 120, 140, ${depthAlpha * lineBrightness})`;

        ctx.lineWidth = Math.max(
          0.25,
          lineWidth * points[0].perspective
        );

        ctx.stroke();
      }
    };

    const drawNodes = () => {
      for (const node of pulseNodes) {
        const point = project(node.point);

        const dx = pointerX - point.x;
        const dy = pointerY - point.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        let hover = 0;

        if (distance < HOVER_RADIUS) {
          hover =
            (1 - distance / HOVER_RADIUS) * HOVER_STRENGTH;
        }

        const breathing =
          0.9 +
          Math.sin(elapsed * 0.0012 + node.phase) * 0.1;

        const radius =
          Math.max(0.3, nodeSize * point.perspective) *
          breathing *
          (1 + hover * 0.8);

        const glowRadius = radius * (4 + hover * 5);

        const glow = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          glowRadius
        );

       glow.addColorStop(
  0,
  `rgba(235, 240, 248, ${0.4 * nodeBrightness + hover * 0.35})`
);

glow.addColorStop(0.3, "rgba(110, 120, 140, 0.15)");
glow.addColorStop(1, "rgba(40, 45, 55, 0)");

        ctx.beginPath();
        ctx.arc(point.x, point.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(235, 240, 248, ${Math.min(
  1,
  nodeBrightness * breathing
)})`;

        ctx.fill();
      }
    };

    const drawEnergyPulse = (time: number) => {
      if (!pulseEnabled || wireVertices.length === 0) return;

      const progress =
        ((time * 0.00009 * pulseSpeed) % 1) *
        wireVertices.length;

      const index = Math.floor(progress);
      const nextIndex = (index + 1) % wireVertices.length;

      const mix = progress - index;

      const current = project(wireVertices[index]);
      const next = project(wireVertices[nextIndex]);

      const x = current.x + (next.x - current.x) * mix;
      const y = current.y + (next.y - current.y) * mix;

      const radius = 42;

      const glow = ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        radius
      );

     glow.addColorStop(0, "#FFFFFF");
glow.addColorStop(0.12, "rgba(210, 220, 235, 0.55)");
glow.addColorStop(0.45, "rgba(110, 120, 140, 0.14)");
glow.addColorStop(1, "rgba(40, 45, 55, 0)");
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = pulseColor;
      ctx.shadowColor = pulseColor;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const render = (time: number) => {
      const delta = Math.min(
        lastTime === 0 ? 16.67 : time - lastTime,
        32
      );

      lastTime = time;
      elapsed += delta;

      ctx.clearRect(0, 0, width, height);

      drawParticles(delta);

      if (autoRotation && !dragging) {
        yaw += autoRotationSpeed * 0.001 * delta;
      }

      if (!dragging) {
        yaw += velocityX;
        pitch += velocityY;

        velocityX *= Math.pow(INERTIA, delta / 16.67);
        velocityY *= Math.pow(INERTIA, delta / 16.67);
      }

      pitch = Math.max(
        -MAX_PITCH,
        Math.min(MAX_PITCH, pitch)
      );

      drawMesh();
      drawWireframe();
      drawNodes();
      drawEnergyPulse(time);

      animationId = requestAnimationFrame(render);
    };

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
      const rect = canvas.getBoundingClientRect();

      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;

      if (!dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      velocityX = dx * 0.0008;
      velocityY = dy * 0.0008;

      yaw += dx * 0.006;
      pitch += dy * 0.006;

      lastX = event.clientX;
      lastY = event.clientY;
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

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        lastTime = 0;
        animationId = requestAnimationFrame(render);
      }
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    if (!document.hidden) {
      animationId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationId);

      resizeObserver.disconnect();

      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);

      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );
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
        }}
      />
    </div>
  );
}
