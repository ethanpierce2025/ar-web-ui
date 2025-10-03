/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  plugins: [],
  theme: {
    extend: {
      animation: {
        'toggle-slide-off': 'toggle-slide 0.5s forwards ease-in-out reverse',
        'toggle-slide-on': 'toggle-slide 0.5s forwards ease-in-out',
      },
      backgroundColor: {
        audioButtonHover: 'var(--button-audio-hover)',
        button: 'var(--button-bg-color)',
        buttonHover: 'var(--button-bg-color-hover)',
        arGreen: 'var(--ar-green)',
      },
      colors: {
        languageSelected: '#C25B4122',
        secondary: 'var(--font-color-secondary)',
      },
      fontFamily: {
        primary: ['"Nunito Sans"', 'sans-serif'],
        secondary: ['"Playfair Display"', 'serif'],
      },
      fontSize: {
        base: ['14px', '20px'],
        lg: ['24px', '24px'],
        md: ['16px', '24px'],
        sm: ['12px', '20px'],
        xl: ['32px', '32px'],
      },
      keyframes: {
        'toggle-slide': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      maxWidth: {
        full: '1440px',
      },
    },
  },
  variants: { extend: {} },
};
