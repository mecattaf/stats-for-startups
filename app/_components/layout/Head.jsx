export default function Head() {
  return (
    <>
      {/* KaTeX CSS for rendering math equations */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" 
        integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+" 
        crossOrigin="anonymous"
      />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/icon-256.png" />
      
      {/* Other meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </>
  )
}
