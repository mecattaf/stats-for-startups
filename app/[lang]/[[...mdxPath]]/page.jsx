import { getPageMap, getPageData } from 'nextra/page-map';
import { MDXRemote } from 'nextra/mdx-remote';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/getDictionary';

// Generate static params for all MDX pages
export async function generateStaticParams() {
  const supportedLangs = ['en']; // Add more languages as needed
  const results = [];

  for (const lang of supportedLangs) {
    try {
      // Get the page map for the language
      const pageMap = await getPageMap(lang);
      
      // Traverse the page map to find all possible MDX paths
      const traversePageMap = (items, parentPath = []) => {
        for (const item of items) {
          if (item.kind === 'Folder' && item.children) {
            traversePageMap(item.children, [...parentPath, item.name]);
          } else if (item.kind === 'MdxPage' && item.name !== 'index') {
            results.push({
              lang,
              mdxPath: [...parentPath, item.name],
            });
          } else if (item.kind === 'MdxPage' && item.name === 'index' && parentPath.length > 0) {
            results.push({
              lang,
              mdxPath: [...parentPath],
            });
          }
        }
      };

      traversePageMap(pageMap);
    } catch (error) {
      console.error(`Error generating paths for language ${lang}:`, error);
    }
  }

  // IMPORTANT: We do NOT add empty mdxPath entries here
  // This avoids the routing conflict with app/[lang]/page.jsx
  
  return results;
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { lang, mdxPath = [] } = params;
  
  // Don't generate metadata for empty paths to avoid conflict
  if (mdxPath.length === 0) {
    return {
      title: 'Not Found',
    };
  }
  
  try {
    // Get page data for metadata
    const pageData = await getPageData({
      locale: lang,
      mdxPath: mdxPath || [],
    });
    
    if (!pageData) {
      return {
        title: 'Page Not Found',
      };
    }
    
    const { frontMatter, title } = pageData;
    const dictionary = await getDictionary(lang);
    
    return {
      title: frontMatter?.title || title || dictionary.siteTitle,
      description: frontMatter?.description || dictionary.siteDescription,
      keywords: frontMatter?.keywords || dictionary.siteKeywords,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
    };
  }
}

export default async function MDXPage({ params }) {
  const { lang, mdxPath = [] } = params;
  
  // Don't handle empty paths - let app/[lang]/page.jsx handle those
  if (mdxPath.length === 0) {
    return notFound();
  }
  
  try {
    // Get page data for rendering
    const pageData = await getPageData({
      locale: lang,
      mdxPath: mdxPath || [],
    });
    
    if (!pageData) {
      return notFound();
    }
    
    const { content, frontMatter, title, structuredData } = pageData;
    
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Page content from MDX */}
        <div className="prose dark:prose-invert max-w-none">
          <MDXRemote source={content} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering MDX page:', error);
    return notFound();
  }
}
