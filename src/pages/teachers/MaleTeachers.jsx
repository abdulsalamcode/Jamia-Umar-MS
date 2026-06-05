import React, { useState, useEffect } from 'react'
import teacherService from '../../services/teacherService'

export default function MaleTeachers() {
  const [teachers, setTeachers]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [showForm, setShowForm]   = useState(false)
  const [saved, setSaved]         = useState(false)
  const [summary, setSummary]     = useState({})

  // Form state
  const [form, setForm] = useState({
    name: '', subject: '', phone: '',
    cnic: '', salary: '', join_date: '', status: 'active'
  })

  // ── Fetch Teachers ──
  const fetchTeachers = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await teacherService.getAllMale()
      setTeachers(res.data.data)
      setSummary(res.data.summary)
    } catch (err) {
      setError('Failed to load teachers. Please check your server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  // ── Search Filter ──
  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  )

  // ── Add Teacher ──
  const handleSave = async () => {
    if (!form.name || !form.subject) {
      alert('Name and subject are required')
      return
    }
    try {
      await teacherService.create({ ...form, section: 'male' })
      setSaved(true)
      setShowForm(false)
      setForm({ name: '', subject: '', phone: '', cnic: '', salary: '', join_date: '', status: 'active' })
      fetchTeachers()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save teacher')
    }
  }

  // ── Delete Teacher ──
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return
    try {
      await teacherService.delete(id)
      fetchTeachers()
    } catch (err) {
      alert('Failed to delete teacher')
    }
  }

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">👨‍🏫 Male Teachers</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage male teaching staff records</p>
      </div>

      {/* ── Success Message ── */}
      {saved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl
                        px-4 py-3 mb-4 text-green-700 text-sm font-bold
                        flex items-center gap-2">
          ✅ Teacher saved successfully!
        </div>
      )}

      {/* ── Error Message ── */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl
                        px-4 py-3 mb-4 text-red-600 text-sm font-bold
                        flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* ── Gender Banner ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3
                      flex items-center gap-3 mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl">👨‍🏫</span>
        <div>
          <p className="font-bold text-blue-800 text-sm sm:text-base">Male Teacher Section</p>
          <p className="text-xs sm:text-sm text-blue-500">
            {loading ? 'Loading...' : `${summary.total || 0} Teachers Registered`}
          </p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[
          { label: 'Total Teachers',  value: loading ? '...' : summary.total   || 0, icon: '👨‍🏫' },
          { label: 'Active',          value: loading ? '...' : summary.active  || 0, icon: '✅' },
          { label: 'On Leave',        value: loading ? '...' : summary.onLeave || 0, icon: '🏖️' },
          { label: 'Monthly Payroll', value: loading ? '...' : `₨ ${Number(summary.payroll || 0).toLocaleString()}`, icon: '💰' },
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
            <span className="text-lg">👨‍🏫</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Male Teachers List</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search teacher..."
              className="bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm
                         border border-white/20 rounded-xl px-3 py-1.5
                         focus:outline-none flex-1 sm:w-44"
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
              <p className="text-gray-400 text-sm">Loading teachers...</p>
            </div>
          </div>
        )}

        {/* ── Mobile Card View ── */}
        {!loading && (
          <div className="block sm:hidden">
            {filtered.map((t, i) => (
              <div key={t.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center
                                    justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.subject}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full
                    ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t.status === 'active' ? '✅ Active' : '🏖️ Leave'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-400">Phone</div>
                    <div className="text-xs font-bold text-gray-700 mt-0.5">{t.phone || 'N/A'}</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-400">Code</div>
                    <div className="text-xs font-bold text-green-700 mt-0.5">{t.teacher_code}</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-400">Salary</div>
                    <div className="text-xs font-bold text-green-900 mt-0.5">
                      ₨{(t.salary/1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 bg-green-800 hover:bg-green-900 text-white
                                     text-xs font-bold py-1.5 rounded-lg transition-colors">
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600
                               text-xs font-bold py-1.5 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No teacher found 🔍</div>
            )}
          </div>
        )}

        {/* ── Desktop Table View ── */}
        {!loading && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-gray-100">
                  {['#', 'Name', 'Code', 'Subject', 'Phone', 'Salary', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold
                                           text-green-900 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center
                                        justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{t.name}</p>
                          <p className="text-xs text-gray-400">Joined {t.join_date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold
                                       px-2.5 py-1 rounded-full">
                        {t.teacher_code}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{t.subject}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{t.phone || 'N/A'}</td>
                    <td className="px-5 py-3 text-sm font-bold text-green-900">
                      ₨ {Number(t.salary).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${t.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'}`}>
                        {t.status === 'active' ? '✅ Active' : '🏖️ On Leave'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button className="bg-green-800 hover:bg-green-900 text-white
                                           text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
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
                    <td colSpan="8" className="text-center py-10 text-gray-400 text-sm">
                      No teacher found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Teacher Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">➕</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Add New Male Teacher</h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              {[
                ['Full Name',      'text',   'name',      'Teacher full name...'],
                ['Subject',        'text',   'subject',   'e.g. Hadith, Mathematics...'],
                ['Phone Number',   'text',   'phone',     '0300-XXXXXXX'],
                ['Monthly Salary', 'number', 'salary',    'e.g. 20000'],
                ['Join Date',      'date',   'join_date', ''],
                ['CNIC',           'text',   'cnic',      '12345-XXXXXXX-X'],
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
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5
                             text-sm focus:outline-none focus:border-green-500 bg-gray-50">
                  <option value="active">Active</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-800 hover:bg-green-900 text-white text-sm
                           font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors">
                ✅ Save Teacher
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