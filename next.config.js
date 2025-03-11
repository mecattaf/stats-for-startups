import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // Nextra configuration
  mdxOptions: {
    remarkPlugins: [
      require('remark-math')
    ],
    rehypePlugins: [
      require('rehype-katex')
    ]
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
  // Disable page extensions in URLs
  trailingSlash: true,
  // Cloudflare specifics
  experimental: {
    optimizeFonts: true
  },
  // Add support for SVG
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  }
}

// Export the combined config
export default withNextra(nextConfig)
