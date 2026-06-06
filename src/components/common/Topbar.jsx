import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PAGE_TITLES = {
  '/dashboard':            { icon: '🕌', label: 'Dashboard' },
  '/announce':             { icon: '📢', label: 'Announcements' },
  '/teachers/male':        { icon: '👨‍🏫', label: 'Male Teachers' },
  '/teachers/female':      { icon: '👩‍🏫', label: 'Female Teachers' },
  '/teachers/attendance':  { icon: '✅', label: 'Teacher Attendance' },
  '/teachers/salary':      { icon: '💰', label: 'Salary Management' },
  '/teachers/performance': { icon: '📊', label: 'Performance' },
  '/students/male':        { icon: '👦', label: 'Male Students' },
  '/students/female':      { icon: '👧', label: 'Female Students' },
  '/students/attendance':  { icon: '📋', label: 'Student Attendance' },
  '/students/tests':       { icon: '📝', label: 'Tests & Papers' },
  '/students/admissions':  { icon: '🎓', label: 'Admissions' },
  '/finance/expenses':     { icon: '🧾', label: 'Expense Tracker' },
  '/finance/funds':        { icon: '🤝', label: 'Funds & Donations' },
  '/profile':              { icon: '👤', label: 'Profile Settings' },
}

export default function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const current = PAGE_TITLES[location.pathname] || { icon: '🕌', label: 'Dashboard' }

  const today = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  // User name ka pehla letter avatar ke liye
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || 'A'
  const displayName  = user?.name || 'Administrator'
  const displayCode  = user?.identity_code || 'ADMIN-001'

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">

        {/* ── Left: Page Title ── */}
        <div className="flex items-center gap-2 sm:gap-3 ml-12 lg:ml-0">
          <span className="text-xl sm:text-2xl">{current.icon}</span>
          <div>
            <h1 className="text-sm sm:text-lg font-bold text-green-900 leading-tight">
              {current.label}
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">{today}</p>
          </div>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Institute Badge — only desktop */}
          <div className="hidden lg:flex items-center gap-2 bg-green-50
                          border border-green-200 rounded-full px-3 py-1.5">
            <span className="text-green-700 text-xs font-bold">🕌 Jamia Umar IU</span>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
                   6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6
                   8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6
                   0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Admin Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 bg-green-800 hover:bg-green-900
                         transition-colors rounded-full pl-1.5 pr-2 sm:pr-3 py-1.5"
            >
              <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center
                              justify-center text-green-900 font-bold text-sm flex-shrink-0">
                {avatarLetter}
              </div>
              <span className="text-white text-xs font-bold hidden sm:block">
                {displayName.split(' ')[0]}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg"
                className={`w-3 h-3 text-white transition-transform duration-200 hidden sm:block
                  ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <>
                {/* Backdrop — click karo toh band ho */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl
                                shadow-lg border border-gray-100 overflow-hidden z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800 truncate">{displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{displayCode}</p>
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700
                                     font-bold px-2 py-0.5 rounded-full capitalize">
                      {user?.role || 'admin'}
                    </span>
                  </div>

                  {/* Profile Settings */}
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/profile') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5
                               text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <span>👤</span>
                    <span>Profile Settings</span>
                  </button>

                  {/* Divider + Logout */}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5
                                 text-sm text-red-500 hover:bg-red-50 transition-colors font-bold">
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}