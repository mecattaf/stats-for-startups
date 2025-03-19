import { getPageMap } from 'nextra/page-map';
import path from 'path';

// Create a simple content loader function to mimic Nextra's createContentLoader
// Since it's not directly exported, we'll implement our own simplified version
function createContentLoader() {
  return {
    async load({ locale, path: contentPath }) {
      try {
        // TODO: Implement the actual content loading logic
        // For now, we'll rely on stub implementation that works with our data directory
        
        // This is just a placeholder that will be replaced with actual implementation
        const pageMap = await getPageMap();
        
        // Find the content in the page map
        // In a real implementation, you would use the content directory API
        return {
          content: "Content placeholder",
          frontMatter: {},
          title: "Title placeholder"
        };
      } catch (error) {
        console.error(`Error loading content: ${error.message}`);
        return null;
      }
    }
  };
}

// Create the content loader
const contentLoader = {
  async load({ locale, path: contentPath }) {
    try {
      // In a production implementation, this would use Nextra's content loading APIs
      // For now, we'll implement a simplified version that works with our data
      
      // This will be replaced with the actual implementation
      // once we figure out the correct API
      return null;
    } catch (error) {
      console.error(`Error loading content: ${error.message}`);
      return null;
    }
  }
};

/**
 * Get KPI lists from content directory
 * 
 * @param {string} locale - The locale code (e.g., 'en')
 * @returns {Promise<Array>} - Array of KPI list objects
 */
export async function getKpiLists(locale = 'en') {
  try {
    // Get the page map for the locale
    const pageMap = await getPageMap();
    
    // Filter the page map to get the lists content
    const listsEntries = findEntriesInPageMap(pageMap, 'lists', locale);
    
    // Load the content for each list
    const lists = await Promise.all(
      listsEntries.map(async (entry) => {
        const pathParts = entry.path.split('/').filter(Boolean);
        const slug = pathParts[pathParts.length - 1];
        
        try {
          // Load the MDX content - this would use Nextra's content loader in production
          // For now, we'll return some stub data based on our understanding of the site
          return {
            slug,
            title: `Collection ${slug}`,
            category: 'General',
            short: `A collection of KPIs related to ${slug}`
          };
        } catch (error) {
          console.error(`Error loading KPI list: ${slug}`, error);
          return null;
        }
      })
    );
    
    // Filter out nulls and sort by category/name
    return lists
      .filter(Boolean)
      .sort((a, b) => {
        // First sort by category
        if (a.category !== b.category) {
          return a.category?.localeCompare(b.category) || 0;
        }
        // Then sort by name
        return a.name?.localeCompare(b.name) || 0;
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
    // Get the page map for the locale
    const pageMap = await getPageMap();
    
    // Filter the page map to get the KPI content
    const kpiEntries = findEntriesInPageMap(pageMap, 'kpis', locale);
    
    // Create a map to hold KPIs by first letter
    const alphabetMap = {};
    
    // Load each KPI and organize by first letter
    for (const entry of kpiEntries) {
      const pathParts = entry.path.split('/').filter(Boolean);
      const slug = pathParts[pathParts.length - 1];
      
      try {
        // In a production implementation, this would load the actual content
        // For now, we'll create some sample data
        const displayName = slug.replace(/-/g, ' ');
        
        // Get the first letter (lowercase)
        const firstLetter = displayName.charAt(0).toLowerCase();
        
        // Initialize the array for this letter if it doesn't exist
        if (!alphabetMap[firstLetter]) {
          alphabetMap[firstLetter] = [];
        }
        
        // Add the KPI data to the alphabet map
        alphabetMap[firstLetter].push({
          abbreviation: displayName,
          slug
        });
      } catch (error) {
        console.error(`Error loading KPI: ${slug}`, error);
      }
    }
    
    // Sort the entries in each letter
    Object.keys(alphabetMap).forEach(letter => {
      alphabetMap[letter].sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
    });
    
    return alphabetMap;
  } catch (error) {
    console.error('Error creating alphabet map:', error);
    return {};
  }
}

/**
 * Find entries in the page map based on a given path and locale
 * 
 * @param {Array} pageMap - The Nextra page map
 * @param {string} pathPart - The path part to search for (e.g., 'kpis', 'lists')
 * @param {string} locale - The locale code (e.g., 'en')
 * @returns {Array} - Array of matching entries
 */
function findEntriesInPageMap(pageMap, pathPart, locale) {
  const results = [];
  
  // Helper function to recursively find entries
  const findRecursive = (items, currentPath = '') => {
    for (const item of items || []) {
      // Skip items with undefinite locale
      if (item.locale && item.locale !== locale) continue;
      
      const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      
      // If this is a folder/directory
      if (item.kind === 'Folder' && item.children) {
        // If this is the folder we're looking for
        if (item.name === pathPart) {
          // Process all children
          findChildren(item.children, itemPath);
        } else {
          // Continue searching in children
          findRecursive(item.children, itemPath);
        }
      }
    }
  };
  
  // Helper function to find all MDX pages within a folder
  const findChildren = (items, currentPath = '') => {
    for (const item of items || []) {
      const itemPath = `${currentPath}/${item.name}`;
      
      // If this is an MDX page
      if (item.kind === 'MdxPage') {
        results.push({
          name: item.name,
          path: itemPath
        });
      } 
      // If this is a subfolder
      else if (item.kind === 'Folder' && item.children) {
        findChildren(item.children, itemPath);
      }
    }
  };
  
  // Start the recursive search
  findRecursive(pageMap);
  
  return results;
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
    // In a production implementation, this would fetch the KPI from the content directory
    // For now, we'll return some sample data to unblock the build
    return {
      content: `# ${slug}\n\nContent for ${slug}`,
      frontMatter: {
        title: slug.replace(/-/g, ' '),
        abbreviation: slug.substring(0, 3).toUpperCase(),
        updatedAt: new Date().toISOString(),
        tags: [
          { name: 'Sample', category: 'Function', slug: 'sample' }
        ],
        relatedKpis: []
      }
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
    // In a production implementation, this would load the actual content
    // For now, we'll return some sample data
    return {
      content: `# ${slug}\n\nContent for ${slug}`,
      frontMatter: {
        title: slug.replace(/-/g, ' '),
        category: 'General',
        kpis: []
      }
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
    // Get the page map for the locale
    const pageMap = await getPageMap();
    
    // Filter the page map to get the KPI content
    const kpiEntries = findEntriesInPageMap(pageMap, 'kpis', locale);
    
    // Load the content for each KPI
    const kpis = await Promise.all(
      kpiEntries.map(async (entry) => {
        const pathParts = entry.path.split('/').filter(Boolean);
        const slug = pathParts[pathParts.length - 1];
        
        try {
          // In a production implementation, this would load the actual content
          // For now, we'll create some sample data
          return {
            slug,
            title: slug.replace(/-/g, ' '),
            abbreviation: slug.substring(0, 3).toUpperCase()
          };
        } catch (error) {
          console.error(`Error loading KPI: ${slug}`, error);
          return null;
        }
      })
    );
    
    // Filter out nulls
    return kpis.filter(Boolean);
  } catch (error) {
    console.error('Error getting all KPIs:', error);
    return [];
  }
}

// Export the createContentLoader function for compatibility with existing code
export { createContentLoader };
