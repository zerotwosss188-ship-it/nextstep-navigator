/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1E3F',
          light: '#1A3560',
          dark: '#061228',
        },
        saffron: {
          DEFAULT: '#FF8A00',
          light: '#FFA733',
          dark: '#CC6E00',
        },
        teal: {
          DEFAULT: '#00C2A8',
          light: '#33CEBB',
          dark: '#009B86',
        },
        offwhite: '#F7F9FC',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}