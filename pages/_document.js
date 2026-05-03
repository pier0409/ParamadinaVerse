import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* TITLE */}
        <title>ParamadinaVerse</title>

        {/* FAVICON */}
        <link rel="icon" href="/images/Icon512.png" />

        {/* OPTIONAL: META */}
        <meta
          name="description"
          content="Platform showcase karya mahasiswa Universitas Paramadina"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}