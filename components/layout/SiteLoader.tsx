"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export function SiteLoader() {
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => setLoading(false), 1000);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="site-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.14),transparent_26%),linear-gradient(180deg,#ffffff,#f7fbff_60%,#edf5ff)] px-4"
          role="status"
          aria-live="polite"
          aria-label="Loading website"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_28%,rgba(96,165,250,0.14),transparent_18%),radial-gradient(circle_at_75%_75%,rgba(34,211,238,0.14),transparent_20%)]" />

          <motion.div
            initial={{ y: 14, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[300px] overflow-hidden rounded-[30px] border border-white/80 bg-white/75 px-7 py-7 text-center shadow-[0_24px_70px_rgba(37,99,235,0.12)] backdrop-blur-2xl"
          >
            <div className="absolute -left-10 top-0 h-24 w-24 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-24 w-24 rounded-full bg-cyan-200/35 blur-3xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent" />

            <div className="relative flex flex-col items-center gap-4">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-200/70"
                  animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-[7px] rounded-full border-2 border-cyan-300/80"
                  animate={prefersReducedMotion ? undefined : { rotate: -360 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-[13px] rounded-full bg-white/95 shadow-[0_10px_26px_rgba(37,99,235,0.14)]"
                  animate={prefersReducedMotion ? undefined : { scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10 overflow-hidden rounded-full border border-blue-100 bg-white">
                  <Image src="/projects/logo.png" alt="Site logo" width={44} height={44} priority />
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-semibold tracking-[0.08em] text-slate-800">Loading portfolio</p>
                <p className="text-[11px] text-slate-500">Preparing smooth experience…</p>
              </div>

              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                  initial={{ x: "-100%" }}
                  animate={prefersReducedMotion ? { x: "0%" } : { x: ["-100%", "100%"] }}
                  transition={prefersReducedMotion ? { duration: 0.2 } : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
