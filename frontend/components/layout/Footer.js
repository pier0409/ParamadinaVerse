// components/layout/Footer.js
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear())

  // Warna konsisten dari MainLayout
  const colors = {
    primaryDark: '#083552',
    primaryLight: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)',
    gradientDiagonal: 'linear-gradient(135deg, #083552 0%, #0B4A6E 50%, #1276B5 100%)'
  }

  return (
    <footer className="text-white mt-12" style={{
      background: colors.gradientDiagonal
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Kolom 1: Tentang ParamadinaVerse */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center p-2 border border-white/20">
                <img 
                  src="/images/Icon.png" 
                  alt="ParamadinaVerse Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">ParamadinaVerse</h3>
                <p className="text-blue-100 text-sm">Digital Art Gallery</p>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{
                  background: colors.gradient
                }}>
                  ℹ️
                </span>
                Tentang Kami
              </h4>
              <p className="text-blue-100 leading-relaxed">
                ParamadinaVerse adalah platform digital eksklusif yang didedikasikan untuk menampilkan 
                dan mengapresiasi karya kreatif mahasiswa Universitas Paramadina.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '📸', label: 'Instagram' },
                { icon: '🐦', label: 'Twitter' }
                // YouTube dihapus sesuai permintaan
              ].map((social) => (
                <button
                  key={social.label}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 border border-white/20"
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
          
          {/* Kolom 2: Kontak Kampus Cipayung */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold flex items-center mb-4">
              <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{
                background: colors.gradient
              }}>
                📍
              </span>
              Kontak Kami
            </h4>
            
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{
                    background: `linear-gradient(135deg, ${colors.primaryDark}20, ${colors.primaryLight}20)`
                  }}>
                    <span className="text-xl">🏫</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-md mb-1">Kampus Cipayung</h5>
                    <p className="text-blue-100 text-sm">Jl. Raya Mabes Hankam Kav 9</p>
                    <p className="text-blue-100 text-sm">Setu, Cipayung, Jakarta Timur 13880</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs">📞</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">+62 815-918-1190</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs">📱</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">+62 815-818-1186</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs">✉️</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">info@paramadina.ac.id</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Kolom 3: Tautan Cepat */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold flex items-center mb-4">
              <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{
                background: colors.gradient
              }}>
                🔗
              </span>
              Tautan Cepat
            </h4>
            
            <div className="space-y-3">
              <Link href="/guest/artworks">
                <div className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer group border border-white/10">
                  <span className="mr-3 group-hover:scale-125 transition-transform">🖼️</span>
                  <span className="font-medium">Galeri Karya</span>
                </div>
              </Link>
              
              <Link href="/auth/login">
                <div className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer group border border-white/10">
                  <span className="mr-3 group-hover:scale-125 transition-transform">🔐</span>
                  <span className="font-medium">Login</span>
                </div>
              </Link>
            </div>
            
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-blue-100 text-sm">
                &copy; {currentYear} <span className="font-bold">ParamadinaVerse</span>
                <span className="ml-2">Hak cipta dilindungi.</span>
              </p>
              <p className="text-blue-200/80 text-xs mt-1">
                Dikembangkan untuk Universitas Paramadina
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/privacy" className="text-blue-100 hover:text-white text-xs transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-10 h-10 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 z-50"
        aria-label="Kembali ke atas"
        style={{
          background: colors.gradient
        }}
      >
        <span className="text-lg">↑</span>
      </button>
    </footer>
  )
}