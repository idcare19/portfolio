"use client";

import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "welcome-back-popup-seen";
const SHOW_DELAY_MS = 900;
const EXIT_MS = 220;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function WelcomeBackPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false); // drives enter/exit animation
  const dialogRef = useRef<HTMLDivElement>(null);
  const exitTimer = useRef(0);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  const onMaintenance = pathname === "/maintenance";

  useEffect(() => {
    if (onMaintenance || open) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // Show the welcome message when storage is unavailable.
    }

    const timer = window.setTimeout(() => {
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      // Mark as seen as soon as it appears, so it never repeats even if the
      // visitor leaves without pressing a button.
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Ignore storage errors; closing still works for this visit.
      }
      setOpen(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [onMaintenance, open]);

  const dismiss = useCallback(() => {
    setVisible(false);
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      setOpen(false);
      returnFocusTo.current?.focus?.();
    }, EXIT_MS);
  }, []);

  // Enter animation, move focus into the dialog, lock page scroll
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      setVisible(true);
      dialogRef.current?.focus();
    });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  // Keep Tab inside the dialog while it is open
  const trapFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;
    if (e.shiftKey && (current === first || current === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && current === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open || onMaintenance) return null;

  return (
    <div className="fixed inset-0 z-[115] flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={dismiss}
        className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Card: bottom sheet on phones, centered card on larger screens */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-back-title"
        aria-describedby="welcome-back-message"
        tabIndex={-1}
        onKeyDown={trapFocus}
        className={`relative max-h-[92dvh] w-full max-w-md overflow-y-auto overflow-x-hidden rounded-t-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] pb-[env(safe-area-inset-bottom)] text-text-main shadow-2xl shadow-black/20 outline-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:shadow-black/50 sm:rounded-3xl sm:pb-0 ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        {/* Accent line + soft glow (same language as the announcement popup) */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl"
        />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close welcome message"
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-text-muted transition hover:bg-[rgb(var(--card-hover))] hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-6 pt-7 sm:p-7">
          {/* Status tile: pulses once to say "we're live again" */}
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/25 dark:text-emerald-400">
            <span
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-emerald-500/30 motion-safe:animate-[welcome-pulse_1.4s_ease-out_0.35s_2_both]"
            />
            <CheckCircle2 className="relative h-6 w-6" />
          </div>

          <p className="mt-5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Welcome back
          </p>
          <h2
            id="welcome-back-title"
            className="mt-1.5 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-[1.75rem]"
          >
            The site is back online
          </h2>
          <p
            id="welcome-back-message"
            className="mt-2.5 text-sm leading-relaxed text-text-muted sm:text-[15px]"
          >
            Thanks for your patience while we completed the maintenance update.
          </p>

          <button
            type="button"
            onClick={dismiss}
            className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Continue browsing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/*
  Add this keyframe once (globals.css), next to maintenance-slide:

  @keyframes welcome-pulse {
    0%   { transform: scale(1);   opacity: 0.7; }
    100% { transform: scale(1.7); opacity: 0; }
  }
*/