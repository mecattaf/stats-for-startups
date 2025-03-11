'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import SearchResults from './SearchResults'

export default function SearchDialog({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagefind, setPagefind] = useState(null)
  const [pagefindLoaded, setPagefindLoaded] = useState(false)
  const [searchError, setSearchError] = useState(null)
  
  const inputRef = useRef(null)
  const dialogRef = useRef(null)

  // Load Pagefind when dialog is first opened
  useEffect(() => {
    if (!isOpen || pagefindLoaded) return

    const loadPagefind = async () => {
      try {
        setLoading(true)
        // Import the Pagefind library dynamically
        const pagefindModule = await import('/_pagefind/pagefind.js')
        const pagefind = pagefindModule.default || pagefindModule
        
        // Initialize Pagefind
        await pagefind.init()
        setPagefind(pagefind)
        setPagefindLoaded(true)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load Pagefind:', error)
        setSearchError('Failed to load search. Please try again later.')
        setLoading(false)
      }
    }

    loadPagefind()
  }, [isOpen, pagefindLoaded])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure the dialog is fully rendered
      setTimeout(() => {
        inputRef.current.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Handle search
  const performSearch = useCallback(
    async (searchQuery) => {
      if (!pagefind || !searchQuery.trim()) {
        setResults([])
        return
      }

      try {
        setLoading(true)
        const search = await pagefind.search(searchQuery)
        
        // Transform results to a more usable format
        const searchResults = await Promise.all(
          search.results.map(async (result) => {
            const data = await result.data()
            return {
              url: data.url,
              title: data.meta.title || 'Untitled',
              excerpt: data.excerpt,
              content: data.content
            }
          })
        )
        
        setResults(searchResults)
        setLoading(false)
      } catch (error) {
        console.error('Search error:', error)
        setSearchError('Something went wrong with your search. Please try again.')
        setLoading(false)
      }
    },
    [pagefind]
  )

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Handle dialog click outside
  const handleDialogClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-start justify-center p-4 md:pt-16"
      onClick={handleDialogClick}
      aria-labelledby="search-dialog-title"
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={dialogRef}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="search"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-charge placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Search for KPIs, metrics, and more..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
            />
            {query && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <svg 
                  className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
          
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={onClose}
            aria-label="Close search"
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
        
        {/* Search results container */}
        <div className="flex-1 overflow-y-auto">
          {searchError ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              <svg 
                className="mx-auto h-12 w-12 text-red-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <p className="mt-4 text-lg">{searchError}</p>
              <button 
                className="mt-4 text-charge hover:underline focus:outline-none"
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
            </div>
          ) : (
            <SearchResults
              results={results}
              loading={loading || !pagefindLoaded}
              query={query}
              onClose={onClose}
            />
          )}
        </div>
        
        {/* Optional footer with search info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Press ESC to close, or use '/' to search anytime</p>
        </div>
      </div>
    </div>
  )
}
