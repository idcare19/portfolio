import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#ddebff",
          200: "#bfd9ff",
          300: "#91beff",
          400: "#5b99ff",
          500: "#2f74ff",
          600: "#1b57f5",
          700: "#1645e1",
          800: "#1b3bb6",
          900: "#1d368f",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(47, 116, 255, 0.2), 0 16px 40px rgba(47, 116, 255, 0.25)",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 20% 10%, rgba(47,116,255,0.22), transparent 42%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.2), transparent 40%), radial-gradient(circle at 50% 90%, rgba(139,92,246,0.17), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
