import { createContext, useContext, useState } from 'react'

const ArtworkContext = createContext()

export function ArtworkProvider({ children }) {
  const [artworks, setArtworks] = useState([])

  return (
    <ArtworkContext.Provider value={{ artworks, setArtworks }}>
      {children}
    </ArtworkContext.Provider>
  )
}

export const useArtwork = () => useContext(ArtworkContext)