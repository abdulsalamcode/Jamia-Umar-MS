import React from 'react'

const STATS = [
  { icon: '🎓', value: '1,248+', label: 'Total Students'     },
  { icon: '👨‍🏫', value: '64+',    label: 'Qualified Teachers'  },
  { icon: '📖', value: '187+',   label: 'Hafiz Students'     },
  { icon: '🏆', value: '15+',    label: 'Years of Excellence' },
]

export default function Hero() {
  return (
    <section id="home"
      className="pt-16 sm:pt-20 min-h-screen flex items-center
                 bg-gradient-to-br from-green-950 via-green-900 to-green-800
                 relative overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-4 border-white"></div>
        <div className="absolute top-32 right-20 w-24 h-24 rounded-full border-4 border-white"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 rounded-full border-4 border-white"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full border-4 border-white"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border
                            border-yellow-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                Est. 2019 • Burewala, Pakistan
              </span>
            </div>

            <div className="text-yellow-400 text-2xl sm:text-3xl font-bold mb-3 leading-relaxed">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white
                           leading-tight mb-6">
              Jamia Umar <br />
              <span className="text-yellow-400">Islamic University</span>
            </h1>

            <p className="text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed
                          mb-8 max-w-xl mx-auto lg:mx-0">
              A premier Islamic educational institution offering comprehensive
              programs in Quran, Hadith, and modern education — nurturing
              scholars for a better tomorrow.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4
                            justify-center lg:justify-start">
              <a href="#admissions"
                className="inline-flex items-center justify-center gap-2
                           bg-yellow-500 hover:bg-yellow-400 text-green-900
                           font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl
                           shadow-xl shadow-yellow-500/30 transition-all
                           hover:-translate-y-1 hover:shadow-2xl text-sm sm:text-base">
                🎓 Apply for Admission
              </a>
              <a href="#programs"
                className="inline-flex items-center justify-center gap-2
                           bg-white/10 hover:bg-white/20 text-white
                           border border-white/30 font-bold
                           px-6 sm:px-8 py-3 sm:py-4 rounded-2xl
                           transition-all hover:-translate-y-1
                           text-sm sm:text-base">
                📚 Our Programs
              </a>
            </div>
          </div>

          {/* Right — Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {STATS.map((s, i) => (
              <div key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20
                           rounded-2xl p-4 sm:p-6 text-center
                           hover:bg-white/15 transition-all hover:-translate-y-1">
                <div className="text-3xl sm:text-4xl mb-2">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{s.value}</div>
                <div className="text-white/70 text-xs sm:text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}