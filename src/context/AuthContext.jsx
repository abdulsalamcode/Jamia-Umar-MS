import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API = 'http://localhost/jamia-umar-ms/api/auth/verify.php'

export function AuthProvider({ children }) {
  const [user,       setUser]       = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading,    setLoading]    = useState(true)

  // ── App open hote hi token VERIFY karo backend se ──
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res  = await fetch(API, {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()

        if (data.success) {
          setUser(data.user)
          setIsLoggedIn(true)
        } else {
          // Token invalid — sab clear karo
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('role')
        }
      } catch {
        // Server down — clear karo
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user',  JSON.stringify(userData))
    localStorage.setItem('role',  userData.role)
    setUser(userData)
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    setUser(null)
    setIsLoggedIn(false)
  }

  const isAdmin   = () => user?.role === 'admin'
  const isTeacher = () => user?.role === 'teacher'
  const isParent  = () => user?.role === 'parent'

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, loading,
      login, logout,
      isAdmin, isTeacher, isParent,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext