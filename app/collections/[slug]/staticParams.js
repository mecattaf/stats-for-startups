import { getPageMap } from 'nextra/page-map';

// Helper function to find entries in the page map
function findEntriesInPageMap(pageMap, pathPart, locale = 'en') {
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

// Generate static params for collection pages
export async function generateCollectionStaticParams() {
  try {
    // Get the page map
    const pageMap = await getPageMap();
    
    // Find all collection entries
    const collectionEntries = findEntriesInPageMap(pageMap, 'lists');
    
    // Create params for each collection
    return collectionEntries.map(entry => {
      const pathParts = entry.path.split('/').filter(Boolean);
      const slug = pathParts[pathParts.length - 1];
      
      return { slug };
    });
  } catch (error) {
    console.error('Error generating collection static params:', error);
    return [];
  }
}

// Use in [slug]/page.jsx as:
// export { generateCollectionStaticParams as generateStaticParams } from './staticParams';
