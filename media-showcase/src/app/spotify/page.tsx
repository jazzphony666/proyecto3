export default function SpotifyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Spotify Playlists</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Featured Playlist */}
        <div className="col-span-full">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Featured Playlist</h2>
            <div className="aspect-square bg-gray-700 rounded-lg">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
                title="Featured Spotify playlist"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Playlist Grid */}
        {[
          '37i9dQZF1DXcBWIGoYBM5M',
          '37i9dQZF1DX4WYpdgoIcn6',
          '37i9dQZF1DX0XUsuxWHRQd',
          '37i9dQZF1DX4WYpdgoIcn6',
          '37i9dQZF1DX0XUsuxWHRQd',
          '37i9dQZF1DXcBWIGoYBM5M'
        ].map((playlistId, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gray-700 rounded-lg mb-4">
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://open.spotify.com/embed/playlist/${playlistId}`}
                title={`Spotify playlist ${index + 1}`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              ></iframe>
            </div>
            <h3 className="text-lg font-semibold mb-2">Playlist Title {index + 1}</h3>
            <p className="text-gray-400 text-sm">Playlist description goes here...</p>
          </div>
        ))}
      </div>
    </div>
  )
} 