/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark Cosmic Theme - Deep Purple & Midnight Blue
        cosmic: {
          50:  '#f2effa',
          100: '#e3dbf3',
          200: '#cabbe8',
          300: '#a78bd8',
          400: '#845fc8',
          500: '#643cb0',
          600: '#522f92',
          700: '#432575',
          800: '#381f62',
          900: '#2e1b50',
          950: '#140b2e',   // Very Deep Purple (Near Black)
          980: '#0a0518',   // Deep Space
        },
        // Royal Gold / Stardust Accent - Enhanced Gold Palette
        stardust: {
          300: '#fde68a',
          400: '#fde047',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        accent: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        // Deep Purple Variants for better depth
        deep: {
          950: '#0c0618',
          980: '#07030f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
      },
      animation: {
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(234, 179, 8, 0.6)' },
        }
      }
    },
  },
  plugins: [],
};
