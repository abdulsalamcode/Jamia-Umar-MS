import React from 'react'
import { useNavigate } from 'react-router-dom'

const QUICK_LINKS = ['Home', 'About', 'Programs', 'Admissions', 'Contact']

const PROGRAMS = [
  'Hifz ul Quran',
  'Hadith Course',
  'School Education',
  'Islamic Studies',
]

const SOCIAL = [
  { icon: '📘', label: 'Facebook'  },
  { icon: '📸', label: 'Instagram' },
  { icon: '🐦', label: 'Twitter'   },
  { icon: '▶️', label: 'YouTube'   },
]

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-green-950 text-white">

      {/* ── Top CTA Banner ── */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center
                          justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-green-900 font-bold text-lg sm:text-xl">
                🎓 Admissions Open for 2026!
              </h3>
              <p className="text-green-800 text-xs sm:text-sm mt-1">
                Limited seats available — apply now before it's too late.
              </p>
            </div>
            <div className="flex gap-3">
              <a href="#admissions"
                className="bg-green-900 hover:bg-green-800 text-white font-bold
                           text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-xl
                           transition-all hover:-translate-y-0.5 whitespace-nowrap">
                Apply Now →
              </a>
              <a href="#contact"
                className="bg-white hover:bg-gray-50 text-green-900 font-bold
                           text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-xl
                           transition-all hover:-translate-y-0.5 whitespace-nowrap">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10">

            {/* Col 1 — Logo & About */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center
                                justify-center text-green-900 font-bold text-xl flex-shrink-0">
                  ج
                </div>
                <div>
                  <div className="font-bold text-base">Jamia Umar</div>
                  <div className="text-yellow-400 text-sm">Islamic University</div>
                </div>
              </div>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-4">
                Nurturing Islamic scholars and modern professionals
                since 2009. Providing quality education with Islamic values.
              </p>

              {/* Arabic */}
              <div className="text-yellow-400 text-sm font-bold leading-relaxed mb-4">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              </div>

              {/* Social */}
              <div className="flex gap-2">
                {SOCIAL.map((s, i) => (
                  <button key={i}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-yellow-500
                               flex items-center justify-center text-sm
                               transition-all hover:-translate-y-0.5">
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 2 — Quick Links */}
            <div>
              <h4 className="font-bold text-yellow-400 text-sm mb-5 uppercase tracking-wide">
                Quick Links
              </h4>
              <div className="space-y-2.5">
                {QUICK_LINKS.map(link => (
                  <a key={link} href={`#${link.toLowerCase()}`}
                    className="flex items-center gap-2 text-white/60
                               hover:text-white text-xs sm:text-sm transition-colors group">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500
                                     group-hover:bg-white transition-colors flex-shrink-0">
                    </span>
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 3 — Programs */}
            <div>
              <h4 className="font-bold text-yellow-400 text-sm mb-5 uppercase tracking-wide">
                Programs
              </h4>
              <div className="space-y-2.5">
                {PROGRAMS.map(p => (
                  <div key={p}
                    className="flex items-center gap-2 text-white/60
                               hover:text-white text-xs sm:text-sm
                               transition-colors cursor-pointer group">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500
                                     group-hover:bg-white transition-colors flex-shrink-0">
                    </span>
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Col 4 — Contact */}
            <div>
              <h4 className="font-bold text-yellow-400 text-sm mb-5 uppercase tracking-wide">
                Contact
              </h4>
              <div className="space-y-3 mb-5">
                {[
                  { icon: '📍', text: 'Burewala, Punjab, Pakistan' },
                  { icon: '📞', text: '0306-2410266'                 },
                  { icon: '📧', text: 'info@jamia-umar.edu.pk'       },
                  { icon: '⏰', text: 'Sat–Thu, 4AM – 5PM'           },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
                    <span className="text-white/60 text-xs sm:text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Admin Button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-green-900
                           font-bold text-xs sm:text-sm py-2.5 rounded-xl
                           transition-all hover:-translate-y-0.5 shadow-md
                           hover:shadow-lg">
                🔐 Admin Portal
              </button>
            </div>

          </div>

          {/* ── Divider ── */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col sm:flex-row items-center
                            justify-between gap-3">
              {/* <p className="text-white/40 text-xs text-center sm:text-left">
               Powered by : Abdul-Salam Chohan.
              </p> */}
              <div className="flex items-center gap-4">
                <span className="text-white/40 text-xs">Privacy Policy</span>
                <span className="text-white/20">•</span>
                <span className="text-white/40 text-xs">Terms of Use</span>
                <span className="text-white/20">•</span>
                <span className="text-white/40 text-xs">
                  Built with ❤️ for Islamic Education
                </span>
              </div>
            </div>
          </div><br />
                 <p className="text-white/40 text-xs text-center ">
               Powered by : Abdul-Salam Chohan.
              </p>
        </div>
      </div>

    </footer>
  )
}