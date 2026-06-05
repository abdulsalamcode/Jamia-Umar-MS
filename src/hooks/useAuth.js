import { useState, useEffect } from 'react'

const useAuth = () => {
  const [user, setUser]           = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    // localStorage se token check karo
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
    window.location.href = '/login'
  }

  const isAdmin = () => user?.role === 'admin'
  const isPrincipal = () => user?.role === 'principal'
  const isManager = () => user?.role === 'manager'

  return {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    isAdmin,
    isPrincipal,
    isManager,
  }
}

export default useAuth