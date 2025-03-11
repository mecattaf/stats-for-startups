import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import matter from 'gray-matter'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import KpiListItem from '@/app/_components/kpi/KpiListItem'

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { slug } = params
  
  try {
    const collection = await getCollectionBySlug(slug)
    return {
      title: collection.name,
      description: collection.short || `Collection of KPIs related to ${collection.name}`,
      openGraph: {
        title: collection.name,
        description: collection.short || `Collection of KPIs related to ${collection.name}`,
      }
    }
  } catch (error) {
    return {
      title: 'Collection Not Found',
      description: 'The requested collection could not be found.'
    }
  }
}

// Get collection by slug
async function getCollectionBySlug(slug) {
  try {
    // Path to the collection MDX file
    const filePath = path.join(process.cwd(), 'content', 'collections', `${slug}.mdx`)
    
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf8')
    
    // Parse the frontmatter and content
    const { data, content } = matter(fileContent)
    
    return {
      ...data,
      slug,
      content
    }
  } catch (error) {
    throw new Error(`Failed to get collection: ${error.message}`)
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

export default async function CollectionDetailPage({ params }) {
  const { slug } = params
  
  try {
    // Get the collection details
    const collection = await getCollectionBySlug(slug)
    
    // Get all KPIs to filter for this collection
    const allKpis = await getAllKpis()
    
    // Filter KPIs that belong to this collection
    // This implementation assumes there's a property in the KPI frontmatter
    // that identifies which collection it belongs to, like a 'collections' array
    // You may need to adjust this logic based on your data structure
    const collectionKpis = allKpis.filter(kpi => {
      // If collection.kpis is defined in the frontmatter, use that
      if (collection.kpis && Array.isArray(collection.kpis)) {
        return collection.kpis.includes(kpi.abbreviation) || 
               collection.kpis.includes(kpi.slug);
      }
      
      // Otherwise check if the KPI has collections defined
      if (kpi.collections && Array.isArray(kpi.collections)) {
        return kpi.collections.includes(collection.name) || 
               kpi.collections.includes(slug);
      }
      
      return false;
    });
    
    return (
      <div>
        {/* Collection Header */}
        <div className="bg-primary p-4 text-white">
          <div className="container mx-auto my-12">
            <p className="text-gray-400 font-mono mb-2 uppercase">{collection.category}</p>
            <h1 className="text-5xl font-serif">{collection.name}</h1>
          </div>
        </div>
        
        {/* Collection Content */}
        <div className="container mx-auto py-8">
          <div className="prose dark:prose-invert max-w-none">
            <MDXRemote source={collection.content} />
          </div>
          
          {/* KPIs in this collection */}
          <div className="mt-12">
            <h2 className="text-3xl font-serif mb-8">KPIs in this collection</h2>
            
            {collectionKpis.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No KPIs found in this collection.</p>
                <Link href="/kpis" className="mt-4 inline-block text-charge hover:underline">
                  Browse all KPIs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {collectionKpis.map((kpi, index) => (
                  <KpiListItem key={index} summary={kpi} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    // If collection not found, return 404
    return notFound()
  }
}
