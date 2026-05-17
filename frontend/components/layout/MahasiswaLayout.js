// components/layout/MahasiswaLayout.js
import MahasiswaNavbar from './MahasiswaNavbar'

export default function MahasiswaLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <MahasiswaNavbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}