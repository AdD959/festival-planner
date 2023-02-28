/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      skin: {
        base: 'var(--base)',
        muted: 'var(--muted)',
        inverted: 'var(--inverted)',
        accent: 'var(--accent)',
        tertiary: 'var(--tertiary)',
        quaternary: 'var(--quaternary)',
      },
    },
  },
  plugins: [],
}
