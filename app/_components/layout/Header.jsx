'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SearchButton from '../search/SearchButton'
import SearchDialog from '../search/SearchDialog'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/config'

export default function Header({ dictionary, currentLang, pageMap }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  // Navigation items from dictionary
  const nav = dictionary?.navigation || {
    home: 'Home',
    collections: 'Collections',
    about: 'About',
    chargeVc: 'Charge VC'
  }
  
  // Search dictionary
  const searchDict = dictionary?.search || {
    placeholder: 'Search',
    button: 'Search'
  }
  
  // Get current path without language prefix to maintain path when switching languages
  const getPathWithoutLang = () => {
    if (typeof window === 'undefined') return ''
    const path = window.location.pathname
    const segments = path.split('/')
    
    // If the path starts with a language code, remove it
    if (segments.length > 1 && SUPPORTED_LANGUAGES.some(lang => lang.code === segments[1])) {
      return '/' + segments.slice(2).join('/')
    }
    
    return path
  }

  return (
    <>
      <div id="top-header" className="bg-primary px-4">
        <div className="container mx-auto py-4 flex items-center text-white">
          {/* Logo and Site Title */}
          <Link href={`/${currentLang}`} className="leading-8 mt-1 ml-1 flex items-center">
            <Image
              width={24}
              height={24}
              src="/img/logo.svg"
              alt="Stats For Startups Logo"
              className="my-2 mr-2 inline-block"
            />
            <p className="hidden md:inline-block text-sm logo-word font-semibold tracking-widest">
              STATS<span className="text-gray-400 font-normal">FOR</span>STARTUPS
            </p>
          </Link>

          {/* Navigation Links */}
          <div className="ml-auto flex items-center">
            <Link
              href={`/${currentLang}/collections`}
              className="font-mono text-sm leading-7 py-2 tracking-wider font-medium hover:text-white text-gray-400 px-3"
            >
              {nav.collections}
            </Link>
            
            {/* Search button */}
            <div className="hidden md:block ml-4 md:mr-4">
              <SearchButton 
                onClick={() => setIsSearchOpen(true)} 
                placeholder={searchDict.placeholder}
                buttonText={searchDict.button}
              />
            </div>

            {/* Charge VC Link */}
            
              href="https://charge.vc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex ml-4 items-center"
            >
              <Image
                width={100}
                height={24}
                className="hidden md:inline-block pt-1"
                src="/img/charge-green.png"
                alt="Charge VC"
              />
              <Image
                width={20}
                height={20}
                className="md:hidden m-1 mt-2"
                src="/img/charge-icon.svg"
                alt="Charge VC"
              />
            </a>
            
            {/* Mobile search icon */}
            <button
              className="md:hidden ml-3 p-2 text-gray-400 hover:text-white focus:outline-none"
              onClick={() => setIsSearchOpen(true)}
              aria-label={searchDict.button}
            >
              <svg 
                className="w-5 h-5" 
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
            </button>
            
            {/* Language Selector - Hidden for now as we only support English */}
            {SUPPORTED_LANGUAGES.length > 1 && (
              <div className="relative ml-4 pl-4 border-l border-gray-700">
                <select
                  className="appearance-none bg-transparent text-gray-300 hover:text-white cursor-pointer focus:outline-none"
                  value={currentLang}
                  onChange={(e) => {
                    const newLang = e.target.value
                    const currentPath = getPathWithoutLang()
                    window.location.href = `/${newLang}${currentPath}`
                  }}
                  aria-label="Select language"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Dialog */}
      <SearchDialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        dictionary={dictionary?.search || {}}
        currentLang={currentLang}
      />
    </>
  )
}
