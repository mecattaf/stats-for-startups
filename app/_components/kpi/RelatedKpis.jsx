import Link from 'next/link'

export default function RelatedKpis({ relatedKpis }) {
  if (!relatedKpis || relatedKpis.length === 0) {
    return null
  }
  
  return (
    <div className="border-t border-b border-gray-200 p-6">
      <div className="container mx-auto mb-4">
        <label className="kpi-section-label">Related</label>
        <div className="flex flex-row overflow-x-auto">
          {relatedKpis.map((rel, index) => (
            <div key={`related_${index}`} className="mr-6">
              <Link
                href={`/kpis/${rel.slug}`}
                className="w-full border-gray-200 border-2 p-4 flex flex-col hover:border-gray-300"
              >
                <p className="font-serif text-2xl mb-1 fond-bold">
                  {rel.abbreviation}
                </p>
                <p className="font-serif font-normal text-sm">
                  {rel.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
