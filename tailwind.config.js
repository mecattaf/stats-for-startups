/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx,md,mdx}',
    './content/**/*.{md,mdx}',
    './mdx-components.jsx',
    './components/**/*.{js,jsx,ts,tsx}',
    './styles/**/*.css',
    './node_modules/nextra/**/*.js',
    './node_modules/nextra-theme-docs/**/*.js',
  ],
  darkMode: 'class', // Enable class-based dark mode
  plugins: [],
}
