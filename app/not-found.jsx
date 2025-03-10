import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mx-auto py-8">
        <Image
          className="inline-block"
          width={300}
          height={300}
          src="/img/taken.svg"
          alt="Page not found"
        />
        <h2 className="mt-8 text-gray-400 font-mono text-center">
          Oops! This page doesn&#39;t exist...
        </h2>
      </div>
      <Link
        className="bg-charge hover:bg-blue-800 text-white p-3 px-6 mt-4 rounded-md"
        href="/"
      >
        ← Back Home
      </Link>
    </div>
  )
}
