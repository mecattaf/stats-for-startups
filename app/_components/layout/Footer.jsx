'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const [scrolled, setScrolled] = useState(false)
  
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
            <Link href="/">Home</Link>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <Link href="/collections">Collections</Link>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <Link href="/about">About</Link>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <a href="https://charge.vc" target="_blank" rel="noopener noreferrer">
              Charge VC
            </a>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <Link href="/terms">T&amp;Cs</Link>
          </li>
          <li className="mx-3 pr-0 hover:underline">
            <a 
              href="https://github.com/yourusername/stats-for-startups-nextra" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
        
        {/* Copyright */}
        <div className="text-center p-4 text-gray-400 text-xs">
          Copyright {new Date().getFullYear()} - Charge Ventures
        </div>
      </div>

      {/* Scroll to top button */}
      {scrolled && (
        <div
          onClick={scrollTop}
          className="fixed bottom-4 cursor-pointer hover:bg-opacity-100 rounded-full right-4 p-4 bg-opacity-50 bg-gray-200"
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
