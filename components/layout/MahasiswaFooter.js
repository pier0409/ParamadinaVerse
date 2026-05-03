// components/layout/MahasiswaFooter.js
import Link from 'next/link'
import { useState } from 'react'

export default function MahasiswaFooter() {
  const [currentYear] = useState(new Date().getFullYear())

  // Warna konsisten
  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  // Link yang relevan untuk mahasiswa
  const mahasiswaLinks = [
    { label: 'Dashboard', href: '/mahasiswa/dashboard', icon: '📊' },
    { label: 'Profile', href: '/mahasiswa/profile', icon: '👤' },
    { label: 'Upload Karya', href: '/mahasiswa/artworks', icon: '⬆️' },
    { label: 'Kontak', href: '/kontak', icon: '📞' },
  ]

  const infoLinks = [
    { label: 'Panduan Upload', href: '/bantuan/upload' },
    { label: 'FAQ', href: '/bantuan/faq' },
    { label: 'Kebijakan Privasi', href: '/privacy' },
  ]

  return (
    <footer className="text-white mt-12" style={{ background: colors.gradient }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & About */}
          <div>
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">
                  ParamadinaVerse
                </span>
              </div>
              <p className="mt-4 text-white/80 text-sm leading-relaxed">
                Platform karya kreatif mahasiswa Universitas Paramadina. 
                Tampilkan dan apresiasi karya terbaik Anda di sini.
              </p>
            </div>
            
            {/* Location Info */}
            <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex items-start">
                <span className="mr-3 text-xl mt-1">📍</span>
                <div>
                  <p className="font-medium text-white">Universitas Paramadina</p>
                  <p className="text-white/70 text-sm mt-1">
                    Jl. Raya Mabes Hankam No.Kav 9, Setu, Kec. Cipayung, 
                    Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13880
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Menu Mahasiswa</h4>
            <ul className="space-y-3">
              {mahasiswaLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="flex items-center text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info & Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Informasi</h4>
            <ul className="space-y-3 mb-8">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/80 hover:text-white hover:underline transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="mr-3 text-xl">📧</span>
                <div>
                  <p className="text-white/80 text-sm">Email Support</p>
                  <p className="font-medium text-white">paramadinaverse@paramadina.ac.id</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="mr-3 text-xl">📱</span>
                <div>
                  <p className="text-white/80 text-sm">Instagram</p>
                  <p className="font-medium text-white">@paramadinaverse</p>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="mt-6 p-3 bg-white/10 rounded-lg">
              <p className="text-white/80 text-sm">Jam Dukungan Teknis:</p>
              <p className="font-medium text-white text-sm">Senin - Jumat: 08:00 - 16:00 WIB</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-white/80 text-sm">
                &copy; {currentYear} <span className="font-semibold text-white">ParamadinaVerse</span>. 
                Hak Cipta Dilindungi.
              </p>
              <p className="text-white/60 text-xs mt-1">
                Platform Mahasiswa Universitas Paramadina
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                {['📘', '📸', '🐦'].map((icon, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm transition-colors duration-200"
                    aria-label="Social media"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-10 h-10 text-white rounded-full shadow-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center"
        aria-label="Kembali ke atas"
        style={{ background: colors.gradient }}
      >
        <span className="text-lg">↑</span>
      </button>
    </footer>
  )
}