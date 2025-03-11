'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SearchButton from '../search/SearchButton'
import SearchDialog from '../search/SearchDialog'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <div id="top-header" className="bg-primary px-4">
        <div className="container mx-auto py-4 flex items-center text-white">
          {/* Logo and Site Title */}
          <Link href="/" className="leading-8 mt-1 ml-1 flex items-center">
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
              href="/collections"
              className="font-mono text-sm leading-7 py-2 tracking-wider font-medium hover:text-white text-gray-400 px-3"
            >
              COLLECTIONS
            </Link>
            
            {/* Search button */}
            <div className="hidden md:block ml-4 md:mr-4">
              <SearchButton onClick={() => setIsSearchOpen(true)} />
            </div>

            {/* Charge VC Link */}
            <a
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
              aria-label="Search"
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
          </div>
        </div>
      </div>
      
      {/* Search Dialog */}
      <SearchDialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
}

// CSS styles for the logo word
export const style = `
.logo-word {
  position: relative;
}
.logo-word::after {
  content: 'BETA';
  position: relative;
  font-size: 8px;
  font-family: serif;
  font-weight: normal;
  top: -6px;
  right: 2px;
  letter-spacing: 1px;
  opacity: 0.7;
}
`
