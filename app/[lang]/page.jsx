import Link from 'next/link';
import Image from 'next/image';
import CollectionCard from '@/app/_components/features/CollectionCard';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { createContentLoader } from 'nextra/page-map';
import { getKpiLists, getAlphabetMap } from '@/app/_lib/content-loader';

// Create content loader for the MDX files
const contentLoader = createContentLoader();

// Generate static params for the language pages
export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export async function generateMetadata({ params }) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  
  // Try to get index page content from the content directory
  try {
    const indexContent = await contentLoader.load({
      locale: lang,
      path: []
    });
    
    if (indexContent && indexContent.frontMatter && indexContent.frontMatter.title) {
      return {
        title: indexContent.frontMatter.title,
        description: indexContent.frontMatter.description || dictionary.siteDescription,
      };
    }
  } catch (error) {
    console.error('Error loading index page metadata:', error);
  }
  
  // Fall back to default metadata
  return {
    title: dictionary.siteTitle,
    description: dictionary.siteDescription,
  };
}

export default async function HomePage({ params }) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  
  // Get collections dynamically from content/lists
  const collections = await getKpiLists(lang);
  
  // Get alphabet map dynamically from content/kpis
  const alphabetMap = await getAlphabetMap(lang);
  
  // Get alphabet letters with counts
  const alphabetLetters = Object.keys(alphabetMap).sort().map(letter => ({
    letter: letter.toUpperCase(),
    count: alphabetMap[letter].length
  }));
  
  // Calculate total number of KPIs
  const totalKpis = Object.values(alphabetMap).reduce((sum, letterKpis) => sum + letterKpis.length, 0);
  
  // Make sure we have at least 5 collections to display
  const displayCollections = collections.length >= 5 
    ? collections.slice(0, 5) 
    : [
        ...(collections || []),
        ...Array(5 - (collections?.length || 0)).fill({
          name: "Sample Collection",
          slug: "#",
          category: "Sample",
          short: "This is a placeholder for a collection."
        })
      ];
  
  return (
    <div data-pagefind-body>
      {/* Hero Section with Network Background */}
      <div id="topDiv" className="network relative pt-12 pb-24 px-4 bg-primary">
        <div className="container mx-auto">
          <div className="container mx-auto flex flex-col gap-6 md:flex-row justify-center">
            {/* Display first 5 collections as feature cards */}
            {displayCollections.slice(0, 5).map((collection, index) => (
              <div 
                key={`${collection.slug}-${index}`} 
                className="w-full md:w-1/5 justify-between min-w-min flex flex-col"
              >
                {/* If it's the last card, show About link */}
                {index === 4 ? (
                  <Link
                    href={`/${lang}/about`}
                    className="border-gray-700 py-4 px-6 mb-6 md:mb-auto cursor-pointer bg-gray-400 bg-opacity-10 tracking-wider text-white text-right font-normal hover:bg-opacity-20 font-serif"
                  >
                    {dictionary.common?.aboutLink || "Our Story"} →
                  </Link>
                ) : null}
                
                {/* Display collection card */}
                <CollectionCard info={collection} index={index} />
                
                {/* Display A-Z explorer link on the first card */}
                {index === 0 ? (
                  <Link
                    href="#alphabet-explorer"
                    className="border-gray-700 bg-gray-500 py-3 px-6 mt-6 md:mt-auto cursor-pointer bg-opacity-10 hover:bg-opacity-20 font-mono text-sm"
                    style={{ color: '#6b7280' }}
                  >
                    <strong className="font-serif text-white inline-block font-normal mt-1 mb-1 text-xl">
                      A-Z
                    </strong>
                    <br />
                    {dictionary.alphabet?.all || "All"} {totalKpis} {dictionary.common?.metrics || "metrics"}
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Alphabet Explorer Section */}
      <div id="alphabet-explorer" className="container mx-auto py-8">
        <h2 className="text-3xl font-serif text-center mb-6">
          {dictionary.alphabet?.explore || "Explore all KPIs"}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
          {alphabetLetters.map((item) => (
            <Link
              key={item.letter}
              href={`/${lang}/kpis/browse/${item.letter.toLowerCase()}`}
              className={`
                px-4 bg-opacity-20 border-2 text-center
                ${item.count === 0 
                  ? 'opacity-10 cursor-not-allowed border-gray-300' 
                  : 'border-gray-500 hover:border-charge'}
                m-4 h-16 flex items-center justify-center
                text-2xl font-bold font-mono
              `}
              onClick={e => item.count === 0 && e.preventDefault()}
            >
              {item.letter}
              <sup className="ml-1 font-mono text-sm" style={{ color: '#9ca3af' }}>
                {item.count}
              </sup>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
