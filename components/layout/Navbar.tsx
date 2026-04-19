"use client";

import { portfolioData } from "@/data/portfolio";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const sectionMap = [
  { id: "home", href: "#home" },
  { id: "light-motion", href: "#home" },
  { id: "about", href: "#about" },
  { id: "skills", href: "#skills" },
  { id: "projects", href: "#projects" },
  { id: "reviews", href: "#reviews" },
  { id: "journey", href: "#journey" },
  { id: "contact", href: "#contact" },
];

export function Navbar() {
  const hasTopNotice = Boolean(portfolioData.websiteControl?.topNoticeBar?.enabled);
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const isDesktopViewport = () => window.innerWidth >= 768;
    const syncMobile = () => setIsMobile(window.innerWidth < 768);

    const syncFromHash = () => {
      if (window.location.hash && portfolioData.nav.some((item) => item.href === window.location.hash)) {
        setActive(window.location.hash);
      }
    };

    const syncFromScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastY);
      const isGoingDown = currentY > lastY;

      if (!isDesktopViewport()) {
        setScrolled(currentY > 12);
        if (currentY < 64) {
          setHideOnScroll(false);
        } else if (delta > 6) {
          setHideOnScroll(isGoingDown);
        }
        syncMobile();
        lastY = currentY;
        return;
      }

      setHideOnScroll(false);

      const marker = Math.max(140, window.innerHeight * 0.32);
      let current = "#home";
      let fallback: string | null = null;

      for (const item of sectionMap) {
        const section = document.getElementById(item.id);
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
      setScrolled(currentY > 12);
      lastY = currentY;
    };

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncFromScroll);
    };

    syncMobile();
    syncFromHash();
    syncFromScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", syncFromHash);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);

      if (window.innerWidth >= 768) {
        setOpen(false);
      }

      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
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
    <motion.header
      className={`fixed inset-x-0 z-[90] ${hasTopNotice ? "top-11 sm:top-12" : "top-0"}`}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      animate={{
        opacity: 1,
        y: hideOnScroll && isMobile && !open ? -110 : 0,
        scale: scrolled ? 0.995 : 1,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0.2, ease: "easeOut" }
          : { type: "spring", stiffness: 280, damping: 28, mass: 0.65 }
      }
    >
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
            {portfolioData.nav.map((item) => (
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
                  <motion.span
                    layoutId="desktop-nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-blue-50 ring-1 ring-blue-200/80"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.15 }
                        : { type: "spring", stiffness: 450, damping: 35 }
                    }
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

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id="mobile-navbar-menu"
              className="mt-2 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur-sm md:hidden"
              initial={prefersReducedMotion ? { opacity: 1, height: "auto" } : { opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, height: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.22, ease: "easeOut" }}
            >
              {portfolioData.nav.map((item) => (
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
