import nextra from 'nextra'

const withNextra = nextra({
  // Enable LaTeX support via KaTeX
  latex: {
    renderer: 'katex',
    options: {
      throwOnError: false,
      strict: false
    }
  },
  
  // Default configurations
  defaultShowCopyCode: true,
  staticImage: true,
  
  // Disable default search (will be implemented separately)
  flexsearch: false,
  
  // Configure the repository for "Edit this page" links
  docsRepositoryBase: 'https://github.com/mecattaf/stats-for-startups/tree/main',
  
  // MDX options for additional processing
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: []
  }
})

export default withNextra({
  // General Next.js config
  reactStrictMode: true,
  
  // Image domains for optimization
  images: {
    domains: ['statsforstartups.com'],
    unoptimized: process.env.NODE_ENV === 'production' // Required for Cloudflare Pages
  },
  
  // Configure URL rewrites to maintain compatibility with old URLs
  async rewrites() {
    return [
      // Redirect /kpis/[slug] to /kpis/[slug]/ to maintain compatibility with old URLs
      {
        source: '/kpis/:slug',
        destination: '/kpis/:slug/'
      },
      // Similar redirects for collections and tags
      {
        source: '/collections/:slug',
        destination: '/collections/:slug/'
      },
      {
        source: '/tags/:category/:slug',
        destination: '/tags/:category/:slug/'
      }
    ]
  },
  
  // Cloudflare Pages specific optimizations
  // See: https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/
  // Set to "edge" for Cloudflare compatibility
  experimental: {
    optimizeFonts: true,
    optimizePackageImports: true
  }
})
