import { useMDXComponents as useNextraMDXComponents } from 'nextra-theme-docs'
import Link from 'next/link'
import Image from 'next/image'

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
    
    // Use Next.js Image component for optimized images (with unoptimized option for Cloudflare)
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
    
    // Any custom components you want to add
    ...components
  }
}
