import { getPageMap } from 'nextra/page-map';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

/**
 * Helper function to create a content loader that loads and processes MDX files
 * - This is similar to Nextra's internal createContentLoader but implemented based on public APIs
 */
export function createContentLoader() {
  return {
    /**
     * Load content for a given path and locale
     * 
     * @param {Object} options - Options object
     * @param {string} options.locale - The locale to use (e.g., 'en')
     * @param {string|Array} options.path - The path to the content as a string or array of segments
     * @returns {Promise<Object|null>} - The processed content or null if not found
     */
    async load({ locale, path: contentPath }) {
      try {
        // Convert path array to string path if needed
        const pathString = Array.isArray(contentPath) 
          ? contentPath.join('/') 
          : contentPath;
        
        // Construct the full path to the MDX file in the content directory
        const filePath = path.join(
          process.cwd(), 
          'content', 
          locale, 
          pathString,
          // If the path doesn't end with .mdx, assume it's a directory and add index.mdx
          pathString.endsWith('.mdx') ? '' : 'index.mdx'
        );
        
        // Check if the file exists
        try {
          await fs.access(filePath);
        } catch (error) {
          // Try with .mdx extension if not found
          if (!pathString.endsWith('.mdx')) {
            const mdxFilePath = `${filePath.slice(0, -8)}.mdx`;
            try {
              await fs.access(mdxFilePath);
              // If we reach here, the .mdx file exists
              return this.processMdxFile(mdxFilePath);
            } catch {
              // File not found even with .mdx extension
              return null;
            }
          }
          // File not found
          return null;
        }
        
        // Process the MDX file
        return this.processMdxFile(filePath);
      } catch (error) {
        console.error(`Error loading content: ${error.message}`);
        return null;
      }
    },
    
    /**
     * Process an MDX file by reading it and parsing frontmatter
     * 
     * @param {string} filePath - The path to the MDX file
     * @returns {Promise<Object>} - The processed content
     */
    async processMdxFile(filePath) {
      // Read the file content
      const source = await fs.readFile(filePath, 'utf8');
      
      // Parse frontmatter and content
      const { data: frontMatter, content } = matter(source);
      
      // Extract title from frontmatter or first heading
      const title = frontMatter.title || this.extractTitleFromContent(content);
      
      return {
        content,
        frontMatter,
        title
      };
    },
    
    /**
     * Extract title from the first heading in the content
     * 
     * @param {string} content - The MDX content
     * @returns {string|null} - The extracted title or null if not found
     */
    extractTitleFromContent(content) {
      // Look for the first heading (# Title)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      return titleMatch ? titleMatch[1] : null;
    }
  };
}

/**
 * Get KPI lists from content directory
 * 
 * @param {string} locale - The locale code (e.g., 'en')
 * @returns {Promise<Array>} - Array of KPI list objects
 */
export async function getKpiLists(locale = 'en') {
  try {
    // Try to read the lists directory
    const listsDir = path.join(process.cwd(), 'content', locale, 'lists');
    
    // Get all files in the directory
    let files;
    try {
      files = await fs.readdir(listsDir);
    } catch (error) {
      console.error(`Lists directory not found: ${error.message}`);
      return [];
    }
    
    // Filter MDX files
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));
    
    // Process each list file
    const lists = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(listsDir, file);
        const source = await fs.readFile(filePath, 'utf8');
        const { data } = matter(source);
        
        // Get slug from filename
        const slug = file.replace(/\.mdx$/, '');
        
        return {
          ...data,
          slug
        };
      })
    );
    
    // Filter out any null items and sort by category and name
    return lists
      .filter(Boolean)
      .sort((a, b) => {
        // First sort by category
        if (a.category !== b.category) {
          return (a.category || '').localeCompare(b.category || '');
        }
        // Then sort by name or title
        return (a.name || a.title || '').localeCompare(b.name || b.title || '');
      });
  } catch (error) {
    console.error('Error getting KPI lists:', error);
    return [];
  }
}

/**
 * Get alphabet map of KPIs
 * 
 * @param {string} locale - The locale code (e.g., 'en')
 * @returns {Promise<Object>} - Object mapping first letters to KPI data
 */
export async function getAlphabetMap(locale = 'en') {
  try {
    // Get all KPIs
    const kpis = await getAllKpis(locale);
    
    // Group KPIs by first letter
    const alphabetMap = {};
    
    for (const kpi of kpis) {
      // Determine display name (abbreviation or title)
      const displayName = kpi.abbreviation || kpi.title;
      
      if (!displayName) continue;
      
      // Get the first letter (lowercase)
      const firstLetter = displayName.charAt(0).toLowerCase();
      
      // Initialize the array for this letter if it doesn't exist
      if (!alphabetMap[firstLetter]) {
        alphabetMap[firstLetter] = [];
      }
      
      // Add the KPI data to the alphabet map
      alphabetMap[firstLetter].push({
        abbreviation: displayName,
        title: kpi.title,
        slug: kpi.slug
      });
    }
    
    // Sort the entries in each letter
    Object.keys(alphabetMap).forEach(letter => {
      alphabetMap[letter].sort((a, b) => 
        (a.abbreviation || '').localeCompare(b.abbreviation || '')
      );
    });
    
    return alphabetMap;
  } catch (error) {
    console.error('Error creating alphabet map:', error);
    return {};
  }
}

/**
 * Get a KPI by slug
 * 
 * @param {string} slug - The KPI slug
 * @param {string} locale - The locale code (e.g., 'en')
 * @returns {Promise<Object|null>} - The KPI data or null if not found
 */
export async function getKpiBySlug(slug, locale = 'en') {
  try {
    // Path to the KPI MDX file
    const filePath = path.join(process.cwd(), 'content', locale, 'kpis', `${slug}.mdx`);
    
    // Check if the file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error(`KPI file not found: ${filePath}`);
      return null;
    }
    
    // Read the file content
    const source = await fs.readFile(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data: frontMatter, content } = matter(source);
    
    return {
      content,
      frontMatter
    };
  } catch (error) {
    console.error(`Error getting KPI by slug: ${slug}`, error);
    return null;
  }
}

/**
 * Get a KPI list by slug
 * 
 * @param {string} slug - The KPI list slug
 * @param {string} locale - The locale code (e.g., 'en')
 * @returns {Promise<Object|null>} - The KPI list data or null if not found
 */
export async function getKpiListBySlug(slug, locale = 'en') {
  try {
    // Path to the KPI list MDX file
    const filePath = path.join(process.cwd(), 'content', locale, 'lists', `${slug}.mdx`);
    
    // Check if the file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error(`KPI list file not found: ${filePath}`);
      return null;
    }
    
    // Read the file content
    const source = await fs.readFile(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data: frontMatter, content } = matter(source);
    
    return {
      content,
      frontMatter
    };
  } catch (error) {
    console.error(`Error getting KPI list by slug: ${slug}`, error);
    return null;
  }
}

/**
 * Get all KPIs
 * 
 * @param {string} locale - The locale code (e.g., 'en')
 * @returns {Promise<Array>} - Array of KPI objects
 */
export async function getAllKpis(locale = 'en') {
  try {
    // Path to the KPIs directory
    const kpisDir = path.join(process.cwd(), 'content', locale, 'kpis');
    
    // Get all files in the directory
    let files;
    try {
      files = await fs.readdir(kpisDir);
    } catch (error) {
      console.error(`KPIs directory not found: ${error.message}`);
      return [];
    }
    
    // Filter MDX files
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));
    
    // Process each KPI file
    const kpis = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(kpisDir, file);
        const source = await fs.readFile(filePath, 'utf8');
        const { data } = matter(source);
        
        // Get slug from filename
        const slug = file.replace(/\.mdx$/, '');
        
        return {
          ...data,
          slug
        };
      })
    );
    
    // Filter out any null items
    return kpis.filter(Boolean);
  } catch (error) {
    console.error('Error getting all KPIs:', error);
    return [];
  }
}
