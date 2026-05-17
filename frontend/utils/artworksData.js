// utils/artworksData.js

// Data artis yang konsisten
const artists = [
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

// Data prodi
const prodiList = [
  { value: 'dkv', label: 'Desain Komunikasi Visual' },
  { value: 'ti', label: 'Teknik Informatika' },
  { value: 'dp', label: 'Desain Produk' },
  { value: 'ikom', label: 'Ilmu Komunikasi' },
  { value: 'psi', label: 'Psikologi' },
  { value: 'hi', label: 'Hubungan Internasional' },
  { value: 'man', label: 'Manajemen' }
]

// Data kategori
const categories = [
  'Digital Art', 'Illustration', 'Web Development', 'Mobile Development',
  'Product Design', 'Photography', 'Video Production', 'Academic Research',
  'Business Strategy', 'Market Analysis'
]

// Data tags
const tags = [
  'landscape', 'digital painting', 'nature', 'urban', 'illustration',
  'colorful', 'city life', 'web development', 'e-commerce', 'react',
  'mobile app', 'flutter', 'productivity', 'product design', 'ergonomic',
  'sustainable', 'photography', 'documentary', 'video production',
  'social campaign', 'research', 'psychology', 'business', 'startup'
]

// Fungsi untuk generate artworks dengan seed yang konsisten
export const generateArtworks = () => {
  const artworks = []
  
  // Gunakan seed agar hasil random sama setiap kali
  let seed = 12345
  
  for (let i = 1; i <= 48; i++) {
    // Fungsi random sederhana dengan seed
    seed = (seed * 9301 + 49297) % 233280
    const random = seed / 233280
    
    const prodiIndex = Math.floor(random * prodiList.length)
    const categoryIndex = Math.floor(random * 1000 % categories.length)
    const artistIndex = Math.floor(random * 10000 % artists.length)
    
    const prodi = prodiList[prodiIndex]
    const category = categories[categoryIndex]
    const selectedArtist = artists[artistIndex]
    
    // Random tags
    const tagCount = 3 + Math.floor(random * 2)
    const shuffledTags = [...tags].sort(() => 0.5 - random)
    const randomTags = shuffledTags.slice(0, tagCount)

    artworks.push({
      id: i,
      title: `Karya Kreatif ${category} #${i}`,
      artist: selectedArtist.name,
      prodi: prodi.value,
      prodiFull: prodi.label,
      year: 2024,
      description: `Karya ${category.toLowerCase()} yang dibuat oleh ${selectedArtist.name} dengan penuh kreativitas dan inovasi. Menampilkan konsep unik dan penerapan teknik yang menarik.`,
      image: `/images/artworks/${i % 12}.jpg`,
      likes: 20 + Math.floor(random * 80),
      comments: 5 + Math.floor(random * 25),
      tags: randomTags,
      createdAt: `2024-0${1 + Math.floor(random * 8)}-${1 + Math.floor(random * 27)}`,
      views: 100 + Math.floor(random * 400),
      technique: 'Berbagai teknik kreatif',
      dimensions: 'Bervariasi',
      fileSize: 'N/A',
      category: category,
      isMine: false,
      avatar: selectedArtist.avatar,
      content: `Karya ini merupakan hasil dari proses kreatif yang panjang oleh ${selectedArtist.name}. Dengan pendekatan yang inovatif, ${selectedArtist.name.split(' ')[0]} berusaha menyampaikan pesan melalui media ${category.toLowerCase()}. Setiap elemen dalam karya ini memiliki makna dan tujuan tertentu untuk menciptakan pengalaman yang menyeluruh bagi penikmatnya.`,
      materials: 'Digital Tools, Creative Software, Innovative Techniques',
      duration: 'Beberapa minggu',
      webLink: '',
      githubLink: '',
      behanceLink: ''
    })
  }
  
  return artworks
}

// Fungsi untuk mendapatkan atau membuat data artworks
export const getArtworks = () => {
  if (typeof window !== 'undefined') {
    // Cek apakah sudah ada data di localStorage
    const storedArtworks = localStorage.getItem('artworksData')
    if (storedArtworks) {
      return JSON.parse(storedArtworks)
    } else {
      // Generate data baru dan simpan ke localStorage
      const artworks = generateArtworks()
      localStorage.setItem('artworksData', JSON.stringify(artworks))
      return artworks
    }
  }
  // Fallback untuk server-side rendering
  return generateArtworks()
}

// Fungsi untuk mendapatkan data artis berdasarkan nama
export const getArtistInfo = (artistName) => {
  const artist = artists.find(a => a.name === artistName)
  return artist || { 
    avatar: artistName.split(' ').map(n => n[0]).join(''), 
    karyaCount: 10, 
    totalLikes: 300, 
    joined: 2023 
  }
}

// Fungsi untuk mendapatkan komentar berdasarkan artis
export const getCommentsForArtwork = (artistName) => {
  const commentsData = {
    'Ahmad Rizki': [
      { id: 1, user: 'Sari Dewi', avatar: 'SD', text: 'Karya yang sangat bagus Ahmad! Teknik digital painting nya keren.', time: '1 hari lalu' },
      { id: 2, user: 'Rizky Pratama', avatar: 'RP', text: 'Wah keren banget nih karya Ahmad!', time: '3 hari lalu' }
    ],
    'Rina Sari': [
      { id: 1, user: 'Fajar Setiawan', avatar: 'FS', text: 'Rina, karya videonya keren banget! Editingnya smooth.', time: '2 hari lalu' },
      { id: 2, user: 'Maya Indah', avatar: 'MI', text: 'Video production nya bagus Rina! Konsepnya menarik.', time: '4 hari lalu' },
      { id: 3, user: 'Budi Santoso', avatar: 'BS', text: 'Karya video yang sangat profesional Rina!', time: '1 minggu lalu' }
    ],
    'Fajar Setiawan': [
      { id: 1, user: 'Rina Sari', avatar: 'RS', text: 'Fajar, karyamu selalu menginspirasi! Palet warna nya sangat bagus.', time: '2 jam lalu' },
      { id: 2, user: 'Maya Sari', avatar: 'MS', text: 'Wah Fajar, konsepnya unik banget! Suka dengan detail-detail kecilnya!', time: '3 hari lalu' },
      { id: 3, user: 'Budi Santoso', avatar: 'BS', text: 'Fajar Setiawan memang jago nih, tekniknya sangat profesional.', time: '1 minggu lalu' }
    ],
    'Sari Dewi': [
      { id: 1, user: 'Ahmad Rizki', avatar: 'AR', text: 'Sari, ilustrasinya selalu colorful dan menyenangkan!', time: '2 hari lalu' },
      { id: 2, user: 'Dian Anggraini', avatar: 'DA', text: 'Suka banget dengan style ilustrasi Sari!', time: '5 hari lalu' }
    ],
  }

  return commentsData[artistName] || [
    { id: 1, user: 'Rina Sari', avatar: 'RS', text: 'Karya yang sangat menginspirasi! Palet warna nya sangat bagus.', time: '2 jam lalu' },
    { id: 2, user: 'Maya Sari', avatar: 'MS', text: 'Konsepnya unik, suka dengan detail-detail kecilnya!', time: '3 hari lalu' },
    { id: 3, user: 'Budi Santoso', avatar: 'BS', text: 'Teknik yang digunakan sangat profesional.', time: '1 minggu lalu' }
  ]
}