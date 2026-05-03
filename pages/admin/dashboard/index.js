import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AdminFooter from '../../../components/layout/AdminFooter'
import Link from 'next/link'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [showQuickActionPopup, setShowQuickActionPopup] = useState(null)
  const [showUserEditPopup, setShowUserEditPopup] = useState(null)
  const [showReviewPopup, setShowReviewPopup] = useState(null)
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

  const handleQuickAction = (action) => {
    setShowQuickActionPopup(action)
    setTimeout(() => {
      setShowQuickActionPopup(null)
      if (action === 'backup') {
        alert('Backup data berhasil dibuat!')
      } else if (action === 'report') {
        alert('Laporan berhasil di-generate!')
      }
    }, 2000)
  }

  const handleEditUser = (userId) => {
    setShowUserEditPopup(userId)
    setTimeout(() => {
      setShowUserEditPopup(null)
      alert(`User ${userId} berhasil diperbarui!`)
    }, 2000)
  }

  const handleReviewArtwork = (artworkId) => {
    setShowReviewPopup(artworkId)
    setTimeout(() => {
      setShowReviewPopup(null)
      alert(`Karya ${artworkId} berhasil direview!`)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#083552] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard Admin - ParamadinaVerse</title>
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
            50% { transform: translateY(-5px); }
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
          
          .group-hover-scale-110 {
            transition: transform 0.3s ease-out;
          }
          
          .group:hover .group-hover-scale-110 {
            transform: scale(1.1);
          }
        `}</style>
      </Head>
      
      <AdminLayout>
        {/* Hero Section */}
        <div 
          className="relative text-white py-12 px-4 mb-8 rounded-b-2xl shadow-lg animate-fadeIn"
          style={{ background: colors.gradient }}
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2 animate-slideDown" style={{animationDelay: '0.1s'}}>
                  Dashboard Admin
                </h1>
                <p className="text-blue-100 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                  Selamat datang kembali, <span className="font-semibold">{user?.name}!</span>
                </p>
                <div className="flex items-center mt-4 space-x-2">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm animate-fadeIn" style={{animationDelay: '0.3s'}}>
                    Admin Utama
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm animate-fadeIn" style={{animationDelay: '0.4s'}}>
                    Akses Penuh
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 animate-fadeIn" style={{animationDelay: '0.5s'}}>
                <button 
                  onClick={confirmLogout}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/30 hover-scale hover:shadow-lg active:scale-95 transform"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: "Total Pengguna", 
                value: "156", 
                icon: "👥", 
                color: "from-blue-500 to-blue-600",
                change: "+12% dari bulan lalu",
                animateDelay: "0.1s"
              },
              { 
                title: "Total Karya", 
                value: "342", 
                icon: "🖼️", 
                color: "from-purple-500 to-pink-500",
                change: "+8% dari bulan lalu",
                animateDelay: "0.2s"
              },
              { 
                title: "Menunggu Review", 
                value: "23", 
                icon: "⚠️", 
                color: "from-amber-500 to-orange-500",
                action: true,
                animateDelay: "0.3s"
              },
              { 
                title: "Aktivitas Hari Ini", 
                value: "48", 
                icon: "📈", 
                color: "from-green-500 to-teal-500",
                subtitle: "Like, komentar, upload",
                animateDelay: "0.4s"
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fadeIn`}
                style={{ animationDelay: stat.animateDelay }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="opacity-90 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl group-hover-scale-110">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
                <div className="mt-4">
                  {stat.action ? (
                    <Link href="/admin/artworks?filter=pending">
                      <button 
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover-scale active:scale-95 transform"
                        onClick={(e) => {
                          e.stopPropagation()
                          alert('Mengarahkan ke halaman review...')
                        }}
                      >
                        Review Sekarang
                      </button>
                    </Link>
                  ) : stat.change ? (
                    <span className="text-green-300 text-sm font-medium">{stat.change}</span>
                  ) : (
                    <span className="text-white/80 text-sm">{stat.subtitle}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Menu Admin */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 animate-scaleIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Admin</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { 
                      href: "/admin/users", 
                      icon: "👥", 
                      title: "Kelola Pengguna", 
                      desc: "Kelola semua pengguna", 
                      count: "156 user",
                      color: "from-blue-50 to-indigo-50",
                      border: "border-blue-100",
                      iconColor: "bg-blue-100",
                      textColor: "text-blue-600"
                    },
                    { 
                      href: "/admin/artworks", 
                      icon: "🖼️", 
                      title: "Kelola Karya", 
                      desc: "Review, edit, hapus karya", 
                      count: "342 karya",
                      color: "from-purple-50 to-pink-50",
                      border: "border-purple-100",
                      iconColor: "bg-purple-100",
                      textColor: "text-purple-600"
                    },
                    { 
                      href: "/admin/reports", 
                      icon: "📊", 
                      title: "Laporan & Analitik", 
                      desc: "Statistik platform", 
                      count: "5 laporan",
                      color: "from-amber-50 to-orange-50",
                      border: "border-amber-100",
                      iconColor: "bg-amber-100",
                      textColor: "text-amber-600"
                    },
                    { 
                      href: "/admin/categories", 
                      icon: "🏷️", 
                      title: "Kategori & Tag", 
                      desc: "Kelola kategori karya", 
                      count: "12 kategori",
                      color: "from-green-50 to-teal-50",
                      border: "border-green-100",
                      iconColor: "bg-green-100",
                      textColor: "text-green-600"
                    },
                    { 
                      href: "/admin/settings", 
                      icon: "⚙️", 
                      title: "Pengaturan Sistem", 
                      desc: "Pengaturan platform", 
                      count: "Config",
                      color: "from-gray-50 to-slate-50",
                      border: "border-gray-100",
                      iconColor: "bg-gray-100",
                      textColor: "text-gray-600"
                    }
                  ].map((menu, index) => (
                    <Link key={index} href={menu.href}>
                      <div 
                        className={`group bg-gradient-to-r ${menu.color} p-6 rounded-xl border ${menu.border} hover:shadow-lg transition-all duration-300 cursor-pointer hover-scale animate-fadeIn`}
                        style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                        onClick={() => {
                          alert(`Mengarahkan ke ${menu.title}...`)
                        }}
                      >
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 ${menu.iconColor} rounded-xl flex items-center justify-center mr-4 group-hover-scale-110 transition-transform`}>
                            <span className="text-xl">{menu.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{menu.title}</h3>
                            <p className="text-sm text-gray-600">{menu.desc}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className={`text-sm ${menu.textColor} font-medium`}>{menu.count}</span>
                          <span className={`${menu.textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pending Reviews */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-scaleIn" style={{animationDelay: '0.6s'}}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Karya Menunggu Review</h2>
                  <Link href="/admin/artworks?filter=pending">
                    <span 
                      className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer hover-scale transition-all duration-300"
                      onClick={() => alert('Mengarahkan ke semua review...')}
                    >
                      Lihat semua (23) →
                    </span>
                  </Link>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((item, index) => (
                    <div 
                      key={item} 
                      className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1 + 0.7}s` }}
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-4 group-hover-scale-110">
                          <span className="text-2xl">🖼️</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 group-hover:text-blue-700">
                            Digital Illustration #{item}
                          </p>
                          <p className="text-sm text-gray-500">Oleh: Mahasiswa {item}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">
                              Digital Art
                            </span>
                            <span className="text-xs text-gray-500">2 jam yang lalu</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleReviewArtwork(item)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md hover-scale active:scale-95 transform"
                      >
                        {showReviewPopup === item ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Reviewing...
                          </div>
                        ) : (
                          'Review'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Recent Activities */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6 animate-scaleIn" style={{animationDelay: '0.8s'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Aktivitas Terbaru</h2>
                
                <div className="space-y-6">
                  {[
                    { icon: "👤", title: "3 pengguna baru mendaftar", time: "1 jam yang lalu", color: "from-blue-100 to-blue-200", badge: true },
                    { icon: "📤", title: "5 karya baru diupload", time: "3 jam yang lalu", color: "from-green-100 to-green-200", tags: true },
                    { icon: "⚠️", title: "2 laporan perlu ditinjau", time: "5 jam yang lalu", color: "from-red-100 to-red-200", action: true },
                    { icon: "👍", title: "24 like pada karya baru", time: "7 jam yang lalu", color: "from-purple-100 to-purple-200" }
                  ].map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-start animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1 + 0.9}s` }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center mr-4 flex-shrink-0 hover-scale transition-transform duration-300`}>
                        <span className="text-lg">{activity.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                        {activity.badge && (
                          <div className="flex items-center mt-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white animate-bounce-once"></div>
                            <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white -ml-2"></div>
                            <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white -ml-2"></div>
                            <span className="text-xs text-gray-600 ml-2">+3 user</span>
                          </div>
                        )}
                        {activity.tags && (
                          <div className="mt-2">
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2 animate-pulse-once">
                              Ilustrasi
                            </span>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded animate-pulse-once" style={{animationDelay: '0.2s'}}>
                              Fotografi
                            </span>
                          </div>
                        )}
                        {activity.action && (
                          <button 
                            onClick={() => alert('Membuka laporan...')}
                            className="mt-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm px-3 py-1 rounded-lg transition-all duration-300 hover-scale active:scale-95 transform"
                          >
                            Tinjau Sekarang
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4">Aksi Cepat</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { text: "Tambah Admin", color: "blue" },
                      { text: "Generate Report", color: "green", action: "report" },
                      { text: "Backup Data", color: "purple", action: "backup" },
                      { text: "System Logs", color: "gray" }
                    ].map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (action.action) {
                            handleQuickAction(action.action)
                          } else {
                            alert(`${action.text} belum tersedia`)
                          }
                        }}
                        className={`bg-${action.color}-50 hover:bg-${action.color}-100 text-${action.color}-700 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-300 hover-scale active:scale-95 transform animate-fadeIn`}
                        style={{ animationDelay: `${index * 0.1 + 1.3}s` }}
                      >
                        {showQuickActionPopup === action.action ? (
                          <div className="flex items-center justify-center">
                            <div className={`w-3 h-3 border-2 border-${action.color}-700 border-t-transparent rounded-full animate-spin mr-2`}></div>
                            Processing...
                          </div>
                        ) : (
                          action.text
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 animate-scaleIn" style={{animationDelay: '1s'}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pengguna Terbaru</h2>
              <Link href="/admin/users">
                <button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md hover-scale active:scale-95 transform"
                  onClick={() => alert('Mengarahkan ke kelola semua pengguna...')}
                >
                  Kelola Semua Pengguna
                </button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-600 font-medium">Nama</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Email</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Role</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Bergabung</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((item, index) => (
                    <tr 
                      key={item} 
                      className="border-b border-gray-100 hover:bg-gray-50 animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1 + 1.1}s` }}
                    >
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 hover-scale">
                            <span>U{item}</span>
                          </div>
                          <span>User {item}</span>
                        </div>
                      </td>
                      <td className="py-4">user{item}@example.com</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item === 1 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        } animate-pulse-once`}>
                          {item === 1 ? 'Admin' : 'Mahasiswa'}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500">Hari ini</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse-once">
                          Active
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleEditUser(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm hover-scale transition-all duration-300"
                        >
                          {showUserEditPopup === item ? (
                            <div className="flex items-center">
                              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                              Updating...
                            </div>
                          ) : (
                            'Edit'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
      
      {/* Quick Action Success Popup */}
      {showQuickActionPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 relative z-10 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Aksi Berhasil!</h3>
              <p className="text-gray-600 mb-6">
                {showQuickActionPopup === 'backup' 
                  ? 'Backup data berhasil dibuat!' 
                  : 'Laporan berhasil di-generate!'}
              </p>
              <button
                onClick={() => setShowQuickActionPopup(null)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-slideUp">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#083552] to-[#1276B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">👋</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Keluar Akun Admin?</h3>
              <p className="text-gray-600 mb-8">
                Apakah Anda yakin ingin logout dari akun Administrator? Anda perlu login kembali untuk mengakses panel admin.
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

      <AdminFooter />
    </>
  )
}