"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  const hasPageBackButton =
    pathname.startsWith("/projects/") ||
    pathname.startsWith("/completed-projects/");

  if (pathname === "/" || hasPageBackButton) return null;

  return (
    <div className="fixed inset-x-0 top-24 z-[80] pointer-events-none">
      <div className="section-wrap">
        <button
          type="button"
          onClick={() => router.back()}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]/95 px-4 py-2 text-xs font-semibold text-text-muted shadow-sm backdrop-blur-xl transition hover:-translate-x-0.5 hover:border-primary/40 hover:text-primary"
          aria-label="Go back"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </div>
    </div>
  );
}
