import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import matter from 'gray-matter'
import Link from 'next/link'
import { MDXRemote } from 'nextra/mdx-remote'
import KpiListItem from '@/app/_components/kpi/KpiListItem'

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { category, slug } = params
  
  try {
    const tag = await getTagBySlug(category, slug)
    
    // Format the category name for display (capitalize first letter of each word)
    const formattedCategory = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    return {
      title: `${tag.name} - ${formattedCategory} Tag`,
      description: tag.description || `KPIs tagged with ${tag.name}.`,
      openGraph: {
        title: `${tag.name} - ${formattedCategory} Tag`,
        description: tag.description || `KPIs tagged with ${tag.name}.`,
      }
    }
  } catch (error) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.'
    }
  }
}

// Get tag by category and slug
async function getTagBySlug(category, slug) {
  try {
    // Path to the tag MDX file
    const filePath = path.join(process.cwd(), 'content', 'tags', category, `${slug}.mdx`)
    
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf8')
    
    // Parse the frontmatter and content
    const { data, content } = matter(fileContent)
    
    return {
      ...data,
      slug,
      category,
      content
    }
  } catch (error) {
    throw new Error(`Failed to get tag: ${error.message}`)
  }
}

// Get all KPIs
async function getAllKpis() {
  try {
    const kpisDir = path.join(process.cwd(), 'content', 'kpis')
    const files = await fs.readdir(kpisDir)
    
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    const kpis = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(kpisDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        const { data } = matter(content)
        
        // Get slug from filename
        const slug = file.replace(/\.mdx$/, '')
        
        return {
          ...data,
          slug
        }
      })
    )
    
    return kpis
  } catch (error) {
    console.error('Error getting KPIs:', error)
    return []
  }
}

export default async function TagDetailPage({ params }) {
  const { category, slug } = params
  
  try {
    // Get the tag details
    const tag = await getTagBySlug(category, slug)
    
    // Get all KPIs to filter for this tag
    const allKpis = await getAllKpis()
    
    // Filter KPIs that have this tag
    const taggedKpis = allKpis.filter(kpi => {
      if (!kpi.tags || !Array.isArray(kpi.tags)) {
        return false
      }
      
      // Check if any of the KPI's tags match this tag
      return kpi.tags.some(kpiTag => {
        // If tag is a string, compare it directly
        if (typeof kpiTag === 'string') {
          return kpiTag.toLowerCase() === tag.name.toLowerCase()
        }
        
        // If tag is an object, check if it matches by slug, name, or other properties
        if (typeof kpiTag === 'object') {
          return (
            (kpiTag.slug && kpiTag.slug === slug) ||
            (kpiTag.name && kpiTag.name.toLowerCase() === tag.name.toLowerCase()) ||
            (kpiTag.category && kpiTag.category.toLowerCase() === category.replace(/-/g, ' ').toLowerCase())
          )
        }
        
        return false
      })
    })
    
    // Format the category name for display (capitalize first letter of each word)
    const formattedCategory = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    return (
      <div>
        {/* Tag Header */}
        <div className="bg-primary p-4 text-white">
          <div className="container mx-auto my-12">
            <Link 
              href={`/tags/${category}`}
              className="text-gray-400 hover:text-white font-mono mb-2 inline-block"
            >
              ← {formattedCategory}
            </Link>
            <h1 className="text-5xl font-serif">{tag.name}</h1>
          </div>
        </div>
        
        {/* Tag Content */}
        <div className="container mx-auto py-8">
          {tag.content && (
            <div className="prose dark:prose-invert max-w-none mb-12">
              <MDXRemote source={tag.content} />
            </div>
          )}
          
          {/* KPIs with this tag */}
          <div>
            <h2 className="text-3xl font-serif mb-8">KPIs with this tag</h2>
            
            {taggedKpis.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No KPIs found with this tag.</p>
                <Link href="/kpis" className="mt-4 inline-block text-charge hover:underline">
                  Browse all KPIs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {taggedKpis.map((kpi, index) => (
                  <KpiListItem key={index} summary={kpi} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    // If tag not found, return 404
    return notFound()
  }
}
