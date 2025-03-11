import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Header from '@/app/_components/layout/Header'
import Footer from '@/app/_components/layout/Footer'
import { getDictionary, getDirection } from '@/lib/i18n/getDictionary'

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export async function generateMetadata({ params }) {
  const { lang } = params
  const dictionary = await getDictionary(lang)
  
  return {
    title: {
      default: dictionary.siteTitle,
      template: `%s | ${dictionary.siteTitle}`
    },
    description: dictionary.siteDescription,
    keywords: dictionary.siteKeywords.split(',').map(keyword => keyword.trim()),
    authors: [{ name: 'Charge Ventures' }],
    creator: 'Charge Ventures',
    openGraph: {
      type: 'website',
      locale: lang,
      url: 'https://statsforstartups.com/',
      siteName: dictionary.siteTitle,
      images: [
        {
          url: 'https://statsforstartups.com/sfs-social-banner-min.png',
          width: 1200,
          height: 630,
          alt: dictionary.siteTitle
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.siteTitle,
      description: dictionary.siteDescription,
      images: ['https://statsforstartups.com/sfs-social-banner-min.png']
    }
  }
}

export default async function LocaleLayout({ children, params }) {
  const { lang } = params
  const pageMap = await getPageMap(lang)
  const direction = getDirection(lang)
  const dictionary = await getDictionary(lang)
  
  return (
    <html 
      lang={lang} 
      dir={direction}
      className={inter.className}
      // This attribute helps avoid hydration warnings with dark mode
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
        {/* Theme script for system-based dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // On page load, check for dark mode preference
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Listen for system preference changes
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                  if (e.matches) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                });
              })();
            `,
          }}
        />
      </Head>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white">
        <Header dictionary={dictionary} currentLang={lang} pageMap={pageMap} />
        <main className="flex-grow" data-pagefind-body data-pagefind-lang={lang}>
          {children}
        </main>
        <Footer dictionary={dictionary} currentLang={lang} />
      </body>
    </html>
  )
}
