// pages/guest/artworks/[id]/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MainLayout from '../../../../components/layout/MainLayout'
import Link from 'next/link'
import { getArtworks, getArtistInfo, getCommentsForArtwork } from '../../../../utils/artworksData'

export default function GuestArtworkDetail() {
  const router = useRouter()
  const { id } = router.query
  const [karya, setKarya] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [relatedArtworks, setRelatedArtworks] = useState([])

  const [comments, setComments] = useState([])
  const [artistInfo, setArtistInfo] = useState({
    avatar: 'M',
    karyaCount: 0,
    totalLikes: 0,
    joined: '-'
  })

  useEffect(() => {
    if (!router.isReady || !id) return

    const loadData = async () => {
      try {
        // 1. Fetch Detail Karya & Komentar
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${id}`)
        if (!res.ok) {
          router.push('/404')
          return
        }
        const data = await res.json()
        const artwork = data.artwork
        setKarya(artwork)
        setComments(data.comments || [])

        // 2. Fetch Creator Profile & Stats
        const creatorId = artwork.created_by?._id || artwork.created_by
        if (creatorId) {
          const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${creatorId}`)
          if (userRes.ok) {
            const userData = await userRes.json()
            const creator = userData.user || {}
            const stats = userData.statistik || {}
            setArtistInfo({
              avatar: (creator.name || creator.username || 'M').charAt(0).toUpperCase(),
              karyaCount: stats.totalArtwork || 0,
              totalLikes: stats.totalLikes || 0,
              joined: creator.createdAt ? new Date(creator.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : '-'
            })
          }
        }

        // 3. Fetch Related Artworks
        const listRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks`)
        if (listRes.ok) {
          const listData = await listRes.json()
          const categoryId = artwork.category?._id || artwork.category
          const filtered = listData
            .filter(art => (art.category?._id || art.category) === categoryId && art._id !== id)
            .slice(0, 3)
          setRelatedArtworks(filtered)
        }
      } catch (err) {
        console.error('Gagal memuat detail karya:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router.isReady, id])

  const handleLike = async () => {
    // Guest cannot like via API if they are not authenticated (protect middleware)
    // But they can click to toggle local likes count as a visual feedback
    if (liked) {
      setKarya(prev => ({ ...prev, likes: (prev.likes || []).filter(u => u !== 'guest') }))
    } else {
      setKarya(prev => ({ ...prev, likes: [...(prev.likes || []), 'guest'] }))
    }
    setLiked(!liked)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1276B5] mb-4"></div>
              <p className="text-gray-600">Memuat detail karya...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!karya) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Karya tidak ditemukan</h2>
              <p className="text-gray-600 mb-6">Karya yang Anda cari tidak ditemukan atau telah dihapus.</p>
              <Link href="/guest/artworks">
                <button className="px-6 py-3 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                  Kembali ke Galeri
                </button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }


  return (
    <>
      <Head>
        <title>{karya.title} - ParamadinaVerse</title>
      </Head>
      
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <div className="mb-6">
              <Link href="/guest/artworks">
                <button className="flex items-center text-gray-600 hover:text-[#08344F] transition-colors">
                  <span className="mr-2">←</span>
                  Kembali ke Galeri
                </button>
              </Link>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Karya Detail */}
              <div className="lg:col-span-2">
                {/* Karya Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        {karya.title}
                      </h1>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 text-[#08344F] px-3 py-1 rounded-full text-sm font-medium">
                          {karya.categoryName || karya.category?.name || '-'}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                          {karya.createdAt ? new Date(karya.createdAt).getFullYear() : '-'}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                          {karya.programStudi}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Guest hanya bisa like */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                          liked 
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className={liked ? 'text-red-500' : ''}>
                          {liked ? '❤️' : '🤍'}
                        </span>
                        <span className="font-medium">{karya.likes?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Karya Preview */}
                  <div className="mb-6">
                    <div className="h-64 md:h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                      {karya.image_url ? (
                        <img src={karya.image_url} alt={karya.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <div className="text-8xl opacity-20 mb-4">🎨</div>
                          <p className="text-gray-500">Preview karya</p>
                          <p className="text-sm text-gray-400 mt-2">Karya oleh {karya.created_by?.name || karya.created_by?.username || 'Unknown'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Karya Description */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Deskripsi Karya</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {karya.description}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {karya.content}
                      </p>
                    </div>
                  </div>
                  
                  {/* Technical Details */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Detail Karya</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Pembuat</p>
                        <p className="font-medium text-gray-800">{karya.created_by?.name || karya.created_by?.username || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Teknik</p>
                        <p className="font-medium text-gray-800">{karya.teknik || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Durasi Pengerjaan</p>
                        <p className="font-medium text-gray-800">{karya.durasi || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Kategori</p>
                        <p className="font-medium text-gray-800">{karya.categoryName || karya.category?.name || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Guest Restriction Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Komentar ({comments.length})
                  </h2>
                  
                  {/* Guest Info Banner */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-yellow-500 text-2xl">⚠️</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-yellow-800">
                          Anda login sebagai Guest
                        </h3>
                        <div className="mt-2 text-yellow-700">
                          <p>
                            Anda hanya bisa melihat detail karya dan memberikan like. Fitur komentar hanya tersedia untuk mahasiswa yang sudah login.
                          </p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Mahasiswa: Bisa like, komentar, dan upload karya</li>
                            <li>Guest: Hanya bisa like dan melihat karya</li>
                          </ul>
                          <div className="mt-4">
                            <Link href="/auth/login">
                              <button className="px-6 py-2.5 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                                Login sebagai Mahasiswa
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comments List (Read Only for Guest) */}
                  <div className="space-y-6">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment._id} className="flex items-start gap-3 pb-6 border-b border-gray-100 last:border-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 font-bold">
                            {comment.user?.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-800">{comment.user?.name || comment.user?.username || 'Anonim'}</span>
                              <span className="text-sm text-gray-500">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                            </div>
                            <p className="text-gray-700">{comment.comment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">💬</div>
                        <p className="text-gray-600">Belum ada komentar untuk karya ini</p>
                        <p className="text-sm text-gray-500 mt-2">Jadilah yang pertama memberikan komentar!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Artist Info & Related */}
              <div className="space-y-6">
                {/* Artist Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 flex items-center justify-center text-[#08344F] text-2xl font-bold border-2 border-white shadow">
                      {artistInfo.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{karya.created_by?.name || karya.created_by?.username}</h3>
                      <p className="text-gray-600">{karya.programStudi}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Karya</span>
                      <span className="font-bold text-[#08344F]">{artistInfo.karyaCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Total Likes</span>
                      <span className="font-bold text-[#08344F]">{artistInfo.totalLikes}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Bergabung</span>
                      <span className="font-bold text-[#08344F]">{artistInfo.joined}</span>
                    </div>
                  </div>
                  
                  {/* Tombol Lihat Profil Lengkap untuk guest */}
                  <Link 
                    href={{
                      pathname: '/guest/profile-mahasiswa',
                      query: { student: (karya.created_by?.name || karya.created_by?.username || '').toLowerCase().replace(/\s+/g, '-') }
                    }}
                  >
                    <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                      Lihat Profil Lengkap
                    </button>
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="bg-gradient-to-r from-[#08344F] to-[#1276B5] rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Statistik Karya</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👁️</span>
                        <span>Views</span>
                      </div>
                      <span className="font-bold">{karya.views}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">❤️</span>
                        <span>Likes</span>
                      </div>
                      <span className="font-bold">{karya.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        <span>Komentar</span>
                      </div>
                      <span className="font-bold">{comments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📅</span>
                        <span>Diunggah</span>
                      </div>
                      <span className="font-bold">{formatDate(karya.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Related Artworks */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {relatedArtworks.length > 0 && relatedArtworks[0].artist === karya.artist 
                      ? `Karya Lain dari ${karya.artist}` 
                      : 'Karya Terkait'}
                  </h3>
                  <div className="space-y-4">
                    {relatedArtworks.length > 0 ? (
                      relatedArtworks.map((art) => (
                        <Link key={art._id} href={`/guest/artworks/${art._id}`}>
                          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                              {art.image_url || art.thumbnail ? (
                                <img src={art.image_url || art.thumbnail} alt={art.title} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl opacity-60">🎨</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 line-clamp-1">{art.title}</h4>
                              <p className="text-sm text-gray-500">{art.created_by?.name || art.created_by?.username}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {art.categoryName || art.category?.name || '-'}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <span>❤️</span>
                                  <span>{art.likes?.length || 0}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Belum ada karya lain dari pembuat ini
                      </div>
                    )}
                  </div>
                </div>

                {/* Guest Login CTA */}
                <div className="bg-gradient-to-r from-[#08344F] to-[#1276B5] rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Ingin Lebih Banyak Fitur?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">✅</span>
                      <span className="text-sm">Like karya</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl mr-3">✅</span>
                      <span className="text-sm">Lihat detail karya</span>
                    </div>
                    <div className="flex items-center opacity-50">
                      <span className="text-xl mr-3">❌</span>
                      <span className="text-sm">Tambah komentar</span>
                    </div>
                    <div className="flex items-center opacity-50">
                      <span className="text-xl mr-3">❌</span>
                      <span className="text-sm">Upload karya sendiri</span>
                    </div>
                  </div>
                  <Link href="/auth/login">
                    <button className="w-full mt-6 px-4 py-3 bg-white text-[#08344F] font-medium rounded-lg hover:bg-gray-100 transition-colors">
                      Login untuk Fitur Lengkap
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}