// pages/auth/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    prodi: '',
    semester: '',
    nim: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)',
    gradientDiagonal:
      'linear-gradient(135deg, #083552 0%, #0B4A6E 50%, #1276B5 100%)',
  };

  const stats = [
    { number: '500+', label: 'Karya Kreatif' },
    { number: '200+', label: 'Mahasiswa Aktif' },
    { number: '7+', label: 'Program Studi' },
    { number: '1000+', label: 'Pengunjung' },
  ];

  const prodiList = [
    'Informatika',
    'Desain Komunikasi Visual',
    'Ilmu Komunikasi',
    'Manajemen',
    'Akuntansi',
    'Psikologi',
    'Falsafah dan Agama',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();

    setError('');
    setLoading(true);

    const { username, email, password, confirmPassword, prodi, semester, nim } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError('Semua field wajib diisi');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const allowedDomains = ['@students.paramadina.ac.id', '@paramadina.ac.id'];
    const isValidDomain = allowedDomains.some((domain) =>
      emailLower.endsWith(domain)
    );

    if (!isValidDomain) {
      setError('Harus menggunakan email mahasiswa Universitas Paramadina');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email: emailLower,
            password,
            prodi,
            semester,
            nim,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registrasi gagal');
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify({ ...data, name: data.name || username }));
      localStorage.setItem('isLoggedIn', 'true');

      setShowSuccessPopup(true);
    } catch (err) {
      console.error('FETCH ERROR:', err);
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccessPopup(false);
    router.push('/mahasiswa/dashboard');
  };

  return (
    <>
      <Head>
        <title>Daftar - ParamadinaVerse</title>
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
              Platform digital eksklusif untuk mahasiswa Universitas Paramadina menampilkan karya terbaik dalam berbagai bidang keilmuan.
            </p>

            {/* STATS GRID */}
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
        <div className="w-full lg:w-3/5 flex flex-col justify-center p-8 lg:p-16 overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            {/* BACK BUTTON */}
            <Link
              href="/auth/login"
              className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Login
            </Link>

            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Daftar Akun Baru
              </h1>
              <p className="text-gray-600">
                Buat akun untuk mulai berbagi karya terbaik Anda
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nama lengkap kamu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="mahasiswa@students.paramadina.ac.id"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gunakan email mahasiswa (@students.paramadina.ac.id)
                </p>
              </div>

              {/* NIM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIM
                </label>
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  placeholder="Nomor Induk Mahasiswa"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Prodi & Semester */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Studi
                  </label>
                  <select
                    name="prodi"
                    value={formData.prodi}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    disabled={loading}
                  >
                    <option value="">Pilih Prodi</option>
                    {prodiList.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    disabled={loading}
                  >
                    <option value="">Pilih</option>
                    {[1,2,3,4,5,6,7,8].map((s) => (
                      <option key={s} value={String(s)}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="············"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                <span>{loading ? 'Memproses...' : 'Daftar Sekarang'}</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>

            {/* LOGIN LINK */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Sudah punya akun?{' '}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP SUKSES */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: colors.gradient }}
              >
                {formData.username?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <h3 className="text-xl font-bold mb-2">Registrasi Berhasil!</h3>
              <p className="text-gray-600 mb-1">{formData.username}</p>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: '#E0F2FE', color: '#0369A1' }}
              >
                Mahasiswa
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