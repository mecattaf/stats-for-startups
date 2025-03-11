import { getPageMap, getPageData } from 'nextra/page-map'
import { MDXRemote } from 'nextra/mdx-remote'
import { notFound } from 'next/navigation'

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { mdxPath = [] } = params
  
  try {
    // Get page data for metadata
    const pageData = await getPageData({
      mdxPath: mdxPath || [],
    })
    
    if (!pageData) {
      return {
        title: 'Page Not Found',
      }
    }
    
    const { frontMatter, title } = pageData
    
    return {
      title: frontMatter?.title || title || 'Stats For Startups',
      description: frontMatter?.description || 'A repository of key performance indicators for startups',
      openGraph: {
        title: frontMatter?.title || title || 'Stats For Startups',
        description: frontMatter?.description || 'A repository of key performance indicators for startups',
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Error',
    }
  }
}

export default async function MDXPage({ params }) {
  const { mdxPath = [] } = params
  
  try {
    // Get page data for rendering
    const pageData = await getPageData({
      mdxPath: mdxPath || [],
    })
    
    if (!pageData) {
      return notFound()
    }
    
    // Extract content and other metadata
    const { content, frontMatter, title, structuredData } = pageData
    
    return (
      <div className="nx-container nx-mx-auto">
        <MDXRemote source={content} />
      </div>
    )
  } catch (error) {
    console.error('Error rendering MDX page:', error)
    return notFound()
  }
}
