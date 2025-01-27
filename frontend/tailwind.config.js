/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        heading: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          light: "#2f256e",
          dark: "#60a5fa",
        },
        background: {
          light: "#ffffff",
          dark: "#0f172a",
        },
        card: {
          light: "#ffffff",
          dark: "#1e293b",
        },
        text: {
          light: "#1e2226",
          dark: "#e2e8f0",
        },
        accent: {
          light: "#eef2ff",
          dark: "#334155",
        },
        button: {
          light: "#2f256e",
          dark: "#60a5fa",
        },
        hover: {
          light: "#241d52",
          dark: "#93c5fd",
        },
      },
    },
  },
  plugins: [],
};
