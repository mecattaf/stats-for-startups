'use client'

import Link from 'next/link'

export default function SearchResultItem({ result, onClick, currentLang = 'en' }) {
  const { url, title, excerpt, content } = result
  
  // Add language prefix to URLs that don't already have it
  const getLanguageAwareUrl = (url) => {
    // If URL already has a language prefix, return it as is
    if (url.startsWith(`/${currentLang}/`)) {
      return url
    }
    
    // Remove leading slash if present
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url
    
    // If URL already starts with 'en/' or another language code, replace it
    if (/^[a-z]{2}\//.test(cleanUrl)) {
      return `/${currentLang}/${cleanUrl.substring(3)}`
    }
    
    // Otherwise, add the language prefix
    return `/${currentLang}/${cleanUrl}`
  }
  
  // Generate the final URL
  const finalUrl = getLanguageAwareUrl(url)

  return (
    <Link
      href={finalUrl}
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
        {finalUrl}
      </div>
    </Link>
  )
}
