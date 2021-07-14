// tailwind.config.js
module.exports = {
  purge: ["./src/render/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [
    // tailwindcss: {},
    // autoprefixer: {},
  ]
}
