/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d2d43',
        secundary: '#588152',
        terciary: '#ffffff',
        new: '#d2d7db'
      },
    },
  },
  plugins: [],
}