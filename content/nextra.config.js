// nextra.config.js
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // Specify content directories for each language
  contentDirs: {
    en: './en',
    // Add additional languages here when needed
    // fr: './fr',
  },
  // Ensure mdx files are processed
  extensions: ['mdx'],
  // Configure default ordering for index files
  defaultShowIndex: true
})

module.exports = withNextra({
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeDetection: false
  }
})
