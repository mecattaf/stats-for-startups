import { notFound } from 'next/navigation';
import { getKpiListBySlug } from '@/app/_lib/content-loader';
import { MDXRemote } from 'nextra/mdx-remote';
import Link from 'next/link';
import MetaTags from '@/app/_components/layout/MetaTags';

// Export the static params generator
export { generateCollectionStaticParams as generateStaticParams } from './staticParams';

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    // Get the collection data
    const collection = await getKpiListBySlug(slug);
    
    if (!collection) {
      return {
        title: 'Collection Not Found',
        description: 'The requested collection could not be found.'
      };
    }
    
    const { frontMatter } = collection;
    
    return MetaTags({
      title: frontMatter.title,
      description: frontMatter.short || `Explore ${frontMatter.title} collection - a curated list of key performance indicators.`,
      keywords: `${frontMatter.title}, KPIs, metrics, ${frontMatter.category}`,
      canonical: `/collections/${slug}`
    });
  } catch (error) {
    console.error('Error generating collection metadata:', error);
    
    return {
      title: 'Collection Not Found',
      description: 'The requested collection could not be found.'
    };
  }
}

export default async function CollectionPage({ params }) {
  const { slug } = params;
  
  try {
    // Get the collection data
    const collection = await getKpiListBySlug(slug);
    
    if (!collection) {
      return notFound();
    }
    
    const { content, frontMatter } = collection;
    
    return (
      <div>
        {/* Collection Header */}
        <div className="bg-primary p-4 text-white">
          <div className="container mx-auto my-12">
            <Link
              href="/collections"
              className="text-gray-400 hover:text-white font-mono mb-2 inline-block"
            >
              ← Collections
            </Link>
            <h1 className="text-5xl font-serif">{frontMatter.title}</h1>
            <p className="text-gray-400 font-mono mt-2">{frontMatter.category}</p>
          </div>
        </div>
        
        {/* Collection Content */}
        <div className="container mx-auto py-8">
          <div className="prose dark:prose-invert max-w-none">
            <MDXRemote source={content} />
          </div>
          
          {/* Collection KPIs List */}
          <div className="mt-8">
            {frontMatter.kpis && frontMatter.kpis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {frontMatter.kpis.map((kpi, index) => (
                  <Link
                    key={`${kpi.slug}-${index}`}
                    href={`/kpis/${kpi.slug}`}
                    className="block p-4 border-2 border-gray-200 hover:border-charge transition-colors"
                  >
                    <h3 className="text-2xl font-serif mb-1 font-bold">
                      {kpi.abbreviation}
                    </h3>
                    <p className="font-serif font-normal">
                      {kpi.name}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No KPIs found in this collection.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering collection page:', error);
    return notFound();
  }
}
