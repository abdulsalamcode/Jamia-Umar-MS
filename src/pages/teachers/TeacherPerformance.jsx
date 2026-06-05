import React, { useState, useEffect } from 'react'
import performanceService from '../../services/performanceService'

const getAvg = (t) =>
  ((parseFloat(t.punctuality) + parseFloat(t.teaching) +
    parseFloat(t.results) + parseFloat(t.attitude)) / 4).toFixed(1)

const getRatingColor = (val) => {
  if (val >= 4.5) return 'bg-green-100 text-green-700'
  if (val >= 3.5) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-600'
}

const getGrade = (val) => {
  if (val >= 4.5) return { grade: 'A+', color: 'bg-green-100 text-green-700'  }
  if (val >= 4.0) return { grade: 'A',  color: 'bg-green-100 text-green-700'  }
  if (val >= 3.5) return { grade: 'B+', color: 'bg-yellow-100 text-yellow-700'}
  if (val >= 3.0) return { grade: 'B',  color: 'bg-yellow-100 text-yellow-700'}
  return               { grade: 'C',  color: 'bg-red-100 text-red-600'       }
}

const getStars = (val) => {
  const full  = Math.floor(val)
  const empty = 5 - full
  return '⭐'.repeat(full) + '☆'.repeat(empty)
}

export default function TeacherPerformance() {
  const [performance, setPerformance]     = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [summary, setSummary]             = useState({})
  const [sectionFilter, setSectionFilter] = useState('')
  const [showForm, setShowForm]           = useState(false)
  const [saved, setSaved]                 = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  const [form, setForm] = useState({
    teacher_id:  '',
    month:       new Date().toISOString().slice(0, 7),
    punctuality: '5',
    teaching:    '5',
    results:     '5',
    attitude:    '5',
    remarks:     '',
  })

  // ── Fetch Performance ──
  const fetchPerformance = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await performanceService.getAll(
        selectedMonth,
        sectionFilter || null
      )
      setPerformance(res.data.data)
      setSummary(res.data.summary)
    } catch (err) {
      setError('Failed to load performance data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPerformance() }, [selectedMonth, sectionFilter])

  // ── Save Evaluation ──
  const handleSave = async () => {
    if (!form.teacher_id) {
      alert('Teacher ID is required')
      return
    }
    try {
      await performanceService.create(form)
      setSaved(true)
      setShowForm(false)
      fetchPerformance()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save evaluation')
    }
  }

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this evaluation?')) return
    try {
      await performanceService.delete(id)
      fetchPerformance()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  const topPerformer = summary.topPerformer

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">📊 Teacher Performance</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Monthly performance evaluation and ratings
        </p>
      </div>

      {/* ── Success ── */}
      {saved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl
                        px-4 py-3 mb-4 text-green-700 text-sm font-bold flex items-center gap-2">
          ✅ Evaluation saved successfully!
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
          { label: 'Total Evaluated', value: loading ? '...' : summary.total      || 0,        icon: '👨‍🏫', color: 'bg-green-50 border-green-100'   },
          { label: 'Avg Rating',      value: loading ? '...' : `${summary.avgRating || 0}/5`,  icon: '⭐',   color: 'bg-yellow-50 border-yellow-100' },
          { label: 'Excellent (A+)',  value: loading ? '...' : summary.excellent   || 0,        icon: '🎖️',  color: 'bg-green-50 border-green-100'   },
          { label: 'Top Performer',   value: loading ? '...' : topPerformer?.teacher_name?.split(' ')[0] || '-', icon: '🏆', color: 'bg-green-50 border-green-100' },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border shadow-sm p-3 sm:p-4 text-center ${s.color}`}>
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-base sm:text-lg font-bold text-green-900">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Top 3 Performers ── */}
      {!loading && performance.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Top 3 Performers</h3>
          </div>
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {performance.slice(0, 3).map((t, i) => (
              <div key={t.id}
                className={`rounded-2xl p-4 text-center border
                  ${i === 0 ? 'bg-yellow-50 border-yellow-200' :
                    i === 1 ? 'bg-gray-50 border-gray-200'     :
                               'bg-orange-50 border-orange-200'}`}>
                <div className="text-3xl mb-2">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </div>
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center
                                 justify-center font-bold text-lg mb-2
                  ${t.section === 'male'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-pink-100 text-pink-700'}`}>
                  {t.teacher_name.charAt(0)}
                </div>
                <p className="font-bold text-gray-800 text-sm">{t.teacher_name}</p>
                <p className="text-xs text-gray-400 mb-1">{t.subject}</p>
                <div className="text-yellow-500 text-xs">{getStars(parseFloat(t.average))}</div>
                <div className="text-base font-bold text-green-900 mt-1">{t.average}/5</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Performance Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">

        {/* Card Header */}
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row
                        sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Performance Records</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            />
            <select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-yellow-500 hover:bg-yellow-400 text-white text-xs sm:text-sm
                         font-bold px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap"
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
              <p className="text-gray-400 text-sm">Loading performance data...</p>
            </div>
          </div>
        )}

        {/* ── Mobile View ── */}
        {!loading && (
          <div className="block sm:hidden">
            {performance.map((t, i) => {
              const { grade, color } = getGrade(parseFloat(t.average))
              return (
                <div key={t.id} className="p-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                       font-bold text-sm flex-shrink-0
                        ${t.section === 'male'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'}`}>
                        {t.teacher_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{t.teacher_name}</p>
                        <p className="text-xs text-gray-400">{t.subject}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>
                      {grade}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[
                      ['Punctuality', t.punctuality],
                      ['Teaching',    t.teaching],
                      ['Results',     t.results],
                      ['Attitude',    t.attitude],
                    ].map(([label, val]) => (
                      <div key={label} className="text-center bg-gray-50 rounded-lg p-1.5">
                        <div className="text-xs text-gray-400">{label}</div>
                        <div className={`text-xs font-bold mt-0.5 px-1 py-0.5 rounded
                          ${getRatingColor(parseFloat(val))}`}>
                          {val}/5
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-yellow-500 text-xs">
                      {getStars(parseFloat(t.average))}
                    </div>
                    <span className="text-sm font-bold text-green-900">{t.average}/5</span>
                  </div>
                </div>
              )
            })}
            {performance.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No data found 🔍</div>
            )}
          </div>
        )}

        {/* ── Desktop Table ── */}
        {!loading && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-gray-100">
                  {['#', 'Teacher', 'Section', 'Punctuality', 'Teaching', 'Results', 'Attitude', 'Average', 'Grade', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold
                                           text-green-900 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {performance.map((t, i) => {
                  const { grade, color } = getGrade(parseFloat(t.average))
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
                            {t.teacher_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{t.teacher_name}</p>
                            <p className="text-xs text-gray-400">{t.subject}</p>
                          </div>
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
                      {[t.punctuality, t.teaching, t.results, t.attitude].map((val, j) => (
                        <td key={j} className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full
                            ${getRatingColor(parseFloat(val))}`}>
                            {val}/5
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold text-green-900">{t.average}/5</div>
                        <div className="text-xs text-yellow-500">{getStars(parseFloat(t.average))}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
                          {grade}
                        </span>
                      </td>
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
                {performance.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center py-10 text-gray-400 text-sm">
                      No performance data found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Evaluation Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">✏️</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Add New Evaluation</h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Teacher ID
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  value={form.teacher_id}
                  onChange={e => setForm({ ...form, teacher_id: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Month
                </label>
                <input
                  type="month"
                  value={form.month}
                  onChange={e => setForm({ ...form, month: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                />
              </div>
              {[
                ['Punctuality (1-5)', 'punctuality'],
                ['Teaching (1-5)',    'teaching'   ],
                ['Results (1-5)',     'results'    ],
                ['Attitude (1-5)',    'attitude'   ],
              ].map(([label, key]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                    {label}
                  </label>
                  <select
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                               focus:outline-none focus:border-green-500 bg-gray-50"
                  >
                    {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Remarks
                </label>
                <input
                  type="text"
                  placeholder="Optional remarks..."
                  value={form.remarks}
                  onChange={e => setForm({ ...form, remarks: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-800 hover:bg-green-900 text-white text-sm
                           font-bold px-5 py-2.5 rounded-xl transition-colors">
                💾 Save Evaluation
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm
                           font-bold px-5 py-2.5 rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}