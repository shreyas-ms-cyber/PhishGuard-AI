/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        "on-surface": "var(--text-primary)",
        "on-surface-variant": "var(--text-secondary)",
        "surface-container-low": "var(--bg-secondary)",
        "surface-variant": "var(--bg-surface)",
        "primary": "var(--accent-cyan)",
        "primary-container": "var(--accent-cyan)",
        "on-primary-container": "var(--text-inverse)",
        "secondary": "var(--status-safe)",
        "tertiary-container": "var(--status-suspicious)",
        "error": "var(--status-high-risk)",
        "outline-variant": "var(--bg-glass-border)",
        "outline": "var(--text-muted)",
        "surface": "var(--bg-surface)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl: "var(--surface-radius)",
        "2xl": "var(--surface-radius-lg)",
      },
      boxShadow: {
        glass: "var(--surface-shadow)",
      },
      backdropBlur: {
        glass: "var(--glass-blur)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
    },
  },
  plugins: [],
}
