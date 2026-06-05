import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Home & Login
import Home  from './pages/Home'
import Login from './pages/Login'

// Common Layout
import Sidebar from './components/common/Sidebar'
import Topbar  from './components/common/Topbar'

// Pages
import Dashboard    from './pages/Dashboard'
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

// Finance
import ExpenseTracker   from './pages/finance/ExpenseTracker'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public Pages ── */}
        <Route path="/"      element={<Home />}  />
        <Route path="/login" element={<Login />} />

        {/* ── Admin Pages ── */}
        <Route path="/dashboard"
          element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/announce"
          element={<AdminLayout><Announcements /></AdminLayout>} />

        {/* Teachers */}
        <Route path="/teachers/male"
          element={<AdminLayout><MaleTeachers /></AdminLayout>} />
        <Route path="/teachers/female"
          element={<AdminLayout><FemaleTeachers /></AdminLayout>} />
        <Route path="/teachers/attendance"
          element={<AdminLayout><TeacherAttendance /></AdminLayout>} />
        <Route path="/teachers/salary"
          element={<AdminLayout><SalaryManagement /></AdminLayout>} />
        <Route path="/teachers/performance"
          element={<AdminLayout><TeacherPerformance /></AdminLayout>} />

        {/* Students */}
        <Route path="/students/male"
          element={<AdminLayout><MaleStudents /></AdminLayout>} />
        <Route path="/students/female"
          element={<AdminLayout><FemaleStudents /></AdminLayout>} />
        <Route path="/students/attendance"
          element={<AdminLayout><StudentAttendance /></AdminLayout>} />
        <Route path="/students/tests"
          element={<AdminLayout><TestsAndPapers /></AdminLayout>} />
        <Route path="/students/admissions"
          element={<AdminLayout><Admissions /></AdminLayout>} />

        {/* Finance */}
        <Route path="/finance/expenses"
          element={<AdminLayout><ExpenseTracker /></AdminLayout>} />
        <Route path="/finance/funds"
          element={<AdminLayout><FundsAndDonations /></AdminLayout>} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}