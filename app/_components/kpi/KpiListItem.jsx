import Link from 'next/link'

export default function KpiListItem({ summary }) {
  // Handle title field which could be different between different implementations (title vs kpi_name)
  const displayTitle = summary.title || summary.kpi_name

  return (
    <Link
      className="w-full flex flex-col items-center px-3"
      href={`/kpis/${summary.slug}/`}
    >
      <div className="flex flex-col my-4 min-w-full">
        <div className="bg-white flex flex-col justify-start p-3 border border-gray-200 hover:border-charge transition-colors">
          <h2 className="text-3xl tracking-wider font-serif mb-2 font-bold">
            {summary.abbreviation}
          </h2>
          <h1 className="text-lg font-serif font-normal mb-2">
            {displayTitle}
          </h1>
          {summary.alternativeNames && summary.alternativeNames.length > 0 && (
            <h3 className="italic text-gray-400 font-normal mb-2">
              aka {Array.isArray(summary.alternativeNames) 
                ? summary.alternativeNames.join(', ') 
                : summary.alternativeNames}
            </h3>
          )}
          {summary.short && (
            <p className="text-gray-400 mt-1 font-light max-w-md">
              {summary.short}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
