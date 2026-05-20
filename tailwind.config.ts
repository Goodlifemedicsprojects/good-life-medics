import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a5c5c',
          light: '#0e8080',
          pale: '#e6f4f4',
        },
        accent: {
          DEFAULT: '#c8a96e',
          light: '#f5ecd8',
        },
        dark: '#0d1f1f',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
