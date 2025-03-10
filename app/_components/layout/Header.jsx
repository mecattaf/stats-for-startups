import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <div id="top-header" className="bg-primary px-4">
      <div className="container mx-auto py-4 flex items-center text-white">
        {/* Logo and Site Title */}
        <Link href="/" className="leading-8 mt-1 ml-1 flex items-center">
          <Image
            width={24}
            height={24}
            src="/img/logo.svg"
            alt="Stats For Startups Logo"
            className="my-2 mr-2 inline-block"
          />
          <p className="hidden md:inline-block text-sm logo-word font-semibold tracking-widest">
            STATS<span className="text-gray-400 font-normal">FOR</span>STARTUPS
          </p>
        </Link>

        {/* Navigation Links */}
        <div className="ml-auto flex items-center">
          <Link
            href="/collections"
            className="font-mono text-sm leading-7 py-2 tracking-wider font-medium hover:text-white text-gray-400 px-3"
          >
            COLLECTIONS
          </Link>
          
          {/* Placeholder for future search functionality */}
          <div className="hidden md:block ml-4 md:mr-4">
            {/* Search will be implemented in a future phase */}
          </div>

          {/* Charge VC Link */}
          <a
            href="https://charge.vc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex ml-4 items-center"
          >
            <Image
              width={100}
              height={24}
              className="hidden md:inline-block pt-1"
              src="/img/charge-green.png"
              alt="Charge VC"
            />
            <Image
              width={20}
              height={20}
              className="md:hidden m-1 mt-2"
              src="/img/charge-icon.svg"
              alt="Charge VC"
            />
          </a>
        </div>
      </div>
    </div>
  )
}

// CSS styles for the logo word
export const style = `
.logo-word {
  position: relative;
}
.logo-word::after {
  content: 'BETA';
  position: relative;
  font-size: 8px;
  font-family: serif;
  font-weight: normal;
  top: -6px;
  right: 2px;
  letter-spacing: 1px;
  opacity: 0.7;
}
`
