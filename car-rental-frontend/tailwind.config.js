/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF3FC', 100: '#DCE6F8', 200: '#B9CDF0', 300: '#8AAAE3',
          400: '#4F7BCB', 500: '#1F55B0', 600: '#0B3D91', 700: '#093178',
          800: '#07265E', 900: '#051A42', DEFAULT: '#0B3D91',
        },
        accent: {
          50: '#FFF4E5', 100: '#FFE3BF', 300: '#FFB866', 400: '#FFA126',
          500: '#FF8C00', 600: '#E67E00', 700: '#B86200', DEFAULT: '#FF8C00',
        },
        ink: '#0F1B3D',
        muted: '#6B7A99',
        line: '#E3E9F4',
        canvas: '#F7F9FD',
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
      boxShadow: {
        soft: '0 8px 24px rgba(11,61,145,0.08)',
        lift: '0 16px 40px rgba(11,61,145,0.12)',
        cta: '0 10px 24px rgba(255,140,0,0.35)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0B3D91 0%, #07265E 100%)',
        'accent-gradient': 'linear-gradient(135deg, #FF8C00 0%, #FFA126 100%)',
      },
    },
  },
  plugins: [],
}
