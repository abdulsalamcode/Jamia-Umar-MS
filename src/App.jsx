import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// ── Auth ──
import { AuthProvider, useAuth } from './context/AuthContext'

// ── Public Pages ──
import Home  from './pages/Home'
import Login from './pages/Login'

// ── Common Layout ──
import Sidebar from './components/common/Sidebar'
import Topbar  from './components/common/Topbar'

// ── Admin Pages ──
import Dashboard     from './pages/Dashboard'
import Announcements from './pages/Announcements'

// Teachers
import MaleTeachers      from './pages/teachers/MaleTeachers'
import FemaleTeachers    from './pages/teachers/FemaleTeachers'
import TeacherAttendance from './pages/teachers/TeacherAttendance'
import SalaryManagement  from './pages/teachers/SalaryManagement'
import TeacherPerformance from './pages/teachers/TeacherPerformance'

// Students
import MaleStudents      from './pages/students/MaleStudents'
import FemaleStudents    from './pages/students/FemaleStudents'
import StudentAttendance from './pages/students/StudentAttendance'
import TestsAndPapers    from './pages/students/TestsAndPapers'
import Admissions        from './pages/students/Admissions'

// Profile
import ProfileSettings from './pages/ProfileSettings'

// Finance
import ExpenseTracker    from './pages/finance/ExpenseTracker'
import FundsAndDonations from './pages/finance/FundsAndDonations'

// ── Admin Layout ──
function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 p-3 sm:p-5 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

// ── Protected Route ──
// Agar token nahi → /login pe bhejo
// Agar logged in hai aur /login pe jaye → /dashboard pe bhejo
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center
                          justify-center text-green-900 font-bold text-2xl mx-auto mb-4">
            ج
          </div>
          <p className="text-green-900 font-bold text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

// ── Login Route Guard ──
// Already logged in ho toh login pe mat jao
function PublicOnlyRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) return null

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// ── Main App ──
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public ── */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* ── Protected Admin Pages ── */}
          <Route path="/dashboard"
            element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/announce"
            element={<ProtectedRoute><AdminLayout><Announcements /></AdminLayout></ProtectedRoute>} />

          {/* Teachers */}
          <Route path="/teachers/male"
            element={<ProtectedRoute><AdminLayout><MaleTeachers /></AdminLayout></ProtectedRoute>} />
          <Route path="/teachers/female"
            element={<ProtectedRoute><AdminLayout><FemaleTeachers /></AdminLayout></ProtectedRoute>} />
          <Route path="/teachers/attendance"
            element={<ProtectedRoute><AdminLayout><TeacherAttendance /></AdminLayout></ProtectedRoute>} />
          <Route path="/teachers/salary"
            element={<ProtectedRoute><AdminLayout><SalaryManagement /></AdminLayout></ProtectedRoute>} />
          <Route path="/teachers/performance"
            element={<ProtectedRoute><AdminLayout><TeacherPerformance /></AdminLayout></ProtectedRoute>} />

          {/* Students */}
          <Route path="/students/male"
            element={<ProtectedRoute><AdminLayout><MaleStudents /></AdminLayout></ProtectedRoute>} />
          <Route path="/students/female"
            element={<ProtectedRoute><AdminLayout><FemaleStudents /></AdminLayout></ProtectedRoute>} />
          <Route path="/students/attendance"
            element={<ProtectedRoute><AdminLayout><StudentAttendance /></AdminLayout></ProtectedRoute>} />
          <Route path="/students/tests"
            element={<ProtectedRoute><AdminLayout><TestsAndPapers /></AdminLayout></ProtectedRoute>} />
          <Route path="/students/admissions"
            element={<ProtectedRoute><AdminLayout><Admissions /></AdminLayout></ProtectedRoute>} />

          {/* Profile */}
          <Route path="/profile"
            element={<ProtectedRoute><AdminLayout><ProfileSettings /></AdminLayout></ProtectedRoute>} />

          {/* Finance */}
          <Route path="/finance/expenses"
            element={<ProtectedRoute><AdminLayout><ExpenseTracker /></AdminLayout></ProtectedRoute>} />
          <Route path="/finance/funds"
            element={<ProtectedRoute><AdminLayout><FundsAndDonations /></AdminLayout></ProtectedRoute>} />

          {/* 404 → Home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}