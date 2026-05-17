import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AdminFooter from '../../../components/layout/AdminFooter'

export default function AdminSettings() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      siteName: 'ParamadinaVerse',
      siteDescription: 'Platform Showcase Karya Mahasiswa Universitas Paramadina',
      adminEmail: 'admin@paramadinaverse.ac.id',
      contactEmail: 'contact@paramadinaverse.ac.id',
      maintenanceMode: false,
      allowRegistrations: true
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      logoUrl: '/images/Icon.png',
      faviconUrl: '/favicon.ico',
      enableDarkMode: true
    },
    security: {
      requireEmailVerification: true,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      enable2FA: false,
      passwordMinLength: 8,
      blockSuspiciousIPs: true
    },
    notifications: {
      emailNotifications: true,
      newUserNotification: true,
      newArtworkNotification: true,
      reportNotification: true,
      newsletterEnabled: true,
      notificationSound: true
    },
    system: {
      cacheEnabled: true,
      debugMode: false,
      backupFrequency: 'daily',
      logRetention: '30days',
      autoUpdate: true,
      apiRateLimit: 100
    }
  })
  const [saving, setSaving] = useState(false)
  const [backupStatus, setBackupStatus] = useState('idle')
  const router = useRouter()

  useEffect(() => {
    // Cek apakah user sudah login dan role admin
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (!userData || userData.role !== 'admin') {
      router.push('/login')
      return
    }
    
    setUser(userData)
    // Load settings from localStorage jika ada
    const savedSettings = JSON.parse(localStorage.getItem('adminSettings') || 'null')
    if (savedSettings) {
      setSettings(savedSettings)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    alert('Logout berhasil!')
    router.push('/')
  }

  const handleSaveSettings = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('adminSettings', JSON.stringify(settings))
      setSaving(false)
      alert('Pengaturan berhasil disimpan!')
    }, 1000)
  }

  const handleResetSettings = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua pengaturan ke default? Aksi ini tidak dapat dibatalkan.')) {
      const defaultSettings = {
        general: {
          siteName: 'ParamadinaVerse',
          siteDescription: 'Platform Showcase Karya Mahasiswa Universitas Paramadina',
          adminEmail: 'admin@paramadinaverse.ac.id',
          contactEmail: 'contact@paramadinaverse.ac.id',
          maintenanceMode: false,
          allowRegistrations: true
        },
        appearance: {
          theme: 'light',
          primaryColor: '#3B82F6',
          secondaryColor: '#8B5CF6',
          logoUrl: '/images/Icon.png',
          faviconUrl: '/favicon.ico',
          enableDarkMode: true
        },
        security: {
          requireEmailVerification: true,
          maxLoginAttempts: 5,
          sessionTimeout: 30,
          enable2FA: false,
          passwordMinLength: 8,
          blockSuspiciousIPs: true
        },
        notifications: {
          emailNotifications: true,
          newUserNotification: true,
          newArtworkNotification: true,
          reportNotification: true,
          newsletterEnabled: true,
          notificationSound: true
        },
        system: {
          cacheEnabled: true,
          debugMode: false,
          backupFrequency: 'daily',
          logRetention: '30days',
          autoUpdate: true,
          apiRateLimit: 100
        }
      }
      setSettings(defaultSettings)
      alert('Pengaturan telah dikembalikan ke default')
    }
  }

  const handleCreateBackup = () => {
    setBackupStatus('creating')
    // Simulate backup creation
    setTimeout(() => {
      setBackupStatus('completed')
      setTimeout(() => setBackupStatus('idle'), 3000)
      alert('Backup berhasil dibuat!')
    }, 2000)
  }

  const handleClearCache = () => {
    if (confirm('Apakah Anda yakin ingin membersihkan cache? Ini akan meningkatkan performa sistem.')) {
      alert('Cache berhasil dibersihkan!')
    }
  }

  const handleUpdateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const tabs = [
    { id: 'general', name: 'Umum', icon: '⚙️' },
    { id: 'appearance', name: 'Tampilan', icon: '🎨' },
    { id: 'security', name: 'Keamanan', icon: '🔒' },
    { id: 'notifications', name: 'Notifikasi', icon: '🔔' },
    { id: 'system', name: 'Sistem', icon: '🖥️' },
    { id: 'backup', name: 'Backup', icon: '💾' },
    { id: 'logs', name: 'Logs', icon: '📋' }
  ]

  const systemLogs = [
    { id: 1, type: 'info', message: 'Sistem dijalankan ulang', timestamp: '2024-01-15 08:30:00', user: 'System' },
    { id: 2, type: 'warning', message: 'Tinggi penggunaan memori terdeteksi', timestamp: '2024-01-15 10:15:00', user: 'System' },
    { id: 3, type: 'success', message: 'Backup otomatis selesai', timestamp: '2024-01-15 02:00:00', user: 'System' },
    { id: 4, type: 'info', message: 'Admin login dari IP: 192.168.1.1', timestamp: '2024-01-15 08:05:00', user: 'Admin' },
    { id: 5, type: 'error', message: 'Gagal mengirim email notifikasi', timestamp: '2024-01-14 14:30:00', user: 'System' },
    { id: 6, type: 'info', message: 'Cache dibersihkan', timestamp: '2024-01-14 12:00:00', user: 'System' },
    { id: 7, type: 'success', message: 'Update sistem berhasil', timestamp: '2024-01-13 23:00:00', user: 'System' }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Pengaturan Sistem - Admin ParamadinaVerse</title>
      </Head>
      
      <AdminLayout>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-900 to-slate-800 text-white py-8 md:py-12 px-4 mb-6 rounded-b-2xl shadow-lg">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Pengaturan Sistem</h1>
                <p className="text-gray-300 text-sm md:text-base">Kelola semua pengaturan platform</p>
                <div className="flex items-center mt-3 space-x-2">
                  <span className="bg-gray-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">Version 1.0.0</span>
                  <span className="bg-blue-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">Admin Panel</span>
                  <span className="bg-green-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">Settings</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
                <button 
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
                >
                  Logout
                </button>
                <button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Menyimpan...
                    </>
                  ) : (
                    '💾 Simpan Semua'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Sidebar Tabs */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Menu Pengaturan</h3>
                </div>
                <nav className="p-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={handleResetSettings}
                    className="w-full text-center text-red-600 hover:text-red-700 text-sm font-medium py-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Reset ke Default
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Pengaturan Umum</h2>
                      <p className="text-gray-600 text-sm">Pengaturan dasar platform</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        settings.general.maintenanceMode 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {settings.general.maintenanceMode ? 'Maintenance Mode' : 'Normal Mode'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Situs
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleUpdateSetting('general', 'siteName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Situs
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteDescription}
                        onChange={(e) => handleUpdateSetting('general', 'siteDescription', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Admin
                      </label>
                      <input
                        type="email"
                        value={settings.general.adminEmail}
                        onChange={(e) => handleUpdateSetting('general', 'adminEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Kontak
                      </label>
                      <input
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) => handleUpdateSetting('general', 'contactEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">Maintenance Mode</h4>
                          <p className="text-sm text-gray-600">Nonaktifkan akses publik saat maintenance</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.general.maintenanceMode}
                            onChange={(e) => handleUpdateSetting('general', 'maintenanceMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">Izinkan Pendaftaran</h4>
                          <p className="text-sm text-gray-600">Izinkan user baru untuk mendaftar</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.general.allowRegistrations}
                            onChange={(e) => handleUpdateSetting('general', 'allowRegistrations', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Pengaturan Tampilan</h2>
                      <p className="text-gray-600 text-sm">Kustomisasi tampilan platform</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Theme: {settings.appearance.theme}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tema
                      </label>
                      <select
                        value={settings.appearance.theme}
                        onChange={(e) => handleUpdateSetting('appearance', 'theme', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Warna Primer
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleUpdateSetting('appearance', 'primaryColor', e.target.value)}
                          className="w-10 h-10 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleUpdateSetting('appearance', 'primaryColor', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Warna Sekunder
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleUpdateSetting('appearance', 'secondaryColor', e.target.value)}
                          className="w-10 h-10 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleUpdateSetting('appearance', 'secondaryColor', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Logo
                      </label>
                      <input
                        type="text"
                        value={settings.appearance.logoUrl}
                        onChange={(e) => handleUpdateSetting('appearance', 'logoUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">Enable Dark Mode</h4>
                          <p className="text-sm text-gray-600">Izinkan user menggunakan dark mode</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.appearance.enableDarkMode}
                            onChange={(e) => handleUpdateSetting('appearance', 'enableDarkMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-gray-800 mb-2">Preview</h4>
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-16 h-16 rounded-lg"
                            style={{ backgroundColor: settings.appearance.primaryColor }}
                          ></div>
                          <div 
                            className="w-16 h-16 rounded-lg"
                            style={{ backgroundColor: settings.appearance.secondaryColor }}
                          ></div>
                          <div className="text-sm text-gray-600">
                            <p>Primary: {settings.appearance.primaryColor}</p>
                            <p>Secondary: {settings.appearance.secondaryColor}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Pengaturan Keamanan</h2>
                      <p className="text-gray-600 text-sm">Konfigurasi keamanan platform</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Security Level: High
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Require Email Verification</h4>
                        <p className="text-sm text-gray-600">User harus verifikasi email sebelum login</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.requireEmailVerification}
                          onChange={(e) => handleUpdateSetting('security', 'requireEmailVerification', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => handleUpdateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="120"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleUpdateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Min Length
                        </label>
                        <input
                          type="number"
                          min="6"
                          max="20"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => handleUpdateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Rate Limit (per hour)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="1000"
                          value={settings.system.apiRateLimit}
                          onChange={(e) => handleUpdateSetting('system', 'apiRateLimit', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Enable 2-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Tambahkan lapisan keamanan ekstra untuk admin</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.enable2FA}
                          onChange={(e) => handleUpdateSetting('security', 'enable2FA', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Block Suspicious IPs</h4>
                        <p className="text-sm text-gray-600">Otomatis blokir IP dengan aktivitas mencurigakan</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.blockSuspiciousIPs}
                          onChange={(e) => handleUpdateSetting('security', 'blockSuspiciousIPs', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Pengaturan Notifikasi</h2>
                      <p className="text-gray-600 text-sm">Kelola notifikasi sistem</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Notifications
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Aktifkan semua notifikasi email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => handleUpdateSetting('notifications', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">New User Notification</h4>
                          <p className="text-sm text-gray-600">Notifikasi saat user baru mendaftar</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.newUserNotification}
                            onChange={(e) => handleUpdateSetting('notifications', 'newUserNotification', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">New Artwork Notification</h4>
                          <p className="text-sm text-gray-600">Notifikasi saat ada karya baru</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.newArtworkNotification}
                            onChange={(e) => handleUpdateSetting('notifications', 'newArtworkNotification', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">Report Notification</h4>
                          <p className="text-sm text-gray-600">Notifikasi saat ada laporan baru</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.reportNotification}
                            onChange={(e) => handleUpdateSetting('notifications', 'reportNotification', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">Newsletter</h4>
                          <p className="text-sm text-gray-600">Kirim newsletter ke user</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.newsletterEnabled}
                            onChange={(e) => handleUpdateSetting('notifications', 'newsletterEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Notification Sound</h4>
                        <p className="text-sm text-gray-600">Putar suara untuk notifikasi baru</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.notificationSound}
                          onChange={(e) => handleUpdateSetting('notifications', 'notificationSound', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Pengaturan Sistem</h2>
                      <p className="text-gray-600 text-sm">Konfigurasi sistem dan performa</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      System Config
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Backup Frequency
                        </label>
                        <select
                          value={settings.system.backupFrequency}
                          onChange={(e) => handleUpdateSetting('system', 'backupFrequency', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Log Retention
                        </label>
                        <select
                          value={settings.system.logRetention}
                          onChange={(e) => handleUpdateSetting('system', 'logRetention', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="7days">7 Days</option>
                          <option value="30days">30 Days</option>
                          <option value="90days">90 Days</option>
                          <option value="1year">1 Year</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Enable Cache</h4>
                        <p className="text-sm text-gray-600">Cache data untuk meningkatkan performa</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.cacheEnabled}
                          onChange={(e) => handleUpdateSetting('system', 'cacheEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Debug Mode</h4>
                        <p className="text-sm text-gray-600">Aktifkan mode debug untuk development</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.debugMode}
                          onChange={(e) => handleUpdateSetting('system', 'debugMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Auto Update</h4>
                        <p className="text-sm text-gray-600">Otomatis update sistem ke versi terbaru</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.autoUpdate}
                          onChange={(e) => handleUpdateSetting('system', 'autoUpdate', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={handleClearCache}
                        className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        🗑️ Clear Cache
                      </button>
                      <button
                        onClick={() => alert('Sistem akan di-restart. Konfirmasi?')}
                        className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        🔄 Restart System
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Backup Settings */}
              {activeTab === 'backup' && (
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Backup & Restore</h2>
                      <p className="text-gray-600 text-sm">Kelola backup dan restore sistem</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Backup Active
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-gray-800">Backup Otomatis</h4>
                          <p className="text-sm text-gray-600">Jadwal backup: {settings.system.backupFrequency}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          backupStatus === 'creating' ? 'bg-amber-100 text-amber-800' :
                          backupStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {backupStatus === 'creating' ? 'Creating...' :
                           backupStatus === 'completed' ? 'Completed' :
                           'Ready'}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Last Backup</span>
                          <span className="text-sm font-medium text-gray-800">Jan 15, 2024 02:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Backup Size</span>
                          <span className="text-sm font-medium text-gray-800">45.2 MB</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Next Backup</span>
                          <span className="text-sm font-medium text-gray-800">Jan 16, 2024 02:00 AM</span>
                        </div>
                      </div>

                      <button
                        onClick={handleCreateBackup}
                        disabled={backupStatus === 'creating'}
                        className="w-full mt-4 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {backupStatus === 'creating' ? (
                          <>
                            <span className="animate-spin">⟳</span>
                            Creating Backup...
                          </>
                        ) : (
                          '💾 Create Manual Backup'
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-3">Backup Files</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Database Backup</span>
                            <span className="font-medium text-gray-800">12.4 MB</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Media Files</span>
                            <span className="font-medium text-gray-800">28.7 MB</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">System Logs</span>
                            <span className="font-medium text-gray-800">4.1 MB</span>
                          </div>
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors">
                          📥 Download All
                        </button>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-3">Restore Options</h4>
                        <div className="space-y-3">
                          <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                            Restore Latest Backup
                          </button>
                          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                            Upload Backup File
                          </button>
                          <button className="w-full px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                            Delete Old Backups
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-start space-x-3">
                        <div className="text-amber-600">⚠️</div>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-1">Important Notice</h4>
                          <p className="text-sm text-gray-600">
                            Backup akan menyimpan semua data termasuk user, karya, dan settings. 
                            Pastikan backup dilakukan secara berkala. Backup terbaru akan menggantikan backup sebelumnya.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Logs */}
              {activeTab === 'logs' && (
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800">System Logs</h2>
                      <p className="text-gray-600 text-sm">Log aktivitas dan error sistem</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm">
                        Export Logs
                      </button>
                      <button className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm">
                        Clear Logs
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-3 px-4 text-gray-700 font-bold text-sm">Type</th>
                          <th className="text-left py-3 px-4 text-gray-700 font-bold text-sm">Message</th>
                          <th className="text-left py-3 px-4 text-gray-700 font-bold text-sm">Timestamp</th>
                          <th className="text-left py-3 px-4 text-gray-700 font-bold text-sm">User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {systemLogs.map(log => (
                          <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                log.type === 'info' ? 'bg-blue-100 text-blue-800' :
                                log.type === 'warning' ? 'bg-amber-100 text-amber-800' :
                                log.type === 'success' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {log.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-sm text-gray-800">{log.message}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-sm text-gray-600">{log.timestamp}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-sm text-gray-800">{log.user}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Showing {systemLogs.length} of 100+ logs
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
                        1
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                        2
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">System Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800">Server Status</h4>
                  <span className="text-green-600">● Online</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-medium text-gray-800">99.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium text-gray-800">128ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-medium text-gray-800">64%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800">Database Status</h4>
                  <span className="text-blue-600">● Healthy</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Records</span>
                    <span className="font-medium text-gray-800">1,248</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Backup Size</span>
                    <span className="font-medium text-gray-800">45.2 MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Connections</span>
                    <span className="font-medium text-gray-800">24/100</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800">Security Status</h4>
                  <span className="text-green-600">● Secure</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Scan</span>
                    <span className="font-medium text-gray-800">2 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Threats Detected</span>
                    <span className="font-medium text-gray-800">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Firewall</span>
                    <span className="font-medium text-gray-800">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
      
      <AdminFooter />
    </>
  )
}