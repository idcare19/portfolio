"use client";

import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getManagedNavItems } from "@/lib/section-controls";

export function Navbar() {
  const portfolioData = useSiteDataContext();
  const shell = portfolioData.shell;
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const navItems = useMemo(() => getManagedNavItems(portfolioData.nav, portfolioData.sectionControls), [portfolioData.nav, portfolioData.sectionControls]);
  const resolvedNavItems = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        href:
          item.href === "#journey"
            ? isHomePage
              ? "#experience"
              : "/#experience"
            : !isHomePage && item.href.startsWith("#")
              ? `/${item.href}`
              : item.href,
      })),
    [isHomePage, navItems]
  );
  const contactHref = isHomePage ? "#contact" : "/#contact";
  const homeHref = isHomePage ? "#home" : "/#home";
  const githubHref = "/github";
  const hasTopNotice = Boolean(portfolioData.websiteControl?.topNoticeBar?.enabled);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  const sectionOrder = useMemo(() => ["home", "about", "skills", "projects", "experience", "services", "contact", "github"], []);

  useEffect(() => {
    if (!isHomePage) return;

    const elements = sectionOrder
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const best = visible[0]?.target as HTMLElement | undefined;
        if (best?.id) {
          setActive(`#${best.id}`);
        }
      },
      {
        root: null,
        threshold: [0.15, 0.3, 0.5, 0.7],
        rootMargin: hasTopNotice ? "-140px 0px -45% 0px" : "-110px 0px -45% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [hasTopNotice, isHomePage, sectionOrder]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleNavClick(href: string) {
    const normalizedHref = href === "#journey" || href === "/#journey" ? (isHomePage ? "#experience" : "/#experience") : href;
    const target = normalizedHref.startsWith("/#") ? `#${normalizedHref.slice(2)}` : normalizedHref;
    setActive(target);
    setOpen(false);
  }

  function navLinkClass(href: string) {
    const current = active === href || active === (href.startsWith("/#") ? `#${href.slice(2)}` : href);
    return `relative z-0 flex min-h-11 items-center rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-out ${
      current ? "text-[#1D4ED8] shadow-[0_8px_24px_rgba(37,99,235,0.10)]" : "text-text-muted hover:text-text-main hover:bg-[rgb(var(--card-hover))]/80"
    }`;
  }

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
            href={homeHref}
            onClick={() => {
              handleNavClick(homeHref);
            }}
            className="min-w-0 max-w-[62vw] truncate text-sm font-bold tracking-tight text-text-main sm:max-w-none"
          >
            <span className="block truncate text-text-main">
              {portfolioData.owner.username}
              {portfolioData.websiteControl?.versionInfo?.showBadge ? (
                <span className="ml-2 inline-flex items-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-semibold text-[#1D4ED8]">
                  {shell.navbar.brandBadgePrefix} {portfolioData.websiteControl.versionInfo.currentVersion}
                </span>
              ) : null}
            </span>
          </a>

          <div className="ml-3 hidden items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3 py-1 text-[11px] font-medium text-text-muted lg:flex">
            <span>{portfolioData.owner.identityLine}</span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {resolvedNavItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href || active === navItems[index]?.href ? "page" : undefined}
                onClick={() => handleNavClick(item.href)}
                className={navLinkClass(item.href)}
              >
                {active === item.href || active === navItems[index]?.href ? (
                  <span className="absolute inset-0 -z-10 rounded-full border border-[#BFDBFE] bg-[#EFF6FF]/90" />
                ) : null}
                {navItems[index]?.label || item.label}
              </a>
            ))}
          </nav>

          <a
            href={contactHref}
            onClick={() => handleNavClick(contactHref)}
            className="hidden rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 lg:inline-flex"
          >
            {shell.navbar.desktopCtaLabel}
          </a>

          <a
            href={githubHref}
            className="hidden rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-5 py-2 text-xs font-semibold text-text-main transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary lg:inline-flex"
          >
            GitHub
          </a>

          <button
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-main md:hidden"
            aria-label={shell.navbar.mobileMenuLabel}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {open ? (
          <div
            id="mobile-navbar-menu"
            className="mt-3 rounded-[28px] border bg-[rgb(var(--card-bg))]/98 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl md:hidden"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            <div className="grid gap-2">
              {resolvedNavItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active === item.href || active === navItems[index]?.href ? "page" : undefined}
                  onClick={() => {
                    handleNavClick(item.href);
                  }}
                  className={`relative block rounded-2xl px-4 py-4 text-sm font-medium ${
                    active === item.href || active === navItems[index]?.href
                      ? "border border-[#BFDBFE] bg-[#EFF6FF] text-text-main"
                      : "text-text-muted hover:bg-[rgb(var(--card-bg))]/80 hover:text-text-main"
                  }`}
                >
                  {navItems[index]?.label || item.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              <a
                href={contactHref}
                onClick={() => {
                  handleNavClick(contactHref);
                }}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                {shell.navbar.desktopCtaLabel}
              </a>
              <a
                href={githubHref}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 text-sm font-semibold text-text-main hover:border-primary/40 hover:text-primary"
              >
                GitHub
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
