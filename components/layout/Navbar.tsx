"use client";

import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
import { usePathname } from "next/navigation";

export function Navbar() {
  const portfolioData = useSiteDataContext();
  const shell = portfolioData.shell;
  const pathname = usePathname();
  const isHomePage = pathname === "/";
=======

export function Navbar() {
  const portfolioData = useSiteDataContext();
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  const navItems = useMemo(() => {
    const fromSections = Object.values(portfolioData.sections || {})
      .filter((section) => {
        if (section.id === 'github') {
          return section.enabled && section.nav?.show && portfolioData.githubConfig?.enabled;
        }
<<<<<<< HEAD
        if (section.id === "blogs") {
          return section.enabled && section.nav?.show && portfolioData.blogs.length > 0;
        }
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
        return section.enabled && section.nav?.show;
      })
      .sort((a, b) => a.order - b.order)
      .map((section) => ({
        label: section.nav?.label || section.label,
<<<<<<< HEAD
        href:
          section.id === "github"
            ? "/github"
            : section.nav?.href || `#${section.id}`,
=======
        href: section.nav?.href || `#${section.id}`,
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
      }));

    return fromSections.length ? fromSections : portfolioData.nav;
  }, [portfolioData.nav, portfolioData.sections, portfolioData.githubConfig?.enabled]);
<<<<<<< HEAD
  const resolvedNavItems = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        href: !isHomePage && item.href.startsWith("#") ? `/${item.href}` : item.href,
      })),
    [isHomePage, navItems]
  );
  const contactHref = isHomePage ? "#contact" : "/#contact";
  const homeHref = isHomePage ? "#home" : "/#home";
  const sectionMap = useMemo(
    () =>
      resolvedNavItems
        .filter((item) => item.href.startsWith("#") || item.href.startsWith("/#"))
        .map((item) => {
          const hash = item.href.includes("#") ? item.href.slice(item.href.indexOf("#")) : item.href;
          return {
            id: hash === "#home" ? "home" : hash.replace(/^#/, ""),
            href: item.href,
          };
        }),
    [resolvedNavItems]
=======
  const sectionMap = useMemo(
    () =>
      navItems.map((item) => ({
        id: item.href === "#home" ? "home" : item.href.replace(/^#/, ""),
        href: item.href,
      })),
    [navItems]
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  );
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
<<<<<<< HEAD
      if (window.location.hash && resolvedNavItems.some((item) => item.href.endsWith(window.location.hash))) {
=======
      if (window.location.hash && navItems.some((item) => item.href === window.location.hash)) {
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
        setActive(window.location.hash);
      }
    };

    const syncFromScroll = () => {
<<<<<<< HEAD
      if (!isHomePage) {
        setActive(pathname === "/github" ? "/github" : pathname);
        return;
      }

=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
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
<<<<<<< HEAD
  }, [isHomePage, pathname, resolvedNavItems, sectionMap]);
=======
  }, [navItems, sectionMap]);
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

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
    <header className={`sticky inset-x-0 top-0 z-[90] ${hasTopNotice ? "top-11 sm:top-12" : "top-0"}`}>
      <div className="section-wrap pt-4">
        <div
          className={`flex items-center justify-between gap-3 rounded-[24px] border px-4 py-3 transition-all duration-300 backdrop-blur-xl ${
            scrolled ? "bg-[rgb(var(--card-bg))]/98" : "bg-[rgb(var(--card-bg))]/88"
          }`}
          style={{
            borderColor: "rgb(var(--border))",
            boxShadow: scrolled ? "0 18px 48px rgba(15, 23, 42, 0.10)" : "0 12px 36px rgba(15, 23, 42, 0.07)",
          }}
        >
          <a
<<<<<<< HEAD
            href={homeHref}
            onClick={() => {
              setActive(isHomePage ? "#home" : "/#home");
=======
            href="#home"
            onClick={() => {
              setActive("#home");
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
              setOpen(false);
            }}
            className="min-w-0 max-w-[62vw] truncate text-sm font-bold tracking-tight text-text-main sm:max-w-none"
          >
            <span className="block truncate text-text-main">
              {portfolioData.owner.username}
              {portfolioData.websiteControl?.versionInfo?.showBadge ? (
                <span className="ml-2 inline-flex items-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-semibold text-[#1D4ED8]">
<<<<<<< HEAD
                  {shell.navbar.brandBadgePrefix} {portfolioData.websiteControl.versionInfo.currentVersion}
=======
                  {portfolioData.websiteControl.versionInfo.currentVersion}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
                </span>
              ) : null}
            </span>
          </a>

          <div className="ml-3 hidden items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3 py-1 text-[11px] font-medium text-text-muted lg:flex">
            <span>{portfolioData.owner.identityLine}</span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
<<<<<<< HEAD
            {resolvedNavItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href || active === navItems[index]?.href ? "page" : undefined}
                onClick={() => setActive(item.href.startsWith("/#") ? item.href.slice(1) : item.href)}
                className={`relative z-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                  active === item.href || active === navItems[index]?.href
=======
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "page" : undefined}
                onClick={() => setActive(item.href)}
                className={`relative z-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                  active === item.href
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
                    ? "text-text-main"
                    : "text-text-muted hover:text-text-main hover:bg-[rgb(var(--card-hover))]/80"
                }`}
              >
<<<<<<< HEAD
                {active === item.href || active === navItems[index]?.href ? (
                  <span className="absolute inset-0 -z-10 rounded-full border border-[#BFDBFE] bg-[#EFF6FF]" />
                ) : null}
                {navItems[index]?.label || item.label}
=======
                {active === item.href ? (
                  <span className="absolute inset-0 -z-10 rounded-full border border-[#BFDBFE] bg-[#EFF6FF]" />
                ) : null}
                {item.label}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
              </a>
            ))}
          </nav>

          <a
<<<<<<< HEAD
            href={contactHref}
            onClick={() => setActive(isHomePage ? "#contact" : "/#contact")}
            className="hidden rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 lg:inline-flex"
          >
            {shell.navbar.desktopCtaLabel}
=======
            href="#contact"
            onClick={() => setActive("#contact")}
            className="hidden rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 lg:inline-flex"
          >
            Hire Me
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
          </a>

          <button
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-main md:hidden"
<<<<<<< HEAD
            aria-label={shell.navbar.mobileMenuLabel}
=======
            aria-label="Toggle menu"
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {open ? (
          <div
            id="mobile-navbar-menu"
            className="mt-3 rounded-2xl border bg-[rgb(var(--card-bg))]/98 p-4 shadow-lg backdrop-blur-xl md:hidden"
            style={{ borderColor: "rgb(var(--border))" }}
          >
<<<<<<< HEAD
            {resolvedNavItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href || active === navItems[index]?.href ? "page" : undefined}
                onClick={() => {
                  setActive(item.href.startsWith("/#") ? item.href.slice(1) : item.href);
                  setOpen(false);
                }}
                className={`relative block rounded-lg px-4 py-3 text-sm font-medium ${
                  active === item.href || active === navItems[index]?.href
=======
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "page" : undefined}
                onClick={() => {
                  setActive(item.href);
                  setOpen(false);
                }}
                className={`relative block rounded-lg px-4 py-3 text-sm font-medium ${
                  active === item.href
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
                    ? "border border-[#BFDBFE] bg-[#EFF6FF] text-text-main"
                    : "text-text-muted hover:bg-[rgb(var(--card-bg))]/80 hover:text-text-main"
                }`}
              >
<<<<<<< HEAD
                {navItems[index]?.label || item.label}
              </a>
            ))}
            <a
              href={contactHref}
              onClick={() => {
                setActive(isHomePage ? "#contact" : "/#contact");
=======
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => {
                setActive("#contact");
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
                setOpen(false);
              }}
              className="mt-3 inline-flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
<<<<<<< HEAD
              {shell.navbar.desktopCtaLabel}
=======
              Hire Me
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
