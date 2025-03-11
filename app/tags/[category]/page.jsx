import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import matter from 'gray-matter'
import Link from 'next/link'

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { category } = params
  
  // Format the category name for display (capitalize first letter of each word)
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return {
    title: `${formattedCategory} Tags`,
    description: `Browse KPIs by ${formattedCategory} tags.`,
    openGraph: {
      title: `${formattedCategory} Tags`,
      description: `Browse KPIs by ${formattedCategory} tags.`,
    }
  }
}

// Get all tags for a specific category
async function getTagsByCategory(category) {
  try {
    // First check if the category directory exists
    const tagsDir = path.join(process.cwd(), 'content', 'tags', category)
    
    try {
      await fs.access(tagsDir)
    } catch {
      return null // Category doesn't exist
    }
    
    // Read all tag files in the category directory
    const files = await fs.readdir(tagsDir)
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    // Parse each tag file to get metadata
    const tags = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(tagsDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        const { data } = matter(content)
        
        // Get slug from filename
        const slug = file.replace(/\.mdx$/, '')
        
        return {
          ...data,
          slug,
          category
        }
      })
    )
    
    // Sort alphabetically by name
    return tags.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error(`Error getting tags for category ${category}:`, error)
    return []
  }
}

// Get all available tag categories
async function getAllCategories() {
  try {
    const tagsDir = path.join(process.cwd(), 'content', 'tags')
    const directories = await fs.readdir(tagsDir, { withFileTypes: true })
    
    // Filter out only directories and exclude index/meta files
    const categories = directories
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
      .map(dirent => dirent.name)
    
    return categories
  } catch (error) {
    console.error('Error getting all tag categories:', error)
    return []
  }
}

export default async function TagCategoryPage({ params }) {
  const { category } = params
  
  // Get tags for this category
  const tags = await getTagsByCategory(category)
  
  // If category doesn't exist, return 404
  if (tags === null) {
    return notFound()
  }
  
  // Get all categories for navigation
  const allCategories = await getAllCategories()
  
  // Format the category name for display (capitalize first letter of each word)
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return (
    <div>
      {/* Page Header */}
      <div className="bg-primary p-4 text-white">
        <div className="container mx-auto my-12">
          <h1 className="text-5xl font-serif">{formattedCategory} Tags</h1>
        </div>
        
        {/* Categories Navigation */}
        <div className="container mx-auto py-6">
          <ul className="flex flex-wrap gap-4">
            {allCategories.map((cat) => {
              const formattedName = cat
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
              
              return (
                <li key={cat} className="mb-2">
                  <Link
                    href={`/tags/${cat}`}
                    className={`
                      px-4 py-2 rounded-full
                      ${cat === category 
                        ? 'bg-white text-primary font-semibold' 
                        : 'text-gray-300 hover:text-white'}
                    `}
                  >
                    {formattedName}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      
      {/* Tags List */}
      <div className="container mx-auto py-12">
        {tags.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tags found in this category.</p>
            <Link href="/tags" className="mt-4 inline-block text-charge hover:underline">
              Browse all tag categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${category}/${tag.slug}`}
                className="p-4 border-2 border-gray-200 hover:border-charge rounded-md flex items-center justify-center text-center transition-colors"
              >
                <span className="font-semibold">{tag.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
