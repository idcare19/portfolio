import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "page-bg": "rgb(var(--page-bg))",
        "section-bg": "rgb(var(--section-bg))",
        "card-bg": "rgb(var(--card-bg))",
        "card-hover": "rgb(var(--card-hover))",
        primary: "rgb(var(--primary))",
        secondary: "rgb(var(--secondary))",
        "text-main": "rgb(var(--text-main))",
        "text-muted": "rgb(var(--text-muted))",
        border: "rgb(var(--border))",
        "admin-bg": "rgb(var(--admin-bg))",
        "admin-sidebar": "rgb(var(--admin-sidebar))",
        "admin-topbar": "rgb(var(--admin-topbar))",
        "admin-card": "rgb(var(--admin-card))",
        "admin-input": "rgb(var(--admin-input))",
        "admin-modal": "rgb(var(--admin-modal))",
        "admin-text": "rgb(var(--admin-text))",
        "admin-text-muted": "rgb(var(--admin-text-muted))",
        "admin-border": "rgb(var(--admin-border))",
        "admin-primary": "rgb(var(--admin-primary))",
        "admin-danger": "rgb(var(--admin-danger))",
        "admin-success": "rgb(var(--admin-success))",
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(37, 99, 235, 0.12), 0 16px 40px rgba(37, 99, 235, 0.16)",
        "card-hover": "0 24px 48px rgba(15, 23, 42, 0.10)",
      },
      backgroundImage: {
        "hero-gradient": "none",
        "section-gradient": "linear-gradient(180deg, rgb(var(--section-bg)) 0%, rgb(var(--page-bg)) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
