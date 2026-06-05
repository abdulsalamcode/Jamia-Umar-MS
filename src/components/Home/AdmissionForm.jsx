import React, { useState } from 'react'

const REQUIREMENTS = [
  { step: '01', title: 'Age Requirement',    desc: 'Students from age 4 (Play Group) to adults for higher courses.' },
  { step: '02', title: 'Previous Education', desc: 'Basic literacy required. Quran reading preferred for Hifz.'     },
  { step: '03', title: 'Documents Needed',   desc: 'B-Form/CNIC copy, passport photo, previous result card.'        },
  { step: '04', title: 'Admission Test',     desc: 'Simple oral test for Hifz and Hadith courses.'                  },
]

export default function AdmissionForm() {
  const [form, setForm] = useState({
    name:    '',
    father:  '',
    phone:   '',
    dob:     '',
    section: 'Male (Boys)',
    program: 'Hifz ul Quran',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!form.name || !form.father || !form.phone) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setForm({ name: '', father: '', phone: '', dob: '', section: 'Male (Boys)', program: 'Hifz ul Quran' })
  }

  return (
    <section id="admissions"
      className="py-16 sm:py-24 bg-gradient-to-br from-green-900 to-green-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
            Join Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2">
            Admissions Open 2026
          </h2>
          <div className="w-16 h-1 bg-yellow-500 rounded-full mx-auto mt-4"></div>
          <p className="text-white/70 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Applications are now open for the academic year 2026.
            Limited seats available — apply early!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Left — Requirements */}
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl mb-6">
              📋 Admission Requirements
            </h3>
            <div className="space-y-4">
              {REQUIREMENTS.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center
                                  justify-center text-green-900 font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm sm:text-base">{item.title}</h4>
                    <p className="text-white/60 text-xs sm:text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-5">
              <h4 className="text-yellow-400 font-bold text-sm sm:text-base mb-3">
                📞 Need Help?
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                  <span>📞</span> <span>0300-XXXXXXX</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                  <span>📧</span> <span>admissions@jamia-umar.edu.pk</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                  <span>⏰</span> <span>Mon – Sat, 8:00 AM – 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-2xl">
            <h3 className="text-green-900 font-bold text-lg sm:text-xl mb-2">
              🎓 Quick Apply Form
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-5">
              Fill the form below and our team will contact you within 24 hours.
            </p>

            {/* Success Message */}
            {submitted && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl
                              px-4 py-3 mb-4 text-green-700 text-sm font-bold
                              flex items-center gap-2">
                ✅ Application submitted! We will contact you soon. JazakAllah Khair 🤲
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">

              {/* Student Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Student Name *
                </label>
                <input
                  type="text"
                  placeholder="Full name..."
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50
                             transition-colors placeholder-gray-300"
                />
              </div>

              {/* Father Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Father Name *
                </label>
                <input
                  type="text"
                  placeholder="Father full name..."
                  value={form.father}
                  onChange={e => setForm({ ...form, father: e.target.value })}
                  className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50
                             transition-colors placeholder-gray-300"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="0300-XXXXXXX"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50
                             transition-colors placeholder-gray-300"
                />
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                  className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50
                             transition-colors"
                />
              </div>

              {/* Section */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Section
                </label>
                <select
                  value={form.section}
                  onChange={e => setForm({ ...form, section: e.target.value })}
                  className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50
                             transition-colors"
                >
                  <option>Male (Boys)</option>
                  <option>Female (Girls)</option>
                </select>
              </div>

              {/* Program */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Program
                </label>
                <select
                  value={form.program}
                  onChange={e => setForm({ ...form, program: e.target.value })}
                  className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50
                             transition-colors"
                >
                  <option>Hifz ul Quran</option>
                  <option>Hadith Course</option>
                  <option>School (PG - Matric)</option>
                  <option>Islamic Studies</option>
                </select>
              </div>

            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-800 to-green-700
                         hover:from-green-900 hover:to-green-800 text-white font-bold
                         py-3 sm:py-4 rounded-xl text-sm sm:text-base shadow-lg
                         hover:shadow-xl transition-all hover:-translate-y-0.5
                         flex items-center justify-center gap-2">
              🎓 Submit Application
            </button>

            <p className="text-center text-gray-400 text-xs mt-3">
              🔒 Your information is safe with us
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}