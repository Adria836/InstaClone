/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ig: {
          primary: '#0095f6',
          'primary-hover': '#1877f2',
          secondary: '#737373',
          border: '#dbdbdb',
          'border-dark': '#262626',
          bg: '#ffffff',
          'bg-dark': '#000000',
          elevated: '#ffffff',
          'elevated-dark': '#121212',
          card: '#ffffff',
          'card-dark': '#1a1a1a',
          hover: '#f2f2f2',
          'hover-dark': '#1e1e1e',
          badge: '#ff3040',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        logo: ['"Grand Hotel"', '"Brush Script MT"', 'cursive'],
      },
      keyframes: {
        'like-heart': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        'like-heart': 'like-heart 0.8s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards',
      }
    },
  },
  plugins: [],
}
