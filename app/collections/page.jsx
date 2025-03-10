'use client'

import { useState, useEffect } from 'react'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

// Function to get collections data (client-side)
async function getCollections() {
  try {
    // Fetch collections from API endpoint
    const response = await fetch('/api/collections')
    if (!response.ok) {
      throw new Error('Failed to fetch collections')
    }
    
    const collections = await response.json()
    return collections
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [activeCollections, setActiveCollections] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchData() {
      const collectionsData = await getCollections()
      setCollections(collectionsData)
      setActiveCollections(collectionsData)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(collectionsData.map(c => c.category))]
      
      // Create categories array with "All" as the first option
      setCategories([
        { name: 'All', isActive: true },
        ...uniqueCategories.map(name => ({ name, isActive: false }))
      ])
      
      setLoading(false)
    }
    
    fetchData()
  }, [])
  
  // Function to toggle collection category filter
  const toggleCollectionCategory = (catIndex) => {
    // Create a new categories array with updated active states
    const newCategories = categories.map((cat, index) => {
      // If clicking "All" category
      if (catIndex === 0) {
        return { ...cat, isActive: index === 0 }
      }
      
      // If clicking a specific category
      if (index === catIndex) {
        return { ...cat, isActive: !cat.isActive }
      }
      
      // Set "All" to inactive if any other category is active
      if (index === 0) {
        return { ...cat, isActive: false }
      }
      
      return cat
    })
    
    // If all categories are inactive, activate "All"
    const hasActiveCategory = newCategories.slice(1).some(cat => cat.isActive)
    if (!hasActiveCategory) {
      newCategories[0].isActive = true
    }
    
    setCategories(newCategories)
    
    // Filter collections based on active categories
    if (newCategories[0].isActive) {
      // If "All" is active, show all collections
      setActiveCollections(collections)
    } else {
      // Get active category names
      const activeCategoryNames = newCategories
        .filter(cat => cat.isActive)
        .map(cat => cat.name)
      
      // Filter collections by active categories
      const filteredCollections = collections.filter(collection => 
        activeCategoryNames.includes(collection.category)
      )
      
      setActiveCollections(filteredCollections)
    }
  }
  
  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading collections...</div>
  }
  
  return (
    <div>
      <div className="bg-primary p-4 text-white">
        <div className="container my-12 mx-auto">
          <h1 className="text-5xl font-serif">All collections</h1>
        </div>
        <div className="-mt-10">
          <ul className="container text-white mx-auto py-6 flex flex-wrap">
            {categories.map((category, index) => (
              <li
                key={category.name}
                onClick={() => toggleCollectionCategory(index)}
                className="flex mb-1 cursor-pointer"
              >
                <p
                  className={`
                    ${category.isActive ? 'text-white' : 'text-gray-500'} 
                    hover:underline mr-4 inline-block break-words align-middle mb-2
                  `}
                >
                  {category.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto my-8 flex flex-row flex-wrap">
        {activeCollections.length === 0 ? (
          <div className="w-full text-center py-8">
            No collections found for the selected categories.
          </div>
        ) : (
          activeCollections.map((collection, index) => (
            <div
              key={index}
              className="w-full md:w-1/3 border-2 border-transparent hover:border-gray-200"
            >
              <Link
                className="w-full flex flex-col items-center px-3"
                href={`/collections/${collection.slug}`}
              >
                <div className="flex flex-col my-4 min-w-full">
                  <div className="bg-white flex flex-col justify-start p-3">
                    <h3 className="text-lg font-serif text-gray-400 font-normal mb-3">
                      {collection.category}
                    </h3>
                    <h2 className="text-3xl tracking-wider
