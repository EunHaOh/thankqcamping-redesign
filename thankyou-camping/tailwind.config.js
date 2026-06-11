/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F26522',
          hover: '#E05A1C',
          soft: '#FFF4EE',
        },
        brand: {
          50: '#F5F5F5',
          100: '#EEEEEE',
          500: '#888888',
          600: '#666666',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          border: '#E8ECF0',
        },
        ink: {
          DEFAULT: '#222222',
          secondary: '#666666',
          muted: '#999999',
        },
        accent: {
          DEFAULT: '#F26522',
          soft: '#FFF4EE',
        },
        star: '#FFB020',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 4px rgba(0, 0, 0, 0.06)',
        cta: '0 -2px 12px rgba(0, 0, 0, 0.06)',
      },
      maxWidth: {
        mobile: '390px',
      },
    },
  },
  plugins: [],
};
