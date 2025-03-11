'use client'

import Link from 'next/link'

export default function SearchResultItem({ result, onClick }) {
  const { url, title, excerpt, content } = result

  return (
    <Link
      href={url}
      onClick={onClick}
      className="block p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-charge"
    >
      <h3 className="text-lg font-serif font-bold mb-1 text-gray-900 dark:text-white">
        {/* Render the title with HTML if it has page-find highlighting */}
        {title.includes('<mark>') ? (
          <span dangerouslySetInnerHTML={{ __html: title }} />
        ) : (
          title
        )}
      </h3>
      
      {excerpt && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {/* Render the excerpt with HTML if it has page-find highlighting */}
          {excerpt.includes('<mark>') ? (
            <span dangerouslySetInnerHTML={{ __html: excerpt }} />
          ) : (
            excerpt
          )}
        </p>
      )}
      
      {/* Display content preview if available and no excerpt */}
      {!excerpt && content && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {content.includes('<mark>') ? (
            <span dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            content
          )}
        </p>
      )}
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
        {url}
      </div>
    </Link>
  )
}
