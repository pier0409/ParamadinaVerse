import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import MainLayout from '../components/layout/MainLayout'
import Footer from '../components/layout/Footer'

export default function Home() {
  const { user } = useAuth()

  // Data program studi Universitas Paramadina
  const programStudi = [
    { name: 'DKV', fullName: 'Desain Komunikasi Visual', icon: '🎨' },
    { name: 'Teknik Informatika', fullName: 'Teknik Informatika', icon: '💻' },
    { name: 'Desain Produk', fullName: 'Desain Produk', icon: '📐' },
    { name: 'Ilmu Komunikasi', fullName: 'Ilmu Komunikasi', icon: '🎤' },
    { name: 'Psikologi', fullName: 'Psikologi', icon: '🧠' },
    { name: 'Hubungan Internasional', fullName: 'Hubungan Internasional', icon: '🌐' },
    { name: 'Manajemen', fullName: 'Manajemen', icon: '📊' },
  ]

  // Data fitur unggulan
  const fiturUnggulan = [
    {
      icon: '🏛️',
      title: 'Galeri Digital Profesional',
      description: 'Tampilkan karya Anda dari berbagai kategori: Desain Komunikasi Visual, Fotografi, Ilustrasi Digital, 3D Modeling, dan Desain Produk'
    },
    {
      icon: '👥',
      title: 'Komunitas Kreatif',
      description: 'Berinteraksi dengan sesama mahasiswa melalui like, komentar, dan apresiasi karya. Bangun jaringan profesional sejak di kampus'
    },
    {
      icon: '📁',
      title: 'Portofolio Siap Pakai',
      description: 'Dokumentasi karya tersimpan rapi dan siap dipresentasikan sebagai portofolio profesional untuk melamar pekerjaan atau magang'
    }
  ]

  // Warna: #083552 (0%) dan #1276B5 (100%)
  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    light: '#EFF6FF',
    white: '#FFFFFF',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  return (
    <>
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
          {/* Background Shadows/Bubbles */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden'
          }}>
            {/* Bubble 1 - Top Left */}
            <div style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(8, 53, 82, 0.08), rgba(18, 118, 181, 0.12))',
              top: '-150px',
              left: '-150px',
              animation: 'float 25s infinite ease-in-out',
              filter: 'blur(60px)',
            }} />
            
            {/* Bubble 2 - Top Right */}
            <div style={{
              position: 'absolute',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(18, 118, 181, 0.1), rgba(8, 53, 82, 0.06))',
              top: '10%',
              right: '-200px',
              animation: 'float 30s infinite ease-in-out 5s',
              filter: 'blur(70px)',
            }} />
            
            {/* Bubble 3 - Middle Left */}
            <div style={{
              position: 'absolute',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(8, 53, 82, 0.06), rgba(18, 118, 181, 0.09))',
              top: '40%',
              left: '5%',
              animation: 'float 22s infinite ease-in-out 10s',
              filter: 'blur(55px)',
            }} />
            
            {/* Bubble 4 - Bottom Right */}
            <div style={{
              position: 'absolute',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(18, 118, 181, 0.08), rgba(8, 53, 82, 0.05))',
              bottom: '-150px',
              right: '10%',
              animation: 'float 28s infinite ease-in-out 3s',
              filter: 'blur(65px)',
            }} />

            {/* Bubble 5 - Center */}
            <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(8, 53, 82, 0.07), rgba(18, 118, 181, 0.1))',
              top: '50%',
              left: '40%',
              animation: 'float 20s infinite ease-in-out 7s',
              filter: 'blur(50px)',
            }} />
            
            {/* Bubble 6 - Bottom Left */}
            <div style={{
              position: 'absolute',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(18, 118, 181, 0.09), rgba(8, 53, 82, 0.06))',
              bottom: '15%',
              left: '-100px',
              animation: 'float 26s infinite ease-in-out 12s',
              filter: 'blur(58px)',
            }} />
          </div>

          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translate(0, 0) scale(1); }
              25% { transform: translate(40px, -40px) scale(1.1); }
              50% { transform: translate(-30px, 30px) scale(0.9); }
              75% { transform: translate(30px, 40px) scale(1.05); }
            }
          `}</style>
          
          {/* Hero Section */}
          <section 
            className="relative py-16 text-white z-10"
            style={{
              background: colors.gradient,
              boxShadow: '0 10px 25px -5px rgba(8, 53, 82, 0.2), 0 8px 10px -6px rgba(8, 53, 82, 0.15)'
            }}
          >
            <div className="relative max-w-6xl mx-auto px-4 text-center">
              {/* Logo Section */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative mb-6">
                  {/* Glow Effect dengan warna yang sesuai */}
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-30"
                    style={{
                      background: `radial-gradient(circle at center, ${colors.secondary} 0%, transparent 70%)`
                    }}
                  ></div>
                  
                  {/* Logo Container dengan shadow */}
                  <div 
                    className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center"
                    style={{
                      filter: 'drop-shadow(0 8px 16px rgba(8, 53, 82, 0.25))'
                    }}
                  >
                    <Image
                      src="/images/Icon.png"
                      alt="ParamadinaVerse Logo"
                      width={112}
                      height={112}
                      className="rounded-lg object-contain"
                      priority
                    />
                  </div>
                </div>
                
                <h1 
                  className="text-4xl md:text-5xl font-bold mb-3"
                  style={{
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  ParamadinaVerse
                </h1>
                
                <h2 
                  className="text-xl md:text-2xl font-light opacity-90 mb-2"
                  style={{
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  Platform Karya Digital Mahasiswa
                </h2>
                
                <p className="text-lg opacity-80">
                  Universitas Paramadina
                </p>
              </div>
              
              <p className="text-lg opacity-90 max-w-3xl mx-auto mb-10 leading-relaxed">
                Galeri digital resmi untuk memfasilitasi mahasiswa dalam menampilkan, 
                mengunggah, dan mengembangkan karya digital mereka
              </p>
              
              <Link 
                href="/auth/login" 
                className="inline-block bg-white hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ 
                  color: colors.primary,
                  boxShadow: '0 8px 20px rgba(8, 53, 82, 0.25)'
                }}
              >
                Mulai Sekarang →
              </Link>
            </div>
          </section>

          {/* Program Studi Section */}
          <section className="py-20 bg-white relative z-10">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                  Program Studi
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Karya kreatif dari berbagai program studi Universitas Paramadina
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {programStudi.map((prodi, index) => (
                  <div 
                    key={index}
                    className="group bg-white border rounded-xl p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    style={{
                      borderColor: colors.primary + '20',
                      borderWidth: '1px',
                      boxShadow: '0 4px 6px -1px rgba(8, 53, 82, 0.1), 0 2px 4px -1px rgba(8, 53, 82, 0.06)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(8, 53, 82, 0.15), 0 4px 6px -2px rgba(8, 53, 82, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(8, 53, 82, 0.1), 0 2px 4px -1px rgba(8, 53, 82, 0.06)'
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div 
                        className="text-3xl mb-4 p-4 rounded-full group-hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: colors.primary + '10',
                        }}
                      >
                        {prodi.icon}
                      </div>
                      <h3 
                        className="text-xl font-bold mb-2 group-hover:underline transition-all"
                        style={{ color: colors.primary }}
                      >
                        {prodi.name}
                      </h3>
                      <p className="text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {prodi.fullName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Fitur Unggulan Section */}
          <section 
            className="py-20 relative z-10"
            style={{ backgroundColor: colors.light }}
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                  Fitur Unggulan
                </h2>
                <h3 className="text-3xl font-bold mb-6 text-gray-800">
                  Mengapa ParamadinaVerse?
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Platform lengkap untuk mengelola dan memamerkan karya digital Anda
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {fiturUnggulan.map((fitur, index) => (
                  <div 
                    key={index}
                    className="bg-white p-8 rounded-2xl hover:scale-105 transition-all duration-300"
                    style={{
                      border: `1px solid ${colors.primary}20`,
                      boxShadow: '0 4px 6px -1px rgba(8, 53, 82, 0.1), 0 2px 4px -1px rgba(8, 53, 82, 0.06)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(8, 53, 82, 0.15), 0 4px 6px -2px rgba(8, 53, 82, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(8, 53, 82, 0.1), 0 2px 4px -1px rgba(8, 53, 82, 0.06)'
                    }}
                  >
                    <div 
                      className="text-4xl mb-6"
                      style={{ color: colors.secondary }}
                    >
                      {fitur.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{fitur.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{fitur.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section 
            className="py-20 text-white relative z-10"
            style={{
              background: colors.gradient,
              boxShadow: '0 -10px 25px -5px rgba(8, 53, 82, 0.2), 0 -8px 10px -6px rgba(8, 53, 82, 0.15)'
            }}
          >
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 
                className="text-4xl font-bold mb-6"
                style={{
                  textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                Siap Memamerkan Karya Anda?
              </h2>
              <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
                Bergabunglah dengan komunitas kreatif ParamadinaVerse dan tunjukkan karya terbaik Anda kepada dunia
              </p>
              
              <Link 
                href="/auth/login" 
                className="inline-block bg-white hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ 
                  color: colors.primary,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                }}
              >
                Mulai Sekarang →
              </Link>
            </div>
          </section>

          {/* Info Section */}
          <section className="py-12 bg-white relative z-10">
            <div className="max-w-6xl mx-auto px-4">
              <div 
                className="rounded-2xl p-8 border bg-blue-50"
                style={{
                  borderColor: colors.primary + '20',
                  boxShadow: '0 10px 15px -3px rgba(8, 53, 82, 0.1), 0 4px 6px -2px rgba(8, 53, 82, 0.05)'
                }}
              >
                <div className="text-center">
                  <div 
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 text-white"
                    style={{ 
                      backgroundColor: colors.secondary,
                      boxShadow: '0 8px 16px rgba(18, 118, 181, 0.3)'
                    }}
                  >
                    <span className="text-3xl">🎨</span>
                  </div>
                  <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.primary }}>
                    {user ? (
                      <>Selamat datang, {user.name}!</>
                    ) : (
                      <>Bergabung dengan ParamadinaVerse</>
                    )}
                  </h2>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link 
                      href="/guest/artworks"
                      className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                      style={{
                        backgroundColor: colors.primary,
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(8, 53, 82, 0.3)'
                      }}
                    >
                      Lihat Galeri Karya
                    </Link>
                    
                    {!user && (
                      <Link 
                        href="/auth/login"
                        className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                        style={{
                          backgroundColor: colors.secondary,
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(18, 118, 181, 0.3)'
                        }}
                      >
                        Login untuk Bergabung
                      </Link>
                    )}
                    
                    {user && (
                      <Link 
                        href={user.role === 'admin' ? '/admin/dashboard' : '/mahasiswa/dashboard'}
                        className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                        style={{
                          backgroundColor: colors.secondary,
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(18, 118, 181, 0.3)'
                        }}
                      >
                        Ke Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
      
      <Footer />
    </>
  )
}