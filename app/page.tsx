import Chat from '@/components/Chat'
import DocumentUpload from '@/components/DocumentUpload'

export default function Home() {
  return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="bg-gray-800 p-4">
          <h1 className="text-2xl font-bold">Lawyer Agent</h1>
        </header>
        <main className="flex-grow flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-4">
            <DocumentUpload />
          </div>
          <div className="w-full md:w-2/3 p-4">
            <Chat />
          </div>
        </main>
      </div>
  )
}

