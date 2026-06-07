import React, { useState, useEffect } from 'react'
import studentService from '../../services/studentService'
import StudentViewModal from '../../components/students/StudentViewModal'

const COURSES = ['All', 'school', 'hifz', 'hadith']

export default function MaleStudents() {
  const [students, setStudents]   = useState([])
  const [viewStudent, setViewStudent] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [summary, setSummary]     = useState({})
  const [search, setSearch]       = useState('')
  const [courseFilter, setCourse] = useState('All')
  const [showForm, setShowForm]   = useState(false)
  const [saved, setSaved]         = useState(false)

  const [form, setForm] = useState({
    name: '', father_name: '', phone: '', b_form: '',
    class: 'Class 1', course: 'school',
    monthly_fee: '', join_date: '', status: 'active'
  })

  // ── Fetch Students ──
  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await studentService.getAllMale()
      setStudents(res.data.data)
      setSummary(res.data.summary)
    } catch (err) {
      setError('Failed to load students. Please check your server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const filtered = students
    .filter(s => courseFilter === 'All' || s.course === courseFilter)
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.father_name.toLowerCase().includes(search.toLowerCase())
    )

  // ── Add Student ──
  const handleSave = async () => {
    if (!form.name || !form.father_name) {
      alert('Name and father name are required')
      return
    }
    try {
      await studentService.create({ ...form, section: 'male' })
      setSaved(true)
      setShowForm(false)
      setForm({ name: '', father_name: '', phone: '', b_form: '', class: 'Class 1', course: 'school', monthly_fee: '', join_date: '', status: 'active' })
      fetchStudents()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save student')
    }
  }

  // ── Delete Student ──
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await studentService.delete(id)
      fetchStudents()
    } catch (err) {
      alert('Failed to delete student')
    }
  }

  return (
    <div>

      {viewStudent && (
        <StudentViewModal student={viewStudent} onClose={() => setViewStudent(null)} />
      )}

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">👦 Male Students</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Records for male student section</p>
      </div>

      {/* ── Success ── */}
      {saved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl
                        px-4 py-3 mb-4 text-green-700 text-sm font-bold flex items-center gap-2">
          ✅ Student saved successfully!
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl
                        px-4 py-3 mb-4 text-red-600 text-sm font-bold flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* ── Gender Banner ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3
                      flex items-center gap-3 mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl">👦</span>
        <div>
          <p className="font-bold text-blue-800 text-sm sm:text-base">Male Student Section</p>
          <p className="text-xs sm:text-sm text-blue-500">
            {loading ? 'Loading...' : `${summary.total || 0} Students Enrolled`}
          </p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[
          { label: 'Total Students', value: loading ? '...' : summary.total  || 0, icon: '👦' },
          { label: 'School Section', value: loading ? '...' : summary.school || 0, icon: '🏫' },
          { label: 'Hifz Students',  value: loading ? '...' : summary.hifz   || 0, icon: '📖' },
          { label: 'Hadith Course',  value: loading ? '...' : summary.hadith || 0, icon: '📚' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-lg sm:text-xl font-bold text-green-900">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 sm:mb-6">

        {/* Card Header */}
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row
                        sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">👦</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Male Students List</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={courseFilter}
              onChange={e => setCourse(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              {COURSES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Courses' : c}</option>)}
            </select>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search student..."
              className="bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm
                         border border-white/20 rounded-xl px-3 py-1.5
                         focus:outline-none flex-1 sm:w-40"
            />
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-yellow-500 hover:bg-yellow-400 text-white text-xs sm:text-sm
                         font-bold px-3 sm:px-4 py-1.5 rounded-xl transition-colors whitespace-nowrap"
            >
              + Add
            </button>
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
              <p className="text-gray-400 text-sm">Loading students...</p>
            </div>
          </div>
        )}

        {/* ── Mobile Card View ── */}
        {!loading && (
          <div className="block sm:hidden">
            {filtered.map(s => (
              <div key={s.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center
                                    justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.father_name}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full
                    ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {s.status === 'active' ? '✅' : '⏸️'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-400">Code</div>
                    <div className="text-xs font-bold text-blue-700 mt-0.5">{s.student_code}</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-400">Class</div>
                    <div className="text-xs font-bold text-gray-700 mt-0.5">{s.class}</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-400">Fee</div>
                    <div className="text-xs font-bold text-green-900 mt-0.5">
                      ₨{(s.monthly_fee/1000).toFixed(1)}K
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                  onClick={() => setViewStudent(s)}
                  className="flex-1 bg-green-800 hover:bg-green-900 text-white text-xs font-bold py-1.5 rounded-lg transition-colors">
                    👁 View
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600
                               text-xs font-bold py-1.5 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No student found 🔍</div>
            )}
          </div>
        )}

        {/* ── Desktop Table ── */}
        {!loading && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-gray-100">
                  {['#', 'Student Name', 'Code', 'Class', 'Father', 'Phone', 'Fee', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold
                                           text-green-900 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center
                                        justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{s.name}</p>
                          <p className="text-xs text-gray-400">Joined {s.join_date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold
                                       px-2.5 py-1 rounded-full">
                        {s.student_code}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{s.class}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{s.father_name}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{s.phone || 'N/A'}</td>
                    <td className="px-5 py-3 text-sm font-bold text-green-900">
                      ₨ {Number(s.monthly_fee).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${s.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'}`}>
                        {s.status === 'active' ? '✅ Active' : '⏸️ Leave'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                        onClick={() => setViewStudent(s)}
                        className="bg-green-800 hover:bg-green-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          👁 View
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600
                                     text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-gray-400 text-sm">
                      No student found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Student Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">➕</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Add New Male Student</h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              {[
                ['Student Name',   'text',   'name',        'Muhammad...'],
                ['Father Name',    'text',   'father_name', 'Father full name'],
                ['Phone Number',   'text',   'phone',       '0300-XXXXXXX'],
                ['B-Form / CNIC',  'text',   'b_form',      'Child B-Form number'],
                ['Join Date',      'date',   'join_date',   ''],
                ['Monthly Fee',    'number', 'monthly_fee', 'e.g. 2500'],
              ].map(([label, type, key, ph]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={ph}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5
                               text-sm focus:outline-none focus:border-green-500 bg-gray-50"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Class
                </label>
                <select
                  value={form.class}
                  onChange={e => setForm({ ...form, class: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5
                             text-sm focus:outline-none focus:border-green-500 bg-gray-50">
                  {['PG (Play Group)', 'Class 1', 'Class 2', 'Class 3', 'Class 4',
                    'Class 5', 'Class 6', 'Class 7', 'Class 8',
                    'Matric (9th)', 'Matric (10th)', 'Hifz Course', 'Hadith Course'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Course
                </label>
                <select
                  value={form.course}
                  onChange={e => setForm({ ...form, course: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5
                             text-sm focus:outline-none focus:border-green-500 bg-gray-50">
                  <option value="school">School</option>
                  <option value="hifz">Hifz</option>
                  <option value="hadith">Hadith</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-800 hover:bg-green-900 text-white text-sm
                           font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors">
                ✅ Save Student
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm
                           font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}