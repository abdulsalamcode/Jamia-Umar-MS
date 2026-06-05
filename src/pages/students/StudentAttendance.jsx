import React, { useState, useEffect } from 'react'
import attendanceService from '../../services/attendanceService'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_STATUS = ['present', 'present', 'present', 'absent', 'present', 'holiday', 'holiday']

export default function StudentAttendance() {
  const [students, setStudents]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [saving, setSaving]               = useState(false)
  const [error, setError]                 = useState('')
  const [saved, setSaved]                 = useState(false)
  const [sectionFilter, setSectionFilter] = useState('All')
  const [courseFilter, setCourseFilter]   = useState('All')
  const [selectedDate, setSelectedDate]   = useState(
    new Date().toISOString().split('T')[0]
  )
  const [attendance, setAttendance] = useState({})

  // ── Fetch Attendance ──
  const fetchAttendance = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await attendanceService.getStudentAttendance(
        selectedDate,
        sectionFilter === 'All' ? null : sectionFilter.toLowerCase(),
        courseFilter  === 'All' ? null : courseFilter.toLowerCase()
      )
      setStudents(res.data.data)

      const att = {}
      res.data.data.forEach(s => {
        att[s.id] = s.status || 'present'
      })
      setAttendance(att)
    } catch (err) {
      setError('Failed to load attendance.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAttendance() }, [selectedDate, sectionFilter, courseFilter])

  const handleChange = (id, value) => {
    setAttendance(prev => ({ ...prev, [id]: value }))
    setSaved(false)
  }

  // ── Save Attendance ──
  const handleSave = async () => {
    try {
      setSaving(true)
      const attendanceArr = Object.keys(attendance).map(id => ({
        student_id: parseInt(id),
        status:     attendance[id]
      }))
      await attendanceService.saveStudentAttendance(selectedDate, attendanceArr)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save attendance.')
    } finally {
      setSaving(false)
    }
  }

  const presentCount = Object.values(attendance).filter(v => v === 'present').length
  const absentCount  = Object.values(attendance).filter(v => v === 'absent').length
  const leaveCount   = Object.values(attendance).filter(v => v === 'leave').length

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">📋 Student Attendance</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Track and mark daily attendance for all students
        </p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl
                        px-4 py-3 mb-4 text-red-600 text-sm font-bold flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Students', value: students.length, icon: '🎓', color: 'bg-green-50 border-green-100'   },
          { label: 'Present',        value: presentCount,    icon: '✅', color: 'bg-green-50 border-green-100'   },
          { label: 'Absent',         value: absentCount,     icon: '❌', color: 'bg-red-50 border-red-100'       },
          { label: 'On Leave',       value: leaveCount,      icon: '🏖️', color: 'bg-yellow-50 border-yellow-100' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border shadow-sm p-3 sm:p-4 text-center ${s.color}`}>
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-lg sm:text-xl font-bold text-green-900">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Weekly Overview ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h3 className="text-white font-bold text-sm sm:text-base">Weekly Overview</h3>
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {DAYS.map((day, i) => (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-400 font-bold mb-2">{day}</div>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full mx-auto flex items-center
                                 justify-center text-xs font-bold
                  ${DAY_STATUS[i] === 'present' ? 'bg-green-100 text-green-700' :
                    DAY_STATUS[i] === 'absent'  ? 'bg-red-100 text-red-600'    :
                                                   'bg-yellow-100 text-yellow-700'}`}>
                  {DAY_STATUS[i] === 'present' ? '✓' :
                   DAY_STATUS[i] === 'absent'  ? '✗' : 'H'}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            {[
              ['bg-green-100 text-green-700',  '✓', 'Present'],
              ['bg-red-100 text-red-600',       '✗', 'Absent'],
              ['bg-yellow-100 text-yellow-700', 'H', 'Holiday'],
            ].map(([cls, symbol, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${cls} flex items-center
                                 justify-center text-xs font-bold`}>
                  {symbol}
                </div>
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mark Attendance ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Card Header */}
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row
                        sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">✍️</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Mark Attendance</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            />
            <select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option>All</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option>All</option>
              <option>school</option>
              <option>hifz</option>
              <option>hadith</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-8 h-8 text-green-700" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <p className="text-gray-400 text-sm">Loading attendance...</p>
            </div>
          </div>
        )}

        {/* ── Mobile View ── */}
        {!loading && (
          <div className="block sm:hidden">
            {students.map(s => (
              <div key={s.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                     font-bold text-sm flex-shrink-0
                      ${s.section === 'male'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'}`}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.class} • {s.course}</p>
                    </div>
                  </div>
                  <select
                    value={attendance[s.id] || 'present'}
                    onChange={e => handleChange(s.id, e.target.value)}
                    className={`text-xs font-bold px-2 py-1.5 rounded-xl border
                                focus:outline-none cursor-pointer
                      ${attendance[s.id] === 'present' ? 'bg-green-100 text-green-700 border-green-200' :
                        attendance[s.id] === 'absent'  ? 'bg-red-100 text-red-600 border-red-200'       :
                                                          'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                  >
                    <option value="present">✅ Present</option>
                    <option value="absent">❌ Absent</option>
                    <option value="leave">🏖️ Leave</option>
                  </select>
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No students found 🔍</div>
            )}
          </div>
        )}

        {/* ── Desktop Table ── */}
        {!loading && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-gray-100">
                  {['#', 'Student Name', 'Class', 'Course', 'Section', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold
                                           text-green-900 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                         font-bold text-sm flex-shrink-0
                          ${s.section === 'male'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-pink-100 text-pink-700'}`}>
                          {s.name.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-gray-800">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{s.class}</td>
                    <td className="px-5 py-3">
                      <span className="bg-green-50 text-green-700 text-xs font-bold
                                       px-2.5 py-1 rounded-full capitalize">
                        {s.course}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${s.section === 'male'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'}`}>
                        {s.section === 'male' ? 'Male' : 'Female'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={attendance[s.id] || 'present'}
                        onChange={e => handleChange(s.id, e.target.value)}
                        className={`text-sm font-bold px-3 py-1.5 rounded-xl border
                                    focus:outline-none cursor-pointer transition-colors
                          ${attendance[s.id] === 'present' ? 'bg-green-100 text-green-700 border-green-200' :
                            attendance[s.id] === 'absent'  ? 'bg-red-100 text-red-600 border-red-200'       :
                                                              'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                      >
                        <option value="present">✅ Present</option>
                        <option value="absent">❌ Absent</option>
                        <option value="leave">🏖️ Leave</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 text-sm">
                      No students found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Save Button */}
        <div className="px-4 sm:px-5 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`bg-green-800 hover:bg-green-900 text-white text-sm
                       font-bold px-5 sm:px-6 py-2.5 rounded-xl transition-colors
                       flex items-center gap-2
                       ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Saving...
              </>
            ) : '💾 Save Attendance'}
          </button>
          {saved && (
            <span className="text-green-600 text-sm font-bold animate-pulse">
              ✅ Attendance saved successfully!
            </span>
          )}
        </div>

      </div>

    </div>
  )
}