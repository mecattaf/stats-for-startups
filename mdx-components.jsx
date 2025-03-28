import Link from 'next/link'
import Image from 'next/image'
import { BlockMath, InlineMath } from './components/Math'
import { Pre, withIcons } from 'nextra/components'

/**
 * This file defines how MDX components are rendered in Nextra v4
 * Following the conventions described in the Nextra v4 blog post
 */
export function useMDXComponents(components) {
  return {
    // Handle links (internal vs external)
    a: ({ href, children, ...props }) => {
      // Check if the link is internal or external
      if (href && (href.startsWith('/') || href.startsWith('#'))) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        )
      }
      
      // For external links, use regular anchor tags with target="_blank"
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    },
    
    // Use Next.js Image component for optimized images
    img: ({ src, alt, ...props }) => {
      // For external images or SVGs
      if (src && (src.startsWith('http') || src.endsWith('.svg'))) {
        return <img src={src} alt={alt || ''} {...props} />
      }
      
      // For local images
      return (
        <Image
          src={src}
          alt={alt || ''}
          width={props.width || 800}
          height={props.height || 500}
          unoptimized={true} // Required for Cloudflare Pages
          {...props}
          className={`rounded-md ${props.className || ''}`}
        />
      )
    },
    
    // Math components
    BlockMath,
    InlineMath,
    
    // Pre component with custom code highlighting
    pre: withIcons(Pre, {
      js: (props) => (
        <svg 
          {...props} 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 4L4 20" />
          <path d="M4 4L20 20" />
        </svg>
      ),
      jsx: (props) => (
        <svg 
          {...props} 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8L8 16" />
          <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    }),
    
    // For inline math, we'll use a special syntax: $...$
    // This requires special handling in the mdx processor
    code: ({ children, className, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      
      if (match && match[1] === 'math') {
        return <BlockMath>{String(children).trim()}</BlockMath>
      }
      
      if (match && match[1] === 'inlinemath') {
        return <InlineMath>{String(children).trim()}</InlineMath>
      }
      
      // Use the default code component for regular code blocks
      return <code className={className} {...props}>{children}</code>
    },
    
    // Add custom styling for footnote references
    sup: (props) => (
      <sup 
        {...props} 
        className="text-xs font-medium text-gray-500 cursor-pointer hover:text-blue-600"
      />
    ),
    
    // Any other custom components
    ...components
  }
}
