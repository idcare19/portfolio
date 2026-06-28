"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

import { adminNavSections } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

const defaultMobileGroups: Record<string, boolean> = {
  Dashboard: true,
  Website: false,
  Content: false,
  Management: false,
  System: false,
};

const closeAllMobileGroups = {
  Dashboard: false,
  Website: false,
  Content: false,
  Management: false,
  System: false,
};

export function MobileAdminHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<Record<string, boolean>>(defaultMobileGroups);

  useEffect(() => {
    const activeSection = adminNavSections.find((section) =>
      section.items.some((item) => item.href === pathname)
    );

    if (activeSection) {
      setGroups({
        ...closeAllMobileGroups,
        [activeSection.label]: true,
      });
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setGroups((prev) => {
      if (prev[label]) {
        return { ...closeAllMobileGroups };
      }

      return {
        ...closeAllMobileGroups,
        [label]: true,
      };
    });
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-admin-border bg-admin-card p-2.5 text-sm font-semibold text-admin-text hover:bg-admin-bg"
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 text-right">
          <p className="truncate text-xs font-semibold uppercase tracking-widest text-admin-primary">Admin Panel</p>
          <p className="truncate text-sm font-bold text-admin-text">Portfolio CMS</p>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(15,23,42,0.18)]"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />

          <aside className="relative h-full w-80 max-w-[90vw] overflow-y-auto border-r border-admin-border bg-admin-sidebar p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-admin-border bg-admin-card p-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-admin-primary">Admin Panel</p>
                <h2 className="truncate text-lg font-bold text-admin-text">Portfolio CMS</h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-admin-border p-2 text-xs font-semibold text-admin-text hover:bg-admin-bg"
                aria-label="Close admin menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-3">
              {adminNavSections.map((section) => (
                <div key={section.label} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup(section.label)}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-admin-text-muted hover:bg-admin-bg"
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        groups[section.label] && "rotate-180"
                      )}
                    />
                  </button>

                  {groups[section.label] ? (
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const active = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "block rounded-xl px-3 py-2 text-sm font-medium transition",
                              active ? "bg-admin-primary text-white" : "text-admin-text hover:bg-admin-bg"
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
        </div>
      ) : null}
    </>
  );
}