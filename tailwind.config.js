/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'paynes-grey': {
          100: '#F2F3F8',
          200: '#D9DBE9',
          300: '#BFBFD9',
          400: '#8D90BA',
          500: '#525B76',
          600: '#4A516C',
          700: '#32354A',
          800: '#262932',
        },
    }
    },
    
},
  plugins: [],
}
