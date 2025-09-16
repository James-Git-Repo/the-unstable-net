import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1e40af", // blue-800-ish
          dark: "#0b122b",
          light: "#e5f0ff"
        }
      },
      boxShadow: {
        soft: "0 6px 30px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        "2xl": "1rem"
      }
    },
  },
  plugins: [],
};

export default config;
