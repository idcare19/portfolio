"use client";

import { useIsMobile } from "@/lib/use-is-mobile";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  target?: "_blank" | "_self";
  download?: boolean;
};

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

const variants = {
  primary:
    "bg-primary text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] hover:bg-[#1D4ED8] hover:shadow-[0_20px_40px_rgba(37,99,235,0.28)]",
  secondary:
    "border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-main shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:bg-[rgb(var(--card-hover))] hover:shadow-[0_16px_30px_rgba(15,23,42,0.10)]",
};

function MagneticInner({
  children,
  className,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.2 });
  const rotate = useTransform(x, [-24, 24], [-4, 4]);

  return (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY, rotate }}
      onMouseMove={(event) => {
        const element = ref.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;
        x.set(offsetX * 0.2);
        y.set(offsetY * 0.2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={cn("inline-flex", className)}
    >
      {type === "submit" ? <button type={type}>{children}</button> : children}
    </motion.span>
  );
}

export function Button({ children, href, className, variant = "primary", type = "button", target, download = false }: ButtonProps) {
  const content = <span className={cn(base, variants[variant], className)}>{children}</span>;
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const lightweightMode = isMobile || prefersReducedMotion;
  const rel = target === "_blank" ? "noreferrer" : undefined;

  if (lightweightMode) {
    if (href) {
      return (
        <Link href={href} className="inline-flex" target={target} rel={rel} download={download}>
          {content}
        </Link>
      );
    }

    return type === "submit" ? <button type="submit">{content}</button> : content;
  }

  if (href) {
    return (
      <Link href={href} className="inline-flex" target={target} rel={rel} download={download}>
        <MagneticInner>{content}</MagneticInner>
      </Link>
    );
  }

  return <MagneticInner type={type}>{content}</MagneticInner>;
}
