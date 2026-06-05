import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Dashboard from '../pages/Dashboard'
import Announcements from '../pages/Announcements'

// Teachers
import MaleTeachers from '../pages/teachers/MaleTeachers'
import FemaleTeachers from '../pages/teachers/FemaleTeachers'
import TeacherAttendance from '../pages/teachers/TeacherAttendance'
import SalaryManagement from '../pages/teachers/SalaryManagement'
import TeacherPerformance from '../pages/teachers/TeacherPerformance'

// Students
import MaleStudents from '../pages/students/MaleStudents'
import FemaleStudents from '../pages/students/FemaleStudents'
import StudentAttendance from '../pages/students/StudentAttendance'
import TestsAndPapers from '../pages/students/TestsAndPapers'
import Admissions from '../pages/students/Admissions'

// Finance
import ExpenseTracker from '../pages/finance/ExpenseTracker'
import FundsAndDonations from '../pages/finance/FundsAndDonations'

export default function AppRoutes() {
  return (
    <Routes>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Main */}
      <Route path="/dashboard"  element={<Dashboard />} />
      <Route path="/announce"   element={<Announcements />} />

      {/* Teachers */}
      <Route path="/teachers/male"        element={<MaleTeachers />} />
      <Route path="/teachers/female"      element={<FemaleTeachers />} />
      <Route path="/teachers/attendance"  element={<TeacherAttendance />} />
      <Route path="/teachers/salary"      element={<SalaryManagement />} />
      <Route path="/teachers/performance" element={<TeacherPerformance />} />

      {/* Students */}
      <Route path="/students/male"        element={<MaleStudents />} />
      <Route path="/students/female"      element={<FemaleStudents />} />
      <Route path="/students/attendance"  element={<StudentAttendance />} />
      <Route path="/students/tests"       element={<TestsAndPapers />} />
      <Route path="/students/admissions"  element={<Admissions />} />

      {/* Finance */}
      <Route path="/finance/expenses"     element={<ExpenseTracker />} />
      <Route path="/finance/funds"        element={<FundsAndDonations />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  )
}