"use client";

import { portfolioData } from "@/data/portfolio";
import { getManagedNavItems, SECTION_DEFINITIONS, toSectionControlMap } from "@/lib/section-controls";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const sectionControlMap = toSectionControlMap(portfolioData.sectionControls);
const navItems = getManagedNavItems(portfolioData.nav, portfolioData.sectionControls);
const sectionMap = [
  { id: "home", href: "#home" },
  ...SECTION_DEFINITIONS.filter((section) => {
    const control = sectionControlMap[section.id];
    return control.visible && !control.deleted;
  }).map((section) => ({ id: section.id, href: section.href })),
];

export function Navbar() {
  const hasTopNotice = Boolean(portfolioData.websiteControl?.topNoticeBar?.enabled);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let frame = 0;
    let sectionElements = sectionMap.map((item) => ({
      href: item.href,
      element: document.getElementById(item.id),
    }));

    const isDesktopViewport = () => window.innerWidth >= 768;
    const refreshSections = () => {
      sectionElements = sectionMap.map((item) => ({
        href: item.href,
        element: document.getElementById(item.id),
      }));
    };

    const syncFromHash = () => {
      if (window.location.hash && navItems.some((item) => item.href === window.location.hash)) {
        setActive(window.location.hash);
      }
    };

    const syncFromScroll = () => {
      const currentY = window.scrollY;
      const nextScrolled = currentY > 12;

      if (!isDesktopViewport()) {
        setScrolled((previous) => (previous === nextScrolled ? previous : nextScrolled));
        return;
      }

      const marker = Math.max(140, window.innerHeight * 0.32);
      let current = "#home";
      let fallback: string | null = null;

      for (const item of sectionElements) {
        const section = item.element;
        if (!section) {
          continue;
        }

        const rect = section.getBoundingClientRect();

        if (rect.top <= marker) {
          fallback = item.href;
        }

        if (rect.top <= marker && rect.bottom > marker) {
          current = item.href;
          break;
        }
      }

      if (current === "#home" && fallback) {
        current = fallback;
      }

      setActive((previous) => (previous === current ? previous : current));
      setScrolled((previous) => (previous === nextScrolled ? previous : nextScrolled));
    };

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncFromScroll);
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const nextScrolled = window.scrollY > 12;
      setIsMobile((previous) => (previous === mobile ? previous : mobile));
      setScrolled((previous) => (previous === nextScrolled ? previous : nextScrolled));
      if (!mobile) {
        setOpen(false);
      }
      refreshSections();
      handleScroll();
    };

    handleResize();
    syncFromHash();
    syncFromScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={`fixed inset-x-0 z-[90] ${hasTopNotice ? "top-11 sm:top-12" : "top-0"}`}>
      <div className="section-wrap pt-4">
        <div
          className={`flex items-center justify-between gap-3 rounded-[28px] border px-3 py-2 transition-colors duration-200 sm:px-4 ${
            isMobile ? "shadow-sm backdrop-blur-sm" : "shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          } ${
            scrolled ? "border-slate-200/90 bg-white/92" : "border-white/80 bg-white/78"
          }`}
        >
          <a
            href="#home"
            onClick={() => {
              setActive("#home");
              setOpen(false);
            }}
            className="min-w-0 max-w-[62vw] truncate text-sm font-bold tracking-tight text-slate-900 sm:max-w-none"
          >
            <span className="block truncate text-black">
              {portfolioData.owner.username}
              {portfolioData.websiteControl?.versionInfo?.showBadge ? (
                <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  {portfolioData.websiteControl.versionInfo.currentVersion}
                </span>
              ) : null}
            </span>
          </a>

          <div className="ml-3 hidden items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500 lg:flex">
            <span>{portfolioData.owner.identityLine}</span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "page" : undefined}
                onClick={() => setActive(item.href)}
                className={`relative z-0 rounded-full px-3 py-1.5 text-sm transition-colors duration-150 ease-out ${
                  active === item.href
                    ? "text-blue-700"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                {active === item.href ? (
                  <span
                    className="absolute inset-0 -z-10 rounded-full bg-blue-50 ring-1 ring-blue-200/80"
                  />
                ) : null}
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={() => setActive("#contact")}
            className="hidden rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-0.5 lg:inline-flex"
          >
            Hire Me
          </a>

          <button
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white/80 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {open ? (
          <div
            id="mobile-navbar-menu"
            className="mt-2 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur-sm md:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "page" : undefined}
                onClick={() => {
                  setActive(item.href);
                  setOpen(false);
                }}
                className={`relative block rounded-xl px-3 py-2 text-sm ${
                  active === item.href
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80"
                    : "text-slate-700 hover:bg-blue-50"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => {
                setActive("#contact");
                setOpen(false);
              }}
              className="mt-2 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-sm font-semibold text-white"
            >
              Hire Me
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
}
