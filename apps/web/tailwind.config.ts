import type { Config } from "tailwindcss";

const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withAlpha("--color-primary"),
          container: withAlpha("--color-primary-container"),
          dark: withAlpha("--color-primary-dark"),
          fixed: withAlpha("--color-primary-fixed"),
        },
        secondary: {
          DEFAULT: withAlpha("--color-secondary"),
          container: withAlpha("--color-secondary-container"),
          fixed: withAlpha("--color-on-secondary-fixed"),
        },
        tertiary: {
          DEFAULT: withAlpha("--color-tertiary"),
          container: withAlpha("--color-tertiary-container"),
          fixed: withAlpha("--color-tertiary-fixed"),
        },
        navy: withAlpha("--color-navy"),
        surface: {
          DEFAULT: withAlpha("--color-surface"),
          container: {
            DEFAULT: withAlpha("--color-surface-container"),
            low: withAlpha("--color-surface-container-low"),
            lowest: withAlpha("--color-surface-container-lowest"),
            high: withAlpha("--color-surface-container-high"),
            highest: withAlpha("--color-surface-container-highest"),
          },
          variant: withAlpha("--color-surface-variant"),
        },
        background: withAlpha("--color-background"),
        "on-background": withAlpha("--color-on-background"),
        "on-surface": withAlpha("--color-on-surface"),
        "on-surface-variant": withAlpha("--color-on-surface-variant"),
        "on-primary": withAlpha("--color-on-primary"),
        "on-primary-container": withAlpha("--color-on-primary-container"),
        "on-secondary": withAlpha("--color-on-secondary"),
        "on-secondary-container": withAlpha("--color-on-secondary-container"),
        "on-secondary-fixed": withAlpha("--color-on-secondary-fixed"),
        "on-tertiary-fixed-variant": withAlpha("--color-on-surface-variant"),
        outline: withAlpha("--color-outline"),
        "outline-variant": withAlpha("--color-outline-variant"),
        error: {
          DEFAULT: withAlpha("--color-error"),
          container: withAlpha("--color-error-container"),
        },
        "on-error": withAlpha("--color-on-error"),
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        display: ["var(--font-nunito)", "Nunito Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      maxWidth: {
        "container-max": "1200px",
      },
      spacing: {
        gutter: "16px",
        xl: "64px",
      },
    },
  },
  plugins: [],
};

export default config;
