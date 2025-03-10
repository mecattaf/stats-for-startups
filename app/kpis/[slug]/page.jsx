import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import matter from 'gray-matter'
import KpiTags from '@/app/_components/kpi/KpiTags'
import KpiSidebar from '@/app/_components/kpi/KpiSidebar'
import RelatedKpis from '@/app/_components/kpi/RelatedKpis'

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { slug } = params
  
  try {
    // Read the MDX file
    const kpiContent = await getKpiBySlug(slug)
    const { title, abbreviation } = kpiContent.frontMatter
    
    return {
      title: `${abbreviation} - ${title}`,
      description: `Learn about ${title} (${abbreviation}), including definition, calculation, and related KPIs.`,
      openGraph: {
        title: `${abbreviation} - ${title}`,
        description: `Learn about ${title} (${abbreviation}), including definition, calculation, and related KPIs.`,
      }
    }
  } catch (error) {
    return {
      title: 'KPI Not Found',
      description: 'The requested KPI could not be found.'
    }
  }
}

// Get the KPI content by slug
async function getKpiBySlug(slug) {
  try {
    // Path to the KPI MDX file
    const filePath = path.join(process.cwd(), 'content', 'kpis', `${slug}.mdx`)
    
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf8')
    
    // Parse the frontmatter and content
    const { data: frontMatter, content } = matter(fileContent)
    
    return {
      frontMatter,
      content
    }
  } catch (error) {
    throw new Error(`Failed to get KPI: ${error.message}`)
  }
}

export default async function KpiDetailPage({ params }) {
  const { slug } = params
  
  try {
    // Get the KPI content
    const { frontMatter, content } = await getKpiBySlug(slug)
    
    // Extract information from frontmatter
    const { 
      title, 
      abbreviation, 
      alternativeNames, 
      updatedAt, 
      tags, 
      relatedKpis 
    } = frontMatter
    
    return (
      <>
        {/* Title Section */}
        <div className="bg-white border-b px-4 p-6">
          <div className="container mx-auto py-12 relative">
            <h1 className="kpi-abbreviation">
              {abbreviation}
            </h1>
            <h2 className="kpi-title">
              {title}
            </h2>
            {alternativeNames && alternativeNames.length > 0 && (
              <h2 className="kpi-aka">
                aka {alternativeNames.join(', ')}
              </h2>
            )}
          </div>
        </div>
        
        {/* Tags Section */}
        <KpiTags tags={tags || []} />
        
        {/* Content Section */}
        <div className="container mx-auto flex flex-col md:flex-row">
          {/* Main Content */}
          <div className="w-full md:w-3/4 pl-6 md:pl-0 py-8 pr-6">
            <div className="mdx-content">
              <MDXRemote source={content} />
            </div>
          </div>
          
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 px-6 py-8 border-t md:border-t-0 md:border-l">
            <KpiSidebar updatedAt={updatedAt} />
          </aside>
        </div>
        
        {/* Related KPIs */}
        {relatedKpis && relatedKpis.length > 0 && (
          <RelatedKpis relatedKpis={relatedKpis} />
        )}
      </>
    )
  } catch (error) {
    // If KPI not found, return 404
    return notFound()
  }
}
