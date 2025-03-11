import { useMDXComponents as useNextraMDXComponents } from 'nextra-theme-docs'
import Link from 'next/link'
import Image from 'next/image'
import { BlockMath, InlineMath } from './components/Math'

export function useMDXComponents(components) {
  // Get the default components from Nextra
  const nextraComponents = useNextraMDXComponents()
  
  // Customize components here
  return {
    ...nextraComponents,
    
    // Override the default link component to use Next.js Link for internal links
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
      
      // Use the default Nextra code component for regular code blocks
      return nextraComponents.code({ children, className, ...props })
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
