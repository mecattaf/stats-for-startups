'use client'

import { useRef, useEffect } from 'react'
import SearchResultItem from './SearchResultItem'

export default function SearchResults({ 
  results, 
  loading, 
  query, 
  onClose 
}) {
  const resultsContainerRef = useRef(null)

  // Scroll to top when results change
  useEffect(() => {
    if (resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop = 0
    }
  }, [results])

  // Empty state when no query
  if (!query.trim()) {
    return (
      <div className="py-16 text-center text-gray-500 dark:text-gray-400">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <p className="mt-4 text-lg">Type to start searching</p>
        <p className="mt-2">Search for KPIs, metrics, formulas, and more</p>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500 dark:text-gray-400">
        <svg 
          className="animate-spin mx-auto h-8 w-8 text-charge" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4">Searching...</p>
      </div>
    )
  }

  // No results state
  if (results.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 dark:text-gray-400">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <p className="mt-4 text-lg">No results found for "{query}"</p>
        <p className="mt-2">Try searching for different terms or keywords</p>
      </div>
    )
  }

  // Results list
  return (
    <div 
      ref={resultsContainerRef}
      className="overflow-y-auto divide-y divide-gray-200 dark:divide-gray-800"
    >
      <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 sticky top-0 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-800">
        {results.length} {results.length === 1 ? 'result' : 'results'} found
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {results.map((result, index) => (
          <SearchResultItem
            key={`${result.url}-${index}`}
            result={result}
            onClick={onClose}
          />
        ))}
      </div>
    </div>
  )
}
