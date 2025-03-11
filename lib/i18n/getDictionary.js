// Ensure this file is always called in a server component
import 'server-only'

// Enumerate all dictionaries
const dictionaries = {
  en: () => import('./en.json')
  // Add more language dictionaries as needed
  // fr: () => import('./fr.json'),
  // es: () => import('./es.json'),
  // de: () => import('./de.json')
}

/**
 * Get dictionary for the specified locale
 * Falls back to English if the requested locale is not available
 *
 * @param {string} locale - The locale to get the dictionary for
 * @returns {Promise<object>} - The dictionary for the specified locale
 */
export async function getDictionary(locale) {
  try {
    // Make sure the locale is lowercase for consistency
    const normalizedLocale = locale?.toLowerCase() || 'en'
    
    // Get the dictionary for the locale, or fall back to English
    const dictionaryLoader = dictionaries[normalizedLocale] || dictionaries.en
    const { default: dictionary } = await dictionaryLoader()
    
    return dictionary
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error)
    
    // If there's an error, try to load the English dictionary as a fallback
    try {
      const { default: fallbackDictionary } = await dictionaries.en()
      return fallbackDictionary
    } catch (fallbackError) {
      // If even the fallback fails, return a minimal dictionary
      console.error('Error loading fallback dictionary:', fallbackError)
      return {
        siteTitle: 'Stats For Startups',
        siteDescription: 'A repository of key performance indicators for startups',
        error: 'Error loading translations'
      }
    }
  }
}

/**
 * Get text direction for the specified locale
 * 
 * @param {string} locale - The locale to get the direction for
 * @returns {string} - 'rtl' for right-to-left languages, 'ltr' otherwise
 */
export function getDirection(locale) {
  // List of RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  
  // Return 'rtl' for right-to-left languages, 'ltr' otherwise
  return rtlLanguages.includes(locale?.toLowerCase()) ? 'rtl' : 'ltr'
}
