/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        dark: '#0f172a',
        light: '#f8fafc',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
