/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1b4332",
        secondary: "#ffa20d",
        surface: "#f1f5f9",
        text: "#0f172a",
      },
      boxShadow: {
        glow: "0 0 0 3px rgba(255, 162, 13, 0.25)",
      },
    },
  },
  plugins: [],
};
