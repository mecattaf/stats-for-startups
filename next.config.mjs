import nextra from 'nextra';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Create the Nextra configuration
const withNextra = nextra({
  // MDX options for rendering math equations
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  },
  
  // Content directory configuration
  contentDirBasePath: '/content',
  
  // Static file handling
  staticImage: true,
  
  // Default code block configurations
  defaultShowCopyCode: true,
  
  // Optional: Configure custom tag styling
  whiteListTagsStyling: ['h1', 'h2', 'h3']
});

// Export the combined Next.js config
export default withNextra({
  // General Next.js config
  reactStrictMode: true,
  
  // Image optimization settings (required for Cloudflare Pages)
  images: {
    domains: ['statsforstartups.com'],
    unoptimized: true // Required for static exports on Cloudflare
  },
  
  // Static export for Cloudflare Pages
  output: 'export',
  
  // Cloudflare Pages specific optimizations
  experimental: {
    optimizePackageImports: ['nextra', 'nextra/components']
  }
});
