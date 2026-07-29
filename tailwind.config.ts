import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f6f0e8",
        sand: "#e7dccd",
        stone: "#b9aca0",
        earth: "#8a6d57",
        olive: "#68725a",
        ink: "#23211f",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(35, 33, 31, 0.08)",
        lift: "0 20px 60px rgba(35, 33, 31, 0.12)",
      },
      backgroundImage: {
        "hero-warm":
          "radial-gradient(circle at top left, rgba(232, 214, 193, 0.95), transparent 34%), radial-gradient(circle at top right, rgba(104, 114, 90, 0.14), transparent 28%), linear-gradient(180deg, #fbf7f2 0%, #f6f0e8 50%, #efe5d7 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [],
};

export default config;
