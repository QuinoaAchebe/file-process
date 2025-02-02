import FileProcessor from './components/FileProcessor';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Invoice Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload any invoice and let AI extract key information instantly
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border p-1">
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-xl">
            <FileProcessor />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border bg-white/50 backdrop-blur-sm">
            <div className="text-blue-600 font-semibold mb-2">Smart Analysis</div>
            <p className="text-gray-600 text-sm">
              Advanced AI processing to understand invoice context and type
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-white/50 backdrop-blur-sm">
            <div className="text-blue-600 font-semibold mb-2">Instant Results</div>
            <p className="text-gray-600 text-sm">
              Get structured data extraction in seconds
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-white/50 backdrop-blur-sm">
            <div className="text-blue-600 font-semibold mb-2">Secure Processing</div>
            <p className="text-gray-600 text-sm">
              Your data is processed securely and never stored
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
