/** @type {import('tailwindcss').Config} */
export default {
  content: ["./layouts/**/*.html", "./content/**/*.md"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-2": "rgb(var(--color-accent-2) / <alpha-value>)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        quote: "rgb(var(--color-quote) / <alpha-value>)",
      },
      fontFamily: {
        mono: [
          "IBM Plex Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      maxWidth: {
        app: "48rem", // 768px
      },
      typography: {
        DEFAULT: {
          css: {
            pre: { color: false },
            code: { color: false },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
