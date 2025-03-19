import { notFound } from 'next/navigation';
import { MDXRemote } from 'nextra/mdx-remote';
import { getKpiBySlug, getAllKpis } from '@/app/_lib/content-loader';
import KpiSidebar from '@/app/_components/kpi/KpiSidebar';
import KpiTags from '@/app/_components/kpi/KpiTags';
import RelatedKpis from '@/app/_components/kpi/RelatedKpis';
import MetaTags from '@/app/_components/layout/MetaTags';

// Export the static params generator
export { generateKpiStaticParams as generateStaticParams } from './staticParams';

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    // Get the KPI data
    const kpi = await getKpiBySlug(slug);
    
    if (!kpi) {
      return {
        title: 'KPI Not Found',
        description: 'The requested KPI could not be found.'
      };
    }
    
    const { frontMatter } = kpi;
    
    // Prepare related keywords
    const keywords = [
      frontMatter.title,
      frontMatter.abbreviation,
      ...(frontMatter.alternativeNames || []),
      'KPI', 'metric', 'startup metrics'
    ].filter(Boolean).join(', ');
    
    return MetaTags({
      title: `${frontMatter.abbreviation} - ${frontMatter.title}`,
      description: frontMatter.short || `Learn about the ${frontMatter.title} (${frontMatter.abbreviation}) key performance indicator.`,
      keywords,
      canonical: `/kpis/${slug}`
    });
  } catch (error) {
    console.error('Error generating KPI metadata:', error);
    
    return {
      title: 'KPI Not Found',
      description: 'The requested KPI could not be found.'
    };
  }
}

export default async function KpiPage({ params }) {
  const { slug } = params;
  
  try {
    // Get the KPI data
    const kpi = await getKpiBySlug(slug);
    
    if (!kpi) {
      return notFound();
    }
    
    const { content, frontMatter } = kpi;
    
    // Prepare related KPIs data if they exist
    let relatedKpis = [];
    
    if (frontMatter.relatedKpis && frontMatter.relatedKpis.length > 0) {
      // Get all KPIs to extract full data for related KPIs
      const allKpis = await getAllKpis();
      
      // Map related KPIs to their full data
      relatedKpis = frontMatter.relatedKpis
        .map(relatedKpi => {
          // Try to find the related KPI in all KPIs
          const fullKpi = allKpis.find(k => k.slug === relatedKpi.slug);
          
          // If found, return the combined data, otherwise just return what we have
          return fullKpi ? { ...relatedKpi, ...fullKpi } : relatedKpi;
        });
    }
    
    // Prepare tags data
    const tags = [];
    
    if (frontMatter.tags && frontMatter.tags.length > 0) {
      // Group tags by category
      const tagsByCategory = frontMatter.tags.reduce((acc, tag) => {
        if (!acc[tag.category]) {
          acc[tag.category] = [];
        }
        acc[tag.category].push(tag);
        return acc;
      }, {});
      
      // Flatten the grouped tags
      Object.entries(tagsByCategory).forEach(([category, categoryTags]) => {
        tags.push(...categoryTags.map(tag => ({ ...tag, category })));
      });
    }
    
    return (
      <div>
        {/* KPI Header */}
        <div className="bg-primary p-4 text-white">
          <div className="container mx-auto flex flex-col md:flex-row justify-between pt-8">
            {/* KPI title and abbreviation */}
            <div className="md:w-3/4">
              <h1 className="kpi-abbreviation">{frontMatter.abbreviation}</h1>
              <h2 className="kpi-title">{frontMatter.title}</h2>
              
              {/* Alternative names if available */}
              {frontMatter.alternativeNames && frontMatter.alternativeNames.length > 0 && (
                <p className="kpi-aka">
                  aka {Array.isArray(frontMatter.alternativeNames) 
                    ? frontMatter.alternativeNames.join(', ') 
                    : frontMatter.alternativeNames}
                </p>
              )}
            </div>
            
            {/* KPI sidebar with history and metadata */}
            <div className="md:w-1/4 mt-8 md:mt-0">
              <KpiSidebar updatedAt={frontMatter.updatedAt} />
            </div>
          </div>
        </div>
        
        {/* KPI Tags Section */}
        {tags.length > 0 && (
          <KpiTags tags={tags} />
        )}
        
        {/* KPI Content */}
        <div className="container mx-auto py-8">
          <div className="prose dark:prose-invert max-w-none">
            <MDXRemote source={content} />
          </div>
        </div>
        
        {/* Related KPIs Section */}
        {relatedKpis.length > 0 && (
          <RelatedKpis relatedKpis={relatedKpis} />
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering KPI page:', error);
    return notFound();
  }
}
