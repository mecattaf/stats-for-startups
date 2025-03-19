import Link from 'next/link';
import { getKpiLists } from '@/app/_lib/content-loader';

export const metadata = {
  title: 'KPI Collections',
  description: 'Browse curated collections of key performance indicators'
};

export default async function CollectionsPage() {
  // Fetch collections from content directory
  const collections = await getKpiLists();
  
  // Extract unique categories
  const categories = [...new Set(collections.map(c => c.category))];
  
  // Initialize with "All" category active
  const initialCategories = [
    { name: 'All', isActive: true },
    ...categories.map(name => ({ name, isActive: false }))
  ];

  return (
    <div>
      <div className="bg-primary p-4 text-white">
        <div className="container my-12 mx-auto">
          <h1 className="text-5xl font-serif">All collections</h1>
        </div>
        <div className="-mt-10">
          {/* This section would need client-side interaction to filter collections */}
          <ul className="container text-white mx-auto py-6 flex flex-wrap">
            {initialCategories.map((category, index) => (
              <li
                key={category.name}
                className="flex mb-1 cursor-pointer"
              >
                <p
                  className={`
                    ${category.isActive ? 'text-white' : ''}
                    ${!category.isActive ? 'text-gray-500' : ''}
                    hover:underline mr-4 inline-block break-words align-middle mb-2
                  `}
                  style={{ color: category.isActive ? 'white' : '#6b7280' }}
                >
                  {category.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto my-8 flex flex-row flex-wrap">
        {collections.length === 0 ? (
          <div className="w-full text-center py-8">
            No collections found.
          </div>
        ) : (
          collections.map((collection, index) => (
            <div
              key={`${collection.slug}-${index}`}
              className="w-full md:w-1/3 border-2 border-transparent hover:border-gray-200"
            >
              <Link
                className="w-full flex flex-col items-center px-3"
                href={`/collections/${collection.slug}`}
              >
                <div className="flex flex-col my-4 min-w-full">
                  <div className="bg-white flex flex-col justify-start p-3">
                    <h3 className="text-lg font-serif font-normal mb-3" style={{ color: '#9ca3af' }}>
                      {collection.category}
                    </h3>
                    <h2 className="text-3xl tracking-wider font-serif mb-2 font-bold">
                      {collection.name}
                    </h2>
                    <p className="mt-1 font-light max-w-md" style={{ color: '#9ca3af' }}>
                      {collection.short}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
