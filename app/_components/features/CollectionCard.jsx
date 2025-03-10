import Link from 'next/link'
import Image from 'next/image'

export default function CollectionCard({ info, index }) {
  // Function to get the appropriate icon based on category
  const getCategoryIcon = (category) => {
    let lowCat = category.toLowerCase()
    let icon = ''
    
    switch (lowCat) {
      case 'popular':
        icon = 'tri.svg'
        break
      case 'trends':
        icon = 'romvos.svg'
        break
      case 'community':
        icon = 'circle.svg'
        break
      case 'charge':
        icon = 'charge.svg'
        break
      case 'industry':
        icon = 'vertical.svg'
        break
      case 'new':
        icon = 'triangle.svg'
        break
      default:
        icon = 'square.svg'
    }
    
    return `/img/${icon}`
  }
  
  // Different card layouts based on index
  const renderCard = () => {
    if (index === 0) {
      return (
        <div className="glass flex text-white flex-col h-52 border-gray-800 border-2 hover:border-white min-w-full">
          <div className="relative min-h-full flex flex-col p-6">
            <p className="text-gray-500 font-mono mb-2 lowercase">
              {info.category}
            </p>
            <p className="py-2 text-2xl font-normal mb-auto font-serif">
              {info.name}
            </p>
            <Image
              src={getCategoryIcon(info.category)}
              className="absolute right-6 top-6"
              width={16}
              height={16}
              alt=""
            />
          </div>
        </div>
      )
    }
    
    if (index === 1) {
      return (
        <div className="glass flex text-white flex-col h-60 md:h-80 border-gray-800 border-2 hover:border-white min-w-full">
          <div className="relative min-h-full flex flex-col p-6">
            <p className="text-2xl font-normal mb-auto font-serif">
              {info.name}
            </p>
            <Image
              src={getCategoryIcon(info.category)}
              className="absolute right-6 bottom-6"
              width={16}
              height={16}
              alt=""
            />
            <p className="text-gray-500 font-mono lowercase">
              {info.category}
            </p>
          </div>
        </div>
      )
    }
    
    if (index === 2) {
      return (
        <div className="glass flex text-white flex-col h-60 md:h-80 border-gray-800 border-2 hover:border-white min-w-full">
          <div className="min-h-full relative flex flex-col p-6">
            <Image
              src={getCategoryIcon(info.category)}
              className="absolute right-6 top-6"
              width={16}
              height={16}
              alt=""
            />
            <p className="mt-auto mb-4 text-gray-500 font-mono lowercase">
              {info.category}
            </p>
            <p className="text-2xl font-normal font-serif">
              {info.name}
            </p>
          </div>
        </div>
      )
    }
    
    if (index === 3) {
      return (
        <div className="glass flex text-white flex-col h-60 border-gray-800 border-2 hover:border-white min-w-full">
          <div className="relative min-h-full flex flex-col p-6">
            <p className="text-gray-500 font-mono lowercase">
              {info.category}
            </p>
            <p className="mt-4 text-2xl font-normal mb-auto font-serif">
              {info.name}
            </p>
            <Image
              src={getCategoryIcon(info.category)}
              className="absolute left-6 bottom-6"
              width={16}
              height={16}
              alt=""
            />
          </div>
        </div>
      )
    }
    
    if (index === 4) {
      return (
        <div className="glass flex text-white flex-col h-60 border-gray-800 border-2 hover:border-white min-w-full">
          <div className="min-h-full relative flex flex-col p-6">
            <p className="py-2 text-2xl font-normal mb-auto font-serif">
              {info.name}
            </p>
            <p className="text-gray-500 font-mono lowercase">
              {info.category}
            </p>
            <Image
              src={getCategoryIcon(info.category)}
              className="absolute right-8 bottom-8"
              width={16}
              height={16}
              alt=""
            />
          </div>
        </div>
      )
    }
    
    // Default card style
    return (
      <div className="glass flex text-white flex-col h-52 border-gray-800 border-2 hover:border-white min-w-full">
        <div className="relative min-h-full flex flex-col p-6">
          <p className="text-gray-500 font-mono mb-2 lowercase">
            {info.category}
          </p>
          <p className="py-2 text-2xl font-normal mb-auto font-serif">
            {info.name}
          </p>
          <Image
            src={getCategoryIcon(info.category)}
            className="absolute right-6 top-6"
            width={16}
            height={16}
            alt=""
          />
        </div>
      </div>
    )
  }
  
  return (
    <div className={`${index === 4 ? 'mt-auto' : ''} flex flex-col w-full`}>
      <Link className="w-full" href={`/collections/${info.slug}`}>
        {renderCard()}
      </Link>
    </div>
  )
}

// CSS for glass effect
export const style = `
.glass {
  background-color: rgba(255, 255, 255, 0.01);
}
`
