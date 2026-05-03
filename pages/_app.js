import Head from "next/head"
import "../styles/globals.css"
import { AuthProvider } from "../contexts/AuthContext"
import { ArtworkProvider } from "../contexts/ArtworkContext"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ParamadinaVerse</title>
        <meta
          name="description"
          content="Platform showcase karya mahasiswa Universitas Paramadina"
        />
        <link rel="icon" href="/images/Icon512.png" />
      </Head>

      <AuthProvider>
        <ArtworkProvider>
          {/* SEMUA LAYOUT DIKENDALIKAN DI MASING-MASING HALAMAN */}
          <Component {...pageProps} />
        </ArtworkProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
