import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AdminFooter from '../../../components/layout/AdminFooter'
import Link from 'next/link'

export default function AdminCategories() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '🏷️' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(null)
  const [showExportPopup, setShowExportPopup] = useState(false)
  const [showBulkActionsPopup, setShowBulkActionsPopup] = useState(false)
  const [actionInProgress, setActionInProgress] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const router = useRouter()

  // Warna konsisten
  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)',
    greenGradient: 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
  }

  useEffect(() => {
    // Cek apakah user sudah login dan role admin
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (!userData || userData.role !== 'admin') {
      router.push('/auth/login')
      return
    }
    
    setUser(userData)
    // Simulasi data categories
    const mockCategories = [
      { 
        id: 1, 
        name: 'Digital Art', 
        description: 'Karya seni digital seperti ilustrasi, digital painting', 
        icon: '🎨',
        artworkCount: 87,
        createdAt: '2024-01-01',
        status: 'active'
      },
      { 
        id: 2, 
        name: 'Fotografi', 
        description: 'Foto landscape, portrait, street photography', 
        icon: '📸',
        artworkCount: 65,
        createdAt: '2024-01-02',
        status: 'active'
      },
      { 
        id: 3, 
        name: 'Ilustrasi', 
        description: 'Ilustrasi manual dan digital', 
        icon: '✏️',
        artworkCount: 48,
        createdAt: '2024-01-03',
        status: 'active'
      },
      { 
        id: 4, 
        name: '3D Modeling', 
        description: 'Model 3D, karakter, environment', 
        icon: '🎮',
        artworkCount: 42,
        createdAt: '2024-01-04',
        status: 'active'
      },
      { 
        id: 5, 
        name: 'Video Art', 
        description: 'Video pendek, motion graphics, animasi', 
        icon: '🎬',
        artworkCount: 35,
        createdAt: '2024-01-05',
        status: 'active'
      },
      { 
        id: 6, 
        name: 'Lukisan Tradisional', 
        description: 'Lukisan cat minyak, akrilik, watercolor', 
        icon: '🖌️',
        artworkCount: 28,
        createdAt: '2024-01-06',
        status: 'inactive'
      },
      { 
        id: 7, 
        name: 'Desain Grafis', 
        description: 'Poster, logo, branding design', 
        icon: '📐',
        artworkCount: 25,
        createdAt: '2024-01-07',
        status: 'active'
      },
      { 
        id: 8, 
        name: 'Sketsa', 
        description: 'Sketsa pensil, charcoal, ink', 
        icon: '✍️',
        artworkCount: 18,
        createdAt: '2024-01-08',
        status: 'active'
      }
    ]

    setCategories(mockCategories)
    setLoading(false)
  }, [router])

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

  const filteredCategories = categories.filter(category => {
    if (searchQuery && 
        !category.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !category.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      alert('Nama kategori tidak boleh kosong')
      return
    }

    setActionInProgress('add-category')
    setTimeout(() => {
      const newCat = {
        id: categories.length + 1,
        ...newCategory,
        artworkCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      }

      setCategories([...categories, newCat])
      setNewCategory({ name: '', description: '', icon: '🏷️' })
      setShowAddCategory(false)
      setActionInProgress(null)
      alert('Kategori berhasil ditambahkan')
    }, 1500)
  }

  const handleEditCategory = () => {
    if (!editingCategory.name.trim()) {
      alert('Nama kategori tidak boleh kosong')
      return
    }

    setActionInProgress('edit-category')
    setTimeout(() => {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ))
      setEditingCategory(null)
      setActionInProgress(null)
      alert('Kategori berhasil diupdate')
    }, 1500)
  }

  const confirmDeleteCategory = (id) => {
    setShowDeletePopup(id)
  }

  const handleDeleteCategory = (id) => {
    setActionInProgress(`delete-${id}`)
    setTimeout(() => {
      setCategories(categories.filter(cat => cat.id !== id))
      setShowDeletePopup(null)
      setActionInProgress(null)
    }, 1000)
  }

  const handleToggleStatus = (id) => {
    setActionInProgress(`status-${id}`)
    setTimeout(() => {
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' } : cat
      ))
      setActionInProgress(null)
    }, 1000)
  }

  const handleBulkActivate = () => {
    setActionInProgress('bulk-activate')
    setTimeout(() => {
      const selected = selectedCategories.length > 0 ? selectedCategories : filteredCategories.map(c => c.id)
      setCategories(categories.map(category => 
        selected.includes(category.id) ? { ...category, status: 'active' } : category
      ))
      setSelectedCategories([])
      setActionInProgress(null)
      setShowBulkActionsPopup(false)
    }, 2000)
  }

  const handleBulkDeactivate = () => {
    setActionInProgress('bulk-deactivate')
    setTimeout(() => {
      const selected = selectedCategories.length > 0 ? selectedCategories : filteredCategories.map(c => c.id)
      setCategories(categories.map(category => 
        selected.includes(category.id) ? { ...category, status: 'inactive' } : category
      ))
      setSelectedCategories([])
      setActionInProgress(null)
      setShowBulkActionsPopup(false)
    }, 2000)
  }

  const handleExport = () => {
    setShowExportPopup(true)
  }

  const handleExportConfirm = () => {
    setActionInProgress('export')
    setTimeout(() => {
      setShowExportPopup(false)
      setActionInProgress(null)
      alert('Export data kategori berhasil!')
    }, 2000)
  }

  const toggleSelectCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id))
    } else {
      setSelectedCategories([...selectedCategories, id])
    }
  }

  const selectAllFiltered = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(filteredCategories.map(c => c.id))
    }
  }

  const stats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.status === 'active').length,
    totalArtworksInCategories: categories.reduce((sum, cat) => sum + cat.artworkCount, 0),
    popularCategory: categories.reduce((max, cat) => cat.artworkCount > max.artworkCount ? cat : max, categories[0])
  }

  const iconOptions = ['🎨', '📸', '✏️', '🎮', '🎬', '🖌️', '📐', '✍️', '🏷️', '📌', '📍', '🔖', '⭐', '🌟', '💫', '✨']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#083552] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Categories Data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Kategori - Admin ParamadinaVerse</title>
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          
          @keyframes checkmark {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out forwards;
          }
          
          .animate-slideUp {
            animation: slideUp 0.3s ease-out forwards;
          }
          
          .animate-slideDown {
            animation: slideDown 0.3s ease-out forwards;
          }
          
          .animate-pulse-once {
            animation: pulse 0.5s ease-out;
          }
          
          .animate-bounce-once {
            animation: bounce 0.5s ease-out;
          }
          
          .animate-checkmark {
            animation: checkmark 0.3s ease-out forwards;
          }
          
          .hover-scale {
            transition: transform 0.3s ease-out;
          }
          
          .hover-scale:hover {
            transform: scale(1.02);
          }
          
          .active-scale {
            transition: transform 0.1s ease-out;
          }
          
          .active-scale:active {
            transform: scale(0.95);
          }
          
          .checkbox-animate {
            transition: all 0.2s ease-out;
          }
          
          .checkbox-animate:checked {
            transform: scale(1.1);
          }
        `}</style>
      </Head>
      
      <AdminLayout>
        {/* Hero Section */}
        <div 
          className="relative text-white py-8 md:py-12 px-4 mb-6 rounded-b-2xl shadow-lg animate-fadeIn"
          style={{ background: colors.greenGradient }}
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-slideDown" style={{animationDelay: '0.1s'}}>
                  Kelola Kategori
                </h1>
                <p className="text-green-100 text-sm md:text-base animate-fadeIn" style={{animationDelay: '0.2s'}}>
                  Kelola kategori untuk pengorganisasian karya
                </p>
                <div className="flex items-center mt-3 space-x-2">
                  {[
                    { label: `Total: ${stats.totalCategories}`, color: 'bg-green-700', delay: '0.3s' },
                    { label: `Aktif: ${stats.activeCategories}`, color: 'bg-teal-600', delay: '0.4s' },
                    { label: `Karya: ${stats.totalArtworksInCategories}`, color: 'bg-emerald-600', delay: '0.5s' }
                  ].map((badge, index) => (
                    <span 
                      key={index}
                      className={`${badge.color} px-2 md:px-3 py-1 rounded-full text-xs md:text-sm animate-fadeIn hover-scale active-scale transform`}
                      style={{ animationDelay: badge.delay }}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
                <button 
                  onClick={confirmLogout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/30 hover-scale active-scale animate-fadeIn"
                  style={{animationDelay: '0.6s'}}
                >
                  Logout
                </button>
                <button 
                  onClick={() => setShowAddCategory(true)}
                  className="bg-white hover:bg-white/90 text-green-900 px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 shadow-lg hover-scale active-scale animate-fadeIn"
                  style={{animationDelay: '0.7s'}}
                >
                  + Tambah Kategori
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {[
              { 
                title: "Total Kategori", 
                value: stats.totalCategories, 
                icon: "📂", 
                color: "from-green-500 to-emerald-500",
                subtitle: `${stats.activeCategories} aktif`,
                delay: "0.1s"
              },
              { 
                title: "Karya Terkategori", 
                value: stats.totalArtworksInCategories, 
                icon: "🖼️", 
                color: "from-blue-500 to-indigo-500",
                subtitle: "Dalam kategori",
                delay: "0.2s"
              },
              { 
                title: "Kategori Terpopuler", 
                value: stats.popularCategory?.name || "Digital Art", 
                icon: stats.popularCategory?.icon || "🎨", 
                color: "from-purple-500 to-pink-500",
                subtitle: `${stats.popularCategory?.artworkCount || 87} karya`,
                delay: "0.3s"
              },
              { 
                title: "Rata-rata Karya", 
                value: Math.round(stats.totalArtworksInCategories / stats.totalCategories), 
                icon: "📊", 
                color: "from-amber-500 to-orange-500",
                subtitle: "Per kategori",
                delay: "0.4s"
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${stat.color} text-white p-3 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fadeIn`}
                style={{ animationDelay: stat.delay }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="opacity-90 text-xs md:text-sm font-medium">{stat.title}</p>
                    <p className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 p-1.5 md:p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <span className="text-lg md:text-2xl">{stat.icon}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-4">
                  <span className="text-white/80 text-xs md:text-sm">{stat.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Add */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-100 animate-scaleIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Kelola Kategori</h2>
                <p className="text-gray-600 text-sm">Cari dan kelola kategori platform</p>
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0 animate-fadeIn" style={{animationDelay: '0.5s'}}>
                  <input
                    type="text"
                    placeholder="Cari kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 md:pl-10 pr-3 md:pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm hover-scale transition-all"
                  />
                  <div className="absolute left-2.5 md:left-3 top-2.5 text-gray-400">
                    🔍
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowAddCategory(true)}
                  className="px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover-scale active-scale animate-fadeIn"
                  style={{animationDelay: '0.6s'}}
                >
                  + Tambah Kategori
                </button>
              </div>
            </div>

            {/* Selection Info */}
            {selectedCategories.length > 0 && (
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-checkmark">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">
                        {selectedCategories.length} kategori terpilih
                      </p>
                      <p className="text-green-600 text-xs">Klik untuk batalkan pilihan</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkActivate}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-all duration-300 hover-scale active-scale"
                    >
                      Aktifkan Semua
                    </button>
                    <button
                      onClick={handleBulkDeactivate}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all duration-300 hover-scale active-scale"
                    >
                      Nonaktifkan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 animate-fadeIn" style={{animationDelay: '0.7s'}}>
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                          onChange={selectAllFiltered}
                          className="mr-2 checkbox-animate"
                        />
                        Kategori
                      </div>
                    </th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Deskripsi</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Karya</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Status</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, index) => (
                    <tr 
                      key={category.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1 + 0.8}s` }}
                    >
                      <td className="py-3 px-3 md:px-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleSelectCategory(category.id)}
                            className="mr-3 checkbox-animate hover-scale"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                              {category.icon}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm md:text-base">{category.name}</p>
                              <p className="text-gray-500 text-xs">ID: #{category.id}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 md:px-6">
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </td>
                      <td className="py-3 px-3 md:px-6">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-800 text-sm md:text-base">{category.artworkCount}</span>
                          <span className="text-gray-500 text-xs ml-1">karya</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 md:px-6">
                        <button 
                          onClick={() => handleToggleStatus(category.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium animate-pulse-once ${
                            category.status === 'active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } hover-scale active-scale transition-all`}
                          disabled={actionInProgress === `status-${category.id}`}
                        >
                          {actionInProgress === `status-${category.id}` ? (
                            <div className="flex items-center">
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                              Processing...
                            </div>
                          ) : category.status === 'active' ? (
                            'Aktif'
                          ) : (
                            'Nonaktif'
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-3 md:px-6">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setEditingCategory(category)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => confirmDeleteCategory(category.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale"
                          >
                            Hapus
                          </button>
                          <Link href={`/admin/artworks?category=${category.id}`}>
                            <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale">
                              Lihat Karya
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 mt-4 md:mt-6 animate-fadeIn" style={{animationDelay: '0.9s'}}>
              <div className="text-gray-600 text-sm md:text-base text-center md:text-left">
                Menampilkan <span className="font-bold">{filteredCategories.length}</span> dari <span className="font-bold">{categories.length}</span> kategori
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                {['←', '1', '2', '3', '→'].map((btn, index) => (
                  <button 
                    key={index}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm hover-scale active-scale transition-all ${
                      btn === '1' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (btn === '1') {
                        alert('Halaman 1')
                      }
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-6 rounded-2xl border border-green-100 animate-fadeIn hover-scale transition-all" style={{animationDelay: '1s'}}>
              <h3 className="font-bold text-gray-800 mb-2 md:mb-4 text-sm md:text-base">Bulk Actions</h3>
              <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">Kelola beberapa kategori sekaligus</p>
              <button 
                onClick={() => setShowBulkActionsPopup(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs md:text-sm"
              >
                Bulk Actions
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6 rounded-2xl border border-blue-100 animate-fadeIn hover-scale transition-all" style={{animationDelay: '1.1s'}}>
              <h3 className="font-bold text-gray-800 mb-2 md:mb-4 text-sm md:text-base">Export Data</h3>
              <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">Export data kategori ke berbagai format</p>
              <button 
                onClick={handleExport}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs md:text-sm"
              >
                Export Data
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 md:p-6 rounded-2xl border border-purple-100 animate-fadeIn hover-scale transition-all" style={{animationDelay: '1.2s'}}>
              <h3 className="font-bold text-gray-800 mb-2 md:mb-4 text-sm md:text-base">Analisis Kategori</h3>
              <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                <span className="px-2 py-0.5 md:px-3 md:py-1 bg-green-100 text-green-800 rounded-full text-xs animate-bounce-once">
                  Populer: {stats.popularCategory?.name}
                </span>
                <span className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-100 text-blue-800 rounded-full text-xs animate-bounce-once" style={{animationDelay: '0.1s'}}>
                  Rata-rata: {Math.round(stats.totalArtworksInCategories / stats.totalCategories)} karya
                </span>
              </div>
              <Link href="/admin/reports">
                <button 
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs md:text-sm"
                  onClick={() => alert('Mengarahkan ke laporan...')}
                >
                  Lihat Analitik
                </button>
              </Link>
            </div>
          </div>

          {/* Category Insights */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-scaleIn" style={{animationDelay: '1.3s'}}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Insight Kategori</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Kategori Terpopuler</h4>
                <div className="space-y-3">
                  {categories
                    .sort((a, b) => b.artworkCount - a.artworkCount)
                    .slice(0, 5)
                    .map((category, index) => (
                      <div 
                        key={category.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover-scale transition-all animate-fadeIn"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            {category.icon}
                          </div>
                          <span className="font-medium text-gray-800">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-600">{category.artworkCount}</span>
                          <span className="text-xs text-gray-500 ml-1">karya</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Rekomendasi</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 animate-fadeIn" style={{animationDelay: '0.1s'}}>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      💡
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800">Tambahkan Subkategori</h5>
                      <p className="text-gray-600 text-sm">Pertimbangkan untuk menambahkan subkategori pada kategori populer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      🔄
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800">Review Kategori</h5>
                      <p className="text-gray-600 text-sm">Review kategori dengan karya sedikit, pertimbangkan untuk merge</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 animate-fadeIn" style={{animationDelay: '0.3s'}}>
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      📊
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800">Analisis Trend</h5>
                      <p className="text-gray-600 text-sm">Kategori 3D Modeling menunjukkan pertumbuhan cepat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-slideUp">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#083552] to-[#1276B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">👋</span>
                           </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Keluar dari Admin?</h3>
              <p className="text-gray-600 mb-8">
                Anda akan logout dari panel admin. Yakin ingin melanjutkan?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelLogout}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-all duration-300 hover-scale active-scale"
                >
                  Batal
                </button>
                <button
                  onClick={executeLogout}
                  className="px-6 py-3 bg-gradient-to-r from-[#083552] to-[#1276B5] text-white hover:opacity-90 rounded-xl font-medium transition-all duration-300 hover-scale active-scale"
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Popup */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md mx-4 w-full animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Tambah Kategori Baru</h3>
              <button
                onClick={() => setShowAddCategory(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl hover-scale transition-all"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover-scale transition-all"
                  placeholder="Masukkan nama kategori"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover-scale transition-all"
                  rows="3"
                  placeholder="Masukkan deskripsi kategori"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pilih Icon
                </label>
                <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                  {iconOptions.map((icon, index) => (
                    <button
                      key={index}
                      onClick={() => setNewCategory({...newCategory, icon})}
                      className={`w-10 h-10 text-lg rounded-lg border-2 flex items-center justify-center hover-scale active-scale transition-all ${
                        newCategory.icon === icon 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowAddCategory(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-300 hover-scale active-scale"
              >
                Batal
              </button>
              <button
                onClick={handleAddCategory}
                disabled={actionInProgress === 'add-category'}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-300 hover-scale active-scale disabled:opacity-50"
              >
                {actionInProgress === 'add-category' ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Menambahkan...
                  </div>
                ) : (
                  'Tambah Kategori'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Popup */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md mx-4 w-full animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Edit Kategori</h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl hover-scale transition-all"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover-scale transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover-scale transition-all"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pilih Icon
                </label>
                <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                  {iconOptions.map((icon, index) => (
                    <button
                      key={index}
                      onClick={() => setEditingCategory({...editingCategory, icon})}
                      className={`w-10 h-10 text-lg rounded-lg border-2 flex items-center justify-center hover-scale active-scale transition-all ${
                        editingCategory.icon === icon 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-5 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-300 hover-scale active-scale"
              >
                Batal
              </button>
              <button
                onClick={handleEditCategory}
                disabled={actionInProgress === 'edit-category'}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 hover-scale active-scale disabled:opacity-50"
              >
                {actionInProgress === 'edit-category' ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Memperbarui...
                  </div>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-slideUp">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Hapus Kategori?</h3>
              <p className="text-gray-600 mb-8">
                Kategori yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeletePopup(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-all duration-300 hover-scale active-scale"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteCategory(showDeletePopup)}
                  disabled={actionInProgress === `delete-${showDeletePopup}`}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 rounded-xl font-medium transition-all duration-300 hover-scale active-scale disabled:opacity-50"
                >
                  {actionInProgress === `delete-${showDeletePopup}` ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menghapus...
                    </div>
                  ) : (
                    'Ya, Hapus'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Popup */}
      {showBulkActionsPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Bulk Actions</h3>
              <button
                onClick={() => setShowBulkActionsPopup(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl hover-scale transition-all"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {selectedCategories.length > 0 
                      ? `${selectedCategories.length} kategori terpilih` 
                      : `${filteredCategories.length} kategori akan diproses`}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {selectedCategories.length > 0 
                      ? 'Hanya kategori yang dipilih akan diproses' 
                      : 'Semua kategori di halaman ini akan diproses'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleBulkActivate}
                  disabled={actionInProgress === 'bulk-activate'}
                  className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-300 hover-scale active-scale disabled:opacity-50 flex items-center justify-center"
                >
                  {actionInProgress === 'bulk-activate' ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Mengaktifkan...
                    </div>
                  ) : (
                    <>
                      <span className="mr-2">✓</span>
                      Aktifkan Kategori Terpilih
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleBulkDeactivate}
                  disabled={actionInProgress === 'bulk-deactivate'}
                  className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-300 hover-scale active-scale disabled:opacity-50 flex items-center justify-center"
                >
                  {actionInProgress === 'bulk-deactivate' ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menonaktifkan...
                    </div>
                  ) : (
                    <>
                      <span className="mr-2">✗</span>
                      Nonaktifkan Kategori Terpilih
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowBulkActionsPopup(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-300 hover-scale active-scale"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Popup */}
      {showExportPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Export Data Kategori</h3>
              <button
                onClick={() => setShowExportPopup(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl hover-scale transition-all"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover-scale transition-all cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-lg">📊</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">CSV Format</h4>
                    <p className="text-gray-600 text-sm">Data tabel dalam format CSV</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover-scale transition-all cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-green-600 text-lg">📈</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Excel Format</h4>
                    <p className="text-gray-600 text-sm">File Excel dengan lembar kerja</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover-scale transition-all cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-purple-600 text-lg">📋</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">JSON Format</h4>
                    <p className="text-gray-600 text-sm">Data mentah dalam format JSON</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowExportPopup(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-300 hover-scale active-scale"
              >
                Batal
              </button>
              <button
                onClick={handleExportConfirm}
                disabled={actionInProgress === 'export'}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 hover-scale active-scale disabled:opacity-50"
              >
                {actionInProgress === 'export' ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Mengekspor...
                  </div>
                ) : (
                  'Export Data'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <AdminFooter />
    </>
  )
}