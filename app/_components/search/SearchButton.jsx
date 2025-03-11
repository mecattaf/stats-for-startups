'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchButton({ onClick, placeholder = 'Search', buttonText = 'Search' }) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Handle keyboard shortcut
  useEffect(() => {
    setMounted(true)
    
    const handleKeyDown = (e) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey || document.activeElement === document.body)) {
        e.preventDefault()
        onClick()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClick])

  if (!mounted) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between w-full md:w-64 px-4 py-2 text-sm text-left text-gray-500 md:bg-white md:dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-charge"
      aria-label={buttonText}
    >
      <div className="flex items-center">
        <svg 
          className="mr-3 w-4 h-4"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <span>{placeholder}</span>
      </div>
      <kbd className="hidden md:flex items-center rounded border border-gray-300 dark:border-gray-700 px-2 text-xs text-gray-400">
        /
      </kbd>
    </button>
  )
}
