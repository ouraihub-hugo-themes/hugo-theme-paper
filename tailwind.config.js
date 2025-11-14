/** @type {import('tailwindcss').Config} */
export default {
  content: ["./layouts/**/*.html", "./content/**/*.md"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        accent: "var(--color-accent)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
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
