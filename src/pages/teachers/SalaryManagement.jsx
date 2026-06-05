import React, { useState, useEffect } from 'react'
import salaryService from '../../services/salaryService'

export default function SalaryManagement() {
  const [salaries, setSalaries]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [summary, setSummary]         = useState({})
  const [sectionFilter, setSectionFilter] = useState('')
  const [statusFilter, setStatusFilter]   = useState('')
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )
  const [paying, setPaying] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    teacher_id: '',
    amount:     '',
    month:      new Date().toISOString().slice(0, 7),
    status:     'pending',
  })

  // ── Fetch Salaries ──
  const fetchSalaries = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await salaryService.getAll(
        selectedMonth,
        sectionFilter || null,
        statusFilter  || null
      )
      setSalaries(res.data.data)
      setSummary(res.data.summary)
    } catch (err) {
      setError('Failed to load salaries. Please check your server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSalaries() }, [selectedMonth, sectionFilter, statusFilter])

  // ── Mark as Paid ──
  const handlePay = async (id) => {
    try {
      setPaying(id)
      await salaryService.markAsPaid(id)
      fetchSalaries()
    } catch (err) {
      alert('Failed to mark as paid')
    } finally {
      setPaying(null)
    }
  }

  // ── Add Salary Record ──
  const handleSave = async () => {
    if (!form.teacher_id || !form.amount) {
      alert('Teacher and amount are required')
      return
    }
    try {
      await salaryService.create(form)
      setSaved(true)
      setShowForm(false)
      fetchSalaries()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save salary record')
    }
  }

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">💰 Salary Management</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Monthly salary records and disbursement for all teachers
        </p>
      </div>

      {/* ── Success ── */}
      {saved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl
                        px-4 py-3 mb-4 text-green-700 text-sm font-bold flex items-center gap-2">
          ✅ Salary record saved successfully!
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
          { label: 'Total Payroll',    value: loading ? '...' : `₨ ${Number(summary.totalPayroll || 0).toLocaleString()}`, icon: '💰', color: 'bg-green-50 border-green-100'   },
          { label: 'Paid',             value: loading ? '...' : `₨ ${Number(summary.totalPaid    || 0).toLocaleString()}`, icon: '✅', color: 'bg-green-50 border-green-100'   },
          { label: 'Pending',          value: loading ? '...' : `₨ ${Number(summary.totalPending || 0).toLocaleString()}`, icon: '⏳', color: 'bg-yellow-50 border-yellow-100' },
          { label: 'Pending Teachers', value: loading ? '...' : summary.pendingCount || 0,                                  icon: '👨‍🏫', color: 'bg-red-50 border-red-100'      },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border shadow-sm p-3 sm:p-4 text-center ${s.color}`}>
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-base sm:text-lg font-bold text-green-900">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Salary Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">

        {/* Card Header */}
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row
                        sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📑</span>
            <h3 className="text-white font-bold text-sm sm:text-base">
              Salary Disbursement
            </h3>
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
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
              <p className="text-gray-400 text-sm">Loading salaries...</p>
            </div>
          </div>
        )}

        {/* ── Mobile View ── */}
        {!loading && (
          <div className="block sm:hidden">
            {salaries.map(s => (
              <div key={s.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                     font-bold text-sm flex-shrink-0
                      ${s.section === 'male'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'}`}>
                      {s.teacher_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{s.teacher_name}</p>
                      <p className="text-xs text-gray-400">{s.subject}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full
                    ${s.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'}`}>
                    {s.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-green-900">
                    ₨ {Number(s.amount).toLocaleString()}
                  </span>
                  {s.status === 'pending' && (
                    <button
                      onClick={() => handlePay(s.id)}
                      disabled={paying === s.id}
                      className="bg-green-800 hover:bg-green-900 text-white
                                 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                      {paying === s.id ? '...' : 'Pay Now'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {salaries.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No records found 🔍</div>
            )}
          </div>
        )}

        {/* ── Desktop Table ── */}
        {!loading && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-gray-100">
                  {['#', 'Teacher', 'Section', 'Subject', 'Amount', 'Month', 'Paid On', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold
                                           text-green-900 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salaries.map((s, i) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                         font-bold text-sm flex-shrink-0
                          ${s.section === 'male'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-pink-100 text-pink-700'}`}>
                          {s.teacher_name.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-gray-800">{s.teacher_name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${s.section === 'male'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'}`}>
                        {s.section === 'male' ? 'Male' : 'Female'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{s.subject}</td>
                    <td className="px-5 py-3 text-sm font-bold text-green-900">
                      ₨ {Number(s.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{s.month}</td>
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {s.paid_on || '-'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${s.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'}`}>
                        {s.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {s.status === 'pending' ? (
                        <button
                          onClick={() => handlePay(s.id)}
                          disabled={paying === s.id}
                          className="bg-green-800 hover:bg-green-900 text-white
                                     text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          {paying === s.id ? '...' : 'Pay Now'}
                        </button>
                      ) : (
                        <button className="bg-gray-100 text-gray-400 text-xs
                                           font-bold px-3 py-1.5 rounded-lg cursor-default">
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {salaries.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-gray-400 text-sm">
                      No records found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
              {/* Total Row */}
              {salaries.length > 0 && (
                <tfoot>
                  <tr className="bg-green-900">
                    <td colSpan="4" className="px-5 py-3 text-white font-bold text-sm">
                      Total ({salaries.length} teachers)
                    </td>
                    <td className="px-5 py-3 text-yellow-400 font-bold text-sm">
                      ₨ {salaries.reduce((s, t) => s + Number(t.amount), 0).toLocaleString()}
                    </td>
                    <td colSpan="4"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

      {/* ── Add Salary Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">➕</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Add Salary Record</h3>
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
                  Amount (₨)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 20000"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
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
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-800 hover:bg-green-900 text-white text-sm
                           font-bold px-5 py-2.5 rounded-xl transition-colors">
                💾 Save Record
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