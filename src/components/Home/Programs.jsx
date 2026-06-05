import React from 'react'

const PROGRAMS = [
  {
    icon:     '📖',
    title:    'Hifz ul Quran',
    desc:     'Complete memorization of the Holy Quran under expert Huffaz guidance.',
    duration: '3-5 Years',
    students: '187',
    color:    'from-green-800 to-green-700',
  },
  {
    icon:     '📚',
    title:    'Hadith Course',
    desc:     'In-depth study of Hadith sciences with qualified Muhadditheen.',
    duration: '4 Years',
    students: '419',
    color:    'from-green-900 to-green-700',
  },
  {
    icon:     '🏫',
    title:    'School Education',
    desc:     'From Play Group to Matric with Islamic values integrated in curriculum.',
    duration: 'PG - Matric',
    students: '642',
    color:    'from-green-800 to-green-600',
  },
  {
    icon:     '🕌',
    title:    'Islamic Studies',
    desc:     'Comprehensive Islamic education including Fiqh, Aqeedah, and Tajweed.',
    duration: '2-3 Years',
    students: '200',
    color:    'from-green-900 to-green-800',
  },
]

export default function Programs() {
  return (
    <section id="programs" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900 mt-2">
            Our Programs
          </h2>
          <div className="w-16 h-1 bg-yellow-500 rounded-full mx-auto mt-4"></div>
          <p className="text-gray-500 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            We offer a wide range of Islamic and academic programs for both
            male and female students of all ages.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PROGRAMS.map((prog, i) => (
            <div key={i}
              className="group bg-white rounded-2xl border-2 border-gray-100
                         hover:border-green-300 shadow-sm hover:shadow-xl
                         transition-all duration-300 hover:-translate-y-2
                         overflow-hidden">

              {/* Top */}
              <div className={`bg-gradient-to-br ${prog.color} p-6 sm:p-8 text-center`}>
                <div className="text-4xl sm:text-5xl mb-3">{prog.icon}</div>
                <h3 className="text-white font-bold text-sm sm:text-base">{prog.title}</h3>
              </div>

              {/* Bottom */}
              <div className="p-4 sm:p-5">
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
                  {prog.desc}
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-between mb-4
                                bg-gray-50 rounded-xl px-3 py-2">
                  <div>
                    <div className="text-xs text-gray-400">Duration</div>
                    <div className="text-xs sm:text-sm font-bold text-green-900">
                      {prog.duration}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Students</div>
                    <div className="text-xs sm:text-sm font-bold text-green-900">
                      {prog.students}+
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-green-50 hover:bg-green-800 text-green-800
                             hover:text-white text-xs sm:text-sm font-bold py-2.5
                             rounded-xl transition-all duration-200 border-2
                             border-green-100 hover:border-green-800">
                  Learn More →
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 sm:mt-14">
          <div className="inline-flex items-center gap-3 bg-green-50 border-2
                          border-green-100 rounded-2xl px-6 sm:px-8 py-4 sm:py-5">
            <span className="text-2xl">🕌</span>
            <div className="text-left">
              <p className="text-green-900 font-bold text-sm sm:text-base">
                Interested in joining?
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                Apply now for the new session 2026
              </p>
            </div>
            <a href="#admissions"
              className="bg-green-800 hover:bg-green-900 text-white font-bold
                         text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5
                         rounded-xl transition-all hover:-translate-y-0.5
                         whitespace-nowrap ml-2">
              Apply Now →
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}