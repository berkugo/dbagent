/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#1C1C1C',
          secondary: '#242424',
          accent: '#2D2D2D',
          text: '#E5E7EB',
          border: '#374151',
        },
        light: {
          primary: '#FFFFFF',
          secondary: '#F9FAFB',
          accent: '#F3F4F6',
          text: '#111827',
          border: '#E5E7EB',
        },
      },
      animation: {
        'gradient-slow': 'gradient 15s ease infinite',
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
} 