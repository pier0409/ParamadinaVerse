import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'

export default function MainLayout({ children }) {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Ambil data user dari localStorage jika tidak ada context auth
    let userData = null
    try {
      const auth = useAuth()
      if (auth && auth.user) {
        userData = auth.user
      }
    } catch (error) {
      // Fallback ke localStorage jika context tidak tersedia
      userData = JSON.parse(localStorage.getItem('user') || 'null')
    }
    
    if (userData) {
      setUser(userData)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    alert('Logout berhasil!')
    router.push('/')
    setIsMenuOpen(false)
  }

  // Tentukan dashboard path berdasarkan role
  const getDashboardPath = () => {
    if (!user) return '/guest/home'
    switch(user.role) {
      case 'admin': return '/admin/dashboard'
      case 'mahasiswa': return '/mahasiswa/dashboard'
      default: return '/guest/home'
    }
  }

  // Warna dari gradient untuk digunakan konsisten
  const colors = {
    primaryDark: '#083552',
    primaryLight: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)',
    gradientVertical: 'linear-gradient(to bottom, #094863, #0f5e83)'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navbar dengan struktur seperti AdminNavbar */}
      <nav className="fixed top-0 left-0 right-0 text-white shadow-xl z-50" style={{
        background: colors.gradient
      }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center mr-3">
                  <Image 
                    src="/images/Icon.png" 
                    alt="PV Logo" 
                    width={40} 
                    height={40}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <Link href="/">
                  <div className="flex flex-col cursor-pointer group">
                    <span className="font-bold text-xl tracking-tight group-hover:text-blue-100 transition-colors">ParamadinaVerse</span>
                    <span className="text-xs text-blue-200 font-medium">Showcase Karya Mahasiswa</span>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Desktop Menu - Tengah */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <span className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                  router.pathname === '/' 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : ''
                }`}>
                  <span>Home</span>
                </span>
              </Link>
              
              <Link href="/guest/artworks">
                <span className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                  router.pathname.includes('/guest/artworks')
                    ? 'bg-white/20 backdrop-blur-sm'
                    : ''
                }`}>
                  <span>Galeri Karya</span>
                </span>
              </Link>
              
              {user && (
                <Link href={getDashboardPath()}>
                  <span className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                    router.pathname.includes('/dashboard')
                      ? 'bg-white/20 backdrop-blur-sm'
                      : ''
                  }`}>
                    <span>Dashboard</span>
                  </span>
                </Link>
              )}

              {/* User Profile atau Login Button */}
              {user ? (
                <div className="flex items-center space-x-3 pl-4 ml-2 border-l border-white/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.name || 'User'}</span>
                    <span className="text-xs text-blue-200 capitalize">{user.role || 'Pengguna'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-3 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center pl-4 ml-2 border-l border-white/20">
                  <Link href="/auth/login">
                    <button className="bg-white hover:bg-white/90 text-blue-900 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                      Login
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden rounded-b-xl shadow-lg py-4 mb-4" style={{
              background: colors.gradientVertical
            }}>
              <div className="flex flex-col space-y-3 px-4">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <span className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                    router.pathname === '/' 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : ''
                  }`}>
                    <span>Home</span>
                  </span>
                </Link>
                
                <Link href="/guest/artworks" onClick={() => setIsMenuOpen(false)}>
                  <span className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                    router.pathname.includes('/guest/artworks')
                      ? 'bg-white/20 backdrop-blur-sm'
                      : ''
                  }`}>
                    <span>Galeri Karya</span>
                  </span>
                </Link>
                
                {user && (
                  <Link href={getDashboardPath()} onClick={() => setIsMenuOpen(false)}>
                    <span className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                      router.pathname.includes('/dashboard')
                        ? 'bg-white/20 backdrop-blur-sm'
                        : ''
                    }`}>
                      <span>Dashboard</span>
                    </span>
                  </Link>
                )}

                {/* User Section di Mobile */}
                <div className="pt-4 border-t border-white/20">
                  {user ? (
                    <div className="flex flex-col space-y-4 px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center font-bold text-lg">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{user.name || 'User'}</p>
                          <p className="text-xs text-blue-200 capitalize">{user.role || 'Pengguna'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleLogout}
                          className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                          Logout
                        </button>
                        <Link href={getDashboardPath()} onClick={() => setIsMenuOpen(false)}>
                          <button className="flex-1 bg-white hover:bg-white/90 text-blue-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                            Dashboard
                          </button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3 px-4 py-3">
                      <p className="text-sm text-blue-200">Bergabung dengan ParamadinaVerse</p>
                      <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full bg-white hover:bg-white/90 text-blue-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                          Login
                        </button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Additional Links */}
                <div className="pt-4 border-t border-white/20">
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                    <span className="flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300">
                      <span>📞</span>
                      <span>Kontak</span>
                    </span>
                  </Link>
                  <Link href="/faq" onClick={() => setIsMenuOpen(false)}>
                    <span className="flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300">
                      <span>❓</span>
                      <span>FAQ</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content dengan padding untuk navbar fixed */}
      <main className="pt-20 pb-8 px-4 md:pt-24 md:pb-12 md:px-6">
        {children}
      </main>
    </div>
  )
}