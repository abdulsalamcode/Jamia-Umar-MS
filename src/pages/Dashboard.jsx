import React, { useState, useEffect } from 'react'
import StatCard from '../components/common/StatCard'
import teacherService from '../services/teacherService'
import studentService from '../services/studentService'
import expenseService from '../services/expenseService'
import fundService from '../services/fundService'
import announcementService from '../services/announcementService'

export default function Dashboard() {
  const [loading, setLoading]   = useState(true)
  const [stats, setStats]       = useState({
    totalStudents:  0,
    totalTeachers:  0,
    hafizStudents:  0,
    totalFunds:     0,
    schoolStudents: 0,
    hadithStudents: 0,
    maleTeachers:   0,
    femaleTeachers: 0,
    totalExpenses:  0,
    pendingAdmissions: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])

  // ── Fetch All Stats ──
  const fetchStats = async () => {
    try {
      setLoading(true)

      const [
        maleTeachersRes,
        femaleTeachersRes,
        maleStudentsRes,
        femaleStudentsRes,
        expensesRes,
        fundsRes,
      ] = await Promise.all([
        teacherService.getAllMale(),
        teacherService.getAllFemale(),
        studentService.getAllMale(),
        studentService.getAllFemale(),
        expenseService.getAll(),
        fundService.getAll(),
      ])

      const maleTeachers   = maleTeachersRes.data.summary
      const femaleTeachers = femaleTeachersRes.data.summary
      const maleStudents   = maleStudentsRes.data.summary
      const femaleStudents = femaleStudentsRes.data.summary
      const expenses       = expensesRes.data.summary
      const funds          = fundsRes.data.summary

      setStats({
        totalStudents:  (maleStudents.total   || 0) + (femaleStudents.total   || 0),
        totalTeachers:  (maleTeachers.total   || 0) + (femaleTeachers.total   || 0),
        hafizStudents:  (maleStudents.hifz    || 0) + (femaleStudents.hifz    || 0),
        totalFunds:     funds.totalAll        || 0,
        schoolStudents: (maleStudents.school  || 0) + (femaleStudents.school  || 0),
        hadithStudents: (maleStudents.hadith  || 0) + (femaleStudents.hadith  || 0),
        maleTeachers:   maleTeachers.total    || 0,
        femaleTeachers: femaleTeachers.total  || 0,
        totalExpenses:  expenses.totalAll     || 0,
        pendingAdmissions: 0,
      })

      // Recent Activity
      setRecentActivity([
        { icon: '👨‍🏫', text: `${maleTeachers.total || 0} Male Teachers registered`,            time: 'Total' },
        { icon: '👩‍🏫', text: `${femaleTeachers.total || 0} Female Teachers registered`,          time: 'Total' },
        { icon: '👦',   text: `${maleStudents.total || 0} Male Students enrolled`,               time: 'Total' },
        { icon: '👧',   text: `${femaleStudents.total || 0} Female Students enrolled`,             time: 'Total' },
        { icon: '🧾',   text: `Total Expenses: ₨ ${Number(expenses.totalAll || 0).toLocaleString()}`, time: 'All Time' },
        { icon: '🤝',   text: `Total Funds: ₨ ${Number(funds.totalAll || 0).toLocaleString()}`,      time: 'All Time' },
      ])

    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const STATS_CARDS = [
    {
      icon:       '🎓',
      value:      loading ? '...' : stats.totalStudents.toLocaleString(),
      label:      'Total Students',
      trend:      'up',
      trendValue: `${stats.hafizStudents} Hafiz`,
    },
    {
      icon:       '👨‍🏫',
      value:      loading ? '...' : stats.totalTeachers.toLocaleString(),
      label:      'Total Teachers',
      trend:      'up',
      trendValue: `${stats.maleTeachers}M + ${stats.femaleTeachers}F`,
    },
    {
      icon:       '📖',
      value:      loading ? '...' : stats.hafizStudents.toLocaleString(),
      label:      'Hafiz Students',
      trend:      'up',
      trendValue: 'Hifz ul Quran',
    },
    {
      icon:       '🤝',
      value:      loading ? '...' : `₨${(stats.totalFunds/100000).toFixed(1)}L`,
      label:      'Total Funds',
      trend:      'up',
      trendValue: 'All Time',
    },
  ]

  const QUICK_STATS = [
    ['School Section Students', stats.schoolStudents],
    ['Hifz ul Quran Students',  stats.hafizStudents ],
    ['Hadith Course Students',  stats.hadithStudents],
    ['Male Teachers',           stats.maleTeachers  ],
    ['Female Teachers',         stats.femaleTeachers],
    ['Total Teachers',          stats.totalTeachers ],
    ['Total Expenses',          `₨ ${Number(stats.totalExpenses).toLocaleString()}`],
    ['Total Funds Received',    `₨ ${Number(stats.totalFunds).toLocaleString()}`   ],
  ]

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">
          جامعہ عمر اسلامک یونیورسٹی
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Welcome back, Admin — here's what's happening today.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {STATS_CARDS.map((stat, i) => (
          <StatCard
            key={i}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            trend={stat.trend}
            trendValue={stat.trendValue}
          />
        ))}
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Quick Stats</h3>
          </div>
          <div className="p-3 sm:p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
            ) : (
              <table className="w-full">
                <tbody>
                  {QUICK_STATS.map(([label, value]) => (
                    <tr key={label} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 text-xs sm:text-sm text-gray-500">{label}</td>
                      <td className="py-2.5 text-xs sm:text-sm font-bold text-green-900 text-right">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-900 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
            <span className="text-lg">🕐</span>
            <h3 className="text-white font-bold text-sm sm:text-base">Institute Overview</h3>
          </div>
          <div className="p-3 sm:p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
            ) : (
              recentActivity.map((activity, i) => (
                <div key={i}
                  className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-lg mt-0.5 flex-shrink-0">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-700 leading-snug">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}