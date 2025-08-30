/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./newtab.tsx",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f0f0f",
        "text-primary": "#ffffff"
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ]
}