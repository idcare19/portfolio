"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminNav } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

export function MobileAdminHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          aria-label="Open admin menu"
        >
          Menu
        </button>
        <div className="min-w-0 text-right">
          <p className="truncate text-xs font-semibold uppercase tracking-widest text-blue-700">Admin Panel</p>
          <p className="truncate text-sm font-bold text-slate-900">Portfolio CMS</p>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-slate-900/50" aria-label="Close menu overlay" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-80 max-w-[90vw] overflow-y-auto border-r border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">Admin Panel</p>
                <h2 className="truncate text-lg font-bold text-slate-900">Portfolio CMS</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
                aria-label="Close admin menu"
              >
                Close
              </button>
            </div>

            <nav className="space-y-1 pb-6">
              {adminNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2 text-sm font-medium transition",
                      active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
