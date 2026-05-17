import AdminNavbar from './AdminNavbar'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AdminNavbar />
      <main className="pt-20 pb-8"> {/* Tambah padding-top untuk navbar fixed */}
        {children}
      </main>
    </div>
  )
}