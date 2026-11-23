"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/site/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, setThemeMode } = useTheme();

  const toggle = () => {
    const newTheme = isDark ? "light" : "dark";
    setThemeMode(newTheme);
  };

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 ${className}`}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px] text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-[18px] w-[18px] text-slate-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
