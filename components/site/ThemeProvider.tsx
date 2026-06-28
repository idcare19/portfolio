"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSiteDataContext } from "./SiteDataProvider";

type ThemeMode = "dark" | "light" | "system";

type ThemeContextValue = {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const portfolioData = useSiteDataContext();
  const [isDark, setIsDark] = useState(false);
  const siteTheme =
    (portfolioData.websiteSettings?.themeMode as ThemeMode | undefined) || "dark";
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    setThemeMode(siteTheme);
  }, [siteTheme]);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextIsDark = themeMode === "system" ? prefersDark : themeMode === "dark";
    setIsDark(nextIsDark);
    root.classList.toggle("dark", nextIsDark);
    root.style.setProperty("--theme-primary", portfolioData.websiteSettings?.primaryColor || "#2563eb");
    root.style.setProperty("--theme-accent", portfolioData.websiteSettings?.accentColor || "#14b8a6");
    root.style.setProperty("--theme-radius", portfolioData.websiteSettings?.radius || "1.5rem");
    root.style.setProperty("--theme-font", portfolioData.websiteSettings?.fontFamily || "Inter");
  }, [portfolioData.websiteSettings?.accentColor, portfolioData.websiteSettings?.fontFamily, portfolioData.websiteSettings?.primaryColor, portfolioData.websiteSettings?.radius, themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
