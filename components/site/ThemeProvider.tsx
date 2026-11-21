
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSiteDataContext } from "./SiteDataProvider";

type ThemeMode = "dark" | "light" | "system";

type ThemeContextValue = {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (theme: ThemeMode) => void;
};

const STORAGE_KEY = "portfolio-theme-mode";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const portfolioData = useSiteDataContext();

  const siteTheme =
    (portfolioData.websiteSettings?.themeMode as ThemeMode | undefined) ||
    "dark";

  const [themeMode, setThemeModeState] =
    useState<ThemeMode>("dark");

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);

      if (
        savedTheme === "dark" ||
        savedTheme === "light" ||
        savedTheme === "system"
      ) {
        setThemeModeState(savedTheme);
      } else {
        setThemeModeState(siteTheme);
      }
    } catch {
      setThemeModeState(siteTheme);
    }

    setMounted(true);
  }, [siteTheme]);

  const setThemeMode = useCallback((theme: ThemeMode) => {
    setThemeModeState(theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const applyTheme = () => {
      const nextIsDark =
        themeMode === "system"
          ? mediaQuery.matches
          : themeMode === "dark";

      setIsDark(nextIsDark);

      root.classList.toggle("dark", nextIsDark);
      root.dataset.theme = nextIsDark ? "dark" : "light";
      root.style.colorScheme = nextIsDark ? "dark" : "light";
    };

    applyTheme();

    if (themeMode === "system") {
      mediaQuery.addEventListener("change", applyTheme);

      return () => {
        mediaQuery.removeEventListener("change", applyTheme);
      };
    }
  }, [themeMode, mounted]);

  useEffect(() => {
    const root = document.documentElement;
    const settings = portfolioData.websiteSettings;

    root.style.setProperty(
      "--theme-primary",
      settings?.primaryColor || "#2563eb"
    );

    root.style.setProperty(
      "--theme-accent",
      settings?.accentColor || "#14b8a6"
    );

    root.style.setProperty(
      "--theme-radius",
      settings?.radius || "1.5rem"
    );

    root.style.setProperty(
      "--theme-font",
      settings?.fontFamily || "Inter"
    );
  }, [
    portfolioData.websiteSettings?.primaryColor,
    portfolioData.websiteSettings?.accentColor,
    portfolioData.websiteSettings?.radius,
    portfolioData.websiteSettings?.fontFamily,
  ]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used within a ThemeProvider"
    );
  }

  return context;
}