import { Inter } from 'next/font/google'
import { Head, Search } from 'nextra/components'
import { Layout, useConfig } from 'nextra-theme-docs'
import './globals.css'

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Stats For Startups',
    template: '%s | Stats For Startups'
  },
  description: 'A repository of key performance indicators for startups',
  keywords: 'KPI, startup, metrics, performance indicators, business metrics',
  authors: [{ name: 'Charge Ventures' }],
  creator: 'Charge Ventures',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://statsforstartups.com/',
    siteName: 'Stats For Startups',
    images: [
      {
        url: 'https://statsforstartups.com/sfs-social-banner-min.png',
        width: 1200,
        height: 630,
        alt: 'Stats For Startups'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stats For Startups',
    description: 'A repository of key performance indicators for startups',
    images: ['https://statsforstartups.com/sfs-social-banner-min.png']
  }
}

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={inter.className} 
      suppressHydrationWarning
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* KaTeX CSS for math equations */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" 
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+" 
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.png" />
        {/* Theme colors */}
        <meta name="theme-color" content="#004dff" />
        <meta name="color-scheme" content="light dark" />
      </Head>
      <body className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50">
        <Layout
          // Logo
          logo={<span className="font-bold">Stats For Startups</span>}
          
          // Repository link
          docsRepositoryBase="https://github.com/mecattaf/stats-for-startups/tree/main"
          
          // Navigation options
          navigation={{
            prev: true,
            next: true,
          }}
          
          // Table of contents options
          toc={{
            float: true,
            title: 'On This Page',
            backToTop: true
          }}
          
          // Footer content
          footer={{
            text: `Stats For Startups © ${new Date().getFullYear()}`,
          }}
          
          // Project link
          projectLink="https://github.com/mecattaf/stats-for-startups"
          
          // Theme switching
          darkMode={true}
          
          // Sidebar options
          sidebar={{
            toggleButton: true,
            autoCollapse: false,
            defaultMenuCollapseLevel: 1,
          }}
          
          // Search component
          search={{
            component: <Search />
          }}
          
          // i18n configuration
          i18n={[
            { locale: 'en', name: 'English' }
          ]}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
