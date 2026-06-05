import React from 'react'

const FEATURES = [
  { icon: '🕌', title: 'Islamic Values',  desc: 'Education rooted in authentic Islamic principles and traditions.'    },
  { icon: '📖', title: 'Quran Focus',     desc: 'Special emphasis on Quran memorization and Tajweed.'                },
  { icon: '👨‍🏫', title: 'Expert Faculty',  desc: 'Highly qualified teachers with years of teaching experience.'      },
  { icon: '🤝', title: 'Community',       desc: 'Strong community ties with NGOs and welfare organizations.'         },
]

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest">
            Who We Are
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900 mt-2">
            About Our Institution
          </h2>
          <div className="w-16 h-1 bg-yellow-500 rounded-full mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-4">
              Excellence in Islamic Education Since 2019
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              Jamia Umar Islamic University is a leading Islamic educational
              institution in Burewala Vehari, Pakistan. We are dedicated to providing
              quality Islamic education alongside modern academics in a nurturing
              environment.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              Our institute offers separate facilities for male and female students,
              ensuring a comfortable and productive learning environment for all.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                '✅ Separate Male & Female Sections',
                '✅ Qualified & Experienced Faculty',
                '✅ Modern Learning Facilities',
                '✅ Scholarship Programs Available',
              ].map((item, i) => (
                <div key={i}
                  className="flex items-center gap-2 bg-white rounded-xl
                             px-4 py-3 border border-gray-100 shadow-sm
                             text-gray-700 text-xs sm:text-sm font-medium">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((card, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100
                           shadow-sm hover:shadow-md hover:-translate-y-1
                           transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center
                                justify-center text-xl mb-3">
                  {card.icon}
                </div>
                <h4 className="font-bold text-green-900 text-sm sm:text-base mb-1">
                  {card.title}
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}