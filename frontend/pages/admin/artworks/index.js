import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AdminFooter from '../../../components/layout/AdminFooter'
import Link from 'next/link'

export default function AdminArtworks() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [artworks, setArtworks] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [showApprovePopup, setShowApprovePopup] = useState(null)
  const [showRejectPopup, setShowRejectPopup] = useState(null)
  const [showDeletePopup, setShowDeletePopup] = useState(null)
  const [showExportPopup, setShowExportPopup] = useState(false)
  const [showBulkActionsPopup, setShowBulkActionsPopup] = useState(false)
  const [actionInProgress, setActionInProgress] = useState(null)
  const [selectedArtworks, setSelectedArtworks] = useState([])
  const [reviewNotes, setReviewNotes] = useState('')
  const router = useRouter()

  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)',
    purpleGradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    return userData?.token ? { 'Authorization': `Bearer ${userData.token}` } : {}
  }

  const fetchArtworks = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/karya`,
        {
          headers: {
            ...getAuthHeader(),
          }
        }
      )
      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      setArtworks(data)
    } catch (err) {
      console.error('Gagal ambil artworks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus, notes = '') => {
    setActionInProgress(`status-${id}-${newStatus}`)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/karya/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            status: newStatus,
          })
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      fetchArtworks()
    } catch (err) {
      console.error('Gagal update status:', err)
      alert('Gagal mengupdate status karya: ' + err.message)
    } finally {
      setActionInProgress(null)
      setShowApprovePopup(null)
      setShowRejectPopup(null)
      setReviewNotes('')
    }
  }

  const handleDelete = async (id) => {
    setActionInProgress(`delete-${id}`)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/karya/${id}`,
        {
          method: 'DELETE',
          headers: {
            ...getAuthHeader(),
          }
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      fetchArtworks()
    } catch (err) {
      console.error('Gagal hapus karya:', err)
      alert('Gagal menghapus karya: ' + err.message)
    } finally {
      setActionInProgress(null)
      setShowDeletePopup(null)
    }
  }

  const handleBulkAction = async (newStatus) => {
    const actionKey = `bulk-${newStatus}`
    setActionInProgress(actionKey)

    try {
      const targets = selectedArtworks.length > 0
        ? selectedArtworks
        : filteredArtworks.map(a => a._id)

      await Promise.all(
        targets.map(id =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/karya/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader(),
            },
            body: JSON.stringify({ status: newStatus })
          })
        )
      )

      fetchArtworks()
      setSelectedArtworks([])
    } catch (err) {
      console.error(`Gagal bulk ${newStatus}:`, err)
      alert(`Gagal memproses beberapa karya`)
    } finally {
      setActionInProgress(null)
      setShowBulkActionsPopup(false)
    }
  }

  const handleBulkApprove = () => handleBulkAction('approved')
  const handleBulkReject = () => handleBulkAction('rejected')

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')

    if (!userData || userData.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    setUser(userData)
    fetchArtworks()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const confirmLogout = () => setShowLogoutPopup(true)
  const cancelLogout = () => setShowLogoutPopup(false)
  const executeLogout = () => { handleLogout(); setShowLogoutPopup(false) }

  const filteredArtworks = artworks.filter(artwork => {
    if (filter !== 'all' && artwork.status !== filter) return false

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchTitle    = artwork.title?.toLowerCase().includes(q)
      const matchName     = artwork.user?.name?.toLowerCase().includes(q)
      const matchCategory = artwork.category?.toLowerCase().includes(q)
      if (!matchTitle && !matchName && !matchCategory) return false
    }

    return true
  })

  const confirmDelete = (id) => setShowDeletePopup(id)

  const handleExport = () => setShowExportPopup(true)

  const handleExportConfirm = () => {
    setActionInProgress('export')
    setTimeout(() => {
      setShowExportPopup(false)
      setActionInProgress(null)
      alert('Export berhasil! File akan didownload otomatis.')
    }, 2000)
  }

  const toggleSelectArtwork = (id) => {
    if (selectedArtworks.includes(id)) {
      setSelectedArtworks(selectedArtworks.filter(i => i !== id))
    } else {
      setSelectedArtworks([...selectedArtworks, id])
    }
  }

  const selectAllFiltered = () => {
    if (selectedArtworks.length === filteredArtworks.length) {
      setSelectedArtworks([])
    } else {
      setSelectedArtworks(filteredArtworks.map(a => a._id))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':  return 'bg-amber-500'
      case 'approved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      default:         return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':  return 'Menunggu Review'
      case 'approved': return 'Disetujui'
      case 'rejected': return 'Ditolak'
      default:         return status
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return '-'
    }
  }

  const stats = {
    total:    artworks.length,
    pending:  artworks.filter(a => a.status === 'pending').length,
    approved: artworks.filter(a => a.status === 'approved').length,
    rejected: artworks.filter(a => a.status === 'rejected').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#083552] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat Data Karya...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Kelola Karya - Admin ParamadinaVerse</title>
        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
          @keyframes checkmark { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
          .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
          .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
          .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
          .animate-slideDown { animation: slideDown 0.3s ease-out forwards; }
          .animate-pulse-once { animation: pulse 0.5s ease-out; }
          .animate-bounce-once { animation: bounce 0.5s ease-out; }
          .animate-checkmark { animation: checkmark 0.3s ease-out forwards; }
          .hover-scale { transition: transform 0.3s ease-out; }
          .hover-scale:hover { transform: scale(1.02); }
          .active-scale { transition: transform 0.1s ease-out; }
          .active-scale:active { transform: scale(0.95); }
          .checkbox-animate { transition: all 0.2s ease-out; }
          .checkbox-animate:checked { transform: scale(1.1); }
        `}</style>
      </Head>

      <AdminLayout>
        {/* Hero Section */}
        <div
          className="relative text-white py-8 md:py-12 px-4 mb-6 rounded-b-2xl shadow-lg animate-fadeIn"
          style={{ background: colors.purpleGradient }}
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-slideDown" style={{ animationDelay: '0.1s' }}>
                  Kelola Karya
                </h1>
                <p className="text-blue-100 text-sm md:text-base animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  Review, edit, dan hapus karya pengguna
                </p>
                <div className="flex items-center mt-3 space-x-2">
                  {[
                    { label: `Total: ${stats.total} Karya`, color: 'bg-blue-700', delay: '0.3s' },
                    { label: `Pending: ${stats.pending}`, color: 'bg-amber-600', delay: '0.4s' },
                    { label: `Approved: ${stats.approved}`, color: 'bg-green-600', delay: '0.5s' }
                  ].map((badge, i) => (
                    <span key={i} className={`${badge.color} px-2 md:px-3 py-1 rounded-full text-xs md:text-sm animate-fadeIn hover-scale active-scale`} style={{ animationDelay: badge.delay }}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 md:mt-0 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                <button onClick={confirmLogout} className="bg-white/20 hover:bg-white/30 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/30 hover-scale active-scale">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {[
              { title: "Total Karya", value: stats.total, icon: "🖼️", color: "from-blue-500 to-indigo-500", subtitle: "Semua kategori", delay: "0.1s" },
              { title: "Menunggu Review", value: stats.pending, icon: "⚠️", color: "from-amber-500 to-orange-500", action: () => setFilter('pending'), delay: "0.2s" },
              { title: "Disetujui", value: stats.approved, icon: "✅", color: "from-green-500 to-teal-500", subtitle: "Karya aktif", delay: "0.3s" },
              { title: "Ditolak", value: stats.rejected, icon: "❌", color: "from-red-500 to-pink-500", subtitle: "Tidak lolos", delay: "0.4s" }
            ].map((stat, i) => (
              <div key={i} className={`bg-gradient-to-br ${stat.color} text-white p-3 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fadeIn`} style={{ animationDelay: stat.delay }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="opacity-90 text-xs md:text-sm font-medium">{stat.title}</p>
                    <p className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 p-1.5 md:p-3 rounded-xl"><span className="text-lg md:text-2xl">{stat.icon}</span></div>
                </div>
                <div className="mt-2 md:mt-4">
                  {stat.action ? (
                    <button onClick={stat.action} className="bg-white/20 hover:bg-white/30 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 hover-scale active-scale">
                      Review Sekarang
                    </button>
                  ) : (
                    <span className="text-white/80 text-xs md:text-sm">{stat.subtitle}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-100 animate-scaleIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Daftar Karya</h2>
                <p className="text-gray-600 text-sm">Kelola semua karya yang diupload oleh pengguna</p>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                  <input
                    type="text"
                    placeholder="Cari karya, penulis, atau kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 md:pl-10 pr-3 md:pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div className="absolute left-2.5 md:left-3 top-2.5 text-gray-400">🔍</div>
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu Review</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>

                <button
                  className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium text-sm hover-scale active-scale"
                  onClick={fetchArtworks}
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Selection Info */}
            {selectedArtworks.length > 0 && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 animate-checkmark">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">{selectedArtworks.length} karya terpilih</p>
                      <p className="text-blue-600 text-xs">Klik checkbox untuk batalkan pilihan</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleBulkApprove} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-all duration-300 hover-scale active-scale">
                      {actionInProgress === 'bulk-approved' ? 'Memproses...' : 'Setujui Semua'}
                    </button>
                    <button onClick={handleBulkReject} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all duration-300 hover-scale active-scale">
                      {actionInProgress === 'bulk-rejected' ? 'Memproses...' : 'Tolak Semua'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Artworks Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedArtworks.length === filteredArtworks.length && filteredArtworks.length > 0}
                          onChange={selectAllFiltered}
                          className="mr-2 checkbox-animate"
                        />
                        Karya
                      </div>
                    </th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Pembuat</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Kategori</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Status</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Tanggal</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Interaksi</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArtworks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        {searchQuery ? 'Tidak ada karya yang cocok dengan pencarian' : 'Belum ada data karya'}
                      </td>
                    </tr>
                  ) : (
                    filteredArtworks.map((artwork, index) => (
                      <tr
                        key={artwork._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-fadeIn"
                        style={{ animationDelay: `${index * 0.05 + 0.9}s` }}
                      >
                        <td className="py-3 px-3 md:px-6">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedArtworks.includes(artwork._id)}
                              onChange={() => toggleSelectArtwork(artwork._id)}
                              className="mr-3 checkbox-animate"
                            />
                            <div className="flex items-center">
                              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3 md:mr-4">
                                {artwork.image
                                  ? <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover rounded-lg" />
                                  : <span className="text-lg md:text-xl">🖼️</span>
                                }
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm md:text-base">{artwork.title || 'Tanpa Judul'}</p>
                                <p className="text-gray-500 text-xs">ID: {artwork._id}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 md:px-6">
                          <p className="font-medium text-gray-800 text-sm md:text-base">{artwork.user?.name || 'Tidak diketahui'}</p>
                          <p className="text-gray-500 text-xs">{artwork.user?.email || ''}</p>
                        </td>
                        <td className="py-3 px-3 md:px-6">
                          <span className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {artwork.category || 'Tidak ada kategori'}
                          </span>
                        </td>
                        <td className="py-3 px-3 md:px-6">
                          <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium ${getStatusColor(artwork.status)} text-white`}>
                            {getStatusText(artwork.status)}
                          </span>
                        </td>
                        <td className="py-3 px-3 md:px-6 text-gray-600 text-sm">
                          {formatDate(artwork.created_at)}
                        </td>
                        <td className="py-3 px-3 md:px-6">
                          <div className="flex items-center space-x-2 md:space-x-4">
                            <div className="flex items-center">
                              <span className="text-red-500 mr-1 text-sm">❤️</span>
                              <span className="text-xs md:text-sm">{artwork.likes || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-blue-500 mr-1 text-sm">💬</span>
                              <span className="text-xs md:text-sm">{artwork.comments || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-1 text-sm">👁️</span>
                              <span className="text-xs md:text-sm">{artwork.views || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 md:px-6">
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            <Link href={`/admin/review/${artwork._id}`}>
                              <button className="px-2 md:px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap">
                                Detail
                              </button>
                            </Link>

                            {artwork.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => setShowApprovePopup(artwork._id)}
                                  className="px-2 md:px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => setShowRejectPopup(artwork._id)}
                                  className="px-2 md:px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap"
                                >
                                  Tolak
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => confirmDelete(artwork._id)}
                              className="px-2 md:px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination info */}
            <div className="flex justify-between items-center mt-4 md:mt-6">
              <div className="text-gray-600 text-sm md:text-base">
                Menampilkan <span className="font-bold">{filteredArtworks.length}</span> dari <span className="font-bold">{artworks.length}</span> karya
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6 rounded-2xl border border-blue-100 animate-fadeIn hover-scale transition-all">
              <h3 className="font-bold text-gray-800 mb-2 md:mb-4 text-sm md:text-base">Export Data</h3>
              <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">Export semua data karya ke format Excel atau CSV</p>
              <button onClick={handleExport} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs md:text-sm">
                Export Semua Karya
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 md:p-6 rounded-2xl border border-green-100 animate-fadeIn hover-scale transition-all">
              <h3 className="font-bold text-gray-800 mb-2 md:mb-4 text-sm md:text-base">Bulk Actions</h3>
              <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">Kelola beberapa karya sekaligus. Pilih karya di tabel terlebih dahulu.</p>
              <div className="flex gap-1 md:gap-2">
                <button
                  onClick={handleBulkApprove}
                  disabled={!!actionInProgress}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs"
                >
                  {actionInProgress === 'bulk-approved' ? 'Memproses...' : 'Setujui Terpilih'}
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={!!actionInProgress}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs"
                >
                  {actionInProgress === 'bulk-rejected' ? 'Memproses...' : 'Tolak Terpilih'}
                </button>
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
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Keluar Akun Admin?</h3>
              <p className="text-gray-600 mb-8">Apakah Anda yakin ingin logout dari akun Administrator?</p>
              <div className="flex space-x-4">
                <button onClick={cancelLogout} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale">Batal</button>
                <button onClick={executeLogout} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#083552] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale shadow-lg">Ya, Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Popup */}
      {showApprovePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Setujui Karya?</h3>
              <p className="text-gray-600 mb-6">Karya ini akan ditampilkan di galeri publik.</p>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-6 text-sm"
                rows="3"
                placeholder="Tambahkan catatan untuk penulis (opsional)..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => { setShowApprovePopup(null); setReviewNotes('') }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale"
                >Batal</button>
                <button
                  onClick={() => handleStatusChange(showApprovePopup, 'approved', reviewNotes)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === `status-${showApprovePopup}-approved`
                    ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Memproses...</div>
                    : 'Setujui'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Popup */}
      {showRejectPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">❌</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Tolak Karya?</h3>
              <p className="text-gray-600 mb-6">Karya ini tidak akan ditampilkan di galeri.</p>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6 text-sm"
                rows="3"
                placeholder="Alasan penolakan (wajib)..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                required
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => { setShowRejectPopup(null); setReviewNotes('') }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale"
                >Batal</button>
                <button
                  onClick={() => {
                    if (!reviewNotes.trim()) { alert('Harap masukkan alasan penolakan'); return }
                    handleStatusChange(showRejectPopup, 'rejected', reviewNotes)
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === `status-${showRejectPopup}-rejected`
                    ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Memproses...</div>
                    : 'Tolak'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Hapus Karya?</h3>
              <p className="text-gray-600 mb-8">Apakah Anda yakin ingin menghapus karya ini? Aksi ini tidak dapat dibatalkan.</p>
              <div className="flex space-x-4">
                <button onClick={() => setShowDeletePopup(null)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale">Batal</button>
                <button
                  onClick={() => handleDelete(showDeletePopup)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === `delete-${showDeletePopup}`
                    ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Menghapus...</div>
                    : 'Hapus'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Popup */}
      {showExportPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Export Data</h3>
              <p className="text-gray-600 mb-6">Pilih format untuk export data karya</p>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'excel', label: 'Excel (.xlsx)', icon: '📗', defaultChecked: true },
                  { id: 'csv', label: 'CSV (.csv)', icon: '📄' },
                  { id: 'pdf', label: 'PDF (.pdf)', icon: '📕' },
                ].map(opt => (
                  <div key={opt.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                    <input type="radio" id={opt.id} name="exportFormat" className="mr-3" defaultChecked={opt.defaultChecked} />
                    <label htmlFor={opt.id} className="flex items-center cursor-pointer">
                      <span className="mr-2">{opt.icon}</span><span>{opt.label}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setShowExportPopup(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale">Batal</button>
                <button onClick={handleExportConfirm} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale">
                  {actionInProgress === 'export'
                    ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Mengexport...</div>
                    : 'Export'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminFooter />
    </>
  )
}