/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f7ff',
          100: '#b3ecff',
          200: '#80e1ff',
          300: '#4dd6ff',
          400: '#26ccff',
          500: '#00B4D8',
          600: '#0096c7',
          700: '#0077b6',
          800: '#005f8f',
          900: '#023e68',
        },
        accent: {
          cyan: '#00B4D8',
          'cyan-dark': '#0077b6',
          'cyan-light': '#48cae4',
          resume: '#0B8FA9',
        },
        space: {
          dark: '#000000',
          'dark-blue': '#0a0e1a',
          card: '#283145',
          border: '#30363d',
          bg: '#15161B',
        }
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(180deg, #000000 0%, #0a0e1a 50%, #1a1f2e 100%)',
        'earth-gradient': 'radial-gradient(circle at center, #4a9eff 0%, #1e3a8a 60%, #000000 100%)',
        'earth-night': 'radial-gradient(circle at 30% 40%, #2b5876 0%, #1a365d 40%, #0f172a 70%, #000000 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
