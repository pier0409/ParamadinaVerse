import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import MahasiswaNavbar from "../../../components/layout/MahasiswaNavbar";

export default function KaryaDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [karya, setKarya] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    loadArtwork();
  }, [id]);

  const loadArtwork = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${id}`
      );

      if (!res.ok) {
        router.push("/404");
        return;
      }

      const data = await res.json();

      setKarya(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!karya) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Karya tidak ditemukan
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {karya.title}
        </title>
      </Head>

      <div className="min-h-screen bg-gray-50">

        <MahasiswaNavbar />

        <div className="max-w-7xl mx-auto p-8">

          <Link href="/mahasiswa/profile">
            <button className="mb-8">
              ← Kembali
            </button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2">

              <div className="bg-white rounded-xl p-8 shadow">

                <h1 className="text-3xl font-bold mb-3">
                  {karya.title}
                </h1>

                <div className="flex gap-2 mb-6">

                  <span className="bg-blue-100 px-3 py-1 rounded">

                    {karya.category}

                  </span>

                  <span
                  className={`px-3 py-1 rounded text-white

                  ${
                  karya.status==="approved"

                  ?"bg-green-500"

                  :karya.status==="rejected"

                  ?"bg-red-500"

                  :"bg-yellow-500"
                  }

                  `}
                  >

                    {karya.status}

                  </span>

                </div>

                <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center mb-8">

                  {karya.file_url ? (

                    <img
                    src={karya.file_url}
                    className="w-full h-full object-cover rounded-xl"
                    />

                  ) : (

                    <div className="text-center">

                      <div className="text-7xl">

                        🎨

                      </div>

                      <p>

                        Belum ada preview

                      </p>

                    </div>

                  )}

                </div>

                <h2 className="font-bold text-xl mb-3">

                  Deskripsi

                </h2>

                <p className="mb-8">

                  {karya.description}

                </p>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <p className="text-gray-500">

                      Pembuat

                    </p>

                    <p>

                      {karya.users?.name ||
                      "Mahasiswa"}

                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500">

                      Email

                    </p>

                    <p>

                      {karya.users?.email}

                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500">

                      Diupload

                    </p>

                    <p>

                      {
                      formatDate(
                       karya.created_at
                      )
                      }

                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500">

                      ID Karya

                    </p>

                    <p>

                      {karya.id}

                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div>

              <div className="bg-white p-6 rounded-xl shadow">

                <h2 className="font-bold mb-5">

                  Statistik

                </h2>

                <div className="space-y-4">

                  <div>

                    👁️ Views :

                    {karya.views || 0}

                  </div>

                  <div>

                    ❤️ Likes :

                    {karya.likes || 0}

                  </div>

                  <div>

                    💬 Komentar :

                    {karya.comments || 0}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}