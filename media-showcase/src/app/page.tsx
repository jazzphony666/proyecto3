import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Media Showcase</h1>
        <p className="text-xl text-gray-300">Discover and share amazing digital content</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* YouTube Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">YouTube Videos</h2>
          <div className="aspect-video bg-gray-700 rounded-lg mb-4">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <Link href="/youtube" className="text-blue-400 hover:text-blue-300">
            View more videos →
          </Link>
        </div>

        {/* Spotify Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Spotify Playlists</h2>
          <div className="aspect-square bg-gray-700 rounded-lg mb-4">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
              title="Spotify playlist"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>
          </div>
          <Link href="/spotify" className="text-green-400 hover:text-green-300">
            Browse playlists →
          </Link>
        </div>

        {/* Image Gallery Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Image Gallery</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="aspect-square bg-gray-700 rounded-lg"></div>
            <div className="aspect-square bg-gray-700 rounded-lg"></div>
            <div className="aspect-square bg-gray-700 rounded-lg"></div>
            <div className="aspect-square bg-gray-700 rounded-lg"></div>
          </div>
          <Link href="/gallery" className="text-purple-400 hover:text-purple-300">
            View gallery →
          </Link>
        </div>
      </div>

      <footer className="mt-16 text-center text-gray-400">
        <p>© 2024 Media Showcase. All rights reserved.</p>
      </footer>
    </div>
  )
} 