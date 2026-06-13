import React from 'react'

export default function StudentViewModal({ student, onClose }) {
  if (!student) return null

  const courseLabel = {
    school: '🏫 School',
    hifz:   '📖 Hifz ul Quran',
    hadith: '📜 Hadith',
  }

  const rows = [
    { label: 'Student Code',  value: student.student_code,  icon: '🪪' },
    { label: 'Father Name',   value: student.father_name || 'N/A', icon: '👨' },
    { label: 'Course',        value: courseLabel[student.course] || student.course, icon: '📚' },
    { label: 'Class',         value: student.class || 'N/A', icon: '🏫' },
    { label: 'Section',       value: student.section === 'male' ? '👦 Male' : '👧 Female', icon: '👥' },
    { label: 'Phone',         value: student.phone  || 'N/A', icon: '📞' },
    { label: 'B-Form / CNIC', value: student.b_form || 'N/A', icon: '🪪' },
    { label: 'Monthly Fee',   value: `₨ ${Number(student.monthly_fee || 0).toLocaleString()}`, icon: '💰' },
    { label: 'Join Date',     value: student.join_date || 'N/A', icon: '📅' },
    { label: 'Status',        value: student.status === 'active' ? '✅ Active' : student.status === 'graduated' ? '🎓 Graduated' : '❌ Inactive', icon: '📊' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 px-5 py-4
                        flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-yellow-400 flex items-center
                            justify-center text-green-900 font-bold text-lg flex-shrink-0">
              {student.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">{student.name}</p>
              <p className="text-white/60 text-xs">{student.student_code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
                       flex items-center justify-center text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Details scrollable */}
        <div className="p-5 overflow-y-auto flex-1">
          <p className="text-xs font-bold text-green-900 uppercase tracking-wide mb-3">
            Student Details
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
        <div className="px-5 pb-5 flex-shrink-0">
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