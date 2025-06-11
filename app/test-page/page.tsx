export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ✅ Next.js is Working!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          If you can see this page, the basic Next.js setup is functional.
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success!</strong> The server is responding correctly.
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Home Page
          </a>
        </div>
      </div>
    </div>
  )
} 