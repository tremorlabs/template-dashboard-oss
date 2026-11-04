import type { Config } from "tailwindcss"

// light: Almaton palette, dark: original (see globals.css)
const scale = (name: string) =>
  Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [
      step,
      `rgb(var(--${name}-${step}) / <alpha-value>)`,
    ]),
  )

const config: Config = {
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  darkMode: "selector",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        almaton: {
          navy: "#0A1F44",
          royal: "#0066FF",
          cyan: "#00C6FF",
          light: "#60E0FF",
          slate: "#94A3B8",
          offwhite: "#F8FAFC",
        },
        gray: scale("gray"),
        indigo: scale("indigo"),
        blue: scale("blue"),
        cyan: scale("cyan"),
        tremor: {
          brand: {
            faint: "rgb(var(--blue-50) / <alpha-value>)",
            muted: "rgb(var(--blue-200) / <alpha-value>)",
            subtle: "rgb(var(--blue-400) / <alpha-value>)",
            DEFAULT: "rgb(var(--blue-600) / <alpha-value>)",
            emphasis: "rgb(var(--blue-700) / <alpha-value>)",
            inverted: "rgb(255 255 255 / <alpha-value>)",
          },
          background: {
            muted: "rgb(var(--gray-50) / <alpha-value>)",
            subtle: "rgb(var(--gray-100) / <alpha-value>)",
            DEFAULT: "rgb(255 255 255 / <alpha-value>)",
            emphasis: "rgb(var(--gray-700) / <alpha-value>)",
          },
          border: {
            DEFAULT: "rgb(var(--gray-200) / <alpha-value>)",
          },
          ring: {
            DEFAULT: "rgb(var(--gray-200) / <alpha-value>)",
          },
          content: {
            subtle: "rgb(var(--gray-400) / <alpha-value>)",
            DEFAULT: "rgb(var(--gray-500) / <alpha-value>)",
            emphasis: "rgb(var(--gray-700) / <alpha-value>)",
            strong: "rgb(var(--gray-900) / <alpha-value>)",
            inverted: "rgb(255 255 255 / <alpha-value>)",
          },
        },

        "dark-tremor": {
          brand: {
            faint: "rgb(var(--blue-950) / <alpha-value>)",
            muted: "rgb(var(--blue-800) / <alpha-value>)",
            subtle: "rgb(var(--blue-600) / <alpha-value>)",
            DEFAULT: "rgb(var(--blue-500) / <alpha-value>)",
            emphasis: "rgb(var(--blue-400) / <alpha-value>)",
            inverted: "rgb(var(--gray-950) / <alpha-value>)",
          },
          background: {
            muted: "rgb(var(--gray-950) / <alpha-value>)",
            subtle: "rgb(var(--gray-800) / <alpha-value>)",
            DEFAULT: "rgb(var(--gray-900) / <alpha-value>)",
            emphasis: "rgb(var(--gray-300) / <alpha-value>)",
          },
          border: {
            DEFAULT: "rgb(var(--gray-800) / <alpha-value>)",
          },
          ring: {
            DEFAULT: "rgb(var(--gray-800) / <alpha-value>)",
          },
          content: {
            subtle: "rgb(var(--gray-600) / <alpha-value>)",
            DEFAULT: "rgb(var(--gray-500) / <alpha-value>)",
            emphasis: "rgb(var(--gray-200) / <alpha-value>)",
            strong: "rgb(var(--gray-50) / <alpha-value>)",
            inverted: "rgb(var(--gray-950) / <alpha-value>)",
          },
        },
      },

      boxShadow: {
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },

      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },

      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        dialogOverlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        dialogContentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -45%) scale(0.95)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        drawerSlideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(50%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        hide: "hide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        drawerSlideLeftAndFade:
          "drawerSlideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogOverlayShow:
          "dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogContentShow:
          "dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
export default config