import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Admissions', href: '#admissions' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Home')

  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b-4 border-yellow-500">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <div className="flex items-center gap-3">
            
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full
                         bg-gradient-to-br from-green-800 to-green-600
                         flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <span className="text-yellow-400 text-lg sm:text-xl font-bold">
                ج
              </span>
            </div>

            <div>
              <div className="text-green-900 font-bold text-sm sm:text-base leading-tight">
                Jamia Umar
              </div>

              <div className="text-yellow-600 font-bold text-xs sm:text-sm leading-tight">
                Islamic University
              </div>
            </div>

          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">

            {NAV_LINKS.map((link) => (
              
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveNav(link.label)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                  ${
                    activeNav === link.label
                      ? 'text-green-800 bg-green-50 border-b-2 border-green-800'
                      : 'text-gray-600 hover:text-green-800 hover:bg-green-50'
                  }`}
              >
                {link.label}
              </a>

            ))}

          </div>

          {/* Right Buttons */}
          <div className="hidden lg:flex items-center gap-3">

            <a
              href="#admissions"
              className="px-4 py-2 text-sm font-bold text-green-800 border-2
                         border-green-800 rounded-xl hover:bg-green-50 transition-all"
            >
              Apply Now
            </a>

              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r
                          from-green-800 to-green-700 rounded-xl shadow-md
                          hover:from-green-900 hover:to-green-800 transition-all
                          hover:-translate-y-0.5 hover:shadow-lg">
                🔐 Admin Login
              </button>

          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-xl text-green-900 hover:bg-green-50"
          >

            {menuOpen ? (
              
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

            ) : (

              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

            )}

          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (

        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 shadow-lg">

          {NAV_LINKS.map((link) => (

            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                setActiveNav(link.label)
                setMenuOpen(false)
              }}
              className="block px-4 py-3 text-sm font-semibold text-gray-700
                         hover:text-green-800 hover:bg-green-50
                         rounded-xl mb-1"
            >
              {link.label}
            </a>

          ))}

          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">

            <a
              href="#admissions"
              className="text-center px-4 py-2.5 text-sm font-bold
                         text-green-800 border-2 border-green-800
                         rounded-xl hover:bg-green-50"
            >
              Apply Now
            </a>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2.5 text-sm font-bold text-white
                         bg-green-800 rounded-xl hover:bg-green-900
                         transition-colors"
            >
              🔐 Admin Login
            </button>

          </div>

        </div>

      )}

    </nav>
  )
}