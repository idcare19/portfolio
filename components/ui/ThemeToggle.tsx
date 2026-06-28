"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/site/ThemeProvider";

export function ThemeToggle() {
  const { isDark, setThemeMode, themeMode } = useTheme();

  const toggle = () => {
    // Toggle between dark and light mode (system mode still follows OS preference)
    const newTheme = isDark ? "light" : "dark";
    setThemeMode(newTheme as "dark" | "light");
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-muted transition hover:border-primary hover:text-primary"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
