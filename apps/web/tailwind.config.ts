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
        background: "var(--background)",
        foreground: "var(--foreground)",
        costcoBlue: "var(--costco-blue)",
        costcoRed: "var(--costco-red)",
        tint: "#402E7A",
        tint2: "#4C3BCF",
        shadow: "#888888",
        lightShadow: "#DDDDDD",
        link: "#0a7ea4",
        alert: "#E32A36",
        graphStroke: "#8641f4",
        tint3: "#0060A9",
      },
    },
  },
  plugins: [],
};
export default config;
