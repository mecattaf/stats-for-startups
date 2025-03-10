import nextra from 'nextra'

const withNextra = nextra({
  // Enable LaTeX support with KaTeX
  latex: {
    renderer: 'katex',
    options: {}
  },
  // Default configurations
  defaultShowCopyCode: true,
  flexsearch: false, // Disable default search (will be implemented separately)
  staticImage: true,
  // Configure the repository for "Edit this page" links
  docsRepositoryBase: 'https://github.com/yourusername/stats-for-startups-nextra/tree/main',
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: []
  }
})

export default withNextra({
  reactStrictMode: true,
  // Configure URL rewrites if needed
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
  }
})
