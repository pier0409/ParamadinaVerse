// pages/mahasiswa/[id]/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import MahasiswaNavbar from '../../../components/layout/MahasiswaNavbar'
import { getArtworks, getArtistInfo, getCommentsForArtwork } from '../../../utils/artworksData'

export default function KaryaDetail() {
  const router = useRouter()
  const { id } = router.query
  const [karya, setKarya] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [relatedArtworks, setRelatedArtworks] = useState([])

  useEffect(() => {
    if (id) {
      // Simulasi loading data
      setTimeout(() => {
        // Gunakan data yang SAMA dari utils/artworksData.js
        const artworks = getArtworks()
        const foundKarya = artworks.find(art => art.id === parseInt(id))
        
        if (foundKarya) {
          setKarya(foundKarya)
          setComments(getCommentsForArtwork(foundKarya.artist))
          
          // Generate karya terkait dari pembuat yang sama
          const sameArtistArtworks = artworks
            .filter(art => art.artist === foundKarya.artist && art.id !== parseInt(id))
            .slice(0, 3)
            .map(art => ({
              id: art.id,
              title: art.title,
              artist: art.artist,
              category: art.category,
              likes: art.likes,
              image: art.image
            }))
          
          // Jika tidak ada karya lain dari pembuat yang sama, tampilkan dari prodi yang sama
          if (sameArtistArtworks.length === 0) {
            const sameProdiArtworks = artworks
              .filter(art => art.prodi === foundKarya.prodi && art.id !== parseInt(id))
              .slice(0, 3)
              .map(art => ({
                id: art.id,
                title: art.title,
                artist: art.artist,
                category: art.category,
                likes: art.likes,
                image: art.image
              }))
            setRelatedArtworks(sameProdiArtworks)
          } else {
            setRelatedArtworks(sameArtistArtworks)
          }
        } else {
          // Redirect ke 404 jika karya tidak ditemukan
          router.push('/404')
        }
        setLoading(false)
      }, 500)
    }
  }, [id])

  const handleLike = () => {
    if (liked) {
      setKarya(prev => ({ ...prev, likes: prev.likes - 1 }))
    } else {
      setKarya(prev => ({ ...prev, likes: prev.likes + 1 }))
    }
    setLiked(!liked)
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        user: 'Anda',
        avatar: 'AN',
        text: newComment,
        time: 'Baru saja'
      }
      setComments([newCommentObj, ...comments])
      setKarya(prev => ({ ...prev, comments: prev.comments + 1 }))
      setNewComment('')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
        <MahasiswaNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1276B5] mb-4"></div>
            <p className="text-gray-600">Memuat detail karya...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!karya) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
        <MahasiswaNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Karya tidak ditemukan</h2>
            <p className="text-gray-600 mb-6">Karya yang Anda cari tidak ditemukan atau telah dihapus.</p>
            <Link href="/mahasiswa/dashboard">
              <button className="px-6 py-3 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                Kembali ke Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const artistInfo = getArtistInfo(karya.artist)

  return (
    <>
      <Head>
        <title>{karya.title} - ParamadinaVerse</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
        <MahasiswaNavbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/mahasiswa/dashboard">
              <button className="flex items-center text-gray-600 hover:text-[#08344F] transition-colors">
                <span className="mr-2">←</span>
                Kembali ke Dashboard
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
                        {karya.category}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {karya.year}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {karya.prodiFull}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
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
                      <span className="font-medium">{karya.likes}</span>
                    </button>
                  </div>
                </div>
                
                {/* Karya Preview */}
                <div className="mb-6">
                  <div className="h-64 md:h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-8xl opacity-20 mb-4">🎨</div>
                      <p className="text-gray-500">Preview karya</p>
                      <p className="text-sm text-gray-400 mt-2">Karya oleh {karya.artist}</p>
                    </div>
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
                      <p className="font-medium text-gray-800">{karya.artist}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Teknik</p>
                      <p className="font-medium text-gray-800">{karya.technique}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Durasi Pengerjaan</p>
                      <p className="font-medium text-gray-800">{karya.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Kategori</p>
                      <p className="font-medium text-gray-800">{karya.category}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Komentar ({karya.comments})
                  </h2>
                </div>
                
                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 flex items-center justify-center text-[#08344F] font-bold">
                      AN
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={`Tulis komentar Anda untuk karya ${karya.artist.split(' ')[0]}...`}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08344F]/20 focus:border-[#08344F] transition-all resize-none"
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                            newComment.trim()
                              ? 'bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white hover:opacity-90'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Kirim Komentar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                
                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3 pb-6 border-b border-gray-100 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 font-bold">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">{comment.user}</span>
                          <span className="text-sm text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))}
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
                    <h3 className="font-bold text-gray-800 text-lg">{karya.artist}</h3>
                    <p className="text-gray-600">{karya.prodiFull}</p>
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
                
                {/* Tombol Lihat Profil Lengkap diarahkan ke halaman profile */}
                <Link href="/mahasiswa/profile">
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
                    <span className="font-bold">{karya.likes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💬</span>
                      <span>Komentar</span>
                    </div>
                    <span className="font-bold">{karya.comments}</span>
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
                      <Link key={art.id} href={`/mahasiswa/${art.id}`}>
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-2xl opacity-60">🎨</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 line-clamp-1">{art.title}</h4>
                            <p className="text-sm text-gray-500">{art.artist}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {art.category}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <span>❤️</span>
                                <span>{art.likes}</span>
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}