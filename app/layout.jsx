import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

// Root layout acts as a redirect handler to the appropriate language
export default function RootLayout({ children, params }) {
  // This is a server component, so we can use a redirect
  // Default to English
  redirect('/en')
  
  // The children will never be rendered due to the redirect
  return null
}

// This allows the page to be statically generated
export const dynamic = 'force-static'
