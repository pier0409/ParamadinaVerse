// pages/mahasiswa/kontak/index.js
import { useState } from 'react'
import Link from 'next/link'
import MahasiswaNavbar from '../../../components/layout/MahasiswaNavbar'
import MahasiswaFooter from '../../../components/layout/MahasiswaFooter' // Tambahkan import MahasiswaFooter

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulasi pengiriman data
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      })
      
      // Reset status submitted setelah 5 detik
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  const contactInfo = [
    {
      title: "Hubungi Admin",
      description: "Untuk pertanyaan seputar upload karya, status pengajuan, dan masalah teknis",
      contacts: [
        { icon: "📧", label: "Email", value: "admin@paramadina.ac.id", link: "mailto:admin@paramadina.ac.id" },
        { icon: "📞", label: "Telepon", value: "(021) 765-4321", link: "tel:+62217654321" },
        { icon: "🕐", label: "Jam Operasional", value: "Senin - Jumat, 08:00 - 16:00 WIB" }
      ]
    },
    {
      title: "Bantuan Teknis",
      description: "Untuk masalah teknis website, upload error, atau bug",
      contacts: [
        { icon: "🔧", label: "Email Teknis", value: "support@paramadina.ac.id", link: "mailto:support@paramadina.ac.id" },
        { icon: "💬", label: "WhatsApp", value: "+62 812-3456-7890", link: "https://wa.me/6281234567890" },
        { icon: "🐛", label: "Lapor Bug", value: "bug-report@paramadina.ac.id", link: "mailto:bug-report@paramadina.ac.id" }
      ]
    },
    {
      title: "Jurusan & Dosen",
      description: "Untuk konsultasi akademik dan bimbingan karya",
      contacts: [
        { icon: "🏛️", label: "Fakultas Informatika", value: "informatika@paramadina.ac.id", link: "mailto:informatika@paramadina.ac.id" },
        { icon: "🎨", label: "Fakultas Desain", value: "desain@paramadina.ac.id", link: "mailto:desain@paramadina.ac.id" },
        { icon: "👨‍🏫", label: "Koordinator Karya", value: "Dr. Ahmad Wijaya, M.Kom.", link: "mailto:ahmad.wijaya@paramadina.ac.id" }
      ]
    }
  ]

  const faqItems = [
    {
      question: "Berapa lama waktu review karya?",
      answer: "Proses review karya biasanya memakan waktu 3-5 hari kerja. Anda akan mendapatkan notifikasi via email dan di halaman notifikasi ketika karya Anda sudah direview."
    },
    {
      question: "Apa saja syarat karya yang bisa diupload?",
      answer: "Karya harus orisinal, sesuai dengan tema, format file yang didukung: JPG, PNG, PDF, MP4, dan ukuran maksimal 100MB per file. Pastikan juga karya belum pernah dipublikasikan di platform lain."
    },
    {
      question: "Bagaimana cara mengubah data profil?",
      answer: "Anda bisa mengubah data profil di halaman Profile. Klik tombol edit pada bagian profil dan simpan perubahan yang telah dilakukan."
    },
    {
      question: "Apa yang harus dilakukan jika karya ditolak?",
      answer: "Anda akan mendapatkan alasan penolakan beserta saran perbaikan. Anda bisa mengupload ulang karya yang sudah diperbaiki melalui halaman upload karya."
    },
    {
      question: "Apakah karya saya bisa dihapus?",
      answer: "Ya, Anda bisa menghapus karya yang sudah diupload melalui halaman detail karya. Namun, jika karya sudah dipublikasikan dan mendapatkan banyak engagement, disarankan untuk tidak menghapusnya."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
      <MahasiswaNavbar />
      
      {/* Tambahkan padding-top yang signifikan */}
      <div className="pt-8 md:pt-12"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-[#08344F] to-[#1276B5] bg-clip-text text-transparent">
              Hubungi Kami
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Butuh bantuan atau ingin bertanya seputar ParamadinaVerse? Tim kami siap membantu Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Informasi Kontak */}
          {contactInfo.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">
                    {section.title === "Hubungi Admin" ? "👨‍💼" : 
                     section.title === "Bantuan Teknis" ? "🔧" : "🏛️"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{section.title}</h3>
                <p className="text-gray-600">{section.description}</p>
              </div>
              
              <div className="space-y-4">
                {section.contacts.map((contact, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-xl mt-1">{contact.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{contact.label}</p>
                      {contact.link ? (
                        <a 
                          href={contact.link} 
                          target={contact.link.startsWith('http') ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="text-[#1276B5] hover:text-[#08344F] transition-colors"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-gray-600">{contact.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Form Kontak */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-[#08344F] to-[#1276B5] rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Kirim Pesan Langsung</h2>
            <p className="text-white/80 mb-6">Isi form di samping dan kami akan membalas pesan Anda secepatnya.</p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <p className="font-medium">Email Respon Cepat</p>
                  <p className="text-white/80">response@paramadina.ac.id</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">⏱️</span>
                </div>
                <div>
                  <p className="font-medium">Waktu Respon</p>
                  <p className="text-white/80">1-2 hari kerja</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">🔒</span>
                </div>
                <div>
                  <p className="font-medium">Privasi Terjaga</p>
                  <p className="text-white/80">Data Anda aman bersama kami</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-green-600">✓</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Pesan Terkirim!</h3>
                <p className="text-gray-600 mb-6">Terima kasih telah menghubungi kami. Tim kami akan merespon pesan Anda dalam 1-2 hari kerja.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Form Kontak</h3>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08344F]/20 focus:border-[#08344F] transition-all"
                          placeholder="Masukkan nama Anda"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08344F]/20 focus:border-[#08344F] transition-all"
                          placeholder="email@student.paramadina.ac.id"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08344F]/20 focus:border-[#08344F] transition-all"
                      >
                        <option value="general">Pertanyaan Umum</option>
                        <option value="technical">Masalah Teknis</option>
                        <option value="artwork">Karya & Upload</option>
                        <option value="account">Akun & Profile</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subjek *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08344F]/20 focus:border-[#08344F] transition-all"
                        placeholder="Subjek pesan Anda"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pesan *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08344F]/20 focus:border-[#08344F] transition-all resize-none"
                        placeholder="Tulis pesan Anda di sini..."
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3.5 bg-gradient-to-r from-[#08344F] to-[#1276B5] text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center ${
                          isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mengirim...
                          </>
                        ) : (
                          'Kirim Pesan'
                        )}
                      </button>
                      
                      <div className="text-sm text-gray-500">
                        * Wajib diisi
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-[#08344F] to-[#1276B5] bg-clip-text text-transparent">
                Pertanyaan yang Sering Ditanyakan
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum seputar ParamadinaVerse
            </p>
          </div>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 flex items-center justify-center">
                        <span className="text-[#08344F] font-bold">Q{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                    </div>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 ml-12">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Lokasi & Info Tambahan */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Lokasi Kampus</h3>
              <div className="bg-gradient-to-r from-[#08344F]/10 to-[#1276B5]/10 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#08344F] to-[#1276B5] flex items-center justify-center">
                    <span className="text-xl text-white">📍</span>
                  </div>
                    <div>
                  <p className="font-bold text-gray-800">Universitas Paramadina</p>
                  <p className="text-gray-600 mt-1">Jl. Raya Mabes Hankam No.Kav 9, Setu, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13880
                  </p>
                </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-4">Jam Operasional Kampus</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Senin - Kamis</span>
                      <span className="font-medium">07:00 - 20:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Jumat</span>
                      <span className="font-medium">07:00 - 17:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sabtu</span>
                      <span className="font-medium">08:00 - 15:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Minggu</span>
                      <span className="font-medium text-red-500">Libur</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-800 mb-4">Kunjungi Kami</h4>
                  <div className="space-y-3">
                    <a href="https://www.paramadina.ac.id" target="_blank" rel="noopener noreferrer" 
                       className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <span className="text-xl">🌐</span>
                      <div>
                        <p className="font-medium text-gray-800">Website Resmi</p>
                        <p className="text-sm text-gray-600">www.paramadina.ac.id</p>
                      </div>
                    </a>
                    <a href="https://instagram.com/paramadina" target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <span className="text-xl">📱</span>
                      <div>
                        <p className="font-medium text-gray-800">Instagram</p>
                        <p className="text-sm text-gray-600">@paramadina</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#08344F] to-[#1276B5] rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-6">Butuh Bantuan Cepat?</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="font-medium mb-2">Live Chat</p>
                  <p className="text-white/80 text-sm">Chat langsung dengan admin (Senin-Jumat, 09:00-16:00)</p>
                  <button className="mt-3 w-full py-2 bg-white text-[#08344F] font-medium rounded-lg hover:opacity-90 transition-opacity">
                    Mulai Chat
                  </button>
                </div>
                
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="font-medium mb-2">Komunitas Mahasiswa</p>
                  <p className="text-white/80 text-sm">Bergabung dengan grup diskusi mahasiswa</p>
                  <button className="mt-3 w-full py-2 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                    Gabung Grup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ganti footer lama dengan MahasiswaFooter */}
      <MahasiswaFooter />
    </div>
  )
}