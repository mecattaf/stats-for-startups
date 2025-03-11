import nextra from 'nextra'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// Create the Nextra configuration
// Removed: theme, themeConfig, flexsearch keys
const withNextra = nextra({
  // MDX options for rendering math equations
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  },
  
  // Static file handling
  staticImage: true,
  
  // Default code block configurations
  defaultShowCopyCode: true,
  
  // Content directory settings (using content directory convention)
  contentDirBasePath: '/en',
  
  // Optional: Configure custom tag styling
  whiteListTagsStyling: ['h1', 'h2', 'h3']
})

// Export the combined Next.js config
export default withNextra({
  // General Next.js config
  reactStrictMode: true,
  
  // Image optimization settings (required for Cloudflare Pages)
  images: {
    domains: ['statsforstartups.com'],
    unoptimized: true // Required for static exports on Cloudflare
  },
  
  // i18n configuration
  i18n: {
    // Define the locales
    locales: ['en'],
    // Set the default locale
    defaultLocale: 'en',
    // Disable automatic locale detection
    localeDetection: false
  },
  
  // Static export for Cloudflare Pages
  output: 'export',
  
  // Cloudflare Pages specific optimizations
  experimental: {
    optimizeFonts: true,
    optimizePackageImports: ['nextra', 'nextra/components', 'nextra-theme-docs']
  }
})
