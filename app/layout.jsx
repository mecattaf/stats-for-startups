import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { Head } from 'nextra/components'
import Header from '@/app/_components/layout/Header'
import Footer from '@/app/_components/layout/Footer'

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
  keywords: ['KPI', 'startup', 'metrics', 'performance indicators'],
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
    <html lang="en" className={inter.className}>
      <Head>
        {/* KaTeX CSS for math equations */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" 
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+" 
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <body className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
