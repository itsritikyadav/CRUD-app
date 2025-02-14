import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        slideDown: "slideDown 0.5s ease-out",  // Define the slide down animation
      },
      keyframes: {
        slideDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-50px)",  // Start position above the viewport
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",  // End position at normal view
          },
        },
      },
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;
