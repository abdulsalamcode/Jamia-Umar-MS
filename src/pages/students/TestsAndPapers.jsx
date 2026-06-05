import React, { useState, useEffect } from 'react'
import testService from '../../services/testService'

const getGrade = (marks) => {
  if (marks >= 90) return { grade: 'A+', color: 'bg-green-100 text-green-700'  }
  if (marks >= 80) return { grade: 'A',  color: 'bg-green-100 text-green-700'  }
  if (marks >= 70) return { grade: 'B+', color: 'bg-yellow-100 text-yellow-700'}
  if (marks >= 60) return { grade: 'B',  color: 'bg-yellow-100 text-yellow-700'}
  return               { grade: 'C',  color: 'bg-red-100 text-red-600'       }
}

const getMarksColor = (marks) => {
  if (marks >= 90) return 'text-green-700'
  if (marks >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

export default function TestsAndPapers() {
  const [tests, setTests]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [summary, setSummary]           = useState({})
  const [sectionFilter, setSectionFilter] = useState('')
  const [search, setSearch]             = useState('')
  const [showForm, setShowForm]         = useState(false)
  const [saved, setSaved]               = useState(false)

  const [form, setForm] = useState({
    student_id:  '',
    subject:     '',
    marks:       '',
    total_marks: '100',
    test_date:   new Date().toISOString().split('T')[0],
    remarks:     '',
  })

  // ── Fetch Tests ──
  const fetchTests = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await testService.getAll(
        sectionFilter || null,
        null
      )
      setTests(res.data.data)
      setSummary(res.data.summary)
    } catch (err) {
      setError('Failed to load test results.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTests() }, [sectionFilter])

  const filtered = tests.filter(t =>
    t.student_name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  )

  // ── Add Test ──
  const handleSave = async () => {
    if (!form.student_id || !form.subject || !form.marks) {
      alert('Student ID, subject and marks are required')
      return
    }
    try {
      await testService.create(form)
      setSaved(true)
      setShowForm(false)
      setForm({ student_id: '', subject: '', marks: '', total_marks: '100', test_date: new Date().toISOString().split('T')[0], remarks: '' })
      fetchTests()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save test result')
    }
  }

  // ── Delete Test ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test result?')) return
    try {
      await testService.delete(id)
      fetchTests()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">📝 Tests & Papers</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Student test results and academic performance
        </p>
      </div>

      {/* ── Success ── */}
      {saved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl
                        px-4 py-3 mb-4 text-green-700 text-sm font-bold flex items-center gap-2">
          ✅ Test result saved successfully!
        </div>
      )}

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
          { label: 'Total Tests',  value: loading ? '...' : summary.total      || 0,       icon: '📝', color: 'bg-green-50 border-green-100'   },
          { label: 'Avg Marks',    value: loading ? '...' : `${summary.avgMarks || 0}%`,   icon: '📊', color: 'bg-yellow-50 border-yellow-100' },
          { label: 'Full Marks',   value: loading ? '...' : summary.fullMarks  || 0,       icon: '⭐', color: 'bg-green-50 border-green-100'   },
          { label: 'Top Student',  value: loading ? '...' : summary.topStudent?.student_name?.split(' ')[0] || '-', icon: '🏆', color: 'bg-green-50 border-green-100' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border shadow-sm p-3 sm:p-4 text-center ${s.color}`}>
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-base sm:text-lg font-bold text-green-900">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Top 3 Students ── */}
      {!loading && tests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Top 3 Students</h3>
          </div>
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...tests]
              .sort((a, b) => b.marks - a.marks)
              .slice(0, 3)
              .map((t, i) => (
                <div key={t.id}
                  className={`rounded-2xl p-4 text-center border
                    ${i === 0 ? 'bg-yellow-50 border-yellow-200' :
                      i === 1 ? 'bg-gray-50 border-gray-200'     :
                                 'bg-orange-50 border-orange-200'}`}>
                  <div className="text-3xl mb-2">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className={`w-10 h-10 rounded-full mx-auto flex items-center
                                   justify-center font-bold text-base mb-2
                    ${t.section === 'male'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-pink-100 text-pink-700'}`}>
                    {t.student_name.charAt(0)}
                  </div>
                  <p className="font-bold text-gray-800 text-sm">{t.student_name}</p>
                  <p className="text-xs text-gray-400 mb-1">{t.subject}</p>
                  <p className={`text-xl font-bold ${getMarksColor(t.marks)}`}>
                    {t.marks}/{t.total_marks}
                  </p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block
                    ${getGrade(t.marks).color}`}>
                    {getGrade(t.marks).grade}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Tests Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">

        {/* Card Header */}
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row
                        sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📄</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Test Results</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="">All Sections</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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
              <p className="text-gray-400 text-sm">Loading test results...</p>
            </div>
          </div>
        )}

        {/* ── Mobile View ── */}
        {!loading && (
          <div className="block sm:hidden">
            {filtered.map(t => {
              const { grade, color } = getGrade(t.marks)
              return (
                <div key={t.id} className="p-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                       font-bold text-sm flex-shrink-0
                        ${t.section === 'male'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'}`}>
                        {t.student_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{t.student_name}</p>
                        <p className="text-xs text-gray-400">{t.subject}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>
                      {grade}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-lg font-bold ${getMarksColor(t.marks)}`}>
                      {t.marks}/{t.total_marks}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-400">{t.test_date}</span>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-xs text-red-500 hover:text-red-700">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No results found 🔍</div>
            )}
          </div>
        )}

        {/* ── Desktop Table ── */}
        {!loading && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-gray-100">
                  {['#', 'Student', 'Section', 'Class', 'Subject', 'Marks', 'Total', 'Grade', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold
                                           text-green-900 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const { grade, color } = getGrade(t.marks)
                  return (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                           font-bold text-sm flex-shrink-0
                            ${t.section === 'male'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-pink-100 text-pink-700'}`}>
                            {t.student_name.charAt(0)}
                          </div>
                          <p className="text-sm font-bold text-gray-800">{t.student_name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                          ${t.section === 'male'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-pink-100 text-pink-700'}`}>
                          {t.section === 'male' ? 'Male' : 'Female'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{t.class}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-600">{t.subject}</td>
                      <td className="px-4 py-3">
                        <span className={`text-base font-bold ${getMarksColor(t.marks)}`}>
                          {t.marks}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{t.total_marks}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
                          {grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{t.test_date}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600
                                     text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center py-10 text-gray-400 text-sm">
                      No results found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Test Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">➕</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Add Test Result</h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              {[
                ['Student ID',    'number', 'student_id',  'e.g. 1'],
                ['Subject',       'text',   'subject',     'e.g. Mathematics'],
                ['Marks Obtained','number', 'marks',       'e.g. 85'],
                ['Total Marks',   'number', 'total_marks', 'e.g. 100'],
                ['Test Date',     'date',   'test_date',   ''],
                ['Remarks',       'text',   'remarks',     'Optional...'],
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
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-800 hover:bg-green-900 text-white text-sm
                           font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors">
                💾 Save Result
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