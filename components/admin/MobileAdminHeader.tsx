"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
<<<<<<< HEAD
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

=======
import { Menu, X } from "lucide-react";

import { adminNav } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

export function MobileAdminHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Fix body scroll lock when mobile menu is open/closed
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

<<<<<<< HEAD
=======
  // Close menu when route changes
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

<<<<<<< HEAD
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
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
<<<<<<< HEAD
          className="rounded-xl border border-admin-border bg-admin-card p-2.5 text-sm font-semibold text-admin-text hover:bg-admin-bg"
=======
          className="rounded-xl border p-2.5 text-sm font-semibold border-admin-border bg-admin-card text-admin-text hover:bg-admin-bg"
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </button>
<<<<<<< HEAD

=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
        <div className="min-w-0 text-right">
          <p className="truncate text-xs font-semibold uppercase tracking-widest text-admin-primary">Admin Panel</p>
          <p className="truncate text-sm font-bold text-admin-text">Portfolio CMS</p>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
<<<<<<< HEAD
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(15,23,42,0.18)]"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />

          <aside className="relative h-full w-80 max-w-[90vw] overflow-y-auto border-r border-admin-border bg-admin-sidebar p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-admin-border bg-admin-card p-4">
=======
          <button className="absolute inset-0 bg-[rgba(15,23,42,0.18)]" aria-label="Close menu overlay" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-80 max-w-[90vw] overflow-y-auto border-r p-4 shadow-xl border-admin-border bg-admin-sidebar">
            <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border p-4 border-admin-border bg-admin-card">
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-admin-primary">Admin Panel</p>
                <h2 className="truncate text-lg font-bold text-admin-text">Portfolio CMS</h2>
              </div>
<<<<<<< HEAD

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-admin-border p-2 text-xs font-semibold text-admin-text hover:bg-admin-bg"
=======
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border p-2 text-xs font-semibold border-admin-border text-admin-text hover:bg-admin-bg"
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
                aria-label="Close admin menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

<<<<<<< HEAD
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
=======
            <nav className="space-y-1">
              {adminNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-admin-primary text-white"
                        : "text-admin-text hover:bg-admin-bg"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}