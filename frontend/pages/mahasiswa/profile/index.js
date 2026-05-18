// pages/mahasiswa/profile/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import MahasiswaNavbar from '../../../components/layout/MahasiswaNavbar'
import MahasiswaFooter from '../../../components/layout/MahasiswaFooter'

export default function MahasiswaProfile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('karya')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    prodi: '',
    semester: '',
    bio: '',
    instagram: '',
    linkedin: '',
  })
  const [artworks, setArtworks] = useState([])
  const [loadingArtworks, setLoadingArtworks] = useState(true)

  const [stats, setStats] = useState({
    totalKarya: 0,
    totalLikes: 0,
    totalKomentar: 0,
    acceptedKarya: 0,
    pendingKarya: 0,
    rejectedKarya: 0,
  })

  // =============================================
  // FETCH PROFILE + KARYA dari backend
  // GET /api/users/:id
  // Response: { user, statistik, karya[] }
  // =============================================
  const fetchMyProfile = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user') || 'null')?.token

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // Set artworks dari response backend
      // Field dari backend: _id, namaKarya, kategori, deskripsi, status,
      //                     totalLike, totalKomentar, createdAt, image, prodi
      setArtworks(data.karya || [])

      // Set statistik dari response backend
      const karya = data.karya || []
      setStats({
        totalKarya: data.statistik?.totalKarya || karya.length,
        totalLikes: data.statistik?.totalLikes || 0,
        totalKomentar: data.statistik?.totalKomentar || 0,
        acceptedKarya: karya.filter(k => k.status === 'accepted').length,
        pendingKarya: karya.filter(k => k.status === 'pending').length,
        rejectedKarya: karya.filter(k => k.status === 'denied').length,
      })

      // Update formData dari data user terbaru di backend
      if (data.user) {
        setFormData({
          username: data.user.username || '',
          email: '',
          prodi: data.user.prodi || '',
          semester: data.user.semester || '',
          bio: data.user.description || '',
          instagram: data.user.instagram || '',
          linkedin: data.user.linkedin || '',
        })
      }
    } catch (err) {
      console.error('Gagal fetch profile:', err)
    } finally {
      setLoadingArtworks(false)
    }
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')

    if (!userData) {
      router.push('/auth/login')
      return
    }

    setUser(userData)
    fetchMyProfile(userData._id || userData.id)

    setFormData({
      username: userData.name || userData.username || '',
      email: userData.email || '',
      prodi: userData.prodi || '',
      semester: userData.semester || '',
      bio: userData.description || '',
      instagram: userData.instagram || '',
      linkedin: userData.linkedin || '',
    })
  }, [])

  const handleEditProfile = () => setIsEditing(true)

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (user) {
      setFormData({
        username: user.name || user.username || '',
        email: user.email || '',
        prodi: user.prodi || '',
        semester: user.semester || '',
        bio: user.description || '',
        instagram: user.instagram || '',
        linkedin: user.linkedin || '',
      })
    }
  }

  // =============================================
  // SAVE PROFILE ke backend
  // PUT /api/users/profile
  // =============================================
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      const token = JSON.parse(localStorage.getItem('user') || 'null')?.token

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            prodi: formData.prodi,
            semester: formData.semester,
            nim: user?.nim || '',
            description: formData.bio,
            instagram: formData.instagram,
            linkedin: formData.linkedin,
          }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // Update localStorage dengan data terbaru
      const updatedUser = {
        ...user,
        name: formData.username,
        username: formData.username,
        prodi: formData.prodi,
        semester: formData.semester,
        description: formData.bio,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
      }

      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
      alert('Profil berhasil diperbarui!')
    } catch (err) {
      alert('Gagal menyimpan profil: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'denied': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Diterima'
      case 'pending': return 'Menunggu Review'
      case 'denied': return 'Ditolak'
      default: return '-'
    }
  }

  const displayName = user?.name || user?.username || 'Mahasiswa'

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-[#08344F] to-[#1276B5]"></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
      <MahasiswaNavbar />

      <div className="pt-8 md:pt-12"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Profile */}
        <div className="bg-gradient-to-r from-[#08344F] to-[#1276B5] rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-white/20 to-white/10 border-4 border-white/30 shadow-2xl flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    {displayName.split(' ').map(n => n[0]).join('').toUpperCase() || 'MS'}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <button
                    onClick={handleEditProfile}
                    className="p-2 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white rounded-full hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Info Profile */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    {/* Nama */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="bg-white/20 text-white placeholder-white/50 rounded-lg px-4 py-2 w-full md:w-auto"
                          placeholder="Nama Lengkap"
                        />
                      ) : displayName}
                    </h1>

                    {/* Prodi, Semester, NIM */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name="prodi"
                            value={formData.prodi}
                            onChange={handleInputChange}
                            className="bg-white/20 text-white placeholder-white/50 rounded-lg px-4 py-1 text-sm"
                            placeholder="Program Studi"
                          />
                          <input
                            type="text"
                            name="semester"
                            value={formData.semester}
                            onChange={handleInputChange}
                            className="bg-white/20 text-white placeholder-white/50 rounded-lg px-4 py-1 text-sm"
                            placeholder="Semester"
                          />
                        </>
                      ) : (
                        <>
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {user.prodi || 'Program Studi'}
                          </span>
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Semester {user.semester || '-'}
                          </span>
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                            NIM: {user.nim || '-'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tombol Edit / Simpan */}
                  {isEditing ? (
                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-4 py-2 bg-white text-[#08344F] font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#08344F] border-t-transparent rounded-full animate-spin"></div>
                            Menyimpan...
                          </>
                        ) : 'Simpan'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <Link href="/mahasiswa/upload">
                        <button className="px-4 py-2 bg-white text-[#08344F] font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                          + Upload Karya
                        </button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="mb-6">
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-white/20 text-white placeholder-white/50 rounded-lg px-4 py-3 resize-none"
                      placeholder="Tulis bio Anda..."
                    />
                  ) : (
                    <p className="text-white/90 text-lg">
                      {user.description || formData.bio || 'Mahasiswa kreatif yang suka berbagi karya seni digital dan desain.'}
                    </p>
                  )}
                </div>

                {/* Social Media */}
                <div className="flex flex-wrap gap-4">
                  {isEditing ? (
                    <div className="space-y-3 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          className="bg-white/20 text-white placeholder-white/50 rounded-lg px-4 py-2"
                          placeholder="Instagram"
                        />
                        <input
                          type="text"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="bg-white/20 text-white placeholder-white/50 rounded-lg px-4 py-2"
                          placeholder="LinkedIn"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {(user.instagram || formData.instagram) && (
                        <a
                          href={`https://instagram.com/${(user.instagram || '').replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <span className="text-lg">📷</span>
                          <span>{user.instagram || '@instagram'}</span>
                        </a>
                      )}
                      {(user.linkedin || formData.linkedin) && (
                        <a
                          href={user.linkedin?.includes('http') ? user.linkedin : `https://${user.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <span className="text-lg">💼</span>
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Karya', value: stats.totalKarya, icon: '🎨' },
            { label: 'Total Likes', value: stats.totalLikes, icon: '❤️' },
            { label: 'Total Komentar', value: stats.totalKomentar, icon: '💬' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#08344F]">{stat.value}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 rounded-lg">
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Karya */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Karya Diterima</p>
                <p className="text-2xl font-bold">{stats.acceptedKarya}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg"><span className="text-xl">✓</span></div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Menunggu Review</p>
                <p className="text-2xl font-bold">{stats.pendingKarya}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg"><span className="text-xl">⏳</span></div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Karya Ditolak</p>
                <p className="text-2xl font-bold">{stats.rejectedKarya}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg"><span className="text-xl">✗</span></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { key: 'karya', label: `Karya Saya (${artworks.length})` },
                { key: 'liked', label: 'Disukai (0)' },
                { key: 'activity', label: 'Aktivitas' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#08344F] text-[#08344F]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab: Karya Saya */}
        {activeTab === 'karya' && (
          <>
            {loadingArtworks ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1276B5]"></div>
              </div>
            ) : artworks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Karya</h3>
                <p className="text-gray-600 mb-6">Mulai upload karya pertama Anda!</p>
                <Link href="/mahasiswa/upload">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                    + Upload Karya
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork) => (
                  <div key={artwork._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10">
                      {artwork.image ? (
                        <img
                          src={artwork.image}
                          alt={artwork.namaKarya}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-4xl">🎨</span>
                            <p className="text-sm text-gray-600 mt-2">{artwork.kategori}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(artwork.status)}`}>
                          {getStatusText(artwork.status)}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{artwork.namaKarya}</h3>
                      <p className="text-sm text-gray-500 mb-3">{artwork.kategori}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{new Date(artwork.createdAt).toLocaleDateString('id-ID')}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{artwork.prodi}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-red-500">❤️</span>
                            <span className="font-medium">{artwork.totalLike || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-blue-500">💬</span>
                            <span className="font-medium">{artwork.totalKomentar || 0}</span>
                          </div>
                        </div>
                        <Link href={`/mahasiswa/karya/${artwork._id}`}>
                          <button className="px-4 py-2 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white text-sm rounded-lg hover:opacity-90 transition-opacity">
                            Lihat Detail
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab: Disukai */}
        {activeTab === 'liked' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Karya yang Disukai</h3>
            <p className="text-gray-600 mb-6">Karya yang telah Anda sukai akan muncul di sini</p>
            <Link href="/guest/artworks">
              <button className="px-6 py-3 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                Jelajahi Galeri
              </button>
            </Link>
          </div>
        )}

        {/* Tab: Aktivitas */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Aktivitas Terbaru</h3>
              <div className="space-y-4">
                {artworks.slice(0, 5).map((artwork) => (
                  <div key={artwork._id} className={`flex items-center p-3 rounded-lg ${
                    artwork.status === 'accepted' ? 'bg-green-50' :
                    artwork.status === 'pending' ? 'bg-blue-50' : 'bg-red-50'
                  }`}>
                    <div className={`p-2 rounded-lg mr-4 ${
                      artwork.status === 'accepted' ? 'bg-green-100 text-green-600' :
                      artwork.status === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <span>{artwork.status === 'accepted' ? '✓' : artwork.status === 'pending' ? '🎨' : '✗'}</span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {artwork.status === 'accepted' ? 'Karya Anda diterima' :
                         artwork.status === 'pending' ? 'Anda mengupload karya baru' : 'Karya Anda ditolak'}
                      </p>
                      <p className="text-sm text-gray-500">
                        "{artwork.namaKarya}" • {new Date(artwork.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
                {artworks.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Belum ada aktivitas</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <MahasiswaFooter />
    </div>
  )
}