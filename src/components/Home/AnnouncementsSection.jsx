import React from 'react'

const ANNOUNCEMENTS = [
  {
    type:  'urgent',
    title: 'Annual Exams Schedule',
    date:  '10 May 2026',
    desc:  'School section exams begin from 10th May. All students must bring admit cards.',
    icon:  '📝',
  },
  {
    type:  'normal',
    title: 'Eid Holidays',
    date:  '28 May 2026',
    desc:  'Institute will remain closed from 28 May to 5 June for Eid ul Adha.',
    icon:  '🌙',
  },
  {
    type:  'normal',
    title: 'New Session Admissions',
    date:  '01 Jun 2026',
    desc:  'Admissions are now open for all programs for the academic year 2026.',
    icon:  '🎓',
  },
  {
    type:  'urgent',
    title: 'Hifz Test – Boys Section',
    date:  '15 May 2026',
    desc:  'Monthly Hifz evaluation for boys will be held after Asr prayer.',
    icon:  '📖',
  },
  {
    type:  'normal',
    title: 'Parent Teacher Meeting',
    date:  '12 May 2026',
    desc:  'PTM for all school section parents. Please come after Zuhr prayer.',
    icon:  '👨‍👩‍👧',
  },
  {
    type:  'normal',
    title: 'Hadith Course Final Test',
    date:  '20 May 2026',
    desc:  'Final test for Hadith course students will be held in the main hall.',
    icon:  '📚',
  },
]

export default function AnnouncementsSection() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest">
            Stay Updated
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900 mt-2">
            Latest Announcements
          </h2>
          <div className="w-16 h-1 bg-yellow-500 rounded-full mx-auto mt-4"></div>
          <p className="text-gray-500 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Stay informed about exams, holidays, and important events.
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ANNOUNCEMENTS.map((a, i) => (
            <div key={i}
              className={`rounded-2xl p-5 sm:p-6 border-2 hover:shadow-lg
                          transition-all duration-200 hover:-translate-y-1 relative overflow-hidden
                ${a.type === 'urgent'
                  ? 'bg-red-50 border-red-200 hover:border-red-300'
                  : 'bg-white border-gray-100 hover:border-green-200'
                }`}>

              {/* Urgent Badge */}
              {a.type === 'urgent' && (
                <div className="absolute top-0 right-0">
                  <div className="bg-red-500 text-white text-xs font-bold
                                  px-3 py-1 rounded-bl-xl">
                    🔴 Urgent
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                               text-xl mb-4
                ${a.type === 'urgent' ? 'bg-red-100' : 'bg-green-50'}`}>
                {a.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-green-900 text-sm sm:text-base mb-2 pr-12">
                {a.title}
              </h3>

              {/* Date */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className={`w-1.5 h-1.5 rounded-full
                  ${a.type === 'urgent' ? 'bg-red-500' : 'bg-green-500'}`}>
                </div>
                <span className="text-xs text-gray-400 font-medium">📅 {a.date}</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {a.desc}
              </p>

            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="inline-flex items-center gap-2 bg-white border-2
                             border-green-200 hover:border-green-800 text-green-800
                             hover:bg-green-800 hover:text-white font-bold
                             px-6 sm:px-8 py-3 rounded-2xl transition-all
                             duration-200 hover:-translate-y-0.5 text-sm sm:text-base
                             shadow-sm hover:shadow-lg">
            📢 View All Announcements →
          </button>
        </div>

      </div>
    </section>
  )
}