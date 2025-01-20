/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dosis: ['Dosis', 'sans-serif'],       // Retain the 'Dosis' font
        smooch: ['Smooch Sans', 'sans-serif'], // Add 'Smooch Sans' font
        ubuntu: ['Ubuntu', 'sans-serif'],     // Add 'Ubuntu' font
      },
    },
  },
  plugins: [],
};
