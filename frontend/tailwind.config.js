import { theme } from './src/styles/theme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        success: theme.colors.success,
        warning: theme.colors.warning,
        danger: theme.colors.danger,
        neutral: theme.colors.neutral,
      },
      fontFamily: {
        sans: theme.fonts.sans,
        mono: theme.fonts.mono,
      },
      borderRadius: {
        brand: theme.radius.brand,
      },
    },
  },
  plugins: [],
};
