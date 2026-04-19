"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-72 border-r border-slate-200 bg-white/90 p-4 backdrop-blur">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">Admin Panel</p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">Portfolio CMS</h2>
      </div>

      <nav className="space-y-1">
        {adminNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}
