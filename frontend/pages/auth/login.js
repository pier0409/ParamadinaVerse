// pages/auth/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)',
    gradientDiagonal: 'linear-gradient(135deg, #083552 0%, #0B4A6E 50%, #1276B5 100%)',
  };

  const stats = [
    { number: '500+', label: 'Karya Kreatif' },
    { number: '200+', label: 'Mahasiswa Aktif' },
    { number: '7+', label: 'Program Studi' },
    { number: '1000+', label: 'Pengunjung' },
  ];

  const roleLabel = {
    admin: 'Administrator',
    mahasiswa: 'Mahasiswa',
  };

  // =========================
  // LOGIN HANDLER
  // =========================
  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError('');

    const emailLower = email.toLowerCase().trim();

    if (!emailLower || !password) {
      setError('Email dan password wajib diisi');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailLower,
            password: password,
            // Tidak kirim role — backend tentukan dari database
            // Admin ditentukan dari adminEmails di authController
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login gagal');
        setLoading(false);
        return;
      }

      // =============================================
      // Backend return: { _id, username, email, role, token }
      // Normalisasi ke format yang dipakai seluruh frontend
      // =============================================
      const finalUser = {
        _id: data._id,
        id: data._id,           // fallback untuk kode yang pakai .id
        name: data.username,    // frontend pakai .name, backend kirim .username
        username: data.username,
        email: data.email,
        role: data.role,
        token: data.token,
        avatar: data.username?.charAt(0)?.toUpperCase() || '?',
        // Field tambahan (akan dilengkapi saat fetch profile)
        prodi: data.prodi || '',
        semester: data.semester || '',
        nim: data.nim || '',
        instagram: data.instagram || '',
        linkedin: data.linkedin || '',
        description: data.description || '',
      };

      localStorage.setItem('user', JSON.stringify(finalUser));
      localStorage.setItem('isLoggedIn', 'true');

      setUserData(finalUser);
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('FETCH ERROR:', err);
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  // Redirect berdasarkan role dari backend
  const handleContinue = () => {
    setShowSuccessPopup(false);
    if (userData?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/mahasiswa/dashboard');
    }
  };

  return (
    <>
      <Head>
        <title>Login - ParamadinaVerse</title>
      </Head>

      <div className="min-h-screen bg-white flex">
        {/* LEFT PANEL */}
        <div
          className="hidden lg:flex lg:w-2/5 p-12 flex-col justify-between text-white relative"
          style={{ background: colors.gradientDiagonal }}
        >
          <div>
            <h1 className="text-3xl font-bold mb-4">ParamadinaVerse</h1>
            <p className="text-lg opacity-90 mb-8">Digital Art Gallery</p>
            <p className="text-gray-200 mb-12">
              Platform digital eksklusif untuk mahasiswa Universitas Paramadina
              menampilkan karya terbaik dalam berbagai bidang keilmuan.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="italic text-gray-200 mb-4">
              "Kreatifitas adalah wujud nyata dari pengetahuan."
            </div>
            <div className="text-sm text-gray-300">— Universitas Paramadina</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center p-8 lg:p-16">
          <div className="max-w-md mx-auto w-full">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </Link>

            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Selamat datang kembali
              </h1>
              <p className="text-gray-600">
                Masuk untuk mengakses ParamadinaVerse
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="············"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                style={{ background: colors.gradient }}
              >
                <span>{loading ? 'Memproses...' : 'Masuk'}</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Belum punya akun?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP SUKSES */}
      {showSuccessPopup && userData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: colors.gradient }}
              >
                {userData.avatar}
              </div>
              <h3 className="text-xl font-bold mb-2">Login Berhasil!</h3>
              <p className="text-gray-600 mb-3">{userData.name}</p>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: userData.role === 'admin' ? '#FEF3C7' : '#E0F2FE',
                  color: userData.role === 'admin' ? '#92400E' : '#0369A1',
                }}
              >
                {roleLabel[userData.role] ?? userData.role}
              </span>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ background: colors.gradient }}
            >
              Lanjut ke Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}