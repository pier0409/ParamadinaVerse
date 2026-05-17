import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AdminFooter from '../../../components/layout/AdminFooter'
import Link from 'next/link'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  const colors = {
    primary: '#083552',
    secondary: '#1276B5',
    gradient: 'linear-gradient(90deg, #083552 0%, #1276B5 100%)'
  }

  useEffect(() => {
    const userData = JSON.parse(
      localStorage.getItem('user') || 'null'
    )

    if (!userData || userData.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    setUser(userData)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08344F]/5 via-white to-[#1276B5]/5">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#083552] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          Dashboard Admin - ParamadinaVerse
        </title>

        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(.9);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn .5s ease-out forwards;
          }

          .animate-scaleIn {
            animation: scaleIn .4s ease-out forwards;
          }

          .animate-slideDown {
            animation: slideDown .4s ease-out forwards;
          }

          .hover-scale {
            transition: .3s;
          }

          .hover-scale:hover {
            transform: scale(1.02);
          }

          .group-hover-scale-110 {
            transition: .3s;
          }

          .group:hover .group-hover-scale-110 {
            transform: scale(1.1);
          }
        `}</style>
      </Head>

      <AdminLayout>

        {/* HERO */}

        <div
          className="relative text-white py-12 px-4 mb-8 rounded-b-2xl shadow-lg animate-fadeIn"
          style={{
            background: colors.gradient
          }}
        >
          <div className="container mx-auto">

            <h1 className="text-4xl font-bold mb-2 animate-slideDown">
              Dashboard Admin
            </h1>

            <p className="text-blue-100">
              Selamat datang kembali,
              <span className="font-semibold ml-1">
                {user?.name}
              </span>
            </p>

          </div>
        </div>


        <div className="container mx-auto px-4 py-6">

          {/* QUICK STATS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {[
              {
                title: "Total Pengguna",
                value: "156",
                icon: "👥",
                color:
                  "from-blue-500 to-blue-600",
                change:
                  "+12% dari bulan lalu"
              },

              {
                title: "Total Karya",
                value: "342",
                icon: "🖼️",
                color:
                  "from-purple-500 to-pink-500",
                change:
                  "+8% dari bulan lalu"
              }

            ].map((stat, index) => (

              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color}
                text-white p-6 rounded-2xl
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover-scale animate-fadeIn`}
              >

                <div className="flex justify-between">

                  <div>

                    <p className="text-sm opacity-90">
                      {stat.title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {stat.value}
                    </h2>

                  </div>

                  <div className="bg-white/20 p-3 rounded-xl group-hover-scale-110">

                    <span className="text-2xl">
                      {stat.icon}
                    </span>

                  </div>

                </div>

                <div className="mt-4">

                  <span className="text-green-200 text-sm">
                    {stat.change}
                  </span>

                </div>

              </div>

            ))}

          </div>


          {/* MENU ADMIN */}

          <div className="grid grid-cols-1 gap-8">

            <div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-scaleIn">

                <h2 className="text-2xl font-bold text-gray-800 mb-6">

                  Menu Admin

                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {[
                    {
                      href:
                        "/admin/users",

                      icon:
                        "👥",

                      title:
                        "Kelola Pengguna",

                      desc:
                        "Kelola seluruh pengguna",

                      count:
                        "156 User",

                      color:
                        "from-blue-50 to-indigo-50",

                      border:
                        "border-blue-100",

                      iconColor:
                        "bg-blue-100",

                      textColor:
                        "text-blue-600"
                    },

                    {
                      href:
                        "/admin/artworks",

                      icon:
                        "🖼️",

                      title:
                        "Kelola Karya",

                      desc:
                        "Kelola seluruh karya",

                      count:
                        "342 Karya",

                      color:
                        "from-purple-50 to-pink-50",

                      border:
                        "border-purple-100",

                      iconColor:
                        "bg-purple-100",

                      textColor:
                        "text-purple-600"
                    }

                  ].map((menu, index) => (

                    <Link
                      key={index}
                      href={menu.href}
                    >

                      <div
                        className={`group bg-gradient-to-r
                        ${menu.color}
                        p-6 rounded-xl
                        border ${menu.border}
                        hover:shadow-lg
                        transition-all duration-300
                        cursor-pointer
                        hover-scale`}
                      >

                        <div className="flex items-center mb-4">

                          <div className={`w-12 h-12
                          ${menu.iconColor}
                          rounded-xl
                          flex items-center
                          justify-center mr-4`}>

                            <span className="text-xl">
                              {menu.icon}
                            </span>

                          </div>

                          <div>

                            <h3 className="font-bold text-lg text-gray-800">

                              {menu.title}

                            </h3>

                            <p className="text-sm text-gray-600">

                              {menu.desc}

                            </p>

                          </div>

                        </div>

                        <div className="flex justify-between">

                          <span className={`${menu.textColor} text-sm font-medium`}>

                            {menu.count}

                          </span>

                          <span className={menu.textColor}>

                            →

                          </span>

                        </div>

                      </div>

                    </Link>

                  ))}

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