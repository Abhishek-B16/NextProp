/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        saas: {
          bg: '#0F172A',
          surface: '#162032',
          card: '#1E293B',
          royalBlue: '#0066B2',
          electricTeal: '#00C9A7',
          text: '#F8FAFC',
          subtext: '#CBD5E1'
        },
        brand: {
          50: '#eef8ff',
          100: '#d8efff',
          200: '#b9e3ff',
          300: '#88d1ff',
          400: '#50b5ff',
          500: '#0066b2',
          600: '#005399',
          700: '#00427a',
          800: '#033966',
          900: '#083054'
        },
        tealAccent: {
          50: '#e6fffa',
          100: '#b2f5ea',
          400: '#319795',
          500: '#00c9a7',
          600: '#00b4d8',
          700: '#0096c7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
