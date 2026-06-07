import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const MODULES = [
  { id: 'dashboard',   icon: '🕌', label: 'Dashboard',        section: 'main',     path: '/dashboard'            },
  { id: 'announce',    icon: '📢', label: 'Announcements',     section: 'main',     path: '/announce'             },
  { id: 't-male',      icon: '👨‍🏫', label: 'Male Teachers',     section: 'teachers', path: '/teachers/male'        },
  { id: 't-female',    icon: '👩‍🏫', label: 'Female Teachers',    section: 'teachers', path: '/teachers/female'      },
  { id: 't-attend',    icon: '✅', label: 'Attendance',         section: 'teachers', path: '/teachers/attendance'  },
  { id: 't-salary',    icon: '💰', label: 'Salary Management',  section: 'teachers', path: '/teachers/salary'      },
  { id: 't-perform',   icon: '📊', label: 'Performance',        section: 'teachers', path: '/teachers/performance' },
  { id: 's-male',      icon: '👦', label: 'Male Students',      section: 'students', path: '/students/male'        },
  { id: 's-female',    icon: '👧', label: 'Female Students',     section: 'students', path: '/students/female'      },
  { id: 's-attend',    icon: '📋', label: 'Attendance',         section: 'students', path: '/students/attendance'  },
  { id: 's-tests',     icon: '📝', label: 'Tests & Papers',      section: 'students', path: '/students/tests'       },
  { id: 's-admission', icon: '🎓', label: 'Admissions',         section: 'students', path: '/students/admissions'  },
  { id: 'expenses',    icon: '🧾', label: 'Expense Tracker',    section: 'finance',  path: '/finance/expenses'     },
  { id: 'funds',       icon: '🤝', label: 'Funds & Donations',  section: 'finance',  path: '/finance/funds'        },
]

const SECTION_LABELS = {
  main:     'Overview',
  teachers: 'Teachers',
  students: 'Students',
  finance:  'Finance',
}

const sections = ['main', 'teachers', 'students', 'finance']

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate            = useNavigate()
  const location            = useLocation()

  const handleNavigate = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <>
      {/* ── Mobile Hamburger Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-[60] bg-green-900
                   text-white p-2.5 rounded-xl shadow-xl border border-green-700"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* ── Mobile Overlay ── */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 z-[45]"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[50]
        w-[260px] h-screen
        bg-gradient-to-b from-green-950 to-green-800
        flex flex-col
        transition-transform duration-300 ease-in-out
        overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/15 text-center">
          <div className="text-yellow-400 text-base font-bold mb-1 leading-relaxed">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </div>
          <div className="text-white font-bold text-sm uppercase tracking-wide leading-snug mt-2">
            Jamia Umar <br /> Islamic University
          </div>
          <div className="text-white/50 text-xs mt-1">Management System</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {sections.map(section => (
            <div key={section}>
              <div className="px-5 pt-4 pb-1 text-white/40 text-xs
                              font-bold uppercase tracking-widest">
                {SECTION_LABELS[section]}
              </div>
              {MODULES.filter(m => m.section === section).map(item => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    flex items-center gap-3 px-5 py-2.5 cursor-pointer text-sm
                    border-l-4 transition-all duration-150
                    ${location.pathname === item.path
                      ? 'bg-yellow-500/20 text-white border-yellow-400 font-bold'
                      : 'text-white/75 border-transparent hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 text-center flex-shrink-0">
          <div className="text-white/30 text-xs">
            Powered by : Abdul salam Chohan<br />
            <span className="text-white/20">© Jamia Umar IU 2026</span>
          </div>
        </div>

      </aside>
    </>
  )
}