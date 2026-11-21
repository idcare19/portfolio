
"use client";

import { useEffect, useState } from "react";

export function WebsiteLoader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, 1800);

    const removeTimer = window.setTimeout(() => {
      setMounted(false);
    }, 2350);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-label="Loading website"
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#fafafa] text-[#111111] transition-opacity duration-500 dark:bg-[#fafafa] ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex w-full max-w-xs flex-col items-center px-8">
        {/* BRAND */}
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111111] text-sm font-black text-white">
            i
          </span>

          <span className="text-xl font-bold tracking-tight">
            idcare19<span className="text-neutral-400">.me</span>
          </span>
        </div>

        <p className="mb-9 text-[9px] font-semibold uppercase tracking-[0.32em] text-neutral-400">
          Digital Portfolio
        </p>

        {/* LOOPING LOADER */}
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full w-[35%] rounded-full bg-[#111111] animate-website-loader" />
        </div>

        <div className="mt-3 flex w-full items-center justify-between">
          <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            Initializing experience
          </span>

          <span className="text-[9px] font-semibold tracking-widest text-neutral-500">
            LOADING
          </span>
        </div>
      </div>
    </div>
  );
}
