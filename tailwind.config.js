/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: '#2997FF',
        gray: {
          DEFAULT: '#86868B',
          100: '94928D',
          200: 'AFAFAF',
          300: '42424570',
        },
        zinc: '#101010',
      },
    },
  },
  plugins: [],
}

