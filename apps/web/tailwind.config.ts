import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        costcoBlue: 'var(--costco-blue)',
        costcoRed: 'var(--costco-red)',
        tint: '#FFE9D0',
        tint2: '#FFFED3',
        shadow: '#333333',
        lightShadow: '#555555',
        link: '#0a7ea4',
        alert: '#E32A36',
        graphStroke: '#8641f4',
        tint3: '#0060A9',
      },
      transitionTimingFunction: {
        'in-out-back': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
