import { NextResponse } from 'next/server'
import { LANGUAGE_CODES, DEFAULT_LANGUAGE, isLanguageSupported } from './lib/i18n/config'

/**
 * Regex to match static files that should be excluded from middleware processing
 * - _next/* files (internal Next.js files)
 * - public assets with file extensions
 * - API routes
 */
const PUBLIC_FILE = /\.(.*)$/
const EXCLUDED_PATHS = /^(\/(_next|api)|\/favicon\.ico)/

/**
 * Middleware function for handling internationalization and content path rewrites
 * 
 * This middleware:
 * 1. Skips processing for static files, API routes, and internal Next.js files
 * 2. Redirects the root path (/) to the default language path (/en)
 * 3. Validates language codes in the URL and redirects invalid languages to the default
 * 4. Rewrites paths like /en/about to /en/content/about for MDX content
 * 
 * @param {NextRequest} req - The incoming request
 * @returns {NextResponse|undefined} - The response or undefined to continue
 */
export async function middleware(req) {
  // Get the pathname from the URL
  const { pathname } = req.nextUrl
  
  // Skip middleware for excluded paths (static files, api routes, etc)
  if (
    EXCLUDED_PATHS.test(pathname) ||
    PUBLIC_FILE.test(pathname)
  ) {
    return
  }
  
  // Check if the request is for the root path
  if (pathname === '/') {
    // Get the preferred language from the cookie or defaults to the default language
    const preferredLanguage = 
      req.cookies.get('NEXT_LOCALE')?.value || 
      DEFAULT_LANGUAGE
    
    // Create the URL for the redirect
    const redirectUrl = new URL(`/${preferredLanguage}`, req.url)
    
    // Redirect to the language path
    return NextResponse.redirect(redirectUrl)
  }
  
  // Check if the URL starts with a supported language code
  const pathnameSegments = pathname.split('/')
  const langCode = pathnameSegments[1]?.toLowerCase()
  
  // If the first segment is not a supported language code, redirect to the default language
  if (!isLanguageSupported(langCode)) {
    // Remove the first empty segment from the pathname
    const pathWithoutLang = pathnameSegments.slice(1).join('/')
    
    // Create the URL for the redirect
    const redirectUrl = new URL(`/${DEFAULT_LANGUAGE}/${pathWithoutLang}`, req.url)
    
    // Redirect to the language path
    return NextResponse.redirect(redirectUrl)
  }
  
  // Handle rewrites for direct content paths
  // Example: /en/about should be handled by /en/content/about
  if (pathnameSegments.length > 2 && 
      pathnameSegments[2] !== 'content' && 
      pathnameSegments[2] !== 'kpis' &&  // Skip specific route patterns that should not be rewritten
      pathnameSegments[2] !== 'collections' &&
      pathnameSegments[2] !== 'tags') {
    
    // Create rewrite path
    const contentPath = ['', pathnameSegments[1], 'content', ...pathnameSegments.slice(2)].join('/')
    const rewriteUrl = new URL(contentPath, req.url)
    
    // Rewrite to the content path
    return NextResponse.rewrite(rewriteUrl)
  }
  
  // If the language code is valid and no other conditions are met, continue with the request
  return NextResponse.next()
}

/**
 * Configure which paths should be processed by this middleware
 */
export const config = {
  matcher: [
    // Skip static files, api routes, etc
    '/((?!_next|api|favicon.ico).*)'
  ]
}
