import { notFound } from 'next/navigation';
import Link from 'next/link';
import KpiListItem from '@/app/_components/kpi/KpiListItem';
import { getAllKpis, getAlphabetMap } from '@/app/_lib/content-loader';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { letter } = params;
  
  return {
    title: `KPIs starting with ${letter.toUpperCase()}`,
    description: `Browse all key performance indicators starting with the letter ${letter.toUpperCase()}.`,
    openGraph: {
      title: `KPIs starting with ${letter.toUpperCase()}`,
      description: `Browse all key performance indicators starting with the letter ${letter.toUpperCase()}.`,
    }
  }
}

// Generate static params for all letters
export async function generateStaticParams() {
  // We'll create a page for all alphabetical letters
  return [...'abcdefghijklmnopqrstuvwxyz'].map(letter => ({
    letter
  }));
}

export default async function BrowseByLetterPage({ params }) {
  const { letter } = params;
  
  // Validate letter is a single character
  if (!letter || letter.length !== 1 || !/[a-z]/i.test(letter)) {
    return notFound();
  }
  
  // Get the alphabet map
  const alphabetMap = await getAlphabetMap();
  
  // Get all letters that have KPIs
  const allLetters = Object.keys(alphabetMap).sort();
  
  // Get KPIs for this letter
  const letterKpis = alphabetMap[letter.toLowerCase()] || [];
  
  // If no KPIs for this letter, the page will still render but with empty results
  
  // Get full KPI data for the letter
  const allKpis = await getAllKpis();
  const kpis = letterKpis.map(letterKpi => {
    return allKpis.find(kpi => kpi.slug === letterKpi.slug) || {
      slug: letterKpi.slug,
      abbreviation: letterKpi.abbreviation,
      title: letterKpi.abbreviation // Use abbreviation as title if no match
    };
  });
  
  return (
    <div>
      {/* Page Header */}
      <div className="bg-primary p-4 text-white">
        <div className="container mx-auto my-12">
          <h1 className="text-5xl font-serif">
            KPIs starting with {letter.toUpperCase()}
          </h1>
        </div>
      </div>
      
      {/* Alphabet Navigation */}
      <div className="container mx-auto py-6">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[...'abcdefghijklmnopqrstuvwxyz'].map((char) => {
            const isAvailable = allLetters.includes(char);
            return (
              <Link
                key={char}
                href={isAvailable ? `/kpis/browse/${char}` : '#'}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-md font-mono text-xl
                  ${isAvailable 
                    ? char === letter.toLowerCase()
                      ? 'bg-charge text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  }
                `}
                onClick={e => !isAvailable && e.preventDefault()}
              >
                {char.toUpperCase()}
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* KPIs List */}
      <div className="container mx-auto pb-12">
        {kpis.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No KPIs found starting with {letter.toUpperCase()}.</p>
            <Link href="/kpis" className="mt-4 inline-block text-charge hover:underline">
              Browse all KPIs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpis.map((kpi, index) => (
              <KpiListItem key={`${kpi.slug}-${index}`} summary={kpi} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
