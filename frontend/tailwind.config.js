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
        "on-surface": "var(--text-on-surface)",
        "on-surface-variant": "var(--text-on-surface-variant)",
        "surface-container-low": "var(--bg-surface-container-low)",
        "surface-variant": "var(--bg-surface)",
        "primary": "var(--color-primary)",
        "primary-container": "var(--color-primary-container)",
        "on-primary-container": "var(--color-on-primary-container)",
        "secondary": "var(--color-secondary)",
        "tertiary-container": "var(--color-tertiary-container)",
        "error": "var(--color-error)",
        "outline-variant": "var(--text-outline-variant)",
        "outline": "var(--text-outline)",
        "surface": "var(--bg-surface)",
        "on-primary": "#00363d",
        "surface-container-lowest": "#080e1d",
        "on-error-container": "#ffdad6",
        "surface-container": "#191f2f",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "container-max": "1440px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "base": "8px",
        "gutter": "24px"
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Remap existing utility classes to use the new fonts
        "body-md": ['Inter', 'system-ui', 'sans-serif'],
        "body-sm": ['Inter', 'system-ui', 'sans-serif'],
        "body-lg": ['Inter', 'system-ui', 'sans-serif'],
        "headline-sm": ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        "headline-md": ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        "headline-lg": ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        "headline-lg-mobile": ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        "display": ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        "label-code": ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        "body-md": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "1.4", fontWeight: "400" }],
        "body-lg": ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-sm": ["13px", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.02em" }],
        "headline-md": ["28px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.02em" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.02em" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" }],
        "display": ["20px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" }], // for brand name
        "label-code": ["12px", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.03em" }],
      },
    },
  },
  plugins: [],
}
