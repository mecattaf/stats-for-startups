'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer({ dictionary, currentLang }) {
  const [scrolled, setScrolled] = useState(false)
  
  // Navigation items from dictionary
  const nav = dictionary?.navigation || {
    home: 'Home',
    collections: 'Collections',
    about: 'About',
    chargeVc: 'Charge VC',
    terms: 'T&Cs'
  }
  
  // Footer text
  const footerText = dictionary?.footer || {
    copyright: 'Copyright {year} - Charge Ventures',
    scrollToTop: 'Scroll to top'
  }
  
  // Handle scroll event to show/hide the scroll-to-top button
  const handleScroll = () => {
    setScrolled(window.scrollY > 200)
  }
  
  // Scroll to top function
  const scrollTop = () => {
    // Find the top header element and scroll to it
    document.getElementById('top-header')?.scrollIntoView({
      behavior: 'smooth',
    })
  }
  
  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return (
    <div className="bg-gray-100 z-10 relative">
      <div className="container py-4 mx-auto text-gray-500">
        {/* Logo */}
        <div className="text-center">
          <Image
            className="inline-block m-4 filter grayscale"
            width={24}
            height={24}
            src="/img/logo.svg"
            alt="Stats For Startups Logo"
          />
        </div>
        
        {/* Footer Links */}
        <ul className="flex justify-center py-4">
          <li className="mx-3 pr-0 hover:underline">
            <Link href={`/${currentLang}`}>{nav.home}</Link>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <Link href={`/${currentLang}/collections`}>{nav.collections}</Link>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <Link href={`/${currentLang}/about`}>{nav.about}</Link>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <a href="https://charge.vc" target="_blank" rel="noopener noreferrer">
              {nav.chargeVc}
            </a>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <Link href={`/${currentLang}/terms`}>{nav.terms}</Link>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <a 
              href="https://github.com/mecattaf/stats-for-startups" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
        
        {/* Copyright */}
        <div className="text-center p-4 text-gray-400 text-xs">
          {footerText.copyright.replace('{year}', new Date().getFullYear())}
        </div>
      </div>

      {/* Scroll to top button */}
      {scrolled && (
        <div
          onClick={scrollTop}
          className="fixed bottom-4 cursor-pointer hover:bg-opacity-100 rounded-full right-4 p-4 bg-opacity-50 bg-gray-200"
          aria-label={footerText.scrollToTop}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </div>
      )}
    </div>
  )
}
