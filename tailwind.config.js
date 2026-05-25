/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bucket: {
          bg: "#050505",
          card: "#0c0c0c",
          border: "#1a1400",
          "border-hover": "#2a2000",
          muted: "#665530",
          text: "#e8dcc8",
          "text-dim": "#776644",
          accent: "#ff6a00",
          "accent-dim": "#b35900",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', '"SF Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
