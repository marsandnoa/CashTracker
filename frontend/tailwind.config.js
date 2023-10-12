/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'brother1816': ['Brother1816', 'sans']
      },
      colors: {
        'light-blue-300': '#b3e0ff',   // A light blue shade
        'deep-blue-900': '#003366'    // A deep blue shade
      }
    },
  },
  plugins: [
    
  ],
};
