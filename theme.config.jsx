export default {
  logo: <span style={{ fontWeight: 'bold' }}>Stats For Startups</span>,
  project: {
    link: 'https://github.com/mecattaf/stats-for-startups'
  },
  docsRepositoryBase: 'https://github.com/mecattaf/stats-for-startups/tree/main',
  footer: {
    text: 'Stats For Startups © 2025',
  },
  primaryHue: 210,
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Stats For Startups'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" 
        integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+" 
        crossOrigin="anonymous"
      />
      <link rel="icon" href="/favicon.png" />
    </>
  ),
  darkMode: true,
  navigation: true,
  search: {
    placeholder: 'Search metrics...'
  },
  toc: {
    float: true,
    title: 'On This Page'
  }
}
