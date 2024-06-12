/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '60': '0.60',
        '20': '0.20',
      }
    },
  },
  plugins: [],
}

