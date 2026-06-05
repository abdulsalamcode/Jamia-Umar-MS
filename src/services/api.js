import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/jamia-umar-ms/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
  timeout: 10000,
})

// ── Request Interceptor ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('role')
          window.location.href = '/login'
          break
        case 403:
          console.error('Access forbidden')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error('API Error:', error.response.status)
      }
    } else if (error.request) {
      console.error('Network error')
    }
    return Promise.reject(error)
  }
)

export default api