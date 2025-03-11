import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

/**
 * Read and process an MDX file with frontmatter
 * 
 * @param {string} filepath - Path to the MDX file
 * @returns {Object} - The processed MDX content and frontmatter
 */
export async function getAndProcessMDX(filepath) {
  try {
    // Read the file
    const source = await fs.readFile(filepath, 'utf8')
    
    // Parse frontmatter
    const { content, data } = matter(source)
    
    // Process MDX content with math support
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex]
      },
      scope: data,
    })
    
    return {
      content: mdxSource,
      frontMatter: data
    }
  } catch (error) {
    console.error(`Error processing MDX file ${filepath}:`, error)
    throw error
  }
}

/**
 * Get all MDX files from a directory
 * 
 * @param {string} dir - Directory path to read
 * @param {boolean} withContent - Whether to include processed content
 * @returns {Array} - List of MDX files with their data
 */
export async function getAllMDXFiles(dir, withContent = false) {
  try {
    const files = await fs.readdir(dir)
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    const filesData = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(dir, file)
        const slug = file.replace(/\.mdx$/, '')
        
        if (withContent) {
          const { content, frontMatter } = await getAndProcessMDX(filePath)
          return {
            slug,
            ...frontMatter,
            content
          }
        } else {
          const source = await fs.readFile(filePath, 'utf8')
          const { data } = matter(source)
          return {
            slug,
            ...data
          }
        }
      })
    )
    
    return filesData
  } catch (error) {
    console.error(`Error reading MDX files from ${dir}:`, error)
    return []
  }
}
