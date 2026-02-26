import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#11211c',
        paper: '#f6f8f7',
        brand: {
          50: '#e9fffb',
          100: '#cefef4',
          200: '#9ff9e8',
          300: '#63efd5',
          400: '#2adbbd',
          500: '#0db89d',
          600: '#09937f',
          700: '#0d7566',
          800: '#115d53',
          900: '#114e45',
        },
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '0.875rem',
        lg: '1.25rem',
        xl: '1.75rem',
      },
      boxShadow: {
        soft: '0 8px 20px rgba(17, 33, 28, 0.08)',
        card: '0 2px 8px rgba(17, 33, 28, 0.07)',
      },
      fontFamily: {
        sans: ['\"Manrope\"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(.22,1,.36,1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 260ms ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
