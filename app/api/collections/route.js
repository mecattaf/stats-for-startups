import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { NextResponse } from 'next/server'

// GET handler for collections API
export async function GET() {
  try {
    // Get all collections
    const collectionsDir = path.join(process.cwd(), 'content', 'collections')
    const files = await fs.readdir(collectionsDir)
    
    // Filter for MDX files
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    // Read and parse each collection file
    const collections = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(collectionsDir, file)
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
    
    // Sort collections by category and then by name
    const sortedCollections = collections.sort((a, b) => {
      // First sort by category
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category)
      }
      // Then sort by name
      return a.name.localeCompare(b.name)
    })
    
    // Return the collections as JSON
    return NextResponse.json(sortedCollections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}
