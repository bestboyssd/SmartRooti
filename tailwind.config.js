/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#ff5722',
        secondary: '#4caf50',
        accent: '#3f51b5',
        neutral: '#607d8b',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '32px',
      },
    },
  },
  variants: {
    backdropBlur: ['responsive'],
  },
  plugins: [],
};