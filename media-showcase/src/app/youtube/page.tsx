export default function YouTubePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">YouTube Videos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Featured Video */}
        <div className="col-span-full">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Featured Video</h2>
            <div className="aspect-video bg-gray-700 rounded-lg">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Featured YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-gray-700 rounded-lg mb-4">
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/dQw4w9WgXcQ?index=${index}`}
                title={`YouTube video ${index}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h3 className="text-lg font-semibold mb-2">Video Title {index}</h3>
            <p className="text-gray-400 text-sm">Video description goes here...</p>
          </div>
        ))}
      </div>
    </div>
  )
} 