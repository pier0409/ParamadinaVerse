// pages/mahasiswa/upload/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MahasiswaLayout from '../../../components/layout/MahasiswaLayout'

export default function UploadKarya() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    file: null,
    technique: '',
    dimensions: '',
    duration: '',
    prodi: '',
    year: new Date().getFullYear()
  })
  
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [errors, setErrors] = useState({})
  
  // Popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [showCancelPopup, setShowCancelPopup] = useState(false)
  const [popupData, setPopupData] = useState(null)
  const [uploadedArtworkId, setUploadedArtworkId] = useState(null)

  // Kategori karya
  const categories = [
    { value: '', label: 'Pilih Kategori' },
    { value: 'Digital Art', label: 'Digital Art' },
    { value: 'Illustration', label: 'Illustration' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Product Design', label: 'Product Design' },
    { value: 'Photography', label: 'Photography' },
    { value: 'Video Production', label: 'Video Production' },
    { value: 'Academic Research', label: 'Academic Research' },
    { value: 'Business Strategy', label: 'Business Strategy' },
    { value: 'Market Analysis', label: 'Market Analysis' },
    { value: 'Graphic Design', label: 'Graphic Design' },
    { value: '3D Modeling', label: '3D Modeling' },
    { value: 'UI/UX Design', label: 'UI/UX Design' },
    { value: 'Creative Writing', label: 'Creative Writing' },
  ]

  // Program Studi
  const prodiOptions = [
    { value: '', label: 'Pilih Program Studi' },
    { value: 'dkv', label: 'Desain Komunikasi Visual' },
    { value: 'ti', label: 'Teknik Informatika' },
    { value: 'dp', label: 'Desain Produk' },
    { value: 'ikom', label: 'Ilmu Komunikasi' },
    { value: 'psi', label: 'Psikologi' },
    { value: 'hi', label: 'Hubungan Internasional' },
    { value: 'man', label: 'Manajemen' },
  ]

  // Teknik/Software yang umum digunakan
  const techniqueOptions = [
    { value: '', label: 'Pilih Teknik/Software' },
    { value: 'Adobe Photoshop', label: 'Adobe Photoshop' },
    { value: 'Adobe Illustrator', label: 'Adobe Illustrator' },
    { value: 'Figma', label: 'Figma' },
    { value: 'Blender', label: 'Blender' },
    { value: 'React.js', label: 'React.js' },
    { value: 'Vue.js', label: 'Vue.js' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Flutter', label: 'Flutter' },
    { value: 'Android Studio', label: 'Android Studio' },
    { value: 'Adobe Premiere Pro', label: 'Adobe Premiere Pro' },
    { value: 'After Effects', label: 'After Effects' },
    { value: 'Canva', label: 'Canva' },
    { value: 'Procreate', label: 'Procreate' },
    { value: 'Traditional Art', label: 'Seni Tradisional' },
    { value: 'Lainnya', label: 'Lainnya' },
  ]

  useEffect(() => {
    // Cek apakah user sudah login dan role mahasiswa
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (!userData || userData.role !== 'mahasiswa') {
      router.push('/auth/login')
      return
    }
    
    // Set data user dengan prodi default
    const userWithProdi = {
      ...userData,
      prodi: userData.prodi || 'ti',
      prodiFull: getProdiFullName(userData.prodi || 'ti')
    }
    
    setUser(userWithProdi)
    
    // Set prodi dari user jika ada
    if (userData.prodi) {
      setFormData(prev => ({
        ...prev,
        prodi: userData.prodi
      }))
    }
    
    setLoading(false)
  }, [router])

  const getProdiFullName = (prodiCode) => {
    const prodi = prodiOptions.find(p => p.value === prodiCode)
    return prodi ? prodi.label : 'Program Studi'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validasi file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4']
      const maxSize = 50 * 1024 * 1024 // 50MB
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          file: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, PDF, atau MP4.'
        }))
        return
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          file: 'Ukuran file terlalu besar. Maksimal 50MB.'
        }))
        return
      }
      
      setFormData(prev => ({
        ...prev,
        file: file
      }))
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl('')
      }
      
      // Clear error
      if (errors.file) {
        setErrors(prev => ({
          ...prev,
          file: ''
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) newErrors.title = 'Judul karya wajib diisi'
    if (!formData.category) newErrors.category = 'Pilih kategori karya'
    if (!formData.description.trim()) newErrors.description = 'Deskripsi karya wajib diisi'
    if (!formData.file) newErrors.file = 'File karya wajib diunggah'
    if (!formData.prodi) newErrors.prodi = 'Pilih program studi'
    if (!formData.technique) newErrors.technique = 'Pilih teknik/software yang digunakan'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const uploadToServer = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artworks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        userId: user.id, // ⬅️ WAJIB
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengirim karya");
  }

  return data;
};





  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0]
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    
    // Show confirmation popup
    setPopupData({
      title: formData.title,
      category: categories.find(c => c.value === formData.category)?.label || formData.category,
      prodi: getProdiFullName(formData.prodi),
      technique: formData.technique,
      fileSize: formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(2)} MB` : 'N/A'
    })
    setShowConfirmPopup(true)
  }

    const confirmSubmit = async () => {
  try {
    setShowConfirmPopup(false);
    setIsUploading(true);

    const savedArtwork = await uploadToServer();

    setUploadedArtworkId(savedArtwork.id);
    setShowSuccessPopup(true);
  } catch (err) {
    alert(err.message);
  } finally {
    setIsUploading(false);
  }
  };


  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false)
    // Redirect ke halaman karya saya
    router.push('/mahasiswa/profile')
  }

  const handleCancelClick = () => {
    // Check if form has any data
    const hasData = formData.title || formData.category || formData.description || formData.file
    
    if (hasData) {
      setShowCancelPopup(true)
    } else {
      // If no data, just redirect
      router.push('/mahasiswa/dashboard')
    }
  }

  const confirmCancel = () => {
    setShowCancelPopup(false)
    router.push('/mahasiswa/dashboard')
  }

  const cancelCancel = () => {
    setShowCancelPopup(false)
  }

  if (loading) {
    return (
      <MahasiswaLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1276B5] mb-4"></div>
            <p className="text-gray-600">Memuat halaman upload...</p>
          </div>
        </div>
      </MahasiswaLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Upload Karya - ParamadinaVerse</title>
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes checkmark {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .animate-slideUp {
            animation: slideUp 0.4s ease-out forwards;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out forwards;
          }
          
          .animate-checkmark {
            animation: checkmark 0.5s ease-out forwards;
          }
          
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
          
          .confetti {
            position: fixed;
            width: 15px;
            height: 15px;
            background: var(--color);
            top: -20px;
            opacity: 0;
            animation: confetti 2s ease-out forwards;
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
            transform: scale(0.98);
          }
        `}</style>
      </Head>
      
      <MahasiswaLayout>
        <div className="py-8">
          {/* Page Header */}
          <div className="mb-8 animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Upload Karya Baru
            </h1>
            <p className="text-gray-600">
              Kirim karya Anda untuk ditinjau Admin sebelum dipublikasikan
            </p>
          </div>

          {/* Warning Banner */}
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-500 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Proses Peninjauan
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Karya yang Anda upload akan diperiksa terlebih dahulu oleh Admin untuk memastikan:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Kesesuaian dengan ketentuan platform</li>
                    <li>Kualitas karya yang memadai</li>
                    <li>Orisinalitas karya</li>
                    <li>Kelengkapan informasi</li>
                  </ul>
                  <p className="mt-2 font-medium">
                    Proses peninjauan membutuhkan waktu 1-3 hari kerja.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6 animate-scaleIn" style={{animationDelay: '0.3s'}}>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Informasi Karya
                </h2>
                
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="mb-6 animate-fadeIn" style={{animationDelay: '0.4s'}}>
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                      Judul Karya <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Contoh: Website E-Commerce Modern"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all hover-scale ${
                        errors.title 
                          ? 'border-red-500 focus:ring-red-500/20 animate-shake' 
                          : 'border-gray-300 focus:ring-[#08344F]/20 focus:border-[#08344F]'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  {/* Category & Prodi Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Category */}
                    <div className="animate-fadeIn" style={{animationDelay: '0.5s'}}>
                      <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                        Kategori <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all hover-scale ${
                          errors.category 
                            ? 'border-red-500 focus:ring-red-500/20 animate-shake' 
                            : 'border-gray-300 focus:ring-[#08344F]/20 focus:border-[#08344F]'
                        }`}
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                      )}
                    </div>

                    {/* Prodi */}
                    <div className="animate-fadeIn" style={{animationDelay: '0.6s'}}>
                      <label htmlFor="prodi" className="block text-gray-700 font-medium mb-2">
                        Program Studi <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="prodi"
                        name="prodi"
                        value={formData.prodi}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all hover-scale ${
                          errors.prodi 
                            ? 'border-red-500 focus:ring-red-500/20 animate-shake' 
                            : 'border-gray-300 focus:ring-[#08344F]/20 focus:border-[#08344F]'
                        }`}
                      >
                        {prodiOptions.map((prodi) => (
                          <option key={prodi.value} value={prodi.value}>
                            {prodi.label}
                          </option>
                        ))}
                      </select>
                      {errors.prodi && (
                        <p className="mt-1 text-sm text-red-500">{errors.prodi}</p>
                      )}
                    </div>
                  </div>

                  {/* Technique & Duration Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Technique */}
                    <div className="animate-fadeIn" style={{animationDelay: '0.7s'}}>
                      <label htmlFor="technique" className="block text-gray-700 font-medium mb-2">
                        Teknik/Software <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="technique"
                        name="technique"
                        value={formData.technique}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all hover-scale ${
                          errors.technique 
                            ? 'border-red-500 focus:ring-red-500/20 animate-shake' 
                            : 'border-gray-300 focus:ring-[#08344F]/20 focus:border-[#08344F]'
                        }`}
                      >
                        {techniqueOptions.map((tech) => (
                          <option key={tech.value} value={tech.value}>
                            {tech.label}
                          </option>
                        ))}
                      </select>
                      {errors.technique && (
                        <p className="mt-1 text-sm text-red-500">{errors.technique}</p>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="animate-fadeIn" style={{animationDelay: '0.8s'}}>
                      <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
                        Durasi Pengerjaan
                      </label>
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="Contoh: 2 minggu, 1 bulan, dll"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08344F]/20 focus:border-[#08344F] transition-all hover-scale"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 animate-fadeIn" style={{animationDelay: '0.9s'}}>
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                      Deskripsi Karya <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      placeholder={`Jelaskan tentang karya Anda secara detail:
                          • Konsep dan ide utama
                          • Tujuan pembuatan
                          • Teknik/software yang digunakan
                          • Proses kreatif
                          • Tantangan yang dihadapi
                          • Hasil yang diharapkan`}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none font-mono text-sm hover-scale ${
                        errors.description 
                          ? 'border-red-500 focus:ring-red-500/20 animate-shake' 
                          : 'border-gray-300 focus:ring-[#08344F]/20 focus:border-[#08344F]'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Berikan deskripsi yang lengkap untuk membantu Admin dalam peninjauan
                    </p>
                  </div>

                  {/* Link Karya */}
                  <div className="mb-6 animate-fadeIn" style={{animationDelay: '1s'}}>
                    <label htmlFor="dimensions" className="block text-gray-700 font-medium mb-2">
                      Link Karya (Opsional)
                    </label>
                    <input
                      type="text"
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      placeholder="Contoh: Link web, Gdrive"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#08344F]/20 focus:border-[#08344F] transition-all hover-scale"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - File Upload & Preview */}
            <div className="space-y-6">
              {/* File Upload */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-scaleIn" style={{animationDelay: '1.1s'}}>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Unggah File
                </h2>
                
                <div className="mb-6">
                  <label htmlFor="file" className="block text-gray-700 font-medium mb-2">
                    File Karya <span className="text-red-500">*</span>
                  </label>
                  
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all hover-scale ${
                    errors.file 
                      ? 'border-red-500 bg-red-50 animate-shake' 
                      : 'border-gray-300 hover:border-[#08344F] hover:bg-[#08344F]/5'
                  }`}>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,application/pdf,video/mp4"
                    />
                    
                    <label htmlFor="file" className="cursor-pointer block">
                      <div className="text-4xl mb-4">📁</div>
                      <p className="font-medium text-gray-800 mb-2">
                        {formData.file ? formData.file.name : 'Klik untuk memilih file'}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Format: JPG, PNG, GIF, PDF, MP4
                      </p>
                      <p className="text-sm text-gray-500">
                        Ukuran maks: 50MB
                      </p>
                    </label>
                  </div>
                  
                  {errors.file && (
                    <p className="mt-2 text-sm text-red-500">{errors.file}</p>
                  )}
                  
                  {formData.file && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 animate-fadeIn">
                      <p className="text-green-700 text-sm">
                        <span className="font-medium">✓ File siap diunggah:</span> {formData.file.name}
                      </p>
                      <p className="text-green-600 text-xs mt-1">
                        Ukuran: {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-6 animate-fadeIn">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Mengirim ke Admin...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-[#08344F] to-[#1276B5] h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Jangan tutup halaman ini...
                    </p>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-scaleIn" style={{animationDelay: '1.2s'}}>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Preview Karya
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-fadeIn" style={{animationDelay: '1.3s'}}>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p className="font-medium text-gray-800">
                      {formData.title ? 'Siap Dikirim untuk Ditinjau' : 'Belum Lengkap'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-fadeIn" style={{animationDelay: '1.4s'}}>
                    <p className="text-sm text-gray-600 mb-1">Pembuat</p>
                    <p className="font-medium text-gray-800">{user?.name || 'Mahasiswa'}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-fadeIn" style={{animationDelay: '1.5s'}}>
                    <p className="text-sm text-gray-600 mb-1">Program Studi</p>
                    <p className="font-medium text-gray-800">{getProdiFullName(formData.prodi)}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-fadeIn" style={{animationDelay: '1.6s'}}>
                    <p className="text-sm text-gray-600 mb-1">Proses</p>
                    <p className="font-medium text-yellow-600">Menunggu Tinjauan Admin</p>
                  </div>
                  
                  {previewUrl && (
                    <div className="mt-4 animate-fadeIn">
                      <p className="text-sm text-gray-600 mb-2">Preview File:</p>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden hover-scale transition-transform">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky top-6 space-y-4">
                <div className="bg-gradient-to-r from-[#08344F] to-[#1276B5] rounded-xl p-4 text-white animate-fadeIn" style={{animationDelay: '1.7s'}}>
                  <p className="text-sm font-medium mb-2">Syarat Karya yang Baik:</p>
                  <ul className="text-xs space-y-1">
                    <li>✓ Karya orisinal buatan sendiri</li>
                    <li>✓ Deskripsi lengkap dan jelas</li>
                    <li>✓ Format file sesuai ketentuan</li>
                    <li>✓ Tidak mengandung konten terlarang</li>
                    <li>✓ Memiliki nilai edukasi/kreatif</li>
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="flex-1 px-6 py-3.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors hover-scale active-scale animate-fadeIn"
                    style={{animationDelay: '1.8s'}}
                    disabled={isUploading}
                  >
                    Batal
                  </button>
                  
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-opacity hover-scale active-scale disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-fadeIn"
                    style={{animationDelay: '1.9s'}}
                  >
                    {isUploading ? (
                      <>
                        <span>Mengirim...</span>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      'Kirim untuk Ditinjau'
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 text-center animate-fadeIn" style={{animationDelay: '2s'}}>
                  Karya akan ditinjau dalam 1-3 hari kerja
                </p>
              </div>
            </div>
          </div>

          {/* Process Flow */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-scaleIn" style={{animationDelay: '2.1s'}}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Alur Peninjauan Karya
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-[#08344F]/5 to-[#1276B5]/5 rounded-xl animate-fadeIn hover-scale" style={{animationDelay: '2.2s'}}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#08344F] text-white rounded-full mb-3">
                  1
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Upload Karya</h4>
                <p className="text-sm text-gray-600">
                  Anda mengupload karya melalui form ini
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-[#08344F]/5 to-[#1276B5]/5 rounded-xl animate-fadeIn hover-scale" style={{animationDelay: '2.3s'}}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#08344F] text-white rounded-full mb-3">
                  2
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Ditinjau Admin</h4>
                <p className="text-sm text-gray-600">
                  Admin memeriksa kelayakan dan kualitas karya
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-[#08344F]/5 to-[#1276B5]/5 rounded-xl animate-fadeIn hover-scale" style={{animationDelay: '2.4s'}}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#08344F] text-white rounded-full mb-3">
                  3
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Notifikasi Hasil</h4>
                <p className="text-sm text-gray-600">
                  Anda mendapatkan notifikasi disetujui/revisi
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-[#08344F]/5 to-[#1276B5]/5 rounded-xl animate-fadeIn hover-scale" style={{animationDelay: '2.5s'}}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#08344F] text-white rounded-full mb-3">
                  4
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Dipublikasikan</h4>
                <p className="text-sm text-gray-600">
                  Karya muncul di dashboard setelah disetujui
                </p>
              </div>
            </div>
          </div>
        </div>
      </MahasiswaLayout>

      {/* Konfirmasi Submit Popup */}
      {showConfirmPopup && popupData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-[#08344F] to-[#1276B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">📤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Kirim Karya untuk Ditinjau?</h3>
              <p className="text-gray-600 mb-6">
                Pastikan data karya Anda sudah benar sebelum dikirim ke Admin.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-[#08344F]/5 to-[#1276B5]/5 rounded-xl p-6 mb-6 border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4">Detail Karya:</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Judul:</span>
                  <span className="font-medium text-gray-800">{popupData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori:</span>
                  <span className="font-medium text-gray-800">{popupData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Program Studi:</span>
                  <span className="font-medium text-gray-800">{popupData.prodi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teknik:</span>
                  <span className="font-medium text-gray-800">{popupData.technique}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ukuran File:</span>
                  <span className="font-medium text-gray-800">{popupData.fileSize}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <span className="text-yellow-500 mr-3">⚠️</span>
                <div>
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Perhatian:</span> Karya akan ditinjau oleh Admin dalam 1-3 hari kerja. Anda akan mendapatkan notifikasi setelah proses selesai.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-all duration-300 hover-scale active-scale"
              >
                Periksa Kembali
              </button>
              <button
                onClick={confirmSubmit}
                className="px-6 py-3 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white hover:opacity-90 rounded-xl font-medium transition-all duration-300 hover-scale active-scale"
              >
                Ya, Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-slideUp">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Batalkan Upload?</h3>
              <p className="text-gray-600 mb-8">
                Anda memiliki data yang belum tersimpan. Apakah Anda yakin ingin membatalkan upload karya ini?
              </p>
              
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6 border border-red-200">
                <h4 className="font-bold text-gray-800 mb-3">Data yang akan hilang:</h4>
                <div className="space-y-2 text-sm text-gray-600 text-left">
                  {formData.title && (
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Judul: "{formData.title}"</span>
                    </div>
                  )}
                  {formData.category && (
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Kategori: {categories.find(c => c.value === formData.category)?.label}</span>
                    </div>
                  )}
                  {formData.file && (
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">•</span>
                      <span>File: {formData.file.name}</span>
                    </div>
                  )}
                  {formData.description && (
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Deskripsi karya</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelCancel}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-all duration-300 hover-scale active-scale"
                >
                  Lanjutkan Upload
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 rounded-xl font-medium transition-all duration-300 hover-scale active-scale"
                >
                  Ya, Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <>
          {/* Confetti Effect */}
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ['#08344F', '#1276B5', '#10B981', '#F59E0B', '#8B5CF6'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const style = {
              '--color': color,
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 0.5}s`,
            };
            return <div key={i} className="confetti" style={style}></div>;
          })}
          
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 w-full animate-slideUp">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-checkmark">
                  <span className="text-4xl text-white">✓</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Karya Berhasil Dikirim!</h3>
                <p className="text-gray-600 mb-6">
                  Karya Anda telah dikirim ke Admin untuk ditinjau. 
                  Proses peninjauan membutuhkan waktu 1-3 hari kerja.
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
                  <h4 className="font-bold text-gray-800 mb-2">Yang terjadi selanjutnya:</h4>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Admin akan memeriksa karya Anda</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Anda akan mendapatkan notifikasi hasil review</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Karya akan dipublikasikan jika disetujui</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Jika perlu revisi, Anda akan mendapatkan panduan</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">ID Karya</p>
                      <p className="text-2xl font-bold text-blue-600">{uploadedArtworkId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium text-yellow-600">Menunggu Review</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Gunakan ID ini untuk melacak status karya Anda di halaman "Karya Saya"
                  </p>
                </div>
                
                <button
                  onClick={handleSuccessPopupClose}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white hover:opacity-90 rounded-xl font-medium transition-all duration-300 hover-scale active-scale flex items-center justify-center gap-2"
                >
                  <span>Lihat Karya Saya</span>
                  <span>→</span>
                </button>
                
                <p className="text-xs text-gray-500 mt-4">
                  Anda akan diarahkan ke halaman "Karya Saya" untuk melacak status
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}