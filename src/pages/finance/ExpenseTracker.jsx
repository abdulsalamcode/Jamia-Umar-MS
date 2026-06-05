import React, { useState, useEffect } from 'react'
import expenseService from '../../services/expenseService'

const CATEGORIES = [
  'Teacher Salaries',
  'Building / Construction',
  'Electricity Bill',
  'Water Bill',
  'Books & Stationery',
  'Canteen / Food',
  'Equipment',
  'Cleaning Supplies',
  'Other',
]

const getCategoryIcon = (type) => {
  switch (type) {
    case 'salary':    return '💰'
    case 'building':  return '🏗️'
    case 'utility':   return '💡'
    case 'academic':  return '📚'
    case 'food':      return '🍽️'
    case 'equipment': return '🖥️'
    default:          return '🧾'
  }
}

export default function ExpenseTracker() {
  const [expenses, setExpenses]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [summary, setSummary]             = useState({})
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch]               = useState('')
  const [showForm, setShowForm]           = useState(false)
  const [saved, setSaved]                 = useState(false)

  const [form, setForm] = useState({
    category:     'Teacher Salaries',
    amount:       '',
    description:  '',
    type:         'salary',
    expense_date: new Date().toISOString().slice(0, 16),
    added_by:     1,
  })

  // ── Fetch Expenses ──
  const fetchExpenses = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await expenseService.getAll(
        categoryFilter || null,
        null,
        null
      )
      setExpenses(res.data.data)
      setSummary(res.data.summary)
    } catch (err) {
      setError('Failed to load expenses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchExpenses() }, [categoryFilter])

  const filtered = expenses.filter(e =>
    e.description?.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  )

  // ── Add Expense ──
  const handleSave = async () => {
    if (!form.category || !form.amount || !form.expense_date) {
      alert('Category, amount and date are required')
      return
    }
    try {
      await expenseService.create(form)
      setSaved(true)
      setShowForm(false)
      setForm({ category: 'Teacher Salaries', amount: '', description: '', type: 'salary', expense_date: new Date().toISOString().slice(0, 16), added_by: 1 })
      fetchExpenses()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save expense')
    }
  }

  // ── Delete Expense ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await expenseService.delete(id)
      fetchExpenses()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">🧾 Expense Tracker</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Complete record of all institute expenditures with exact date and time
        </p>
      </div>

      {/* ── Success ── */}
      {saved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl
                        px-4 py-3 mb-4 text-green-700 text-sm font-bold flex items-center gap-2">
          ✅ Expense saved successfully!
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
          { label: 'Total Expenses',    value: loading ? '...' : `₨ ${Number(summary.totalAll      || 0).toLocaleString()}`, icon: '🧾', color: 'bg-red-50 border-red-100'       },
          { label: 'Teacher Salaries',  value: loading ? '...' : `₨ ${Number(summary.totalSalary  || 0).toLocaleString()}`, icon: '💰', color: 'bg-yellow-50 border-yellow-100' },
          { label: 'Building & Repair', value: loading ? '...' : `₨ ${Number(summary.totalBuilding|| 0).toLocaleString()}`, icon: '🏗️', color: 'bg-green-50 border-green-100'   },
          { label: 'Utilities',         value: loading ? '...' : `₨ ${Number(summary.totalUtility || 0).toLocaleString()}`, icon: '💡', color: 'bg-blue-50 border-blue-100'     },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border shadow-sm p-3 sm:p-4 text-center ${s.color}`}>
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-sm sm:text-base font-bold text-green-900">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Category Breakdown ── */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Category Breakdown</h3>
          </div>
          <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Salaries',  amount: summary.totalSalary   || 0, icon: '💰', bg: 'bg-yellow-50' },
              { label: 'Building',  amount: summary.totalBuilding || 0, icon: '🏗️', bg: 'bg-orange-50' },
              { label: 'Utilities', amount: summary.totalUtility  || 0, icon: '💡', bg: 'bg-blue-50'   },
              { label: 'Academic',  amount: summary.totalAcademic || 0, icon: '📚', bg: 'bg-purple-50' },
              { label: 'Food',      amount: summary.totalFood     || 0, icon: '🍽️', bg: 'bg-green-50'  },
              { label: 'Equipment', amount: summary.totalEquip    || 0, icon: '🖥️', bg: 'bg-gray-50'   },
            ].map((c, i) => (
              <div key={i} className={`${c.bg} rounded-xl p-3 text-center border border-gray-100`}>
                <div className="text-xl mb-1">{c.icon}</div>
                <div className="text-xs sm:text-sm font-bold text-green-900">
                  ₨ {Number(c.amount).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add Button ── */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-800 hover:bg-green-900 text-white text-sm
                     font-bold px-5 py-2.5 rounded-xl transition-colors
                     flex items-center gap-2">
          ➕ Add New Expense
        </button>
      </div>

      {/* ── Add Expense Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">➕</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Add New Expense</h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  <option value="salary">Salary</option>
                  <option value="building">Building</option>
                  <option value="utility">Utility</option>
                  <option value="academic">Academic</option>
                  <option value="food">Food</option>
                  <option value="equipment">Equipment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Amount (₨)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={form.expense_date}
                  onChange={e => setForm({ ...form, expense_date: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-500 bg-gray-50"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
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
                💾 Save Expense
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

      {/* ── Expense History ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Card Header */}
        <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row
                        sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📜</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Expense History</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-white/10 text-white text-xs sm:text-sm border border-white/20
                         rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
              <p className="text-gray-400 text-sm">Loading expenses...</p>
            </div>
          </div>
        )}

        {/* ── Mobile View ── */}
        {!loading && (
          <div className="block sm:hidden">
            {filtered.map(e => (
              <div key={e.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(e.type)}</span>
                    <p className="text-sm font-bold text-green-900">{e.category}</p>
                  </div>
                  <span className="text-base font-bold text-red-600">
                    ₨ {Number(e.amount).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{e.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">{e.expense_date}</p>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-xs text-red-500 hover:text-red-700">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No expenses found 🔍</div>
            )}
          </div>
        )}

        {/* ── Desktop Table ── */}
        {!loading && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-gray-100">
                  {['#', 'Category', 'Description', 'Amount', 'Date & Time', 'Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold
                                           text-green-900 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(e.type)}</span>
                        <span className="text-sm font-bold text-green-900">{e.category}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 max-w-xs">{e.description}</td>
                    <td className="px-5 py-3">
                      <span className="text-base font-bold text-red-600">
                        ₨ {Number(e.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">{e.expense_date}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600
                                   text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 text-sm">
                      No expenses found 🔍
                    </td>
                  </tr>
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-green-900">
                    <td colSpan="3" className="px-5 py-3 text-white font-bold text-sm">
                      Total ({filtered.length} records)
                    </td>
                    <td className="px-5 py-3 text-yellow-400 font-bold text-base">
                      ₨ {filtered.reduce((s, e) => s + Number(e.amount), 0).toLocaleString()}
                    </td>
                    <td colSpan="2"></td>
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