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
        brand: {
          DEFAULT: '#1e3a5f',
          dark: '#152d4a',
          light: '#2d5a8e',
        },
        accent: {
          DEFAULT: '#f97316',
          dark: '#ea6c10',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
