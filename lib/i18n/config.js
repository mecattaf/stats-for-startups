/**
 * i18n configuration file
 * 
 * This file contains the configuration for the internationalization
 * features of the application, including supported languages and their
 * metadata.
 */

// Define supported languages with their metadata
export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    default: true
  }
  // Add more languages as needed
  // {
  //   code: 'fr',
  //   name: 'Français',
  //   flag: '🇫🇷',
  //   dir: 'ltr', 
  //   dateFormat: 'DD/MM/YYYY'
  // },
  // {
  //   code: 'es',
  //   name: 'Español',
  //   flag: '🇪🇸',
  //   dir: 'ltr',
  //   dateFormat: 'DD/MM/YYYY'
  // }
]

// Get the default language
export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.find(lang => lang.default)?.code || 'en'

// Get an array of just the language codes
export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(lang => lang.code)

/**
 * Check if a language is supported
 * 
 * @param {string} langCode - The language code to check
 * @returns {boolean} - True if the language is supported, false otherwise
 */
export function isLanguageSupported(langCode) {
  return LANGUAGE_CODES.includes(langCode?.toLowerCase())
}

/**
 * Get language metadata by code
 * 
 * @param {string} langCode - The language code
 * @returns {object|null} - The language metadata or null if not found
 */
export function getLanguageByCode(langCode) {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === langCode?.toLowerCase()) || null
}

/**
 * Format a date according to the locale
 * 
 * @param {Date|string} date - The date to format
 * @param {string} locale - The locale code
 * @returns {string} - The formatted date
 */
export function formatDate(date, locale = DEFAULT_LANGUAGE) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // If the date is invalid, return an empty string
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  // Get the language metadata
  const lang = getLanguageByCode(locale) || getLanguageByCode(DEFAULT_LANGUAGE)
  
  // Format the date according to the locale
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return dateObj.toLocaleDateString(locale, options)
}
