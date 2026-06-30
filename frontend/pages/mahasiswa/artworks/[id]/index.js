// pages/mahasiswa/karya/[id]/index.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import MahasiswaNavbar from "../../../../components/layout/MahasiswaNavbar";

export default function KaryaDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [karya, setKarya]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [komentar, setKomentar]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Ambil user dari localStorage (sesuaikan dengan auth yang kamu pakai)
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (!router.isReady || !id) return;
    loadKarya();
  }, [router.isReady, id]);

  const loadKarya = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${id}`
      );
      if (!res.ok) { router.push("/404"); return; }
      const data = await res.json();
      setKarya({ ...data.artwork, komentar: data.comments });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Like / Unlike ──────────────────────────────────────────
  const handleLike = async () => {
    if (!currentUser) { router.push("/login"); return; }
    setLikeLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('user') || 'null')?.token;
      const method = isLiked ? "DELETE" : "POST";
      const url = isLiked
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/likes/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/likes`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: isLiked ? null : JSON.stringify({ artworkId: id }),
      });
      if (!res.ok) throw new Error();

      // Update state lokal tanpa reload
      setKarya((prev) => ({
        ...prev,
        likes: isLiked
          ? prev.likes.filter((l) => (l._id ?? l).toString() !== currentUser._id)
          : [...(prev.likes || []), currentUser._id],
      }));
    } catch {
      alert("Gagal melakukan like");
    } finally {
      setLikeLoading(false);
    }
  };

  // ── Kirim Komentar ─────────────────────────────────────────
  const handleKomentar = async (e) => {
    e.preventDefault();
    if (!currentUser) { router.push("/login"); return; }
    if (!komentar.trim()) return;

    setSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('user') || 'null')?.token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ artworkId: id, comment: komentar }),
        }
      );
      if (!res.ok) throw new Error();
      const data = await res.json(); // { comment: { ... } }
      setKarya((prev) => ({ ...prev, komentar: [...(prev.komentar || []), data.comment] }));
      setKomentar("");
    } catch {
      alert("Gagal mengirim komentar");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const statusConfig = {
    accepted: { label: "Diterima", bg: "bg-green-500" },
    denied:   { label: "Ditolak",  bg: "bg-red-500"   },
    pending:  { label: "Pending",  bg: "bg-yellow-500" },
  };

  const isLiked = karya?.likes?.some(
    (l) => (l._id ?? l).toString() === currentUser?._id
  );

  // ── Loading & Error State ───────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Memuat karya...</p>
      </div>
    );
  }

  if (!karya) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Karya tidak ditemukan</p>
      </div>
    );
  }

  const status = statusConfig[karya.status] ?? statusConfig.pending;

  return (
    <>
      <Head><title>{karya.title}</title></Head>

      <div className="min-h-screen bg-gray-50">
        <MahasiswaNavbar />

        <div className="max-w-7xl mx-auto p-8">

          {/* ── Tombol Kembali ── */}
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
          >
            ← Kembali
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Konten Utama ── */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-8 shadow">

                {/* Judul & Badge */}
                <h1 className="text-3xl font-bold mb-3">{karya.title}</h1>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {karya.categoryName || karya.category?.name}
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {karya.programStudi}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm text-white ${status.bg}`}>
                    {status.label}
                  </span>
                </div>

                {/* Preview Gambar */}
                <div className="rounded-xl overflow-hidden h-96 bg-gray-100 flex items-center justify-center mb-8">
                  {karya.image_url ? (
                    <img
                      src={karya.image_url}
                      alt={karya.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="text-6xl mb-2">🎨</div>
                      <p>Belum ada preview</p>
                    </div>
                  )}
                </div>

                {/* ── Tombol Like ── */}
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 font-medium transition-all
                      ${isLiked
                        ? "bg-red-50 border-red-400 text-red-500"
                        : "border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500"
                      } ${likeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLiked ? "❤️" : "🤍"}
                    <span>{karya.likes?.length ?? 0} Likes</span>
                  </button>
                  <span className="text-gray-400 text-sm">
                    💬 {karya.komentar?.length ?? 0} Komentar
                  </span>
                </div>

                {/* Deskripsi */}
                <h2 className="font-bold text-xl mb-2">Deskripsi</h2>
                <p className="text-gray-700 leading-relaxed mb-8">{karya.description}</p>

                {/* Detail */}
                <h2 className="font-bold text-xl mb-4">Detail Karya</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Teknik</p>
                    <p className="font-medium">{karya.teknik}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Durasi Pengerjaan</p>
                    <p className="font-medium">{karya.durasi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Program Studi</p>
                    <p className="font-medium">{karya.programStudi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Diupload</p>
                    <p className="font-medium">{formatDate(karya.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* ── Form Komentar ── */}
              <div className="bg-white rounded-xl p-8 shadow">
                <h2 className="font-bold text-xl mb-4">Komentar</h2>

                {currentUser ? (
                  <form onSubmit={handleKomentar} className="mb-6">
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 shrink-0">
                        {currentUser.username?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={komentar}
                          onChange={(e) => setKomentar(e.target.value)}
                          placeholder="Tulis komentar kamu..."
                          rows={3}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={submitting || !komentar.trim()}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {submitting ? "Mengirim..." : "Kirim"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
                    <Link href="/login" className="text-blue-600 font-medium hover:underline">
                      Login
                    </Link>{" "}
                    untuk memberikan komentar
                  </div>
                )}

                {/* List Komentar */}
                {karya.komentar?.length > 0 ? (
                  <div className="space-y-4">
                    {karya.komentar.map((k) => (
                      <div key={k._id} className="flex gap-3 border-b pb-4">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 shrink-0">
                          {k.user?.username?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{k.user?.username ?? "Anonim"}</p>
                          <p className="text-gray-700 text-sm">{k.comment}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(k.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Belum ada komentar. Jadilah yang pertama! 💬
                  </p>
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-4">

              {/* Statistik */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold mb-4">Statistik</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>❤️ Likes</span>
                    <span className="font-semibold">{karya.likes?.length ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💬 Komentar</span>
                    <span className="font-semibold">{karya.komentar?.length ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* Info Pembuat */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold mb-4">Pembuat</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {karya.created_by?.username?.[0]?.toUpperCase() ?? "M"}
                    </div>
                    <div>
                      <p className="font-medium">{karya.created_by?.username ?? "Mahasiswa"}</p>
                      <p className="text-sm text-gray-500">{karya.created_by?.email ?? "-"}</p>
                    </div>
                  </div>
                  {karya.created_by?.prodi && (
                    <div>
                      <p className="text-sm text-gray-500">Prodi</p>
                      <p className="text-sm">{karya.created_by.prodi}</p>
                    </div>
                  )}
                  {karya.created_by?.nim && (
                    <div>
                      <p className="text-sm text-gray-500">NIM</p>
                      <p className="text-sm">{karya.created_by.nim}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}