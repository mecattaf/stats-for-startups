export default function MetaTags({
  title,
  description,
  keywords = [],
  ogImage = '/sfs-social-banner-min.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonical
}) {
  // Default site name to append to titles
  const siteName = 'Stats For Startups'
  
  // Format the full title
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  
  // Convert keywords array to string if needed
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords
  
  // Ensure ogImage is a full URL
  const fullOgImage = ogImage.startsWith('http') 
    ? ogImage 
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://statsforstartups.com'}${ogImage}`

  // Ensure canonical URL is full
  const fullCanonical = canonical && !canonical.startsWith('http')
    ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://statsforstartups.com'}${canonical}`
    : canonical

  return {
    // Basic metadata
    title: fullTitle,
    description: description || 'A repository of key performance indicators for startups',
    
    // Additional meta tags
    keywords: keywordsString || 'KPI, startup, metrics, performance indicators',
    
    // Open Graph
    openGraph: {
      type: ogType,
      title: fullTitle,
      description: description || 'A repository of key performance indicators for startups',
      site_name: siteName,
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title || siteName
        }
      ]
    },
    
    // Twitter
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description: description || 'A repository of key performance indicators for startups',
      images: [fullOgImage]
    },
    
    // Canonical URL
    ...(fullCanonical && { canonical: fullCanonical })
  }
}
