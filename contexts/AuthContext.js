import { createContext, useContext, useState } from 'react'

// Buat context
const AuthContext = createContext()

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    // Simulasi login sederhana
    if (email.includes('@paramadina.ac.id')) {
      const userData = {
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'mahasiswa'
      }
      setUser(userData)
      return { success: true, user: userData }
    }
    return { success: false, message: 'Email harus menggunakan domain @paramadina.ac.id' }
  }

  const logout = () => {
    setUser(null)
    return Promise.resolve()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      userType: user?.role || null
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook untuk menggunakan auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}