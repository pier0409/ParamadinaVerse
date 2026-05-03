import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function MahasiswaNavbar() {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const router = useRouter()

  // Warna konsisten
  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    setUser(userData)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const confirmLogout = () => {
    setShowLogoutPopup(true)
  }

  const cancelLogout = () => {
    setShowLogoutPopup(false)
  }

  const executeLogout = () => {
    handleLogout()
    setShowLogoutPopup(false)
  }

  // Animasi untuk menu items
  const menuItems = [
    { href: "/mahasiswa/dashboard/", icon: "🏛️", label: "Galeri" },
    { href: "/mahasiswa/profile/", icon: "👤", label: "Profile" },
    { href: "/mahasiswa/kontak/", icon: "📞", label: "Kontak" },
  ]

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 text-white shadow-xl z-50"
        style={{ background: colors.gradient }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section dengan animasi */}
            <div className="flex items-center">
              <Link href="/mahasiswa/dashboard/" className="flex items-center">
                <div className="flex items-center group">
                  <div className="relative w-10 h-10 mr-3 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src="/images/Icon.png"
                      alt="ParamadinaVerse Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl tracking-tight transition-all duration-300 group-hover:text-blue-200">
                      ParamadinaVerse
                    </span>
                    <span className="text-xs text-blue-200 font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Galeri Digital Mahasiswa
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Menu Items dengan animasi */}
              {menuItems.map((item, index) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                >
                  <span 
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 transform ${
                      router.pathname === item.href 
                        ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                        : 'hover:bg-white/10 hover:shadow-md'
                    }`}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInDown 0.5s ease-out forwards'
                    }}
                  >
                    <span className="text-lg transition-transform duration-300 hover:scale-125">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </span>
                </Link>
              ))}
              
              {/* Upload Karya dengan animasi */}
              <Link href="/mahasiswa/artworks/">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  style={{ 
                    background: colors.gradient,
                    animation: 'pulse 2s infinite'
                  }}
                >
                  <span className="text-lg transition-transform duration-300 hover:rotate-90">+</span>
                  <span>Upload Karya</span>
                </button>
              </Link>

              {/* User Profile dengan animasi */}
              {user && (
                <div 
                  className="flex items-center space-x-3 pl-6 border-l border-white/20 animate-fadeIn"
                  style={{ animationDelay: '300ms' }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer transform"
                    style={{ background: colors.gradient }}
                    onClick={() => router.push('/mahasiswa/profile/')}
                  >
                    {user.name?.charAt(0).toUpperCase() || 'M'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium transition-colors duration-300 hover:text-blue-200 cursor-pointer"
                      onClick={() => router.push('/mahasiswa/profile/')}>
                      {user.name || 'Mahasiswa'}
                    </span>
                    <span className="text-xs text-blue-200">Mahasiswa</span>
                  </div>
                  <button
                    onClick={confirmLogout}
                    className="ml-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 transform active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button dengan animasi */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
            >
              <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12"
                    className="origin-center transition-transform duration-300 rotate-180"
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16"
                    className="origin-center transition-transform duration-300"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu dengan animasi */}
          {isMenuOpen && (
            <div 
              className="md:hidden rounded-b-xl shadow-lg py-4 mb-4 animate-slideDown"
              style={{ background: 'linear-gradient(to bottom, #094863, #0f5e83)' }}
            >
              <div className="flex flex-col space-y-3 px-4">
                {/* User Info */}
                {user && (
                  <div 
                    className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg mb-2 transition-all duration-300 hover:bg-white/20 animate-fadeIn"
                    style={{ animationDelay: '100ms' }}
                    onClick={() => {
                      router.push('/mahasiswa/profile/')
                      setIsMenuOpen(false)
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white transition-transform duration-300 hover:scale-110"
                      style={{ background: colors.gradient }}
                    >
                      {user.name?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div>
                      <p className="font-medium">{user.name || 'Mahasiswa'}</p>
                      <p className="text-xs text-blue-200">Mahasiswa</p>
                    </div>
                  </div>
                )}
                
                {/* Menu Items Mobile */}
                {menuItems.map((item, index) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span 
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-102 hover:translate-x-2 ${
                        router.pathname === item.href 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'hover:bg-white/10'
                      }`}
                      style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    >
                      <span className="text-lg transition-transform duration-300 hover:scale-125">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </span>
                  </Link>
                ))}
                
                {/* Upload Karya Mobile */}
                <Link 
                  href="/mahasiswa/artworks/" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span 
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-102 text-white animate-fadeIn"
                    style={{ 
                      background: colors.gradient,
                      animationDelay: '500ms'
                    }}
                  >
                    <span className="text-lg transition-transform duration-300 hover:rotate-90">+</span>
                    <span>Upload Karya</span>
                  </span>
                </Link>

                {/* Logout Section Mobile */}
                <div 
                  className="pt-4 border-t border-white/20 animate-fadeIn"
                  style={{ animationDelay: '600ms' }}
                >
                  {user && (
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-transform duration-300 hover:scale-110"
                          style={{ background: colors.gradient }}
                          onClick={() => {
                            router.push('/mahasiswa/profile/')
                            setIsMenuOpen(false)
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase() || 'M'}
                        </div>
                        <div>
                          <p className="font-medium">{user.name || 'Mahasiswa'}</p>
                          <p className="text-xs text-blue-200">Mahasiswa Panel</p>
                        </div>
                      </div>
                      <button
                        onClick={confirmLogout}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-slideUp">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#083552] to-[#1276B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">👋</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Keluar Akun?</h3>
              <p className="text-gray-600 mb-8">
                Apakah Anda yakin ingin logout dari akun Anda? Anda perlu login kembali untuk mengakses fitur mahasiswa.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Batal
                </button>
                <button
                  onClick={executeLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#083552] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tambahkan styles untuk animasi */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(18, 118, 181, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(18, 118, 181, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(18, 118, 181, 0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.5s ease-out forwards;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .transform {
          transition: transform 0.3s ease-out;
        }
      `}</style>
    </>
  )
}