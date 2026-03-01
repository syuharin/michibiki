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
        // Monotone palette for WCAG AA (4.5:1 ratio)
        "michibiki-black": "#0F172A", // slate-900
        "michibiki-white": "#F8FAFC", // slate-50
        "michibiki-gray-dark": "#334155", // slate-700
        "michibiki-gray": "#64748B", // slate-500
        "michibiki-gray-light": "#CBD5E1", // slate-300
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
export default config;
