import React, { useState, useEffect } from 'react'
import admissionService from '../../services/admissionService'

export default function Admissions() {
  const [admissions, setAdmissions]       = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [summary, setSummary]             = useState({})
  const [sectionFilter, setSectionFilter] = useState('')
  const [statusFilter, setStatusFilter]   = useState('')
  const [search, setSearch]               = useState('')
  const [showForm, setShowForm]           = useState(false)
  const [saved, setSaved]                 = useState(false)
  const [updating, setUpdating]           = useState(null)

  const [form, setForm] = useState({
    name: '', father_name: '', phone: '', b_form: '',
    section: 'male', class: 'Class 1', course: 'school',
    monthly_fee: '', admission_date: new Date().toISOString().split('T')[0],
  })

  // ── Fetch Admissions ──
  const fetchAdmissions = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await admissionService.getAll(
        sectionFilter || null,
        statusFilter  || null
      )
      setAdmissions(res.data.data)
      setSummary(res.data.summary)
    } catch (err) {
      setError('Failed to load admissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAdmissions() }, [sectionFilter, statusFilter])

  const filtered = admissions.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.father_name.toLowerCase().includes(search.toLowerCase())
  )

  // ── Submit Admission ──
  const handleSave = async () => {
    if (!form.name || !form.father_name) {
      alert('Name and father name are required')
      return
    }
    try {
      await admissionService.create(form)
      setSaved(true)
      setShowForm(false)
      setForm({ name: '', father_name: '', phone: '', b_form: '', section: 'male', class: 'Class 1', course: 'school', monthly_fee: '', admission_date: new Date().toISOString().split('T')[0] })
      fetchAdmissions()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to submit admission')
    }
  }

  // ── Update Status ──
  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdating(id)
      await admissionService.updateStatus(id, status, '', 1)
      fetchAdmissions()
    } catch (err) {
      alert('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admission?')) return
    try {
      await admissionService.delete(id)
      fetchAdmissions()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">🎓 Admissions</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          New student admission requests and records
        </p>
      </div>

      {/* ── Success ── */}
      {saved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl
                        px-4 py-3 mb-4 text-green-700 text-sm font-bold flex items-center gap-2">
          ✅ Admission submitted successfully!
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
          { label: 'Total Applications', value: loading ? '...' : summary.total    || 0, icon: '📋', color: 'bg-green-50 border-green-100'   },
          { label: 'Approved',           value: loading ? '...' : summary.approved || 0, icon: '✅', color: 'bg-green-50 border-green-100'   },
          { label: 'Pending',            value: loading ? '...' : summary.pending  || 0, icon: '⏳', color: 'bg-yellow-50 border-yellow-100' },
          { label: 'Rejected',           value: loading ? '...' : summary.rejected || 0, icon: '❌', color: 'bg-red-50 border-red-100'       },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border shadow-sm p-3 sm:p-4 text-center ${s.color}`}>
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-lg sm:text-xl font-bold text-green-900">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Admissions Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">

        {/* Card Header */}
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row
                        sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Admission Records</h3>
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
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm
                         border border-white/20 rounded-xl px-3 py-1.5
                         focus:outline-none flex-1 sm:w-36"
            />
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-yellow-500 hover:bg-yellow-400 text-white text-xs sm:text-sm
                         font-bold px-3 sm:px-4 py-1.5 rounded-xl transition-colors whitespace-nowrap"
            >
              + New
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
              <p className="text-gray-400 text-sm">Loading admissions...</p>
            </div>
          </div>
        )}

        {/* ── Mobile View ── */}
        {!loading && (
          <div className="block sm:hidden">
            {filtered.map(a => (
              <div key={a.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                     font-bold text-sm flex-shrink-0
                      ${a.section === 'male'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'}`}>
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.father_name} • {a.class}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full
                    ${a.status === 'approved' ? 'bg-green-100 text-green-700'   :
                      a.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                                                 'bg-red-100 text-red-600'}`}>
                    {a.status === 'approved' ? '✅' : a.status === 'pending' ? '⏳' : '❌'}
                  </span>
                </div>
                {a.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleStatusUpdate(a.id, 'approved')}
                      disabled={updating === a.id}
                      className="flex-1 bg-green-800 hover:bg-green-900 text-white
                                 text-xs font-bold py-1.5 rounded-lg transition-colors">
                      {updating === a.id ? '...' : '✅ Approve'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(a.id, 'rejected')}
                      disabled={updating === a.id}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600
                                 text-xs font-bold py-1.5 rounded-lg transition-colors">
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No admissions found 🔍</div>
            )}
          </div>
        )}

        {/* ── Desktop Table ── */}
        {!loading && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-gray-100">
                  {['#', 'Student Name', 'Father', 'Section', 'Class', 'Phone', 'Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold
                                           text-green-900 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                         font-bold text-sm flex-shrink-0
                          ${a.section === 'male'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-pink-100 text-pink-700'}`}>
                          {a.name.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-gray-800">{a.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{a.father_name}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${a.section === 'male'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'}`}>
                        {a.section === 'male' ? 'Male' : 'Female'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-green-50 text-green-700 text-xs font-bold
                                       px-2.5 py-1 rounded-full">
                        {a.class}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{a.phone || 'N/A'}</td>
                    <td className="px-5 py-3 text-xs text-gray-400">{a.admission_date}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${a.status === 'approved' ? 'bg-green-100 text-green-700'   :
                          a.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                                                     'bg-red-100 text-red-600'}`}>
                        {a.status === 'approved' ? '✅ Approved' :
                         a.status === 'pending'  ? '⏳ Pending'  : '❌ Rejected'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        {a.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(a.id, 'approved')}
                              disabled={updating === a.id}
                              className="bg-green-800 hover:bg-green-900 text-white
                                         text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                              {updating === a.id ? '...' : '✅'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(a.id, 'rejected')}
                              disabled={updating === a.id}
                              className="bg-red-50 hover:bg-red-100 text-red-600
                                         text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                              ❌
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="bg-gray-50 hover:bg-gray-100 text-gray-500
                                     text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-gray-400 text-sm">
                      No admissions found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── New Admission Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className="text-white font-bold text-sm sm:text-base">New Admission Form</h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              {[
                ['Student Name',   'text',   'name',           'Muhammad / Fatima...'],
                ['Father Name',    'text',   'father_name',    'Father full name'],
                ['Phone Number',   'text',   'phone',          '0300-XXXXXXX'],
                ['B-Form / CNIC',  'text',   'b_form',         'Child B-Form number'],
                ['Admission Date', 'date',   'admission_date', ''],
                ['Monthly Fee',    'number', 'monthly_fee',    'e.g. 2500'],
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
                  Section
                </label>
                <select
                  value={form.section}
                  onChange={e => setForm({ ...form, section: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5
                             text-sm focus:outline-none focus:border-green-500 bg-gray-50">
                  <option value="male">Male (Boys)</option>
                  <option value="female">Female (Girls)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Class / Course
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
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={handleSave}
                className="bg-green-800 hover:bg-green-900 text-white text-sm
                           font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors">
                ✅ Submit Admission
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