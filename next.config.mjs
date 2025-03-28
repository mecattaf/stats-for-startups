import nextra from 'nextra';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the Nextra configuration
const withNextra = nextra({
  // MDX options for rendering math equations
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  
  // Set content directory base path to '/content'
  contentDirBasePath: '/content',
  
  // Static file handling
  staticImage: true,
  
  // Default code block configurations
  defaultShowCopyCode: true,
  
  // Configure custom tag styling for HTML elements in MDX
  whiteListTagsStyling: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'code'],
  
  // Transform frontmatter data (if needed)
  frontmatterTransform: (frontMatter) => {
    // Perform any transformations on frontmatter if needed
    return frontMatter;
  }
});

// Export the combined Next.js config
export default withNextra({
  // General Next.js config
  reactStrictMode: true,
  
  // Image optimization settings (required for Cloudflare Pages)
  images: {
    unoptimized: true, // Required for static exports on Cloudflare
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'statsforstartups.com',
        pathname: '/**',
      },
    ],
  },
  
  // Static export for Cloudflare Pages - this is required for Cloudflare Pages
  output: 'export',
  
  // Cloudflare Pages specific optimizations
  experimental: {
    optimizePackageImports: [
      'nextra', 
      'nextra/components',
      'nextra/mdx-remote'
    ]
  },
  
  // Configure path aliases
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    
    // Add polyfills for node modules 
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    return config;
  },
  
  // Disable server-side features that don't work with static export
  serverRuntimeConfig: {
    disableFS: true
  },
  
  // Skip type checking during build to speed up the process
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  
  // Skip ESLint during builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
});
