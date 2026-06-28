"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { adminNavSections } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

const defaultOpenGroups: Record<string, boolean> = {
  Dashboard: true,
  Website: false,
  Content: false,
  Management: false,
  System: false,
};

const closeAllGroups = {
  Dashboard: false,
  Website: false,
  Content: false,
  Management: false,
  System: false,
};

export function AdminSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(defaultOpenGroups);

  useEffect(() => {
    const activeSection = adminNavSections.find((section) =>
      section.items.some((item) => item.href === pathname)
    );

    if (activeSection) {
      setOpenGroups({
        ...closeAllGroups,
        [activeSection.label]: true,
      });
    }
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      if (prev[label]) {
        return { ...closeAllGroups };
      }

      return {
        ...closeAllGroups,
        [label]: true,
      };
    });
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-admin-border bg-admin-sidebar/95 p-5 backdrop-blur lg:block">
      <div className="mb-6 rounded-[28px] border border-admin-border bg-admin-card p-5 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-admin-primary">Admin Panel</p>
        <h2 className="mt-2 text-lg font-bold text-admin-text">Portfolio CMS</h2>
        <p className="mt-2 text-sm text-admin-text-muted">
          Light-first content workspace with MongoDB-backed publishing.
        </p>
      </div>

      <nav className="max-h-[calc(100vh-160px)] space-y-3 overflow-y-auto pb-4 pr-1">
        {adminNavSections.map((section) => (
          <div key={section.label} className="space-y-2">
            <button
              type="button"
              onClick={() => toggleGroup(section.label)}
              className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-admin-text-muted transition hover:bg-admin-bg"
            >
              <span>{section.label}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openGroups[section.label] && "rotate-180"
                )}
              />
            </button>

            {openGroups[section.label] ? (
              <div className="space-y-2">
                {section.items.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                        active
                          ? "bg-admin-primary text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)]"
                          : "text-admin-text hover:bg-admin-bg"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  );
}