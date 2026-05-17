// pages/guest/profile-mahasiswa/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MainLayout from '../../../components/layout/MainLayout'
import Link from 'next/link'

export default function GuestProfileMahasiswa() {
  const router = useRouter()
  const { student: studentSlug } = router.query
  
  // Data artis dari utils/artworksData.js
  const artistsData = [
    { name: 'Ahmad Rizki', avatar: 'AR', karyaCount: 10, totalLikes: 320, joined: 2023 },
    { name: 'Sari Dewi', avatar: 'SD', karyaCount: 8, totalLikes: 285, joined: 2023 },
    { name: 'Budi Santoso', avatar: 'BS', karyaCount: 12, totalLikes: 410, joined: 2022 },
    { name: 'Dian Anggraini', avatar: 'DA', karyaCount: 9, totalLikes: 275, joined: 2023 },
    { name: 'Maya Indah', avatar: 'MI', karyaCount: 7, totalLikes: 240, joined: 2024 },
    { name: 'Hendra Wijaya', avatar: 'HW', karyaCount: 11, totalLikes: 380, joined: 2022 },
    { name: 'Rizky Pratama', avatar: 'RP', karyaCount: 8, totalLikes: 290, joined: 2023 },
    { name: 'Lisa Hartono', avatar: 'LH', karyaCount: 10, totalLikes: 350, joined: 2023 },
    { name: 'Andi Setiawan', avatar: 'AS', karyaCount: 9, totalLikes: 310, joined: 2023 },
    { name: 'Sarah Miller', avatar: 'SM', karyaCount: 6, totalLikes: 220, joined: 2024 },
    { name: 'Kevin Tan', avatar: 'KT', karyaCount: 8, totalLikes: 270, joined: 2023 },
    { name: 'Rina Sari', avatar: 'RS', karyaCount: 7, totalLikes: 250, joined: 2024 },
    { name: 'Fajar Setiawan', avatar: 'FS', karyaCount: 15, totalLikes: 480, joined: 2022 },
    { name: 'Maya Sari', avatar: 'MS', karyaCount: 9, totalLikes: 310, joined: 2023 },
    { name: 'Rio Pratama', avatar: 'RP', karyaCount: 8, totalLikes: 290, joined: 2023 },
    { name: 'Dewi Anggraini', avatar: 'DA', karyaCount: 7, totalLikes: 260, joined: 2024 }
  ]

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [artworks, setArtworks] = useState([])

  // Dapatkan data mahasiswa dari slug
  const getStudentFromSlug = (slug) => {
    const student = artistsData.find(artist => 
      artist.name.toLowerCase().replace(/\s+/g, '-') === slug
    )
    
    if (student) {
      // Tambahkan informasi tambahan untuk profil
      return {
        ...student,
        prodi: getRandomProdi(),
        prodiFull: getProdiFullName(getRandomProdi()),
        semester: Math.floor(Math.random() * 8) + 1,
        nim: `2023120${String(student.id || Math.floor(Math.random() * 100)).padStart(2, '0')}`,
        bio: `Mahasiswa Universitas Paramadina yang aktif dalam ${student.karyaCount} karya kreatif. ${student.totalLikes}+ likes telah diperoleh dari berbagai karya yang diunggah.`,
        instagram: `@${student.name.toLowerCase().replace(/\s+/g, '')}`,
        twitter: `@${student.name.split(' ')[0].toLowerCase()}_creative`,
        linkedin: `${student.name.toLowerCase().replace(/\s+/g, '-')}`,
        portfolio: `${student.name.toLowerCase().replace(/\s+/g, '-')}.portfolio.com`,
        skills: getRandomSkills(),
        pendidikan: getRandomPendidikan(),
        pencapaian: getRandomPencapaian(),
        socialMedia: {
          instagram: `@${student.name.toLowerCase().replace(/\s+/g, '')}`,
          twitter: `@${student.name.split(' ')[0].toLowerCase()}_creative`,
          linkedin: `${student.name.toLowerCase().replace(/\s+/g, '-')}`,
          behance: student.name.toLowerCase().replace(/\s+/g, '')
        }
      }
    }
    return null
  }

  // Helper functions
  const getRandomProdi = () => {
    const prodis = ['dkv', 'ti', 'dp', 'ikom', 'psi', 'hi', 'man']
    return prodis[Math.floor(Math.random() * prodis.length)]
  }

  const getProdiFullName = (prodi) => {
    const prodiMap = {
      'dkv': 'Desain Komunikasi Visual',
      'ti': 'Teknik Informatika',
      'dp': 'Desain Produk',
      'ikom': 'Ilmu Komunikasi',
      'psi': 'Psikologi',
      'hi': 'Hubungan Internasional',
      'man': 'Manajemen'
    }
    return prodiMap[prodi] || 'Program Studi'
  }

  const getRandomSkills = () => {
    const allSkills = [
      'Digital Painting', 'Illustration', 'Graphic Design', 'UI/UX',
      'Web Development', 'Mobile Development', '3D Modeling', 'Photography',
      'Video Production', 'Research', 'Data Analysis', 'Product Design',
      'Creative Writing', 'Marketing', 'Business Strategy'
    ]
    return allSkills.sort(() => 0.5 - Math.random()).slice(0, 5)
  }

  const getRandomPendidikan = () => {
    const schools = [
      'SMA Negeri 1 Jakarta',
      'SMA Negeri 3 Bandung',
      'SMA Negeri 8 Surabaya',
      'SMA Negeri 5 Yogyakarta',
      'SMA Negeri 2 Medan',
      'SMA Negeri 1 Denpasar',
      'SMA Negeri 4 Semarang'
    ]
    return `${schools[Math.floor(Math.random() * schools.length)]} (2020-2023)`
  }

  const getRandomPencapaian = () => {
    const achievements = [
      'Juara 1 Lomba Kreatif Nasional 2023',
      'Finalis Kompetisi Desain Digital 2024',
      'Best Student Award 2023',
      'Juara 2 Hackathon Web Development',
      'Best Photography Award 2024',
      'Finalis Business Plan Competition 2023',
      'Juara 3 Market Research Competition'
    ]
    return achievements[Math.floor(Math.random() * achievements.length)]
  }

  useEffect(() => {
    // Simulasi loading
    setLoading(true)
    
    setTimeout(() => {
      // Jika ada student slug dari query, gunakan itu
      if (studentSlug) {
        const student = getStudentFromSlug(studentSlug)
        setSelectedStudent(student)
      } else {
        // Default ke Ahmad Rizki
        setSelectedStudent(getStudentFromSlug('ahmad-rizki'))
      }
      
      // Simulasi load artworks
      const generatedArtworks = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `Karya Kreatif #${i + 1}`,
        category: ['Digital Art', 'Illustration', 'Web Development', 'Photography'][i % 4],
        likes: Math.floor(Math.random() * 100) + 20,
        comments: Math.floor(Math.random() * 30) + 5,
        views: Math.floor(Math.random() * 500) + 100,
        status: 'accepted',
        date: '2024-01-15',
        year: 2024
      }))
      
      setArtworks(generatedArtworks)
      setLoading(false)
    }, 800)
  }, [studentSlug])

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1276B5] mb-4"></div>
              <p className="text-gray-600">Memuat profil...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!selectedStudent) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Profil tidak ditemukan</h2>
              <p className="text-gray-600 mb-6">Profil mahasiswa yang Anda cari tidak tersedia.</p>
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
        <title>{selectedStudent.name} - Profil Mahasiswa - ParamadinaVerse</title>
        <meta name="description" content={selectedStudent.bio} />
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

            {/* Header Profile */}
            <div className="bg-gradient-to-r from-[#08344F] to-[#1276B5] rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-white/20 to-white/10 border-4 border-white/30 shadow-2xl flex items-center justify-center">
                      <span className="text-4xl md:text-5xl font-bold text-white">
                        {selectedStudent.avatar}
                      </span>
                    </div>
                  </div>
                  
                  {/* Info Profile */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {selectedStudent.name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {selectedStudent.prodiFull}
                          </span>
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Semester {selectedStudent.semester}
                          </span>
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                            NIM: {selectedStudent.nim}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bio */}
                    <div className="mb-6">
                      <p className="text-white/90 text-lg">
                        {selectedStudent.bio}
                      </p>
                    </div>
                    
                    {/* Social Media */}
                    <div className="flex flex-wrap gap-4">
                      <a href={`https://instagram.com/${selectedStudent.socialMedia.instagram.replace('@', '')}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                        <span className="text-lg">📷</span>
                        <span>{selectedStudent.socialMedia.instagram}</span>
                      </a>
                      <a href={`https://twitter.com/${selectedStudent.socialMedia.twitter.replace('@', '')}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                        <span className="text-lg">🐦</span>
                        <span>{selectedStudent.socialMedia.twitter}</span>
                      </a>
                      <a href={`https://linkedin.com/in/${selectedStudent.socialMedia.linkedin}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                        <span className="text-lg">💼</span>
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Karya</p>
                    <p className="text-2xl font-bold text-[#08344F]">{selectedStudent.karyaCount}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 rounded-lg">
                    <span className="text-xl">🎨</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Likes</p>
                    <p className="text-2xl font-bold text-[#08344F]">{selectedStudent.totalLikes}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 rounded-lg">
                    <span className="text-xl">❤️</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Bergabung</p>
                    <p className="text-2xl font-bold text-[#08344F]">{selectedStudent.joined}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 rounded-lg">
                    <span className="text-xl">👥</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Program Studi</p>
                    <p className="text-2xl font-bold text-[#08344F]">{selectedStudent.prodiFull.split(' ')[0]}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 rounded-lg">
                    <span className="text-xl">🎓</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Grid Informasi */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2">
                {/* Keahlian */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Keahlian</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedStudent.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 text-[#08344F] text-sm font-medium rounded-full border border-[#08344F]/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Karya Mahasiswa */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Karya Mahasiswa</h3>
                    <span className="text-sm text-gray-500">
                      {artworks.length} karya
                    </span>
                  </div>

                  {artworks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {artworks.map((karya) => (
                        <Link key={karya.id} href={`/guest/artworks/${karya.id}`}>
                          <div className="border border-gray-200 rounded-xl p-5 hover:border-[#08344F]/30 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-bold text-gray-800 text-lg line-clamp-1">
                                  {karya.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="px-2 py-1 bg-[#08344F]/10 text-[#08344F] text-xs rounded">
                                    {karya.category}
                                  </span>
                                  <span className="text-gray-500 text-sm">
                                    {karya.year}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center text-red-500">
                                <span className="mr-1">❤️</span>
                                <span className="font-medium">{karya.likes}</span>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-[#08344F] text-sm font-medium">
                                Lihat detail →
                              </span>
                              <div className="flex items-center space-x-3 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <span>👁️</span>
                                  <span>{karya.views}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <span>💬</span>
                                  <span>{karya.comments}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🎨</div>
                      <p className="text-gray-500">Belum ada karya yang diupload</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Info Kontak */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Kontak</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium text-gray-800 break-all">{selectedStudent.name.toLowerCase().replace(/\s+/g, '.')}@student.paramadina.ac.id</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Instagram</p>
                      <a 
                        href={`https://instagram.com/${selectedStudent.socialMedia.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#08344F] hover:underline"
                      >
                        {selectedStudent.socialMedia.instagram}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Pendidikan & Pencapaian */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Pendidikan & Pencapaian</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-[#08344F]/5 to-[#1276B5]/5 rounded-lg border border-[#08344F]/10">
                      <p className="text-sm text-gray-500 mb-1">Pendidikan Terakhir</p>
                      <p className="font-medium text-gray-800">{selectedStudent.pendidikan}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-[#08344F]/5 to-[#1276B5]/5 rounded-lg border border-[#08344F]/10">
                      <p className="text-sm text-gray-500 mb-1">Pencapaian</p>
                      <p className="font-medium text-gray-800">{selectedStudent.pencapaian}</p>
                    </div>
                  </div>
                </div>

                {/* Guest Info */}
                <div className="bg-gradient-to-r from-[#08344F] to-[#1276B5] rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Info untuk Guest</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">✅</span>
                      <span className="text-sm">Lihat profil mahasiswa</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl mr-3">✅</span>
                      <span className="text-sm">Lihat karya mahasiswa</span>
                    </div>
                    <div className="flex items-center opacity-50">
                      <span className="text-xl mr-3">❌</span>
                      <span className="text-sm">Kirim pesan langsung</span>
                    </div>
                    <div className="flex items-center opacity-50">
                      <span className="text-xl mr-3">❌</span>
                      <span className="text-sm">Beri komentar</span>
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