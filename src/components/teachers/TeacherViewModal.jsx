import React from 'react'

export default function TeacherViewModal({ teacher, onClose }) {
  if (!teacher) return null

  const rows = [
    { label: 'Teacher Code', value: teacher.teacher_code, icon: '🪪' },
    { label: 'Subject',      value: teacher.subject,      icon: '📚' },
    { label: 'Section',      value: teacher.section === 'male' ? '👨 Male' : '👩 Female', icon: '👥' },
    { label: 'Phone',        value: teacher.phone || 'N/A',   icon: '📞' },
    { label: 'CNIC',         value: teacher.cnic  || 'N/A',   icon: '🪪' },
    { label: 'Monthly Salary', value: `₨ ${Number(teacher.salary || 0).toLocaleString()}`, icon: '💰' },
    { label: 'Join Date',    value: teacher.join_date || 'N/A', icon: '📅' },
    { label: 'Status',       value: teacher.status === 'active' ? '✅ Active' : '🏖️ On Leave', icon: '📊' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 px-5 py-4
                        flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-yellow-400 flex items-center
                            justify-center text-green-900 font-bold text-lg flex-shrink-0">
              {teacher.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">{teacher.name}</p>
              <p className="text-white/60 text-xs">{teacher.teacher_code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
                       flex items-center justify-center text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Details */}
        <div className="p-5">
          <p className="text-xs font-bold text-green-900 uppercase tracking-wide mb-3">
            Teacher Details
          </p>
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between
                                      bg-gray-50 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{r.icon}</span>
                  <span className="text-xs text-gray-500 font-medium">{r.label}</span>
                </div>
                <span className="text-xs font-bold text-gray-800 text-right max-w-[55%]">
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full bg-green-800 hover:bg-green-900 text-white
                       font-bold py-2.5 rounded-xl text-sm transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  )
}