import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminFooter() {
  const [currentTime] = useState(new Date())

  // Warna konsisten
  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  return (
    <footer 
      className="text-white pt-6 pb-4 mt-8"
      style={{ background: colors.gradient }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Brand Info - Compact */}
          <div className="space-y-3">
            <div className="flex items-center group">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-2 border border-white/30 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/images/Icon.png"
                  alt="ParamadinaVerse Logo"
                  width={32}
                  height={32}
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-base group-hover:text-blue-200 transition-colors duration-300">ParamadinaVerse</h3>
                <p className="text-xs text-blue-100/80">Admin Dashboard</p>
              </div>
            </div>
            <p className="text-blue-100/80 text-xs leading-relaxed">
              Platform showcase karya kreatif mahasiswa Universitas Paramadina
            </p>
          </div>

          {/* Quick Links - Compact */}
          <div>
            <h4 className="font-bold text-sm mb-3 text-white">Quick Links</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/admin/dashboard">
                  <span className="text-blue-100/80 hover:text-white cursor-pointer transition-colors text-xs flex items-center group">
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin/users">
                  <span className="text-blue-100/80 hover:text-white cursor-pointer transition-colors text-xs flex items-center group">
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    Kelola Pengguna
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin/artworks">
                  <span className="text-blue-100/80 hover:text-white cursor-pointer transition-colors text-xs flex items-center group">
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    Kelola Karya
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin/reports">
                  <span className="text-blue-100/80 hover:text-white cursor-pointer transition-colors text-xs flex items-center group">
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    Laporan
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* System Info - More Compact */}
          <div>
            <h4 className="font-bold text-sm mb-3 text-white">System Info</h4>
            <div className="space-y-1 text-blue-100/80 text-xs">
              <div className="flex justify-between items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
                <span>Status:</span>
                <span className="text-green-300 font-medium text-xs bg-green-900/30 px-2 py-0.5 rounded">Online</span>
              </div>
              <div className="flex justify-between items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
                <span>Version:</span>
                <span className="text-blue-300 font-medium text-xs bg-blue-900/30 px-2 py-0.5 rounded">v1.0.0</span>
              </div>
              <div className="flex justify-between items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
                <span>Users:</span>
                <span className="text-amber-300 font-medium text-xs bg-amber-900/30 px-2 py-0.5 rounded">156</span>
              </div>
              <div className="flex justify-between items-center hover:bg-white/5 px-2 py-1 rounded transition-colors">
                <span>Time:</span>
                <span className="text-xs font-medium">
                  {currentTime.toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Support - Compact */}
          <div>
            <h4 className="font-bold text-sm mb-3 text-white">Support</h4>
            <div className="space-y-1.5 text-blue-100/80 text-xs">
              <div className="flex items-center group hover:text-white transition-colors">
                <span className="mr-2">🛟</span>
                <span>Admin Help Center</span>
              </div>
              <div className="flex items-center group hover:text-white transition-colors">
                <span className="mr-2">🔧</span>
                <span>Technical Support</span>
              </div>
              <div className="flex items-center group hover:text-white transition-colors">
                <span className="mr-2">🔒</span>
                <span className="text-blue-200 font-medium">security@paramadinaverse.ac.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - More Compact */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0 text-center md:text-left">
              <p className="text-blue-100/80 text-xs">
                © {new Date().getFullYear()} Universitas Paramadina
              </p>
              <p className="text-blue-100/60 text-xs mt-0.5">
                Admin v1.0.0 • {currentTime.toLocaleDateString('id-ID', { 
                  day: '2-digit', 
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/admin/settings">
                <span className="text-blue-100/80 hover:text-white text-xs cursor-pointer transition-colors flex items-center group">
                  <span className="mr-1 text-sm">⚙️</span>
                  Settings
                </span>
              </Link>
              <Link href="/admin/help">
                <span className="text-blue-100/80 hover:text-white text-xs cursor-pointer transition-colors flex items-center group">
                  <span className="mr-1 text-sm">❓</span>
                  Help
                </span>
              </Link>
              <Link href="/">
                <span className="text-blue-200 hover:text-white text-xs cursor-pointer transition-colors flex items-center group font-medium">
                  <span className="mr-1 text-sm">🏠</span>
                  Home
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}