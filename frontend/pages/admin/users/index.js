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
  const router = useRouter()

  // Warna konsisten
  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  useEffect(() => {
    // Cek apakah user sudah login dan role admin
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (!userData || userData.role !== 'admin') {
      router.push('/auth/login')
      return
    }
    
    setUser(userData)
    // Simulasi data users
    const mockUsers = [
      { 
        id: 1, 
        name: 'Admin Utama', 
        email: 'admin@paramadina.ac.id', 
        role: 'admin', 
        joinDate: '2023-01-15',
        status: 'active',
        artworks: 0,
        lastLogin: '2024-01-15 08:30:00'
      },
      { 
        id: 2, 
        name: 'Mahasiswa 1', 
        email: 'mahasiswa1@paramadina.ac.id', 
        role: 'mahasiswa', 
        joinDate: '2024-01-10',
        status: 'active',
        artworks: 5,
        lastLogin: '2024-01-15 09:15:00'
      },
      { 
        id: 3, 
        name: 'Mahasiswa 2', 
        email: 'mahasiswa2@paramadina.ac.id', 
        role: 'mahasiswa', 
        joinDate: '2024-01-12',
        status: 'active',
        artworks: 3,
        lastLogin: '2024-01-14 14:20:00'
      },
      { 
        id: 4, 
        name: 'Mahasiswa 3', 
        email: 'mahasiswa3@paramadina.ac.id', 
        role: 'mahasiswa', 
        joinDate: '2024-01-08',
        status: 'inactive',
        artworks: 1,
        lastLogin: '2024-01-10 10:45:00'
      },
      { 
        id: 5, 
        name: 'Mahasiswa 4', 
        email: 'mahasiswa4@paramadina.ac.id', 
        role: 'mahasiswa', 
        joinDate: '2024-01-05',
        status: 'active',
        artworks: 8,
        lastLogin: '2024-01-15 11:30:00'
      },
      { 
        id: 6, 
        name: 'Mahasiswa 5', 
        email: 'mahasiswa5@paramadina.ac.id', 
        role: 'mahasiswa', 
        joinDate: '2024-01-03',
        status: 'active',
        artworks: 12,
        lastLogin: '2024-01-14 16:10:00'
      },
      { 
        id: 7, 
        name: 'Admin 2', 
        email: 'admin2@paramadina.ac.id', 
        role: 'admin', 
        joinDate: '2024-01-02',
        status: 'active',
        artworks: 0,
        lastLogin: '2024-01-15 07:45:00'
      },
      { 
        id: 8, 
        name: 'Mahasiswa 6', 
        email: 'mahasiswa6@paramadina.ac.id', 
        role: 'mahasiswa', 
        joinDate: '2024-01-01',
        status: 'inactive',
        artworks: 2,
        lastLogin: '2024-01-05 13:25:00'
      }
    ]
    setUsers(mockUsers)
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

  const filteredUsers = users.filter(user => {
    if (filter === 'admin' && user.role !== 'admin') return false
    if (filter === 'mahasiswa' && user.role !== 'mahasiswa') return false
    if (filter === 'active' && user.status !== 'active') return false
    if (filter === 'inactive' && user.status !== 'inactive') return false
    
    if (searchQuery && 
        !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })

  const handleStatusToggle = (id) => {
    setActionInProgress(`status-${id}`)
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === id ? { 
          ...user, 
          status: user.status === 'active' ? 'inactive' : 'active' 
        } : user
      ))
      setActionInProgress(null)
    }, 1000)
  }

  const confirmDelete = (id) => {
    setShowDeletePopup(id)
  }

  const handleDelete = (id) => {
    setActionInProgress(`delete-${id}`)
    setTimeout(() => {
      setUsers(users.filter(user => user.id !== id))
      setShowDeletePopup(null)
      setActionInProgress(null)
    }, 1000)
  }

  const handleRoleChange = (id, newRole) => {
    setActionInProgress(`role-${id}`)
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === id ? { ...user, role: newRole } : user
      ))
      setActionInProgress(null)
    }, 1000)
  }

  const handleEditUser = (id) => {
    setShowEditPopup(id)
  }

  const handleSaveEdit = (id, newData) => {
    setActionInProgress(`edit-${id}`)
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === id ? { ...user, ...newData } : user
      ))
      setShowEditPopup(null)
      setActionInProgress(null)
    }, 1500)
  }

  const handleSendNotification = (id) => {
    setShowNotificationPopup(id)
  }

  const handleSendNotificationConfirm = (id) => {
    setActionInProgress(`notif-${id}`)
    setTimeout(() => {
      alert(`Notifikasi berhasil dikirim ke user #${id}`)
      setShowNotificationPopup(null)
      setActionInProgress(null)
    }, 1500)
  }

  const handleAddAdmin = () => {
    setShowAddAdminPopup(true)
  }

  const handleAddAdminConfirm = () => {
    setActionInProgress('add-admin')
    setTimeout(() => {
      const newId = Math.max(...users.map(u => u.id)) + 1
      const newAdmin = {
        id: newId,
        name: 'Admin Baru',
        email: `admin${newId}@paramadina.ac.id`,
        role: 'admin',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        artworks: 0,
        lastLogin: new Date().toISOString()
      }
      setUsers([...users, newAdmin])
      setShowAddAdminPopup(false)
      setActionInProgress(null)
    }, 2000)
  }

  const handleImport = () => {
    setShowImportPopup(true)
  }

  const handleImportConfirm = () => {
    setActionInProgress('import')
    setTimeout(() => {
      setShowImportPopup(false)
      setActionInProgress(null)
      alert('Import users berhasil!')
    }, 2000)
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-500' : 'bg-red-500'
  }

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-blue-500' : 'bg-green-500'
  }

  const getStatusText = (status) => {
    return status === 'active' ? 'Aktif' : 'Nonaktif'
  }

  const getRoleText = (role) => {
    return role === 'admin' ? 'Admin' : 'Mahasiswa'
  }

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    mahasiswa: users.filter(u => u.role === 'mahasiswa').length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#083552] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Users Data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Kelola Pengguna - Admin ParamadinaVerse</title>
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
                <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-slideDown" style={{animationDelay: '0.1s'}}>
                  Kelola Pengguna
                </h1>
                <p className="text-blue-100 text-sm md:text-base animate-fadeIn" style={{animationDelay: '0.2s'}}>
                  Kelola semua pengguna admin dan mahasiswa
                </p>
                <div className="flex items-center mt-3 space-x-2">
                  {[
                    { label: `Total: ${stats.total} User`, color: 'bg-blue-700', delay: '0.3s' },
                    { label: `Admin: ${stats.admin}`, color: 'bg-indigo-600', delay: '0.4s' },
                    { label: `Mahasiswa: ${stats.mahasiswa}`, color: 'bg-green-600', delay: '0.5s' }
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
              <div className="mt-4 md:mt-0 animate-fadeIn" style={{animationDelay: '0.6s'}}>
                <button 
                  onClick={confirmLogout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/30 hover-scale active-scale"
                >
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
              { 
                title: "Total Pengguna", 
                value: stats.total, 
                icon: "👥", 
                color: "from-blue-500 to-blue-600",
                subtitle: "Semua role",
                delay: "0.1s"
              },
              { 
                title: "Admin", 
                value: stats.admin, 
                icon: "👑", 
                color: "from-indigo-500 to-purple-500",
                subtitle: "Akses admin",
                delay: "0.2s"
              },
              { 
                title: "Mahasiswa", 
                value: stats.mahasiswa, 
                icon: "🎓", 
                color: "from-green-500 to-teal-500",
                subtitle: "Pengguna aktif",
                delay: "0.3s"
              },
              { 
                title: "Aktif", 
                value: stats.active, 
                icon: "✅", 
                color: "from-amber-500 to-orange-500",
                action: () => setFilter('active'),
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
                  {stat.action ? (
                    <button 
                      onClick={stat.action}
                      className="bg-white/20 hover:bg-white/30 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 hover-scale active-scale"
                    >
                      Lihat Aktif
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
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Daftar Pengguna</h2>
                <p className="text-gray-600 text-sm">Kelola semua pengguna platform</p>
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0 animate-fadeIn" style={{animationDelay: '0.5s'}}>
                  <input
                    type="text"
                    placeholder="Cari user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 md:pl-10 pr-3 md:pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm hover-scale transition-all"
                  />
                  <div className="absolute left-2.5 md:left-3 top-2.5 text-gray-400">
                    🔍
                  </div>
                </div>
                
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm hover-scale transition-all animate-fadeIn"
                  style={{animationDelay: '0.6s'}}
                >
                  <option value="all">Semua User</option>
                  <option value="admin">Admin</option>
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
                
                <button 
                  className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium text-sm hover-scale active-scale animate-fadeIn"
                  style={{animationDelay: '0.7s'}}
                  onClick={() => {
                    alert('Filter diterapkan!')
                  }}
                >
                  Filter
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 animate-fadeIn" style={{animationDelay: '0.8s'}}>
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">User</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Email</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Role</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Status</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Bergabung</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Karya</th>
                    <th className="text-left py-3 px-3 md:px-6 text-gray-700 font-bold text-xs md:text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userItem, index) => (
                    <tr 
                      key={userItem.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1 + 0.9}s` }}
                    >
                      <td className="py-3 px-3 md:px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 md:mr-4 font-bold text-blue-800 hover-scale transition-transform">
                            {userItem.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm md:text-base">{userItem.name}</p>
                            <p className="text-gray-500 text-xs">ID: #{userItem.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 md:px-6">
                        <p className="font-medium text-gray-800 text-sm md:text-base">{userItem.email}</p>
                      </td>
                      <td className="py-3 px-3 md:px-6">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium ${getRoleColor(userItem.role)} text-white animate-pulse-once`}>
                            {getRoleText(userItem.role)}
                          </span>
                          {userItem.role === 'mahasiswa' && (
                            <button 
                              onClick={() => handleRoleChange(userItem.id, 'admin')}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium hover-scale active-scale transition-all"
                              title="Ubah ke Admin"
                              disabled={actionInProgress === `role-${userItem.id}`}
                            >
                              {actionInProgress === `role-${userItem.id}` ? (
                                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                '⬆️'
                              )}
                            </button>
                          )}
                          {userItem.role === 'admin' && userItem.id !== 1 && (
                            <button 
                              onClick={() => handleRoleChange(userItem.id, 'mahasiswa')}
                              className="text-xs text-gray-600 hover:text-gray-800 font-medium hover-scale active-scale transition-all"
                              title="Ubah ke Mahasiswa"
                              disabled={actionInProgress === `role-${userItem.id}`}
                            >
                              {actionInProgress === `role-${userItem.id}` ? (
                                <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                '⬇️'
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 md:px-6">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium ${getStatusColor(userItem.status)} text-white animate-pulse-once`}>
                            {getStatusText(userItem.status)}
                          </span>
                          <button 
                            onClick={() => handleStatusToggle(userItem.id)}
                            className="text-xs text-gray-600 hover:text-gray-800 font-medium hover-scale active-scale transition-all"
                            disabled={actionInProgress === `status-${userItem.id}`}
                          >
                            {actionInProgress === `status-${userItem.id}` ? (
                              <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : userItem.status === 'active' ? (
                              '⏸️'
                            ) : (
                              '▶️'
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 md:px-6 text-gray-600 text-sm">
                        {new Date(userItem.joinDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-3 md:px-6">
                        <div className="flex items-center">
                          <span className="text-blue-600 font-medium text-sm md:text-base">{userItem.artworks}</span>
                          <span className="text-gray-500 text-xs ml-1">karya</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 md:px-6">
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          <button 
                            onClick={() => handleEditUser(userItem.id)}
                            className="px-2 md:px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap"
                          >
                            Edit
                          </button>
                          
                          {userItem.id !== 1 && (
                            <button 
                              onClick={() => confirmDelete(userItem.id)}
                              className="px-2 md:px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap"
                            >
                              Hapus
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleSendNotification(userItem.id)}
                            className="px-2 md:px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm rounded-lg transition-all duration-300 hover-scale active-scale whitespace-nowrap"
                          >
                            Notif
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 mt-4 md:mt-6 animate-fadeIn" style={{animationDelay: '1s'}}>
              <div className="text-gray-600 text-sm md:text-base text-center md:text-left">
                Menampilkan <span className="font-bold">{filteredUsers.length}</span> dari <span className="font-bold">{users.length}</span> pengguna
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                {['←', '1', '2', '3', '→'].map((btn, index) => (
                  <button 
                    key={index}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm hover-scale active-scale transition-all ${
                      btn === '1' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' 
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6 rounded-2xl border border-blue-100 animate-fadeIn hover-scale transition-all" style={{animationDelay: '1.1s'}}>
              <h3 className="font-bold text-gray-800 mb-2 md:mb-4 text-sm md:text-base">Tambah Admin</h3>
              <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">Tambahkan admin baru untuk mengelola platform</p>
              <button 
                onClick={handleAddAdmin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs md:text-sm"
              >
                + Tambah Admin
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 md:p-6 rounded-2xl border border-green-100 animate-fadeIn hover-scale transition-all" style={{animationDelay: '1.2s'}}>
              <h3 className="font-bold text-gray-800 mb-2 md:mb-4 text-sm md:text-base">Import User</h3>
              <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">Import user dari file CSV/Excel</p>
              <div className="flex gap-1 md:gap-2">
                <button 
                  onClick={handleImport}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs"
                >
                  Import CSV
                </button>
                <button 
                  onClick={() => alert('Template downloaded!')}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs"
                >
                  Template
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 md:p-6 rounded-2xl border border-purple-100 animate-fadeIn hover-scale transition-all" style={{animationDelay: '1.3s'}}>
              <h3 className="font-bold text-gray-800 mb-2 md:mb-4 text-sm md:text-base">Statistik</h3>
              <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                {[
                  { label: `Aktif: ${stats.active}`, color: 'bg-blue-100 text-blue-800' },
                  { label: 'Baru/Bulan: 12', color: 'bg-green-100 text-green-800' },
                  { label: 'Login/Hari: 48', color: 'bg-purple-100 text-purple-800' }
                ].map((badge, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-0.5 md:px-3 md:py-1 ${badge.color} rounded-full text-xs animate-bounce-once`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
              <Link href="/admin/reports">
                <button 
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-1.5 md:py-2 rounded-lg transition-all duration-300 hover-scale active-scale text-xs md:text-sm"
                  onClick={() => alert('Mengarahkan ke laporan...')}
                >
                  Lihat Laporan
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-scaleIn" style={{animationDelay: '1.4s'}}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Aktivitas Terbaru</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[
                { icon: "👤", title: "3 User Baru", subtitle: "Minggu ini", color: "blue", delay: "0.1s" },
                { icon: "✅", title: "24 Login", subtitle: "Hari ini", color: "green", delay: "0.2s" },
                { icon: "📤", title: "8 Upload", subtitle: "24 jam", color: "amber", delay: "0.3s" },
                { icon: "📊", title: "+12% User", subtitle: "Dari bulan lalu", color: "purple", delay: "0.4s" }
              ].map((activity, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br from-${activity.color}-50 to-${activity.color}-100 p-3 md:p-5 rounded-xl hover-scale transition-all animate-fadeIn`}
                  style={{ animationDelay: activity.delay }}
                >
                  <div className="flex items-center mb-2 md:mb-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 bg-${activity.color}-500 rounded-lg flex items-center justify-center mr-2 md:mr-3 group-hover:scale-110 transition-transform`}>
                      <span className="text-white text-sm">{activity.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm md:text-base">{activity.title}</p>
                      <p className="text-gray-600 text-xs md:text-sm">{activity.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
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
              <p className="text-gray-600 mb-8">
                Apakah Anda yakin ingin logout dari akun Administrator?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale"
                >
                  Batal
                </button>
                <button
                  onClick={executeLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#083552] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale shadow-lg"
                >
                  Ya, Logout
                </button>
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
                  defaultValue={users.find(u => u.id === showEditPopup)?.name || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={users.find(u => u.id === showEditPopup)?.email || ''}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowEditPopup(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleSaveEdit(showEditPopup, {})}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === `edit-${showEditPopup}` ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menyimpan...
                    </div>
                  ) : (
                    'Simpan'
                  )}
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
              <p className="text-gray-600 mb-8">
                Apakah Anda yakin ingin menghapus user ini? Aksi ini tidak dapat dibatalkan.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeletePopup(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(showDeletePopup)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === `delete-${showDeletePopup}` ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menghapus...
                    </div>
                  ) : (
                    'Hapus'
                  )}
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
              <p className="text-gray-600 mb-6">
                Kirim notifikasi kepada user ini
              </p>
              <textarea 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-6"
                rows="3"
                placeholder="Tulis pesan notifikasi..."
              ></textarea>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowNotificationPopup(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleSendNotificationConfirm(showNotificationPopup)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === `notif-${showNotificationPopup}` ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Mengirim...
                    </div>
                  ) : (
                    'Kirim'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Popup */}
      {showAddAdminPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">👑</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Tambah Admin Baru</h3>
              <p className="text-gray-600">Tambahkan admin baru ke sistem</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Admin</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama admin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@paramadina.ac.id"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowAddAdminPopup(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddAdminConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === 'add-admin' ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menambahkan...
                    </div>
                  ) : (
                    'Tambah Admin'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Popup */}
      {showImportPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Import Users</h3>
              <p className="text-gray-600">Upload file CSV untuk import users</p>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                <span className="text-4xl mb-2">📄</span>
                <p className="text-gray-600 mb-2">Drag & drop file CSV di sini</p>
                <p className="text-gray-500 text-sm">atau</p>
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Pilih File
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Format file harus:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>File CSV dengan header: name,email,role,status</li>
                  <li>Maksimal ukuran file: 5MB</li>
                  <li>Maksimal 1000 baris per import</li>
                </ul>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowImportPopup(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 hover-scale active-scale"
                >
                  Batal
                </button>
                <button
                  onClick={handleImportConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 hover-scale active-scale"
                >
                  {actionInProgress === 'import' ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Mengimport...
                    </div>
                  ) : (
                    'Import'
                  )}
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