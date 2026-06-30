import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AdminFooter from '../../../components/layout/AdminFooter'
import Link from 'next/link'

export default function AdminUsers() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [showEditPopup, setShowEditPopup] = useState(null)
  const [showDeletePopup, setShowDeletePopup] = useState(null)
  const [showNotificationPopup, setShowNotificationPopup] = useState(null)
  const [showAddAdminPopup, setShowAddAdminPopup] = useState(false)
  const [showImportPopup, setShowImportPopup] = useState(false)
  const [actionInProgress, setActionInProgress] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [notifMessage, setNotifMessage] = useState('')
  const router = useRouter()

  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    return userData?.token ? { 'Authorization': `Bearer ${userData.token}` } : {}
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          headers: {
            ...getAuthHeader(),
          }
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setUsers(data)
    } catch (err) {
      console.error('Gagal ambil users:', err)
      alert('Gagal memuat data pengguna: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')

    if (!userData || userData.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    setUser(userData)
    fetchUsers()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const confirmLogout = () => setShowLogoutPopup(true)
  const cancelLogout = () => setShowLogoutPopup(false)
  const executeLogout = () => { handleLogout(); setShowLogoutPopup(false) }

  const filteredUsers = users.filter(u => {
    if (filter === 'admin' && u.role !== 'admin') return false
    if (filter === 'mahasiswa' && u.role !== 'mahasiswa') return false

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false
    }

    return true
  })

  const handleRoleChange = async (id, newRole) => {
    setActionInProgress(`role-${id}`)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({ role: newRole })
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error('Gagal update role:', err)
      alert('Gagal mengubah role: ' + err.message)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleDelete = async (id) => {
    setActionInProgress(`delete-${id}`)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        {
          method: 'DELETE',
          headers: {
            ...getAuthHeader(),
          }
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setUsers(users.filter(u => u._id !== id))
      setShowDeletePopup(null)
    } catch (err) {
      console.error('Gagal hapus user:', err)
      alert('Gagal menghapus user: ' + err.message)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleEditUser = (u) => {
    setEditForm({ name: u.name, email: u.email })
    setShowEditPopup(u._id)
  }

  const handleSaveEdit = async (id) => {
    setActionInProgress(`edit-${id}`)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({ username: editForm.name })
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      await fetchUsers()
      setShowEditPopup(null)
    } catch (err) {
      console.error('Gagal edit user:', err)
      alert('Gagal menyimpan perubahan: ' + err.message)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleSendNotificationConfirm = (id) => {
    setActionInProgress(`notif-${id}`)
    setTimeout(() => {
      alert(`Notifikasi berhasil dikirim ke user`)
      setShowNotificationPopup(null)
      setNotifMessage('')
      setActionInProgress(null)
    }, 1000)
  }

  const confirmDelete = (id) => setShowDeletePopup(id)

  const getStatusColor = () => 'bg-green-500'

  const getRoleColor = (role) => role === 'admin' ? 'bg-blue-500' : 'bg-green-500'
  const getRoleText = (role) => role === 'admin' ? 'Admin' : 'Mahasiswa'

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    mahasiswa: users.filter(u => u.role === 'mahasiswa').length,
    totalKarya: users.reduce((sum, u) => sum + (u.artworks || 0), 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#083552] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat Data Pengguna...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Kelola Pengguna - Admin ParamadinaVerse</title>
        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
          .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
          .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
          .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
          .animate-slideDown { animation: slideDown 0.3s ease-out forwards; }
          .animate-pulse-once { animation: pulse 0.5s ease-out; }
          .animate-bounce-once { animation: bounce 0.5s ease-out; }
          .hover-scale { transition: transform 0.3s ease-out; }
          .hover-scale:hover { transform: scale(1.02); }
          .active-scale { transition: transform 0.1s ease-out; }
          .active-scale:active { transform: scale(0.95); }
        `}</style>
      </Head>

      <AdminLayout>
        {/* Hero Section */}
        <div
          className="relative text-white py-8 md:py-12 px-4 mb-6 rounded-b-2xl shadow-lg animate-fadeIn"
          style={{ background: colors.gradient }}
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-slideDown" style={{ animationDelay: '0.1s' }}>
                  Kelola Pengguna
                </h1>
                <p className="text-blue-100 text-sm md:text-base animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  Kelola semua pengguna admin dan mahasiswa
                </p>
                <div className="flex items-center mt-3 space-x-2">
                  {[
                    { label: `Total: ${stats.total} User`, color: 'bg-blue-700', delay: '0.3s' },
                    { label: `Admin: ${stats.admin}`, color: 'bg-indigo-600', delay: '0.4s' },
                    { label: `Mahasiswa: ${stats.mahasiswa}`, color: 'bg-green-600', delay: '0.5s' }
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
              { title: "Total Pengguna", value: stats.total, icon: "👥", color: "from-blue-500 to-blue-600", subtitle: "Semua role", delay: "0.1s" },
              { title: "Admin", value: stats.admin, icon: "👑", color: "from-indigo-500 to-purple-500", subtitle: "Akses admin", delay: "0.2s" },
              { title: "Mahasiswa", value: stats.mahasiswa, icon: "🎓", color: "from-green-500 to-teal-500", subtitle: "Pengguna aktif", delay: "0.3s" },
              { title: "Total Karya", value: stats.totalKarya, icon: "🖼️", color: "from-amber-500 to-orange-500", subtitle: "Karya disetujui", delay: "0.4s" }
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
                  <span className="text-white/80 text-xs md:text-sm">{stat.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-100 animate-scaleIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Daftar Pengguna</h2>
                <p className="text-gray-600 text-sm">Kelola semua pengguna platform</p>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                  <input
                    type="text"
                    placeholder="Cari user..."
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
                  <option value="all">Semua User</option>
                  <option value="admin">Admin</option>
                  <option value="mahasiswa">Mahasiswa</option>
                </select>

                <button
                  onClick={fetchUsers}
                  className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium text-sm hover-scale active-scale"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">User</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Email</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Role</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Bergabung</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Karya</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan="6" className="py-8 text-center text-gray-500">Tidak ada data pengguna</td></tr>
                  ) : (
                    filteredUsers.map((userItem, index) => (
                      <tr
                        key={userItem._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-fadeIn"
                        style={{ animationDelay: `${index * 0.05 + 0.9}s` }}
                      >
                        <td className="py-3 px-3 md:px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 md:mr-4 font-bold text-blue-800">
                              {userItem.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm md:text-base">{userItem.name}</p>
                              <p className="text-gray-500 text-xs">ID: {userItem._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 md:px-6">
                          <p className="font-medium text-gray-800 text-sm md:text-base">{userItem.email}</p>
                        </td>
                        <td className="py-3 px-3 md:px-6">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium ${getRoleColor(userItem.role)} text-white`}>
                              {getRoleText(userItem.role)}
                            </span>
                            {userItem.role === 'mahasiswa' && (
                              <button
                                onClick={() => handleRoleChange(userItem._id, 'admin')}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium hover-scale active-scale transition-all"
                                title="Ubah ke Admin"
                                disabled={!!actionInProgress}
                              >
                                {actionInProgress === `role-${userItem._id}`
                                  ? <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  : '⬆️'
                                }
                              </button>
                            )}
                            {userItem.role === 'admin' && (
                              <button
                                onClick={() => handleRoleChange(userItem._id, 'mahasiswa')}
                                className="text-xs text-gray-600 hover:text-gray-800 font-medium hover-scale active-scale transition-all"
                                title="Ubah ke Mahasiswa"
                                disabled={!!actionInProgress}
                              >
                                {actionInProgress === `role-${userItem._id}`
                                  ? <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                  : '⬇️'
                                }
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 md:px-6 text-gray-600 text-sm">
                          {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="py-3 px-3 md:px-6">
                          <div className="flex items-center">
                            <span className="text-blue-600 font-medium text-sm md:text-base">{userItem.totalArtwork || 0}</span>
                            <span className="text-gray-500 text-xs ml-1">karya</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 md:px-6">
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            <button
                              onClick={() => handleEditUser(userItem)}
                              className="px-2 md:px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => confirmDelete(userItem._id)}
                              className="px-2 md:px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap"
                            >
                              Hapus
                            </button>

                            <button
                              onClick={() => setShowNotificationPopup(userItem._id)}
                              className="px-2 md:px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap"
                            >
                              Notif
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
                Menampilkan <span className="font-bold">{filteredUsers.length}</span> dari <span className="font-bold">{users.length}</span> pengguna
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

      {/* Edit User Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✏️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Edit User</h3>
              <p className="text-gray-600">Edit informasi pengguna</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  value={editForm.email}
                  disabled
                  title="Email tidak dapat diubah"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowEditPopup(null)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale">Batal</button>
                <button
                  onClick={() => handleSaveEdit(showEditPopup)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === `edit-${showEditPopup}`
                    ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Menyimpan...</div>
                    : 'Simpan'
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
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Hapus User?</h3>
              <p className="text-gray-600 mb-8">Apakah Anda yakin ingin menghapus user ini? Semua karya dan notifikasinya juga akan terhapus.</p>
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

      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">📢</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Kirim Notifikasi</h3>
              <p className="text-gray-600 mb-6">Kirim notifikasi kepada user ini</p>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-6"
                rows="3"
                placeholder="Tulis pesan notifikasi..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
              />
              <div className="flex space-x-4">
                <button onClick={() => { setShowNotificationPopup(null); setNotifMessage('') }} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale">Batal</button>
                <button
                  onClick={() => handleSendNotificationConfirm(showNotificationPopup)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === `notif-${showNotificationPopup}`
                    ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Mengirim...</div>
                    : 'Kirim'
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