export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Image Gallery</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
          <div
            key={index}
            className="group relative aspect-square bg-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold">Image Title {index}</h3>
                <p className="text-gray-200 text-sm">Image description goes here...</p>
              </div>
            </div>
            <div className="w-full h-full bg-gray-600 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Upload Image</span>
        </button>
      </div>
    </div>
  )
} 