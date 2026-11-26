
"use client";

import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Menu, X, ArrowUpRight, Github, Command } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getManagedNavItems } from "@/lib/section-controls";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  const portfolioData = useSiteDataContext();
  const shell = portfolioData.shell;
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isHomePage = pathname === "/";

  if (isAdminRoute || pathname === "/maintenance") return null;

  const navItems = useMemo(
    () =>
      getManagedNavItems(
        portfolioData.nav,
        portfolioData.sectionControls
      ),
    [portfolioData.nav, portfolioData.sectionControls]
  );

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

  const hasTopNotice = Boolean(
    portfolioData.websiteControl?.topNoticeBar?.enabled
  );

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  const sectionOrder = useMemo(
    () => [
      "home",
      "about",
      "skills",
      "projects",
      "experience",
      "services",
      "contact",
      "github",
    ],
    []
  );

  useEffect(() => {
    if (!isHomePage) return;

    const elements = sectionOrder
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );

        const best = visible[0]?.target as HTMLElement | undefined;

        if (best?.id) setActive(`#${best.id}`);
      },
      {
        threshold: [0.15, 0.3, 0.5, 0.7],
        rootMargin: hasTopNotice
          ? "-140px 0px -45% 0px"
          : "-110px 0px -45% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [hasTopNotice, isHomePage, sectionOrder]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

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
    const normalizedHref =
      href === "#journey" || href === "/#journey"
        ? isHomePage
          ? "#experience"
          : "/#experience"
        : href;

    const target = normalizedHref.startsWith("/#")
      ? `#${normalizedHref.slice(2)}`
      : normalizedHref;

    setActive(target);
    setOpen(false);
  }

  function isActive(href: string, originalHref?: string) {
    const normalized = href.startsWith("/#")
      ? `#${href.slice(2)}`
      : href;

    return active === href || active === normalized || active === originalHref;
  }

  return (
    <header
      className={`sticky inset-x-0 z-[90] transition-all duration-300 ${
        hasTopNotice ? "top-11 sm:top-12" : "top-0"
      }`}
    >
      <div className="section-wrap pt-3 sm:pt-4">
        <div
          className={`relative flex items-center justify-between gap-3 rounded-[22px] border px-4 py-3 backdrop-blur-2xl transition-all duration-500 sm:px-5 ${
            scrolled
              ? "bg-[rgb(var(--card-bg))]/95 shadow-[0_18px_55px_rgba(15,23,42,0.12)]"
              : "bg-[rgb(var(--card-bg))]/75 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
          }`}
          style={{
            borderColor: "rgb(var(--border))",
          }}
        >
          {/* BRAND */}
          <a
            href={homeHref}
            onClick={() => handleNavClick(homeHref)}
            className="group flex min-w-0 items-center gap-3"
          >
            {/* <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
              {(portfolioData.owner.username || "A")
                .charAt(0)
                .toUpperCase()}
            </span> */}

            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-tight text-text-main sm:text-base">
                {portfolioData.owner.username}
              </span>

              {/* <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted sm:block">
                Digital Portfolio
              </span> */}
            </span>

            {portfolioData.websiteControl?.versionInfo?.showBadge ? (
              <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary xl:inline-flex">
                {shell.navbar.brandBadgePrefix}{" "}
                {portfolioData.websiteControl.versionInfo.currentVersion}
              </span>
            ) : null}
          </a>

          {/* IDENTITY */}
          {/* <div className="hidden items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3 py-2 text-[11px] font-medium text-text-muted xl:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{portfolioData.owner.identityLine}</span>
          </div> */}

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {resolvedNavItems.map((item, index) => {
              const selected = isActive(
                item.href,
                navItems[index]?.href
              );

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative isolate rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-300 ${
                    selected
                      ? "text-primary"
                      : "text-text-muted hover:bg-[rgb(var(--card-hover))] hover:text-text-main"
                  }`}
                >
                  {selected && (
                    <span className="absolute inset-0 -z-10 rounded-xl border border-primary/15 bg-primary/[0.07]" />
                  )}

                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />

            <a
              href={githubHref}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--border))] text-text-muted transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              aria-label="GitHub"
              title="GitHub"
            >
              <Github size={17} />
            </a>

            {/* <a
              href={contactHref}
              onClick={() => handleNavClick(contactHref)}
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30"
            >
              {shell.navbar.desktopCtaLabel}
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a> */}
          </div>

          {/* MOBILE CONTROLS */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navbar-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-main transition-all hover:border-primary/40 hover:text-primary"
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          id="mobile-navbar-menu"
          aria-hidden={!open}
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            open
              ? "mt-3 max-h-[80vh] opacity-100"
              : "pointer-events-none mt-0 max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]/95 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                <Command size={13} />
                Navigation
              </span>

              <span className="text-[10px] text-text-muted">
                {resolvedNavItems.length} Links
              </span>
            </div>

            <nav className="grid gap-1.5" aria-label="Mobile navigation">
              {resolvedNavItems.map((item, index) => {
                const selected = isActive(
                  item.href,
                  navItems[index]?.href
                );

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`flex min-h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold transition-all ${
                      selected
                        ? "border border-primary/15 bg-primary/[0.07] text-primary"
                        : "text-text-muted hover:bg-[rgb(var(--card-hover))] hover:text-text-main"
                    }`}
                  >
                    {item.label}
                    {selected ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    ) : null}
                  </a>
                );
              })}
            </nav>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[rgb(var(--border))] pt-4">
              {/* <a
                href={contactHref}
                onClick={() => handleNavClick(contactHref)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-xs font-bold text-white"
              >
                {shell.navbar.desktopCtaLabel}
                <ArrowUpRight size={14} />
              </a> */}

              <a
                href={githubHref}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 text-xs font-bold text-text-main"
              >
                <Github size={15} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
