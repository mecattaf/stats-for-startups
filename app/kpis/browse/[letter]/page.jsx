import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import KpiListItem from '@/app/_components/kpi/KpiListItem'

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { letter } = params
  
  return {
    title: `KPIs starting with ${letter.toUpperCase()}`,
    description: `Browse all key performance indicators starting with the letter ${letter.toUpperCase()}.`,
    openGraph: {
      title: `KPIs starting with ${letter.toUpperCase()}`,
      description: `Browse all key performance indicators starting with the letter ${letter.toUpperCase()}.`,
    }
  }
}

// Get KPIs by first letter of abbreviation
async function getKpisByLetter(letter) {
  try {
    const kpisDir = path.join(process.cwd(), 'content', 'kpis')
    const files = await fs.readdir(kpisDir)
    
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    // Parse all KPI files
    const kpisData = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(kpisDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        const { data } = matter(content)
        
        // Get slug from filename
        const slug = file.replace(/\.mdx$/, '')
        
        return {
          ...data,
          slug
        }
      })
    )
    
    // Filter KPIs by the first letter of their abbreviation
    const letterLower = letter.toLowerCase()
    const kpisByLetter = kpisData.filter(kpi => {
      // Use abbreviation first, then title if abbreviation doesn't exist
      const abbr = kpi.abbreviation || kpi.title
      if (!abbr) return false
      return abbr.charAt(0).toLowerCase() === letterLower
    })
    
    // Sort alphabetically by abbreviation
    return kpisByLetter.sort((a, b) => {
      const aAbbr = a.abbreviation || a.title || ''
      const bAbbr = b.abbreviation || b.title || ''
      return aAbbr.localeCompare(bAbbr)
    })
  } catch (error) {
    console.error(`Error getting KPIs by letter ${letter}:`, error)
    return []
  }
}

// Get all available letters that have KPIs
async function getAllLetters() {
  try {
    const kpisDir = path.join(process.cwd(), 'content', 'kpis')
    const files = await fs.readdir(kpisDir)
    
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    // Parse all KPI files to get abbreviations
    const abbreviations = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(kpisDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        const { data } = matter(content)
        
        return data.abbreviation || data.title || ''
      })
    )
    
    // Extract first letters and create a unique set
    const letters = new Set(
      abbreviations
        .filter(abbr => abbr?.length > 0)
        .map(abbr => abbr.charAt(0).toLowerCase())
    )
    
    return Array.from(letters).sort()
  } catch (error) {
    console.error('Error getting all letters:', error)
    return []
  }
}

export default async function BrowseByLetterPage({ params }) {
  const { letter } = params
  
  // Validate letter is a single character
  if (!letter || letter.length !== 1 || !/[a-z]/i.test(letter)) {
    return notFound()
  }
  
  const kpis = await getKpisByLetter(letter)
  const allLetters = await getAllLetters()
  
  // If no KPIs found for this letter and it's not in the available letters, return 404
  if (kpis.length === 0 && !allLetters.includes(letter.toLowerCase())) {
    return notFound()
  }
  
  return (
    <div>
      {/* Page Header */}
      <div className="bg-primary p-4 text-white">
        <div className="container mx-auto my-12">
          <h1 className="text-5xl font-serif">
            KPIs starting with {letter.toUpperCase()}
          </h1>
        </div>
      </div>
      
      {/* Alphabet Navigation */}
      <div className="container mx-auto py-6">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[...'abcdefghijklmnopqrstuvwxyz'].map((char) => {
            const isAvailable = allLetters.includes(char)
            return (
              <Link
                key={char}
                href={isAvailable ? `/kpis/browse/${char}` : '#'}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-md font-mono text-xl
                  ${isAvailable 
                    ? char === letter.toLowerCase()
                      ? 'bg-charge text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  }
                `}
                onClick={e => !isAvailable && e.preventDefault()}
              >
                {char.toUpperCase()}
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* KPIs List */}
      <div className="container mx-auto pb-12">
        {kpis.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No KPIs found starting with {letter.toUpperCase()}.</p>
            <Link href="/kpis" className="mt-4 inline-block text-charge hover:underline">
              Browse all KPIs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpis.map((kpi, index) => (
              <KpiListItem key={index} summary={kpi} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
