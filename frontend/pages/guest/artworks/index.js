// pages/guest/artworks/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MainLayout from '../../../components/layout/MainLayout'
import Link from 'next/link'
import Footer from '../../../components/layout/Footer'
import { getArtworks } from '../../../utils/artworksData'

export default function GuestArtworksGallery() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [transitionDirection, setTransitionDirection] = useState('')
  const itemsPerPage = 6
  const [likedArtworks, setLikedArtworks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

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

  // Warna konsisten
  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  // Normalisasi data dari backend ke shape yang dipakai frontend
  const normalizeArtwork = (k) => ({
    _id:        k._id,
    id:         k._id, // alias
    title:      k.title || 'Tanpa Judul',
    category:   k.categoryName || k.category?.name || k.category || '-',
    prodi:      k.programStudi || '',
    prodiFull:  k.programStudi || '-',
    description: k.description || '-',
    image:      k.image_url || k.thumbnail || '',
    artist:     k.created_by?.name || k.created_by?.username || 'Unknown',
    avatar:     (k.created_by?.name || k.created_by?.username || '?').charAt(0).toUpperCase(),
    year:       k.createdAt ? new Date(k.createdAt).getFullYear() : '-',
    likes:      Array.isArray(k.likes) ? k.likes.length : (k.likes || 0),
    comments:   Array.isArray(k.comments) ? k.comments.length : (k.comments || 0),
    views:      k.views || 0,
    status:     k.status || 'accepted',
    tags:       k.tags || [],
  })

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks`)
    .then(res => res.json())
    .then(data => setArtworks(Array.isArray(data) ? data.map(normalizeArtwork) : []))
    .finally(() => setLoading(false));
}, []);


  useEffect(() => {
    // Simulasi loading
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [])

  // Filter karya berdasarkan kategori dan search
  const getFilteredArtworks = () => {
    let filtered = artworks
    
    // Filter berdasarkan kategori prodi
    if (selectedCategory) {
      filtered = filtered.filter(artwork => artwork.prodi === selectedCategory)
    }
    
    // Filter berdasarkan search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(artwork => 
        artwork.title.toLowerCase().includes(query) ||
        artwork.artist.toLowerCase().includes(query) ||
        artwork.description.toLowerCase().includes(query) ||
        artwork.prodiFull.toLowerCase().includes(query) ||
        artwork.category.toLowerCase().includes(query) ||
        (artwork.tags && artwork.tags.some(tag => tag.toLowerCase().includes(query)))
      )
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

  const handleLike = (artworkId, e) => {
    e.stopPropagation()
    if (likedArtworks.includes(artworkId)) {
      setLikedArtworks(likedArtworks.filter(id => id !== artworkId))
    } else {
      setLikedArtworks([...likedArtworks, artworkId])
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset ke halaman 1 saat search
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div 
              className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4"
              style={{ borderColor: colors.secondary }}
            ></div>
            <p className="text-gray-600">Memuat galeri...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Galeri Karya - ParamadinaVerse</title>
        <meta name="description" content="Jelajahi karya kreatif dari mahasiswa Universitas Paramadina" />
      </Head>

      <MainLayout>
        {/* Page Header */}
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Galeri Karya Mahasiswa
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                Jelajahi koleksi karya kreatif dan inovatif dari mahasiswa Universitas Paramadina
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Karya Mahasiswa</h2>
                <p className="text-gray-600 text-sm">
                  {filteredArtworks.length} karya ditemukan
                  {selectedCategory && prodiCategories.find(c => c.value === selectedCategory)?.label !== 'Semua Prodi' && 
                    ` • Filter: ${prodiCategories.find(c => c.value === selectedCategory)?.label}`}
                  {searchQuery && ` • Pencarian: "${searchQuery}"`}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex-1 md:flex-none md:w-64">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari karya atau mahasiswa..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:border-transparent transition-all text-gray-800 placeholder-gray-500 text-sm"
                      style={{ 
                        focusRingColor: colors.primary,
                        borderColor: colors.primary + '30'
                      }}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔍
                    </div>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </form>
                
                {/* Filter by Prodi */}
                <select 
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-opacity-20 min-w-[200px] text-gray-800 bg-white cursor-pointer text-sm"
                  style={{ 
                    focusRingColor: colors.primary,
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

            {/* Search Tips */}
            {searchQuery && filteredArtworks.length === 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Tidak ada karya yang ditemukan dengan kata kunci "<strong>{searchQuery}</strong>".
                  Coba kata kunci lain atau hapus filter pencarian.
                </p>
              </div>
            )}
          </div>

          {/* Artworks Grid with Animation */}
          <div className={`transition-all duration-500 ${transitionDirection === 'right' ? 'animate-slideInRight' : 
                          transitionDirection === 'left' ? 'animate-slideInLeft' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {currentItems.map((artwork) => (
                <div
                  key={artwork._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
                  onClick={() => router.push(`/mahasiswa/artworks/${artwork._id}`)}
                >
                  {/* Image/Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {artwork.image ? (
                        <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-6xl opacity-20">🎨</div>
                      )}
                    </div>
                    <div className="absolute top-4 left-4">
                      <span 
                        className="text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
                        style={{ background: colors.gradient }}
                      >
                        {artwork.prodiFull}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                        {artwork.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start mb-3">
                      {/* Avatar Mahasiswa */}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 border"
                        style={{ 
                          background: colors.gradient,
                          borderColor: colors.primary
                        }}
                      >
                        {artwork.avatar || artwork.artist?.charAt(0) || 'A'}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-1">
                          {artwork.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">{artwork.artist}</span>
                          <span className="mx-1">•</span>
                          <span>{artwork.year}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {artwork.description}
                    </p>
                    
                    {artwork.tags && artwork.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {artwork.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 text-xs font-medium rounded-full border"
                            style={{ 
                              backgroundColor: colors.primary + '10',
                              color: colors.primary,
                              borderColor: colors.primary + '20'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                        {artwork.tags.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{artwork.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => handleLike(artwork.id, e)}
                          className="flex items-center space-x-1.5 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <span className="text-lg">
                            {likedArtworks.includes(artwork.id) ? '❤️' : '🤍'}
                          </span>
                          <span className="text-sm font-semibold">{artwork.likes || 0}</span>
                        </button>
                        <div className="flex items-center space-x-1.5 text-gray-600">
                          <span className="text-lg">💬</span>
                          <span className="text-sm font-semibold">{artwork.comments || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-gray-600">
                          <span className="text-lg">👁️</span>
                          <span className="text-sm font-semibold">{artwork.views || 0}</span>
                        </div>
                      </div>
                      
                      <div 
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/guest/artworks/${artwork.id}`)
                        }}
                      >
                        <button 
                          className="px-4 py-2 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all duration-300 group-hover:scale-105 shadow-sm hover:shadow"
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

          {/* No Results Message */}
          {filteredArtworks.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200 mb-10">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tidak ada karya yang ditemukan
              </h3>
              <p className="text-gray-600 mb-6 text-base">
                {searchQuery || selectedCategory ? (
                  <>Coba hapus filter pencarian atau pilih program studi lain</>
                ) : (
                  <>Belum ada karya yang tersedia di galeri</>
                )}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('')
                    setCurrentPage(1)
                  }}
                  className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 shadow hover:shadow-lg"
                  style={{ background: colors.gradient }}
                >
                  Tampilkan Semua Karya
                </button>
              )}
            </div>
          )}

          {/* Pagination with Animation */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Menampilkan <span className="font-semibold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredArtworks.length)}</span> dari <span className="font-semibold">{filteredArtworks.length}</span> karya
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-base">←</span>
                    <span className="hidden sm:inline font-medium text-sm">Sebelumnya</span>
                  </button>
                  
                  <div className="flex items-center gap-1.5">
                    {renderPaginationNumbers().map((pageNumber, index) => (
                      pageNumber === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 min-w-[40px] rounded-lg transition-all duration-300 text-sm ${
                            currentPage === pageNumber
                              ? 'text-white shadow-md scale-105'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow hover:-translate-y-0.5'
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
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="hidden sm:inline font-medium text-sm">Selanjutnya</span>
                    <span className="text-base">→</span>
                  </button>
                </div>
              </div>
              
              {/* Page Indicator */}
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentPage === page
                          ? 'w-8'
                          : 'w-2 bg-gray-300 hover:bg-gray-400 hover:w-3'
                      }`}
                      style={currentPage === page ? { background: colors.gradient } : {}}
                      aria-label={`Pergi ke halaman ${page}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Guest Login CTA */}
          <div 
            className="mt-12 rounded-2xl p-8 text-white text-center"
            style={{ background: colors.gradient }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-4">Ingin berpartisipasi lebih?</h3>
              <p className="text-white/90 text-base mb-6 leading-relaxed">
                Sebagai Guest, Anda hanya bisa melihat dan memberikan like pada karya. 
                Login sebagai mahasiswa untuk mengupload karya Anda sendiri, berinteraksi dengan komunitas, 
                dan mengikuti berbagai kompetisi menarik.
              </p>
              <Link href="/auth/login">
                <button 
                  className="px-8 py-3 bg-white font-bold text-base rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ color: colors.primary }}
                >
                  🎓 Login sebagai Mahasiswa
                </button>
              </Link>
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
        `}</style>
      </MainLayout>
      <Footer />
    </>
  )
}