import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Media Showcase
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/youtube" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                YouTube
              </Link>
              <Link href="/spotify" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Spotify
              </Link>
              <Link href="/gallery" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Gallery
              </Link>
              <Link href="/upload" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Upload
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/youtube"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md"
            >
              YouTube
            </Link>
            <Link
              href="/spotify"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md"
            >
              Spotify
            </Link>
            <Link
              href="/gallery"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md"
            >
              Gallery
            </Link>
            <Link
              href="/upload"
              className="bg-blue-600 text-white block px-3 py-2 rounded-md hover:bg-blue-700"
            >
              Upload
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
} 