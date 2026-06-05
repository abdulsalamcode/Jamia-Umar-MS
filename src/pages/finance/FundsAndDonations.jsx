import React, { useState, useEffect } from 'react'
import fundService from '../../services/fundService'

export default function FundsAndDonations() {
  const [funds, setFunds]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [summary, setSummary]           = useState({})
  const [typeFilter, setTypeFilter]     = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch]             = useState('')
  const [showForm, setShowForm]         = useState(false)
  const [saved, setSaved]               = useState(false)

  const [form, setForm] = useState({
    donor_name:    '',
    amount:        '',
    donor_type:    'private',
    purpose:       'General Fund',
    account:       'MCB Bank 0012-xxxx-3456',
    donation_date: new Date().toISOString().split('T')[0],
    status:        'received',
    remarks:       '',
  })

  // ── Fetch Funds ──
  const fetchFunds = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fundService.getAll(
        typeFilter   || null,
        statusFilter || null,
        null
      )
      setFunds(res.data.data)
      setSummary(res.data.summary)
    } catch (err) {
      setError('Failed to load funds.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFunds() }, [typeFilter, statusFilter])

  const filtered = funds.filter(f =>
    f.donor_name.toLowerCase().includes(search.toLowerCase()) ||
    f.purpose?.toLowerCase().includes(search.toLowerCase())
  )

  // ── Add Fund ──
  const handleSave = async () => {
    if (!form.donor_name || !form.amount || !form.donation_date) {
      alert('Donor name, amount and date are required')
      return
    }
    try {
      await fundService.create(form)
      setSaved(true)
      setShowForm(false)
      setForm({ donor_name: '', amount: '', donor_type: 'private', purpose: 'General Fund', account: 'MCB Bank 0012-xxxx-3456', donation_date: new Date().toISOString().split('T')[0], status: 'received', remarks: '' })
      fetchFunds()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save donation')
    }
  }

  // ── Delete Fund ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donation record?')) return
    try {
      await fundService.delete(id)
      fetchFunds()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">🤝 Funds & Donations</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Complete record of all donations, NGO funds and contributions
        </p>
      </div>

      {/* ── Success ── */}
      {saved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl
                        px-4 py-3 mb-4 text-green-700 text-sm font-bold flex items-center gap-2">
          ✅ Donation recorded! JazakAllah Khair 🤲
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl
                        px-4 py-3 mb-4 text-red-600 text-sm font-bold flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* ── Total Fund Banner ── */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-2xl
                      p-5 sm:p-6 mb-6 flex flex-col sm:flex-row justify-between
                      items-center gap-4">
        <div>
          <p className="text-white/70 text-xs sm:text-sm mb-1">Total Funds Received (All Time)</p>
          <p className="text-yellow-400 text-3xl sm:text-4xl font-bold">
            ₨ {Number(summary.totalAll || 0).toLocaleString()}
          </p>
          <p className="text-white/50 text-xs mt-2">Alhamdulillah 🤲</p>
        </div>
        <div className="text-center">
          <p className="text-white/70 text-xs sm:text-sm mb-1">This Month</p>
          <p className="text-white text-xl sm:text-2xl font-bold">
            ₨ {Number(summary.thisMonth || 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-white/70 text-xs sm:text-sm mb-1">Total Donors</p>
          <p className="text-white text-xl sm:text-2xl font-bold">
            {summary.totalDonors || 0}
          </p>
          <p className="text-white/50 text-xs mt-1">JazakAllah Khair 🕌</p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Funds',    value: `₨ ${Number(summary.totalAll     || 0).toLocaleString()}`, icon: '💰', color: 'bg-green-50 border-green-100'   },
          { label: 'NGO Funds',      value: `₨ ${Number(summary.totalNGO     || 0).toLocaleString()}`, icon: '🏢', color: 'bg-blue-50 border-blue-100'     },
          { label: 'Private Donors', value: `₨ ${Number(summary.totalPrivate || 0).toLocaleString()}`, icon: '👤', color: 'bg-yellow-50 border-yellow-100' },
          { label: 'Pending',        value: summary.totalPending || 0,                                  icon: '⏳', color: 'bg-red-50 border-red-100'       },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border shadow-sm p-3 sm:p-4 text-center ${s.color}`}>
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-sm sm:text-base font-bold text-green-900">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Bank Accounts ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
          <span className="text-lg">🏦</span>
          <h3 className="text-white font-bold text-sm sm:text-base">Institute Bank Accounts</h3>
        </div>
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Principal Account', name: 'Maulana Umar Farooq',          bank: 'MCB Bank',   account: '0012-xxxx-3456',        icon: '👤', color: 'bg-green-50 border-green-200'   },
            { label: 'Institute Account', name: 'Jamia Umar Islamic University', bank: 'HBL Bank',   account: '0078-xxxx-9012',        icon: '🏫', color: 'bg-blue-50 border-blue-200'     },
            { label: 'JazzCash',          name: 'Mobile Account',                bank: 'JazzCash',   account: '0300-XXXXXXX',          icon: '📱', color: 'bg-yellow-50 border-yellow-200' },
            { label: 'Zakat Status',      name: 'Eligible ✅',                   bank: 'Registered', account: 'Zakat & Sadaqah accepted',icon: '🤲', color: 'bg-orange-50 border-orange-200'},
          ].map((acc, i) => (
            <div key={i} className={`rounded-xl border p-4 ${acc.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{acc.icon}</span>
                <span className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  {acc.label}
                </span>
              </div>
              <p className="font-bold text-gray-800 text-sm">{acc.name}</p>
              <p className="text-xs text-gray-500 mt-1">{acc.bank}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{acc.account}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add Donation Button ── */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-800 hover:bg-green-900 text-white text-sm
                     font-bold px-5 py-2.5 rounded-xl transition-colors
                     flex items-center gap-2">
          ➕ Record New Donation
        </button>
      </div>

      {/* ── Add Donation Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">➕</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Record New Donation</h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Donor / NGO Name
                </label>
                <input
                  type="text"
                  placeholder="Donor full name or NGO..."
                  value={form.donor_name}
                  onChange={e => setForm({ ...form, donor_name: e.target.value })}
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
                  placeholder="e.g. 50000"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Donor Type
                </label>
                <select
                  value={form.donor_type}
                  onChange={e => setForm({ ...form, donor_type: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  <option value="private">Private</option>
                  <option value="ngo">NGO</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  value={form.donation_date}
                  onChange={e => setForm({ ...form, donation_date: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Account Credited
                </label>
                <select
                  value={form.account}
                  onChange={e => setForm({ ...form, account: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  <option>MCB Bank 0012-xxxx-3456</option>
                  <option>HBL Bank 0078-xxxx-9012</option>
                  <option>JazzCash 0300-XXXXXXX</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Purpose
                </label>
                <select
                  value={form.purpose}
                  onChange={e => setForm({ ...form, purpose: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  {[
                    'General Fund', 'Building Fund', 'Teacher Salaries',
                    'Student Welfare', 'Books & Stationery', 'Hifz Section',
                    'Infrastructure', 'Zakat/Sadaqah'
                  ].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-800 hover:bg-green-900 text-white text-sm
                           font-bold px-5 py-2.5 rounded-xl transition-colors">
                💾 Save Donation
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

      {/* ── Funds Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Card Header */}
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row
                        sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Donation Records</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="ngo">NGO</option>
              <option value="private">Private</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="received">Received</option>
              <option value="pending">Pending</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search donor..."
              className="bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm
                         border border-white/20 rounded-xl px-3 py-1.5
                         focus:outline-none flex-1 sm:w-36"
            />
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
              <p className="text-gray-400 text-sm">Loading funds...</p>
            </div>
          </div>
        )}

        {/* ── Mobile View ── */}
        {!loading && (
          <div className="block sm:hidden">
            {filtered.map(f => (
              <div key={f.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center
                                    justify-center text-green-700 font-bold text-sm flex-shrink-0">
                      {f.donor_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{f.donor_name}</p>
                      <p className="text-xs text-gray-400">{f.purpose}</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-green-700">
                    ₨ {Number(f.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full
                    ${f.donor_type === 'ngo'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'}`}>
                    {f.donor_type === 'ngo' ? '🏢 NGO' : '👤 Private'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{f.donation_date}</span>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="text-xs text-red-500 hover:text-red-700">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
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
                  {['#', 'Donor / NGO', 'Type', 'Amount', 'Purpose', 'Date', 'Account', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold
                                           text-green-900 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center
                                        justify-center text-green-700 font-bold text-sm flex-shrink-0">
                          {f.donor_name.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-gray-800">{f.donor_name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${f.donor_type === 'ngo'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'}`}>
                        {f.donor_type === 'ngo' ? '🏢 NGO' : '👤 Private'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-base font-bold text-green-700">
                        ₨ {Number(f.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{f.purpose}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{f.donation_date}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{f.account}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                        ${f.status === 'received'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'}`}>
                        {f.status === 'received' ? '✅ Received' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600
                                   text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-gray-400 text-sm">
                      No records found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-green-900">
                    <td colSpan="3" className="px-4 py-3 text-white font-bold text-sm">
                      Total ({filtered.length} donations)
                    </td>
                    <td className="px-4 py-3 text-yellow-400 font-bold text-base">
                      ₨ {filtered.reduce((s, f) => s + Number(f.amount), 0).toLocaleString()}
                    </td>
                    <td colSpan="5"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

    </div>
  )
}