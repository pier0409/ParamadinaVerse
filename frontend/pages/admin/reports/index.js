import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AdminFooter from '../../../components/layout/AdminFooter'
import Link from 'next/link'

export default function AdminReports() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month') // day, week, month, year
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [showExportPopup, setShowExportPopup] = useState(false)
  const [showReportPopup, setShowReportPopup] = useState(null) // 'monthly', 'user', 'artwork'
  const [actionInProgress, setActionInProgress] = useState(null)
  const router = useRouter()

  // Warna konsisten
  const colors = {
    primary: '#B45309',
    secondary: '#F59E0B',
    gradient: 'linear-gradient(90deg, #B45309 0%, #F59E0B 100%)',
    amberGradient: 'linear-gradient(90deg, #B45309 0%, #F59E0B 100%)'
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

  const handleExport = (type) => {
    setActionInProgress(`export-${type}`)
    setTimeout(() => {
      setActionInProgress(null)
      alert(`Laporan berhasil diexport ke ${type === 'excel' ? 'Excel' : type === 'pdf' ? 'PDF' : 'semua format'}!`)
      setShowExportPopup(false)
    }, 2000)
  }

  const handleGenerateReport = (type) => {
    setActionInProgress(`report-${type}`)
    setTimeout(() => {
      setActionInProgress(null)
      alert(`Laporan ${type} berhasil digenerate!`)
      setShowReportPopup(null)
    }, 3000)
  }

  // Data statistik (simulasi)
  const stats = {
    totalUsers: 156,
    newUsers: 12,
    totalArtworks: 342,
    newArtworks: 24,
    pendingReviews: 8,
    totalLikes: 1248,
    totalComments: 342,
    avgRating: 4.5
  }

  // Data chart (simulasi)
  const chartData = {
    userGrowth: [45, 52, 48, 61, 55, 58, 63, 70, 68, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150, 156],
    artworkUploads: [8, 12, 10, 15, 14, 18, 20, 22, 19, 25, 28, 30, 32, 35, 34, 38, 40, 42, 45, 48, 50],
    engagement: [120, 145, 130, 160, 155, 170, 180, 195, 190, 210, 225, 240, 235, 250, 265, 280, 290, 310, 320, 340, 342]
  }

  // Top categories
  const topCategories = [
    { name: 'Digital Art', count: 87, percentage: 25.4 },
    { name: 'Fotografi', count: 65, percentage: 19.0 },
    { name: 'Ilustrasi', count: 48, percentage: 14.0 },
    { name: '3D Modeling', count: 42, percentage: 12.3 },
    { name: 'Video Art', count: 35, percentage: 10.2 },
    { name: 'Lukisan Tradisional', count: 28, percentage: 8.2 },
    { name: 'Desain Grafis', count: 25, percentage: 7.3 },
    { name: 'Lainnya', count: 12, percentage: 3.5 }
  ]

  // Top users
  const topUsers = [
    { name: 'Mahasiswa A', artworks: 15, likes: 245, comments: 48 },
    { name: 'Mahasiswa B', artworks: 12, likes: 198, comments: 35 },
    { name: 'Mahasiswa C', artworks: 10, likes: 167, comments: 28 },
    { name: 'Mahasiswa D', artworks: 8, likes: 142, comments: 22 },
    { name: 'Mahasiswa E', artworks: 7, likes: 125, comments: 19 }
  ]

  // Recent activities
  const recentActivities = [
    { type: 'upload', user: 'Mahasiswa X', title: 'Sunset Dreams', time: '2 jam lalu' },
    { type: 'like', user: 'Mahasiswa Y', title: 'Digital Portrait', time: '3 jam lalu' },
    { type: 'comment', user: 'Mahasiswa Z', title: 'Abstract Composition', time: '4 jam lalu' },
    { type: 'register', user: 'Mahasiswa Baru', time: '5 jam lalu' },
    { type: 'review', admin: 'Admin 1', title: 'Nature Photography', time: '6 jam lalu' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#B45309]/5 via-white to-[#F59E0B]/5">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#B45309] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Reports Data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Laporan & Analitik - Admin ParamadinaVerse</title>
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
          
          @keyframes chartBar {
            from { height: 0; opacity: 0; }
            to { height: var(--bar-height); opacity: 1; }
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
          
          .animate-chartBar {
            animation: chartBar 0.8s ease-out forwards;
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
          
          .gradient-text {
            background: linear-gradient(90deg, #B45309 0%, #F59E0B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>
      </Head>
      
      <AdminLayout>
        {/* Hero Section */}
        <div 
          className="relative text-white py-8 md:py-12 px-4 mb-6 rounded-b-2xl shadow-lg animate-fadeIn"
          style={{ background: colors.amberGradient }}
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-slideDown" style={{animationDelay: '0.1s'}}>
                  Laporan & Analitik
                </h1>
                <p className="text-amber-200 text-sm md:text-base animate-fadeIn" style={{animationDelay: '0.2s'}}>
                  Analisis data dan statistik platform
                </p>
                <div className="flex items-center mt-3 space-x-2">
                  {[
                    { label: `Data Real-time`, color: 'bg-amber-700', delay: '0.3s' },
                    { label: `Periode: Bulan Ini`, color: 'bg-orange-600', delay: '0.4s' },
                    { label: `Update: Hari Ini`, color: 'bg-yellow-600', delay: '0.5s' }
                  ].map((badge, index) => (
                    <span 
                      key={index}
                      className={`${badge.color} px-2 md:px-3 py-1 rounded-full text-xs md:text-sm animate-fadeIn hover-scale active-scale`}
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
                  onClick={() => setShowExportPopup(true)}
                  className="bg-white hover:bg-white/90 text-amber-900 px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 shadow-lg hover-scale active-scale animate-fadeIn"
                  style={{animationDelay: '0.7s'}}
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
          {/* Time Range Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-100 animate-scaleIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Analitik Platform</h2>
                <p className="text-gray-600 text-sm">Pilih periode waktu untuk analisis</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['day', 'week', 'month', 'year'].map((range, index) => (
                  <button 
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover-scale active-scale animate-fadeIn ${
                      timeRange === range 
                        ? 'bg-amber-500 text-white shadow-lg' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                    style={{animationDelay: `${0.5 + index * 0.1}s`}}
                  >
                    {range === 'day' ? 'Hari Ini' : 
                     range === 'week' ? '7 Hari' : 
                     range === 'month' ? 'Bulan Ini' : 'Tahun Ini'}
                  </button>
                ))}
                <button className="px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover-scale active-scale animate-fadeIn"
                  style={{animationDelay: '0.9s'}}
                  onClick={() => alert('Custom Range dipilih')}
                >
                  Custom Range
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {[
              { 
                title: "Total Pengguna", 
                value: stats.totalUsers, 
                icon: "👥", 
                color: "from-blue-500 to-blue-600",
                subtitle: `+${stats.newUsers} baru`,
                trend: "up",
                delay: "0.1s"
              },
              { 
                title: "Total Karya", 
                value: stats.totalArtworks, 
                icon: "🖼️", 
                color: "from-purple-500 to-pink-500",
                subtitle: `+${stats.newArtworks} baru`,
                trend: "up",
                delay: "0.2s"
              },
              { 
                title: "Engagement", 
                value: stats.totalLikes, 
                icon: "❤️", 
                color: "from-green-500 to-teal-500",
                subtitle: `${stats.totalComments} komentar`,
                trend: "stable",
                delay: "0.3s"
              },
              { 
                title: "Rating Rata-rata", 
                value: stats.avgRating, 
                icon: "⭐", 
                color: "from-amber-500 to-orange-500",
                subtitle: "Dari 5.0",
                trend: "up",
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
                <div className="mt-2 md:mt-4 flex items-center">
                  <span className="text-white/80 text-xs md:text-sm">{stat.subtitle}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-400/30 text-green-100' :
                    stat.trend === 'down' ? 'bg-red-400/30 text-red-100' :
                    'bg-blue-400/30 text-blue-100'
                  }`}>
                    {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Graphs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Growth Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn" style={{animationDelay: '0.5s'}}>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Pertumbuhan Platform</h3>
                <span className="text-sm text-green-600 font-medium animate-pulse-once">+24% dari bulan lalu</span>
              </div>
              
              {/* Simple bar chart simulation */}
              <div className="h-48 md:h-56 flex items-end justify-between space-x-1 md:space-x-2">
                {chartData.userGrowth.map((value, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:opacity-80 animate-chartBar"
                      style={{ 
                        '--bar-height': `${(value / 200) * 100}%`,
                        animationDelay: `${index * 0.05}s`,
                        height: `${(value / 200) * 100}%`
                      }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">{index + 1}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2 animate-fadeIn" style={{animationDelay: '0.6s'}}>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pengguna</span>
                </div>
                <div className="flex items-center space-x-2 animate-fadeIn" style={{animationDelay: '0.7s'}}>
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Karya</span>
                </div>
                <div className="flex items-center space-x-2 animate-fadeIn" style={{animationDelay: '0.8s'}}>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Engagement</span>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn" style={{animationDelay: '0.9s'}}>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Kategori Populer</h3>
                <span className="text-sm text-blue-600 font-medium animate-bounce-once">{topCategories.length} kategori</span>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {topCategories.map((category, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between animate-fadeIn"
                    style={{animationDelay: `${1 + index * 0.1}s`}}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm md:text-base">{category.name}</p>
                        <p className="text-xs text-gray-500">{category.count} karya</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{category.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Reports Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Top Users */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn" style={{animationDelay: '1.1s'}}>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Top Users</h3>
                <span className="text-sm text-green-600 font-medium animate-pulse-once">Most Active</span>
              </div>
              
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors animate-fadeIn hover-scale"
                    style={{animationDelay: `${1.2 + index * 0.1}s`}}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center font-bold text-amber-800 group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm md:text-base">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.artworks} karya</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800 text-sm md:text-base">{user.likes} likes</p>
                      <p className="text-xs text-gray-500">{user.comments} komentar</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn" style={{animationDelay: '1.3s'}}>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Aktivitas Terbaru</h3>
                <span className="text-sm text-blue-600 font-medium animate-pulse-once">Live</span>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors animate-fadeIn hover-scale"
                    style={{animationDelay: `${1.4 + index * 0.1}s`}}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                      activity.type === 'upload' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'like' ? 'bg-red-100 text-red-600' :
                      activity.type === 'comment' ? 'bg-green-100 text-green-600' :
                      activity.type === 'register' ? 'bg-purple-100 text-purple-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {activity.type === 'upload' && '📤'}
                      {activity.type === 'like' && '❤️'}
                      {activity.type === 'comment' && '💬'}
                      {activity.type === 'register' && '👤'}
                      {activity.type === 'review' && '✅'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm md:text-base">
                        {activity.type === 'upload' && `${activity.user} mengupload "${activity.title}"`}
                        {activity.type === 'like' && `${activity.user} menyukai "${activity.title}"`}
                        {activity.type === 'comment' && `${activity.user} mengomentari "${activity.title}"`}
                        {activity.type === 'register' && `${activity.user} bergabung`}
                        {activity.type === 'review' && `${activity.admin} mereview "${activity.title}"`}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn" style={{animationDelay: '1.5s'}}>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Statistik Cepat</h3>
                <span className="text-sm text-gray-600">Bulan Ini</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Karya Pending', value: stats.pendingReviews, color: 'bg-blue-50', textColor: 'text-blue-600', icon: '⏳' },
                  { label: 'Karya Disetujui', value: 24, color: 'bg-green-50', textColor: 'text-green-600', icon: '✅' },
                  { label: 'Karya Ditolak', value: 3, color: 'bg-red-50', textColor: 'text-red-600', icon: '❌' },
                  { label: 'Rata-rata Upload/Hari', value: '2.4', color: 'bg-purple-50', textColor: 'text-purple-600', icon: '📈' },
                  { label: 'User Aktif/Hari', value: 48, color: 'bg-amber-50', textColor: 'text-amber-600', icon: '👥' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg ${stat.color} animate-fadeIn hover-scale`}
                    style={{animationDelay: `${1.6 + index * 0.1}s`}}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{stat.icon}</span>
                      <span className="font-medium text-gray-800">{stat.label}</span>
                    </div>
                    <span className={`font-bold ${stat.textColor}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export and Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-100 animate-scaleIn" style={{animationDelay: '1.7s'}}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Export & Laporan</h2>
                <p className="text-gray-600 text-sm">Generate dan export laporan lengkap</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowReportPopup('full')}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover-scale active-scale animate-fadeIn"
                  style={{animationDelay: '1.8s'}}
                >
                  📊 Generate Full Report
                </button>
                <button 
                  onClick={() => setShowExportPopup(true)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover-scale active-scale animate-fadeIn"
                  style={{animationDelay: '1.9s'}}
                >
                  📥 Export to Excel
                </button>
                <button 
                  onClick={() => handleExport('pdf')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover-scale active-scale animate-fadeIn"
                  style={{animationDelay: '2s'}}
                >
                  📄 Export to PDF
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  title: 'Laporan Bulanan', 
                  description: 'Statistik lengkap per bulan',
                  color: 'from-blue-50 to-indigo-50',
                  border: 'border-blue-100',
                  buttonColor: 'bg-blue-500 hover:bg-blue-600',
                  type: 'monthly'
                },
                { 
                  title: 'Laporan User', 
                  description: 'Analisis perilaku user',
                  color: 'from-green-50 to-teal-50',
                  border: 'border-green-100',
                  buttonColor: 'bg-green-500 hover:bg-green-600',
                  type: 'user'
                },
                { 
                  title: 'Laporan Karya', 
                  description: 'Analisis performa karya',
                  color: 'from-purple-50 to-pink-50',
                  border: 'border-purple-100',
                  buttonColor: 'bg-purple-500 hover:bg-purple-600',
                  type: 'artwork'
                }
              ].map((report, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-r ${report.color} p-4 rounded-xl border ${report.border} animate-fadeIn hover-scale transition-all`}
                  style={{animationDelay: `${2.1 + index * 0.1}s`}}
                >
                  <h4 className="font-bold text-gray-800 mb-2">{report.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                  <button 
                    onClick={() => setShowReportPopup(report.type)}
                    className={`w-full ${report.buttonColor} text-white py-2 rounded-lg text-sm transition-all duration-300 hover-scale active-scale`}
                  >
                    Generate
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Insights */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 animate-scaleIn" style={{animationDelay: '2.4s'}}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Platform Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { icon: '📈', color: 'bg-green-100', textColor: 'text-green-600', title: 'Trend Positif', description: 'Pengguna baru meningkat 24% dari bulan lalu' },
                  { icon: '🎯', color: 'bg-blue-100', textColor: 'text-blue-600', title: 'Kategori Favorit', description: 'Digital Art menjadi kategori paling populer (25.4%)' },
                  { icon: '⚡', color: 'bg-amber-100', textColor: 'text-amber-600', title: 'Waktu Puncak', description: 'Aktivitas tertinggi terjadi pukul 14:00 - 16:00' }
                ].map((insight, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-3 animate-fadeIn hover-scale transition-all"
                    style={{animationDelay: `${2.5 + index * 0.1}s`}}
                  >
                    <div className={`w-10 h-10 ${insight.color} rounded-lg flex items-center justify-center ${insight.textColor} group-hover:scale-110 transition-transform`}>
                      {insight.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{insight.title}</h4>
                      <p className="text-gray-600 text-sm">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: '👥', color: 'bg-purple-100', textColor: 'text-purple-600', title: 'User Engagement', description: 'Rata-rata 3.2 like per karya' },
                  { icon: '⚠️', color: 'bg-red-100', textColor: 'text-red-600', title: 'Perhatian', description: '8 karya menunggu review, perlu perhatian' },
                  { icon: '💡', color: 'bg-indigo-100', textColor: 'text-indigo-600', title: 'Rekomendasi', description: 'Promosikan kategori Fotografi untuk meningkatkan engagement' }
                ].map((insight, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-3 animate-fadeIn hover-scale transition-all"
                    style={{animationDelay: `${2.8 + index * 0.1}s`}}
                  >
                    <div className={`w-10 h-10 ${insight.color} rounded-lg flex items-center justify-center ${insight.textColor} group-hover:scale-110 transition-transform`}>
                      {insight.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{insight.title}</h4>
                      <p className="text-gray-600 text-sm">{insight.description}</p>
                    </div>
                  </div>
                ))}
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
              <div className="w-20 h-20 bg-gradient-to-r from-[#B45309] to-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-6">
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
                  className="px-6 py-3 bg-gradient-to-r from-[#B45309] to-[#F59E0B] text-white hover:opacity-90 rounded-xl font-medium transition-all duration-300 hover-scale active-scale"
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Popup */}
      {showExportPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Export Data Laporan</h3>
              <button
                onClick={() => setShowExportPopup(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl hover-scale transition-all"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                { 
                  icon: '📊', 
                  color: 'bg-blue-100', 
                  iconColor: 'text-blue-600',
                  title: 'Excel Format', 
                  description: 'Data dalam format Excel (.xlsx)',
                  type: 'excel'
                },
                { 
                  icon: '📄', 
                  color: 'bg-amber-100', 
                  iconColor: 'text-amber-600',
                  title: 'PDF Format', 
                  description: 'Laporan lengkap dalam PDF',
                  type: 'pdf'
                },
                { 
                  icon: '📁', 
                  color: 'bg-purple-100', 
                  iconColor: 'text-purple-600',
                  title: 'Semua Format', 
                  description: 'Export semua format sekaligus',
                  type: 'all'
                }
              ].map((format, index) => (
                <div 
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover-scale transition-all cursor-pointer animate-fadeIn"
                  style={{animationDelay: `${0.1 + index * 0.1}s`}}
                  onClick={() => handleExport(format.type)}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${format.color} rounded-lg flex items-center justify-center mr-4 ${format.iconColor}`}>
                      <span className="text-lg">{format.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{format.title}</h4>
                      <p className="text-gray-600 text-sm">{format.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowExportPopup(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-300 hover-scale active-scale"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Popup */}
      {showReportPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {showReportPopup === 'monthly' && 'Generate Laporan Bulanan'}
                {showReportPopup === 'user' && 'Generate Laporan User'}
                {showReportPopup === 'artwork' && 'Generate Laporan Karya'}
                {showReportPopup === 'full' && 'Generate Full Report'}
              </h3>
              <button
                onClick={() => setShowReportPopup(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl hover-scale transition-all"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {showReportPopup === 'monthly' && 'Laporan Bulanan (Data lengkap 30 hari terakhir)'}
                    {showReportPopup === 'user' && 'Laporan User (Analisis perilaku pengguna)'}
                    {showReportPopup === 'artwork' && 'Laporan Karya (Analisis performa karya)'}
                    {showReportPopup === 'full' && 'Full Report (Semua data platform)'}
                  </p>
                  <p className="text-gray-600 text-sm">Proses akan memakan waktu beberapa detik</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Periode
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>30 Hari Terakhir</option>
                    <option>Bulan Ini</option>
                    <option>Kuartal Ini</option>
                    <option>Tahun Ini</option>
                  </select>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detail Laporan
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Statistik Utama</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Analisis Trend</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Chart Visualisasi</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReportPopup(null)}
                className="px-5 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-300 hover-scale active-scale"
              >
                Batal
              </button>
              <button
                onClick={() => handleGenerateReport(showReportPopup)}
                disabled={actionInProgress === `report-${showReportPopup}`}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white rounded-lg font-medium transition-all duration-300 hover-scale active-scale disabled:opacity-50"
              >
                {actionInProgress === `report-${showReportPopup}` ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminFooter />
    </>
  )
}