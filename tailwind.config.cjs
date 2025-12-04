/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#000000",
          50: "rgba(0, 0, 0, 0.5)",     // ← THIS FIXES group-hover:bg-black-50
          100: "#2B2C35",
          200: "#242535",
          300: "#1D1E2C",
        },
        white: {
          DEFAULT: "#ffffff",
          50: "rgba(255, 255, 255, 0.5)",  // ← For text-white-50
          100: "#F3F3F3",
        },
        gray: {
          100: "#B0B0B0",
          200: "#9E9E9E",
          300: "#8A8A8A",
        },
        "primary-purple": "#6B4EFF",
        "secondary-blue": "#4ECCA3",
      },
      fontFamily: {
        fira: ['"Fira Code"', "monospace"],
      },
    },
  },
  plugins: [],
}