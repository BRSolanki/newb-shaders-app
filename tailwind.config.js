/* @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Crucial for the dark mode toggle to work
  theme: {
    extend: {},
  },
  plugins: [],
}