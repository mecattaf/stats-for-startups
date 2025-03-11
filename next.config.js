const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // Nextra configuration
  mdxOptions: {
    remarkPlugins: [require('remark-math')],
    rehypePlugins: [require('rehype-katex')]
  },
  // Disable flexsearch as we're using pagefind
  flexsearch: false,
  // Default configurations for code blocks
  defaultShowCopyCode: true,
  staticImage: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Cloudflare compatibility
  output: 'export',
  // Required for Next.js 14+ on Cloudflare
  images: {
    unoptimized: true
  },
  // i18n configuration 
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    localeDetection: false
  },
  // Disable page extensiosn in URLs
  trailingSlash: true,
  // Cloudflare specifics
  experimental: {
    optimizeFonts: true
  }
}

// Export the combined config
module.exports = withNextra(nextConfig)
