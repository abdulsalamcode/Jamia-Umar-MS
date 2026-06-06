import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_INFO = [
  {
    role:  'admin',
    icon:  '👨‍💼',
    label: 'Admin / Principal',
    code:  'ADMIN-001',
    desc:  'Full access to all modules',
    color: 'bg-green-50 border-green-200 text-green-800',
  },
  {
    role:  'teacher',
    icon:  '👨‍🏫',
    label: 'Teacher',
    code:  'TCH-001',
    desc:  'View your attendance, salary & performance',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
  },
  {
    role:  'parent',
    icon:  '👨‍👩‍👧',
    label: 'Parent / Guardian',
    code:  'STD-001',
    desc:  "View your child's progress & attendance",
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
]

export default function Login() {
  const [form, setForm]             = useState({ identity_code: '', password: '' })
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [activeRole, setActiveRole] = useState('admin')

  const navigate  = useNavigate()
  const { login } = useAuth()         // ← AuthContext ka login

  const handleLogin = async () => {
    setError('')

    if (!form.identity_code || !form.password) {
      setError('Please enter your ID and password')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        'http://localhost/jamia-umar-ms/api/auth/login.php',
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(form),
        }
      )

      const data = await response.json()

      if (data.success) {
        // AuthContext mein save karo
        login(data.user, data.token)

        // Role ke hisaab se redirect
        if (data.role === 'admin') {
          navigate('/dashboard')
        } else if (data.role === 'teacher') {
          navigate('/dashboard')   // Teacher portal baad mein
        } else if (data.role === 'parent') {
          navigate('/dashboard')   // Parent portal baad mein
        }

      } else {
        setError(data.message || 'Invalid ID or password')
      }

    } catch (err) {
      setError('Connection error. Please check your server.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  const handleRoleSelect = (role) => {
    setActiveRole(role)
    setError('')
    const found = ROLE_INFO.find(r => r.role === role)
    setForm(prev => ({ ...prev, identity_code: found?.code || '' }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900
                    to-green-800 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-4 border-white"></div>
        <div className="absolute top-32 right-20 w-24 h-24 rounded-full border-4 border-white"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 rounded-full border-4 border-white"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full border-4 border-white"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Top Header */}
          <div className="bg-gradient-to-r from-green-900 to-green-800 px-8 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center
                            justify-center text-green-900 font-bold text-3xl mx-auto mb-4
                            shadow-lg">
              ج
            </div>
            <div className="text-yellow-400 text-sm font-bold mb-2 leading-relaxed">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </div>
            <h1 className="text-white font-bold text-xl leading-tight">
              Jamia Umar Islamic University
            </h1>
            <p className="text-white/60 text-xs mt-1">
              Management System — Secure Portal
            </p>
          </div>

          {/* Form */}
          <div className="px-6 sm:px-8 py-8">

            <h2 className="text-green-900 font-bold text-xl mb-1">
              Select Your Role 👇
            </h2>
            <p className="text-gray-400 text-sm mb-5">
              Choose your role to login to the portal
            </p>

            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
              {ROLE_INFO.map(r => (
                <button
                  key={r.role}
                  onClick={() => handleRoleSelect(r.role)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl
                              border-2 transition-all duration-200 hover:-translate-y-0.5
                    ${activeRole === r.role
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-100 bg-gray-50 hover:border-green-200'
                    }`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <span className={`text-xs font-bold text-center leading-tight
                    ${activeRole === r.role ? 'text-green-800' : 'text-gray-600'}`}>
                    {r.label}
                  </span>
                  {activeRole === r.role && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Role Description */}
            <div className={`rounded-xl px-4 py-2.5 mb-5 border-2 text-xs font-medium
              ${ROLE_INFO.find(r => r.role === activeRole)?.color}`}>
              {ROLE_INFO.find(r => r.role === activeRole)?.icon}{' '}
              {ROLE_INFO.find(r => r.role === activeRole)?.desc}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl
                              px-4 py-3 mb-4 flex items-center gap-2">
                <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Identity Code */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                {activeRole === 'admin'   ? '🔑 Admin ID'             :
                 activeRole === 'teacher' ? '🪪 Teacher ID (TCH-XXX)' :
                                            '🪪 Student ID (STD-XXX)' }
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                  {activeRole === 'admin' ? '📧' : '🪪'}
                </span>
                <input
                  type="text"
                  placeholder={
                    activeRole === 'admin'   ? 'ADMIN-001...' :
                    activeRole === 'teacher' ? 'e.g. TCH-001'  :
                                               'e.g. STD-001'
                  }
                  value={form.identity_code}
                  onChange={e => setForm({ ...form, identity_code: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full border-2 border-gray-100 rounded-xl
                             pl-10 pr-4 py-3 text-sm
                             focus:outline-none focus:border-green-400
                             bg-gray-50 transition-colors placeholder-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                🔒 Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                  🔒
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password..."
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full border-2 border-gray-100 rounded-xl
                             pl-10 pr-12 py-3 text-sm
                             focus:outline-none focus:border-green-400
                             bg-gray-50 transition-colors placeholder-gray-300"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600 text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-green-800 to-green-700
                         text-white font-bold py-3.5 rounded-xl text-sm
                         shadow-lg transition-all flex items-center justify-center gap-2
                         ${loading
                           ? 'opacity-70 cursor-not-allowed'
                           : 'hover:from-green-900 hover:to-green-800 hover:-translate-y-0.5 hover:shadow-xl'
                         }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>🔐 Sign In</>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-gray-300 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            {/* Back to Home */}
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600
                         font-bold py-3 rounded-xl text-sm transition-all
                         border-2 border-gray-100 hover:border-gray-200
                         flex items-center justify-center gap-2">
              🏠 Back to Home
            </button>

            {/* Default Credentials */}
            <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <p className="text-yellow-700 text-xs font-bold mb-2">
                🔑 Default Credentials:
              </p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-600 text-xs">👨‍💼 Admin:</span>
                  <span className="text-yellow-700 text-xs font-bold">ADMIN-001 / password</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-600 text-xs">👨‍🏫 Teacher:</span>
                  <span className="text-yellow-700 text-xs font-bold">TCH-001 / jamia123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-600 text-xs">👨‍👩‍👧 Parent:</span>
                  <span className="text-yellow-700 text-xs font-bold">STD-001 / jamia123</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-6">
          © 2026 Jamia Umar Islamic University
        </p>

      </div>
    </div>
  )
}