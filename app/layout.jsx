import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Head, Search } from 'nextra/components';
import { redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE } from '@/lib/i18n/config';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Stats For Startups',
  description: 'A repository of key performance indicators for startups',
  keywords: 'KPI, startup, metrics, performance indicators, business metrics',
};

export default function RootLayout({ children }) {
  // Redirect any requests at the root layout to the default language
  redirect(`/${DEFAULT_LANGUAGE}`);
  
  // Note: The following won't be executed due to the redirect,
  // but is required for Next.js component structure
  return (
    <html 
      lang="en" 
      className={inter.className}
      suppressHydrationWarning
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.png" />
        {/* KaTeX CSS for math equations */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" 
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+" 
          crossOrigin="anonymous"
        />
      </Head>
      <body className="bg-white dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
