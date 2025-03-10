import { useMDXComponents as useNextraMDXComponents } from 'nextra/mdx'
import Link from 'next/link'

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
    
    // Add custom styling for footnote references
    sup: (props) => (
      <sup 
        {...props} 
        className="text-xs font-medium text-gray-500 cursor-pointer hover:text-blue-600"
      />
    ),
    
    // Add any other custom component overrides
    ...components
  }
}
