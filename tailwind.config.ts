import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens: values live in CSS variables (globals.css), swapped by data-theme.
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        soft: "rgb(var(--soft) / <alpha-value>)",
        saffron: "rgb(var(--saffron) / <alpha-value>)",
        ember: "rgb(var(--ember) / <alpha-value>)",
        line: {
          DEFAULT: "rgb(var(--ink) / 0.10)",
          strong: "rgb(var(--ink) / 0.16)",
        },
        iris: {
          DEFAULT: "#8052ff",
          hover: "#9370ff",
        },
        teal: "#2bd4b4",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        caption: ["0.75rem", { lineHeight: "1.5" }],
        label: ["0.875rem", { lineHeight: "1.2", letterSpacing: "0.025em" }],
        body: ["1.125rem", { lineHeight: "1.5" }],
        "heading-2xs": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "heading-sm": ["clamp(2.25rem, 3.6vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.035em" }],
        "heading-lg": ["clamp(2.625rem, 5.4vw, 4.875rem)", { lineHeight: "1.02", letterSpacing: "-0.04em" }],
        display: ["clamp(2.75rem, 6vw, 5.25rem)", { lineHeight: "1", letterSpacing: "-0.04em" }],
      },
      // 6px rhythm steps missing from Tailwind's default 4px scale
      spacing: {
        "4.5": "18px",
        "7.5": "30px",
        "15": "60px",
        "30": "120px",
      },
      maxWidth: {
        page: "1280px",
      },
      borderRadius: {
        button: "10px",
        card: "16px",
        pill: "9999px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
