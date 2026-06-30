import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AdminFooter from '../../../components/layout/AdminFooter'
import Link from 'next/link'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // =============================================
  // STATE DATA DARI BACKEND
  // =============================================
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalKarya: 0,
    pendingKarya: 0,
    acceptedKarya: 0,
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [pendingKaryaList, setPendingKaryaList] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)

  const router = useRouter()

  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  // =============================================
  // CEK AUTH
  // =============================================
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')

    if (!userData || userData.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    setUser(userData)
    setLoading(false)
    fetchDashboardData(userData.token)
  }, [router])

  // =============================================
  // FETCH DATA DASHBOARD
  // GET /api/admin/users  → total pengguna + recent users
  // GET /api/admin/karya  → total karya + pending karya
  // =============================================
  const fetchDashboardData = async (token) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }

      // Fetch paralel
      const [statsRes, usersRes, pendingRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/statistics`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/recent-users`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, { headers }),
      ])

      const statsData = await statsRes.json()
      const usersData = await usersRes.json()
      const pendingData = await pendingRes.json()

      if (statsRes.ok) {
        setStats(prev => ({
          ...prev,
          totalUsers: statsData.totalUsers,
          totalKarya: statsData.totalArtworks,
          pendingKarya: statsData.pendingReview,
          acceptedKarya: statsData.acceptedArtworks,
        }))
      }

      if (usersRes.ok && Array.isArray(usersData)) {
        setRecentUsers(usersData.slice(0, 3))
      }

      if (pendingRes.ok && Array.isArray(pendingData)) {
        setPendingKaryaList(pendingData.slice(0, 3))
      }
    } catch (err) {
      console.error('Gagal fetch dashboard:', err)
    } finally {
      setLoadingStats(false)
    }
  }

  // =============================================
  // ACCEPT KARYA — POST /api/reviews/:id/approve
  // =============================================
  const handleAcceptKarya = async (id) => {
    const token = JSON.parse(localStorage.getItem('user') || 'null')?.token
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}/approve`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) {
        alert('Karya berhasil disetujui!')
        fetchDashboardData(token)
      } else {
        const data = await res.json()
        alert(data.message || 'Gagal menyetujui karya')
      }
    } catch (err) {
      alert('Gagal terhubung ke server')
    }
  }

  // =============================================
  // DENIED KARYA — POST /api/reviews/:id/reject
  // =============================================
  const handleDeniedKarya = async (id) => {
    const token = JSON.parse(localStorage.getItem('user') || 'null')?.token
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}/reject`,
        { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ note: 'Ditolak admin' })
        }
      )
      if (res.ok) {
        alert('Karya berhasil ditolak!')
        fetchDashboardData(token)
      } else {
        const data = await res.json()
        alert(data.message || 'Gagal menolak karya')
      }
    } catch (err) {
      alert('Gagal terhubung ke server')
    }
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
            from { opacity: 0; transform: scale(.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn .5s ease-out forwards; }
          .animate-scaleIn { animation: scaleIn .4s ease-out forwards; }
          .animate-slideDown { animation: slideDown .4s ease-out forwards; }
          .hover-scale { transition: .3s; }
          .hover-scale:hover { transform: scale(1.02); }
          .group-hover-scale-110 { transition: .3s; }
          .group:hover .group-hover-scale-110 { transform: scale(1.1); }
        `}</style>
      </Head>

      <AdminLayout>
        {/* HERO */}
        <div
          className="relative text-white py-12 px-4 mb-8 rounded-b-2xl shadow-lg animate-fadeIn"
          style={{ background: colors.gradient }}
        >
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2 animate-slideDown">
              Dashboard Admin
            </h1>
            <p className="text-blue-100">
              Selamat datang kembali,
              <span className="font-semibold ml-1">{user?.name}</span>
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">

          {/* QUICK STATS — real data dari backend */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Total Pengguna',
                value: loadingStats ? '...' : stats.totalUsers,
                icon: '👥',
                color: 'from-blue-500 to-blue-600',
                sub: 'Terdaftar di platform',
              },
              {
                title: 'Total Karya',
                value: loadingStats ? '...' : stats.totalKarya,
                icon: '🖼️',
                color: 'from-purple-500 to-pink-500',
                sub: 'Seluruh karya',
              },
              {
                title: 'Menunggu Review',
                value: loadingStats ? '...' : stats.pendingKarya,
                icon: '⚠️',
                color: 'from-amber-500 to-orange-500',
                action: true,
              },
              {
                title: 'Karya Disetujui',
                value: loadingStats ? '...' : stats.acceptedKarya,
                icon: '✅',
                color: 'from-green-500 to-teal-500',
                sub: 'Sudah dipublikasikan',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fadeIn`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm opacity-90">{stat.title}</p>
                    <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
                <div className="mt-4">
                  {stat.action ? (
                    <Link href="/admin/artworks">
                      <span className="text-white/90 text-sm underline cursor-pointer hover:text-white">
                        Review sekarang →
                      </span>
                    </Link>
                  ) : (
                    <span className="text-white/80 text-sm">{stat.sub}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

            {/* MENU ADMIN */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-scaleIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Admin</h2>
                <div className="space-y-4">
                  {[
                    {
                      href: '/admin/users',
                      icon: '👥',
                      title: 'Kelola Pengguna',
                      desc: 'Kelola seluruh pengguna',
                      count: `${loadingStats ? '...' : stats.totalUsers} User`,
                      color: 'from-blue-50 to-indigo-50',
                      border: 'border-blue-100',
                      iconColor: 'bg-blue-100',
                      textColor: 'text-blue-600',
                    },
                    {
                      href: '/admin/artworks',
                      icon: '🖼️',
                      title: 'Kelola Karya',
                      desc: 'Review, edit, hapus karya',
                      count: `${loadingStats ? '...' : stats.totalKarya} Karya`,
                      color: 'from-purple-50 to-pink-50',
                      border: 'border-purple-100',
                      iconColor: 'bg-purple-100',
                      textColor: 'text-purple-600',
                    },
                  ].map((menu, index) => (
                    <Link key={index} href={menu.href}>
                      <div className={`group bg-gradient-to-r ${menu.color} p-5 rounded-xl border ${menu.border} hover:shadow-lg transition-all duration-300 cursor-pointer hover-scale`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 ${menu.iconColor} rounded-xl flex items-center justify-center mr-3`}>
                            <span className="text-lg">{menu.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{menu.title}</h3>
                            <p className="text-xs text-gray-600">{menu.desc}</p>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${menu.textColor} text-sm font-medium`}>{menu.count}</span>
                          <span className={menu.textColor}>→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* KARYA PENDING */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-scaleIn">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Karya Menunggu Review
                  </h2>
                  <Link href="/admin/artworks">
                    <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer text-sm">
                      Lihat semua ({stats.pendingKarya}) →
                    </span>
                  </Link>
                </div>

                {loadingStats ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1276B5]"></div>
                  </div>
                ) : pendingKaryaList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">✅</div>
                    <p>Tidak ada karya yang menunggu review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingKaryaList.map((karya) => (
                      <div
                        key={karya._id}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden flex-shrink-0">
                            {karya.image ? (
                              <img src={karya.image} alt={karya.karya} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-2xl">🖼️</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 truncate">{karya.karya}</p>
                            <p className="text-sm text-gray-500">Oleh: {karya.namaMahasiswa}</p>
                            <div className="flex items-center mt-1 gap-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {karya.kategoriKarya}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(karya.tanggal).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 ml-4">
                          <button
                            onClick={() => handleAcceptKarya(karya._id)}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            ✓ Terima
                          </button>
                          <button
                            onClick={() => handleDeniedKarya(karya._id)}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            ✗ Tolak
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RECENT USERS */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pengguna Terbaru</h2>
              <Link href="/admin/users">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-5 py-2 rounded-lg font-medium transition-all text-sm">
                  Kelola Semua Pengguna
                </button>
              </Link>
            </div>

            {loadingStats ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1276B5]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {['Nama', 'Email', 'Role', 'Total Karya', 'Bergabung'].map(h => (
                        <th key={h} className="text-left py-3 text-gray-600 font-medium text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Belum ada pengguna
                        </td>
                      </tr>
                    ) : (
                      recentUsers.map((u) => (
                        <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 font-bold text-blue-600 text-sm">
                                {u.nama?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <span className="font-medium text-gray-800">{u.nama}</span>
                            </div>
                          </td>
                          <td className="py-4 text-gray-600 text-sm">{u.email}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {u.role === 'admin' ? 'Admin' : 'Mahasiswa'}
                            </span>
                          </td>
                          <td className="py-4 text-gray-600 text-sm">{u.totalKarya} karya</td>
                          <td className="py-4 text-gray-500 text-sm">
                            {new Date(u.bergabung).toLocaleDateString('id-ID')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </AdminLayout>

      <AdminFooter />
    </>
  )
}