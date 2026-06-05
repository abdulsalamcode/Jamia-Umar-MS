import React, { useState, useEffect } from 'react'
import announcementService from '../services/announcementService'

const TYPE_COLORS = {
  exam:      { bg: 'bg-blue-100',   text: 'text-blue-700',   label: '📝 Exam'      },
  holiday:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🌙 Holiday'   },
  hafiz:     { bg: 'bg-green-100',  text: 'text-green-700',  label: '📖 Hafiz'     },
  emergency: { bg: 'bg-red-100',    text: 'text-red-700',    label: '🚨 Emergency' },
  general:   { bg: 'bg-gray-100',   text: 'text-gray-700',   label: '📌 General'   },
  hadith:    { bg: 'bg-purple-100', text: 'text-purple-700', label: '📚 Hadith'    },
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [filter, setFilter]               = useState('all')
  const [showForm, setShowForm]           = useState(false)
  const [saved, setSaved]                 = useState(false)

  const [form, setForm] = useState({
    title:       '',
    description: '',
    type:        'general',
    is_urgent:   0,
  })

  // ── Fetch Announcements ──
  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      setError('')
      const urgent = filter === 'urgent' ? 1 : filter === 'normal' ? 0 : undefined
      const res = await announcementService.getAll(null, urgent)
      setAnnouncements(res.data.data)
    } catch (err) {
      setError('Failed to load announcements.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAnnouncements() }, [filter])

  // ── Add Announcement ──
  const handleSave = async () => {
    if (!form.title || !form.description) {
      alert('Title and description are required')
      return
    }
    try {
      await announcementService.create(form)
      setSaved(true)
      setShowForm(false)
      setForm({ title: '', description: '', type: 'general', is_urgent: 0 })
      fetchAnnouncements()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to publish announcement')
    }
  }

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    try {
      await announcementService.delete(id)
      fetchAnnouncements()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  const urgentCount = announcements.filter(a => a.is_urgent == 1).length
  const normalCount = announcements.filter(a => a.is_urgent == 0).length

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">📢 Announcements & Notices</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Exam schedules, holidays, and emergency notices
        </p>
      </div>

      {/* ── Success ── */}
      {saved && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl
                        px-4 py-3 mb-4 text-green-700 text-sm font-bold flex items-center gap-2">
          ✅ Announcement published successfully!
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl
                        px-4 py-3 mb-4 text-red-600 text-sm font-bold flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* ── Filter Tabs ── */}
      <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
        {[
          { key: 'all',    label: '📋 All',     count: announcements.length },
          { key: 'urgent', label: '🔴 Urgent',  count: urgentCount          },
          { key: 'normal', label: '📌 General', count: normalCount          },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl
                        transition-all duration-200 flex items-center gap-1.5
              ${filter === tab.key
                ? 'bg-white text-green-900 shadow-md'
                : 'text-gray-500 hover:text-green-800'
              }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
              ${filter === tab.key
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-500'
              }`}>
              {tab.count}
            </span>
          </button>
        ))}
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
            <p className="text-gray-400 text-sm">Loading announcements...</p>
          </div>
        </div>
      )}

      {/* ── Announcements Grid ── */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {announcements.map(a => {
            const typeStyle = TYPE_COLORS[a.type] || TYPE_COLORS.general
            return (
              <div
                key={a.id}
                className={`rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200
                  hover:shadow-lg hover:-translate-y-0.5 relative
                  ${a.is_urgent == 1
                    ? 'bg-red-50 border-red-200 hover:border-red-300'
                    : 'bg-white border-gray-100 hover:border-green-200'
                  }`}
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(a.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-500
                             transition-colors text-sm">
                  🗑️
                </button>

                {/* Top Row */}
                <div className="flex items-center gap-2 mb-3 pr-6">
                  <span className={`inline-flex items-center text-xs font-bold
                                    px-2.5 py-1 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
                    {typeStyle.label}
                  </span>
                  {a.is_urgent == 1 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold
                                     px-2.5 py-1 rounded-full bg-red-500 text-white">
                      🔴 Urgent
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-green-900 text-sm sm:text-base mb-1.5 leading-snug">
                  {a.title}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-xs text-gray-400 font-medium">
                    📅 {new Date(a.created_at).toLocaleDateString('en-PK', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {a.description}
                </p>
              </div>
            )
          })}

          {announcements.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📢</div>
              <p className="text-sm">No announcements found</p>
            </div>
          )}
        </div>
      )}

      {/* ── Post New Announcement ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-900 to-green-700 px-4 sm:px-5 py-3 sm:py-4
                        flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-base">✏️</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base">Post New Announcement</h3>
              <p className="text-white/60 text-xs">Notify all students and staff</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-500 hover:bg-yellow-400 text-green-900 text-xs
                       font-bold px-3 py-1.5 rounded-xl transition-colors">
            {showForm ? 'Cancel' : '+ New'}
          </button>
        </div>

        {showForm && (
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Announcement title..."
                  className="border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50
                             transition-colors placeholder-gray-300"
                />
              </div>

              {/* Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50"
                >
                  <option value="exam">📝 Exam Schedule</option>
                  <option value="holiday">🌙 Holiday Notice</option>
                  <option value="emergency">🚨 Emergency</option>
                  <option value="general">📌 General</option>
                  <option value="hafiz">📖 Hifz Test</option>
                  <option value="hadith">📚 Hadith Course</option>
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter full announcement details..."
                  rows={3}
                  className="border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50
                             transition-colors resize-none placeholder-gray-300"
                />
              </div>

            </div>

            {/* Urgent Toggle */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setForm({ ...form, is_urgent: form.is_urgent === 1 ? 0 : 1 })}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200
                  ${form.is_urgent === 1 ? 'bg-red-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
                                 shadow transition-transform duration-200
                                 ${form.is_urgent === 1 ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <label className="text-sm text-gray-600 font-medium">
                Mark as Urgent
                {form.is_urgent === 1 && (
                  <span className="ml-1.5 text-red-500 font-bold">🔴 ON</span>
                )}
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-green-800 to-green-700
                           hover:from-green-900 hover:to-green-800 text-white text-sm
                           font-bold px-5 sm:px-6 py-2.5 rounded-xl transition-all
                           shadow-md hover:shadow-lg hover:-translate-y-0.5">
                📢 Publish Now
              </button>
              <button
                onClick={() => setForm({ title: '', description: '', type: 'general', is_urgent: 0 })}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100
                           text-red-600 text-sm font-bold px-5 sm:px-6 py-2.5
                           rounded-xl transition-all border-2 border-red-100
                           hover:border-red-200">
                🗑️ Clear
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}