export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playwrite': ['"Playwrite IN"', 'cursive'],
        'quicksand': ['"Quicksand"', 'sans-serif'],
      },
      colors: {
        'brand-orange': '#f28314',
        'brand-cream': '#fbf6de',
      }
    }
  },
  plugins: [],
}