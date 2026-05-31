/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bucket: {
          bg:            "var(--bg)",
          card:          "var(--card)",
          border:        "var(--border)",
          "border-hover": "var(--border-hover)",
          muted:         "var(--muted)",
          text:          "var(--text)",
          "text-dim":    "var(--text-dim)",
          accent:        "var(--accent)",
          "accent-dim":  "var(--accent-dim)",
          lime:          "var(--card-lime)",
          pink:          "var(--card-pink)",
          "blue-pastel": "var(--card-blue)",
          yellow:        "var(--card-yellow)",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', '"SF Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
