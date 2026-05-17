// pages/mahasiswa/dashboard/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MahasiswaLayout from '../../../components/layout/MahasiswaLayout'
import MahasiswaFooter from '../../../components/layout/MahasiswaFooter'
import Link from 'next/link'
import { getArtworks } from '../../../utils/artworksData'

export default function MahasiswaDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [transitionDirection, setTransitionDirection] = useState('')
  const itemsPerPage = 6
  const router = useRouter()

  // Warna konsisten
  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  // Gunakan data dari utils/artworksData.js
  const [artworks, setArtworks] = useState([]);

useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData || userData.role !== "mahasiswa") {
    router.push("/auth/login");
    return;
  }

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks`)
    .then(res => res.json())
    .then(data => setArtworks(data))
    .finally(() => setLoading(false));
}, []);


  // Kategori berdasarkan Prodi
  const prodiCategories = [
    { value: '', label: 'Semua Prodi' },
    { value: 'dkv', label: 'Desain Komunikasi Visual' },
    { value: 'ti', label: 'Teknik Informatika' },
    { value: 'dp', label: 'Desain Produk' },
    { value: 'ikom', label: 'Ilmu Komunikasi' },
    { value: 'psi', label: 'Psikologi' },
    { value: 'hi', label: 'Hubungan Internasional' },
    { value: 'man', label: 'Manajemen' }
  ]

  useEffect(() => {
    // Cek apakah user sudah login dan role mahasiswa
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (!userData || userData.role !== 'mahasiswa') {
      router.push('/auth/login')
      return
    }
    
    // Tambah data untuk user
    const userWithAvatar = {
      ...userData,
      avatar: userData.name?.charAt(0).toUpperCase() || 'MS',
      prodi: userData.prodi || 'Mahasiswa',
      nim: 'Mahasiswa'
    }
    
    setUser(userWithAvatar)
    setLoading(false)
  }, [router])

  // Filter karya berdasarkan kategori
  const getFilteredArtworks = () => {
    let filtered = artworks
    
    // Filter berdasarkan kategori prodi
    if (selectedCategory) {
      filtered = filtered.filter(artwork => artwork.prodi === selectedCategory)
    }
    
    return filtered
  }

  const filteredArtworks = getFilteredArtworks()
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage)
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredArtworks.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    // Set direction for animation
    if (pageNumber > currentPage) {
      setTransitionDirection('right')
    } else {
      setTransitionDirection('left')
    }
    
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  // Render pagination numbers with ellipsis
  const renderPaginationNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i)
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i)
      } else {
        pageNumbers.push(1)
        pageNumbers.push('...')
        pageNumbers.push(currentPage - 1)
        pageNumbers.push(currentPage)
        pageNumbers.push(currentPage + 1)
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }
    
    return pageNumbers
  }

  if (loading) {
    return (
      <MahasiswaLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div 
              className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4"
              style={{ borderColor: colors.secondary }}
            ></div>
            <p className="text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </MahasiswaLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard Mahasiswa - ParamadinaVerse</title>
      </Head>
      
      <MahasiswaLayout>
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Welcome Message */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 ring-2 ring-white shadow-lg"
                    style={{ background: colors.gradient }}
                  >
                    {user?.avatar || 'MS'}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                      Selamat datang, <span style={{ color: colors.primary }}>{user?.name}</span>!
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm font-medium text-white px-3 py-1 rounded-full" style={{ background: colors.gradient }}>
                        {user?.prodi || 'Mahasiswa'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl">
                  Jelajahi karya kreatif dari mahasiswa Universitas Paramadina dan bagikan karya terbaikmu!
                </p>
              </div>
              
              {/* Quick Action Button */}
              <div className="mt-4 md:mt-0">
                <Link href="/mahasiswa/artworks">
                  <button 
                    className="px-6 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                    style={{ background: colors.gradient }}
                  >
                    <span className="mr-2 text-lg">+</span>
                    Upload Karya Baru
                  </button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="text-2xl p-3 rounded-xl text-white"
                    style={{ background: colors.gradient }}
                  >
                    🎨
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{artworks.length}</div>
                    <div className="text-sm text-gray-600 font-medium">Total Karya</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="text-2xl p-3 rounded-xl text-white"
                    style={{ background: colors.gradient }}
                  >
                    👨‍🎓
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{prodiCategories.length - 1}</div>
                    <div className="text-sm text-gray-600 font-medium">Program Studi</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="text-2xl p-3 rounded-xl text-white"
                    style={{ background: colors.gradient }}
                  >
                    🔥
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {artworks.reduce((sum, a) => sum + a.likes, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Total Likes</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="text-2xl p-3 rounded-xl text-white"
                    style={{ background: colors.gradient }}
                  >
                    💬
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {artworks.reduce((sum, a) => sum + a.comments, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Total Komentar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <span className="mr-3" style={{ color: colors.secondary }}>🏛️</span>
                  Galeri Karya Mahasiswa
                </h2>
                <p className="text-gray-600">
                  {filteredArtworks.length} karya ditemukan
                  {selectedCategory && prodiCategories.find(c => c.value === selectedCategory)?.label !== 'Semua Prodi' && 
                    ` • Filter: ${prodiCategories.find(c => c.value === selectedCategory)?.label}`}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none md:w-64">
                  <input
                    type="text"
                    placeholder="Cari karya atau mahasiswa..."
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all bg-white/50"
                    style={{ 
                      focusBorderColor: colors.primary,
                      borderColor: colors.primary + '30'
                    }}
                  />
                  <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                    🔍
                  </div>
                </div>
                
                <select 
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="border border-gray-300 rounded-xl px-5 py-3 focus:outline-none min-w-[220px] text-gray-800 bg-white cursor-pointer appearance-none bg-gradient-to-r from-white to-gray-50"
                  style={{ 
                    focusBorderColor: colors.primary,
                    borderColor: colors.primary + '30'
                  }}
                >
                  {prodiCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Artworks Grid */}
          <div className={`transition-all duration-500 ${transitionDirection === 'right' ? 'animate-slideInRight' : 
                          transitionDirection === 'left' ? 'animate-slideInLeft' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-12">
              {currentItems.map((artwork) => (
                <div 
                  key={artwork.id} 
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer"
                >
                  {/* Image/Thumbnail */}
                  <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-7xl opacity-20 group-hover:scale-110 transition-transform duration-500">🎨</div>
                    </div>
                    <div className="absolute top-5 left-5">
                      <span 
                        className="text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg"
                        style={{ background: colors.gradient }}
                      >
                        {artwork.prodiFull}
                      </span>
                    </div>
                    <div className="absolute top-5 right-5">
                      <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                        {artwork.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start mb-4">
                      {/* Avatar Mahasiswa */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 ring-2 ring-white"
                        style={{ background: colors.gradient }}
                      >
                        {artwork.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-xl line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                          {artwork.title}
                        </h3>
                        <div className="flex items-center text-base text-gray-600">
                          <span className="font-semibold">{artwork.artist}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span>{artwork.year}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-base mb-5 line-clamp-2 leading-relaxed">
                      {artwork.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <div className="flex items-center space-x-5">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <span className="text-xl">❤️</span>
                          <span className="text-base font-semibold">{artwork.likes}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <span className="text-xl">💬</span>
                          <span className="text-base font-semibold">{artwork.comments}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <span className="text-xl">👁️</span>
                          <span className="text-base font-semibold">{artwork.views}</span>
                        </div>
                      </div>
                      
                      <div className="group-hover:scale-105 transition-transform duration-300">
                        <button 
                          className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                          style={{ background: colors.gradient }}
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-base text-gray-600">
                  Menampilkan <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredArtworks.length)}</span> dari <span className="font-semibold text-gray-900">{filteredArtworks.length}</span> karya
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-lg">←</span>
                    <span className="hidden sm:inline font-medium">Sebelumnya</span>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {renderPaginationNumbers().map((pageNumber, index) => (
                      pageNumber === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-5 py-3 min-w-[48px] rounded-xl transition-all duration-300 ${
                            currentPage === pageNumber
                              ? 'text-white shadow-xl scale-105'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5'
                          }`}
                          style={currentPage === pageNumber ? { background: colors.gradient } : {}}
                        >
                          <span className="font-medium">{pageNumber}</span>
                        </button>
                      )
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="hidden sm:inline font-medium">Selanjutnya</span>
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
              
              {/* Page Indicator */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentPage === page
                          ? 'w-10'
                          : 'w-3 bg-gray-300 hover:bg-gray-400 hover:w-4'
                      }`}
                      style={currentPage === page ? { background: colors.gradient } : {}}
                      aria-label={`Pergi ke halaman ${page}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Upload Call to Action */}
          <div 
            className="mt-16 rounded-3xl p-10 text-white overflow-hidden relative"
            style={{ background: colors.gradient }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="max-w-3xl mx-auto relative z-10">
              <div className="text-center">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-3xl font-bold mb-6">Saatnya Berbagi Karya!</h3>
                <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                  Bergabunglah dengan komunitas kreatif Paramadina. Unggah karya terbaikmu, dapatkan apresiasi dari teman-teman mahasiswa, dan jadilah inspirasi bagi orang lain.
                </p>
                <div className="flex justify-center">
                  <Link href="/mahasiswa/artworks">
                    <button 
                      className="px-10 py-4 bg-white font-bold text-lg rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                      style={{ color: colors.primary }}
                    >
                      🎨 Upload Karya Sekarang
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .animate-slideInRight {
            animation: slideInRight 0.5s ease-out;
          }
          
          .animate-slideInLeft {
            animation: slideInLeft 0.5s ease-out;
          }
          
          select::-ms-expand {
            display: none;
          }
          
          select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
            padding-right: 2.5rem;
          }
        `}</style>
      </MahasiswaLayout>
      
      {/* Tambahkan MahasiswaFooter di sini */}
      <MahasiswaFooter />
    </>
  )
}