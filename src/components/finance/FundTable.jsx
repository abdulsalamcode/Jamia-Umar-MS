import React, { useState } from 'react'

const FUNDS = [
  { id: 1,  donor: 'Al-Khidmat Foundation',  amount: 150000, date: '2026-05-02', type: 'NGO',     account: 'MCB – 0012-xxxx-3456', purpose: 'General Fund',      status: 'received' },
  { id: 2,  donor: 'Haji Muhammad Saleem',   amount: 50000,  date: '2026-04-30', type: 'Private', account: 'MCB – 0012-xxxx-3456', purpose: 'Building Fund',     status: 'received' },
  { id: 3,  donor: 'Edhi Foundation',        amount: 75000,  date: '2026-04-20', type: 'NGO',     account: 'HBL – 0078-xxxx-9012', purpose: 'Student Welfare',   status: 'received' },
  { id: 4,  donor: 'Anonymous Donor',        amount: 25000,  date: '2026-04-15', type: 'Private', account: 'MCB – 0012-xxxx-3456', purpose: 'General Fund',      status: 'received' },
  { id: 5,  donor: 'Akhuwat Foundation',     amount: 100000, date: '2026-04-10', type: 'NGO',     account: 'HBL – 0078-xxxx-9012', purpose: 'Teacher Salaries',  status: 'received' },
  { id: 6,  donor: 'Dr. Khalid Mahmood',     amount: 30000,  date: '2026-04-05', type: 'Private', account: 'MCB – 0012-xxxx-3456', purpose: 'Books & Stationery',status: 'received' },
  { id: 7,  donor: 'Saylani Welfare Trust',  amount: 80000,  date: '2026-03-28', type: 'NGO',     account: 'HBL – 0078-xxxx-9012', purpose: 'General Fund',      status: 'received' },
  { id: 8,  donor: 'Haji Abdul Razzaq',      amount: 20000,  date: '2026-03-20', type: 'Private', account: 'MCB – 0012-xxxx-3456', purpose: 'Hifz Section',      status: 'pending'  },
  { id: 9,  donor: 'Citizens Foundation',    amount: 120000, date: '2026-03-15', type: 'NGO',     account: 'HBL – 0078-xxxx-9012', purpose: 'Infrastructure',    status: 'received' },
  { id: 10, donor: 'Ustad Bilal Hashmi',     amount: 15000,  date: '2026-03-10', type: 'Private', account: 'JazzCash – 0300-XXXXXX', purpose: 'Zakat/Sadaqah',   status: 'received' },
]

export default function FundsAndDonations() {
  const [typeFilter, setTypeFilter]     = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch]             = useState('')
  const [showForm, setShowForm]         = useState(false)
  const [saved, setSaved]               = useState(false)

  // Form state
  const [form, setForm] = useState({
    donor: '', amount: '', date: '',
    type: 'Private', account: 'MCB – 0012-xxxx-3456',
    purpose: 'General Fund',
  })

  const filtered = FUNDS
    .filter(f => typeFilter   === 'All' || f.type   === typeFilter)
    .filter(f => statusFilter === 'All' || f.status === statusFilter.toLowerCase())
    .filter(f =>
      f.donor.toLowerCase().includes(search.toLowerCase()) ||
      f.purpose.toLowerCase().includes(search.toLowerCase())
    )

  const totalAll      = FUNDS.reduce((s, f) => s + f.amount, 0)
  const totalNGO      = FUNDS.filter(f => f.type === 'NGO').reduce((s, f) => s + f.amount, 0)
  const totalPrivate  = FUNDS.filter(f => f.type === 'Private').reduce((s, f) => s + f.amount, 0)
  const totalFiltered = filtered.reduce((s, f) => s + f.amount, 0)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setShowForm(false)
    setForm({ donor: '', amount: '', date: '', type: 'Private', account: 'MCB – 0012-xxxx-3456', purpose: 'General Fund' })
  }

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-900">🤝 Funds & Donations</h2>
        <p className="text-sm text-gray-400 mt-1">
          Complete record of all donations, NGO funds and contributions
        </p>
      </div>

      {/* ── Total Fund Banner ── */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-2xl
                      p-6 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-white/70 text-sm mb-1">Total Funds Received (All Time)</p>
          <p className="text-yellow-400 text-4xl font-bold">
            ₨ {totalAll.toLocaleString()}
          </p>
          <p className="text-white/50 text-xs mt-2">Alhamdulillah 🤲 — May Allah accept</p>
        </div>
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">This Month</p>
          <p className="text-white text-2xl font-bold">
            ₨ {FUNDS.filter(f => f.date.startsWith('2026-05')).reduce((s,f)=>s+f.amount,0).toLocaleString()}
          </p>
          <p className="text-white/50 text-xs mt-1">May 2026</p>
        </div>
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">Total Donors</p>
          <p className="text-white text-2xl font-bold">{FUNDS.length}</p>
          <p className="text-white/50 text-xs mt-1">JazakAllah Khair 🕌</p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Funds',    value: `₨ ${totalAll.toLocaleString()}`,     icon: '💰', color: 'bg-green-50 border-green-100'  },
          { label: 'NGO Funds',      value: `₨ ${totalNGO.toLocaleString()}`,     icon: '🏢', color: 'bg-blue-50 border-blue-100'    },
          { label: 'Private Donors', value: `₨ ${totalPrivate.toLocaleString()}`, icon: '👤', color: 'bg-yellow-50 border-yellow-100'},
          { label: 'Pending',        value: FUNDS.filter(f=>f.status==='pending').length, icon: '⏳', color: 'bg-red-50 border-red-100'},
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border shadow-sm p-4 text-center ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-lg font-bold text-green-900">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Bank Accounts Box ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-green-900 px-5 py-4 flex items-center gap-2">
          <span className="text-lg">🏦</span>
          <h3 className="text-white font-bold">Institute Bank Accounts</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label:   'Principal Account',
              name:    'Maulana Umar Farooq',
              bank:    'MCB Bank',
              account: '0012-xxxx-3456',
              icon:    '👤',
              color:   'bg-green-50 border-green-200',
            },
            {
              label:   'Institute Account',
              name:    'Jamia Umar Islamic University',
              bank:    'HBL Bank',
              account: '0078-xxxx-9012',
              icon:    '🏫',
              color:   'bg-blue-50 border-blue-200',
            },
            {
              label:   'JazzCash',
              name:    'Mobile Account',
              bank:    'JazzCash',
              account: '0300-XXXXXXX',
              icon:    '📱',
              color:   'bg-yellow-50 border-yellow-200',
            },
            {
              label:   'Zakat Status',
              name:    'Eligible ✅',
              bank:    'Registered Organization',
              account: 'Zakat & Sadaqah accepted',
              icon:    '🤲',
              color:   'bg-orange-50 border-orange-200',
            },
          ].map((acc, i) => (
            <div key={i} className={`rounded-xl border p-4 ${acc.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{acc.icon}</span>
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
                     font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          ➕ Record New Donation
        </button>
      </div>

      {/* ── Add Donation Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-green-900 px-5 py-4 flex items-center gap-2">
            <span className="text-lg">➕</span>
            <h3 className="text-white font-bold">Record New Donation</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Donor / NGO Name
                </label>
                <input
                  type="text"
                  placeholder="Donor full name or NGO..."
                  value={form.donor}
                  onChange={e => setForm({ ...form, donor: e.target.value })}
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
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  <option>Private</option>
                  <option>NGO</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
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
                  <option>MCB – 0012-xxxx-3456</option>
                  <option>HBL – 0078-xxxx-9012</option>
                  <option>JazzCash – 0300-XXXXXX</option>
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
                  <option>General Fund</option>
                  <option>Building Fund</option>
                  <option>Teacher Salaries</option>
                  <option>Student Welfare</option>
                  <option>Books & Stationery</option>
                  <option>Hifz Section</option>
                  <option>Infrastructure</option>
                  <option>Zakat/Sadaqah</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 items-center">
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
            {saved && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl
                              px-4 py-3 text-green-700 text-sm font-bold">
                ✅ Donation recorded successfully! JazakAllah Khair 🤲
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Funds Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Card Header */}
        <div className="bg-green-900 px-5 py-4 flex flex-col sm:flex-row
                        sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h3 className="text-white font-bold">Donation Records</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-white/10 text-white text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option>All</option>
              <option>NGO</option>
              <option>Private</option>
            </select>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white/10 text-white text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option>All</option>
              <option>Received</option>
              <option>Pending</option>
            </select>
            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search donor..."
              className="bg-white/10 text-white placeholder-white/50 text-sm
                         border border-white/20 rounded-xl px-3 py-1.5
                         focus:outline-none w-36"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-50 border-b border-gray-100">
                {['#', 'Donor / NGO', 'Type', 'Amount', 'Purpose', 'Date', 'Account', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold
                                         text-green-900 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center
                                      justify-center text-green-700 font-bold text-sm flex-shrink-0">
                        {f.donor.charAt(0)}
                      </div>
                      <p className="text-sm font-bold text-gray-800">{f.donor}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                      ${f.type === 'NGO'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                      {f.type === 'NGO' ? '🏢 NGO' : '👤 Private'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-base font-bold text-green-700">
                      ₨ {f.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{f.purpose}</td>
                  <td className="px-5 py-3 text-sm text-gray-400">{f.date}</td>
                  <td className="px-5 py-3 text-xs text-gray-400 font-mono">{f.account}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                      ${f.status === 'received'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                      {f.status === 'received' ? '✅ Received' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400 text-sm">
                    No records found 🔍
                  </td>
                </tr>
              )}
            </tbody>
            {/* Total Row */}
            <tfoot>
              <tr className="bg-green-900">
                <td colSpan="3" className="px-5 py-3 text-white font-bold text-sm">
                  Total ({filtered.length} donations)
                </td>
                <td className="px-5 py-3 text-yellow-400 font-bold text-base">
                  ₨ {totalFiltered.toLocaleString()}
                </td>
                <td colSpan="4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  )
}