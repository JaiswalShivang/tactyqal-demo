import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ice: "#F4F6FB",
        ivory: "#FFFFFF",
        sand: "#F4F6FB",
        ink: "#0F1B3D",
        navy: "#0F1B3D",
        navyCard: "#162654",
        navyBorder: "#263B73",
        signal: "#FF3D88",
        pink: "#FF3D88",
        volt: "#FFE4EF",
        cyan: "#00F5D4",
        emerald: "#00D2B4",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderWidth: {
        DEFAULT: "1.5px",
        "0": "0",
        "2": "2px",
        "4": "4px",
      },
      boxShadow: {
        tactile: "4px 4px 0 #0F1B3D",
        "tactile-sm": "2px 2px 0 #0F1B3D",
        "tactile-none": "0px 0px 0 #0F1B3D",
        "tactile-signal": "4px 4px 0 #FF3D88",
        "tactile-pink": "4px 4px 0 #FF3D88",
        "tactile-white": "4px 4px 0 #FFFFFF",
      },
      animation: {
        "stamp-in": "stampIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "ticker-left": "tickerLeft 25s linear infinite",
        "ticker-right": "tickerRight 20s linear infinite",
        "count-up": "countUp 1s ease-out forwards",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "draw-path": "drawPath 2s ease-in-out forwards",
        "slide-in-ticket": "slideInTicket 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        stampIn: {
          "0%": { transform: "scale(1.15) rotate(-3deg)", opacity: "0" },
          "60%": { transform: "scale(0.97) rotate(0.5deg)" },
          "80%": { transform: "scale(1.02) rotate(-0.3deg)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        tickerLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        tickerRight: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        slideInTicket: {
          "0%": { transform: "translateY(-100%) rotate(-2deg)", opacity: "0" },
          "100%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
        },
        drawPath: {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
