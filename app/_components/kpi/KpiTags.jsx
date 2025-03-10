import Link from 'next/link'

export default function KpiTags({ tags }) {
  // Group tags by category
  const tagsByCategory = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = []
    }
    acc[tag.category].push(tag)
    return acc
  }, {})

  return (
    <div className="border-b p-6">
      <div className="container mx-auto flex flex-wrap">
        {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
          <div key={category} className="flex flex-col mr-12 mb-4">
            <label className="kpi-section-label">
              {category}
            </label>
            <div>
              {categoryTags.length === 0 ? (
                <p className="font-semibold">Any</p>
              ) : (
                <p className="font-semibold">
                  {categoryTags.map((tag, index) => (
                    <span key={`${category}_${index}`}>
                      <Link
                        href={`/tags/${category.toLowerCase()}/${tag.slug}`}
                        className="hover:text-charge font-semibold inline w-full"
                      >
                        <span>
                          {index === 0 ? tag.name : `, ${tag.name}`}
                        </span>
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
