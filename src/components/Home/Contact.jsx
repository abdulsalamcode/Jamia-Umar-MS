import React, { useState } from 'react'

const CONTACT_INFO = [
  {
    icon:  '📍',
    title: 'Address',
    info:  'Burewala, Punjab, Pakistan',
    sub:   'In Village NO 511/E.B',
    bg:    'bg-green-50',
  },
  {
    icon:  '📞',
    title: 'Phone',
    info:  '0300-XXXXXXX',
    sub:   'Sat – Thu, 8AM – 5PM',
    bg:    'bg-blue-50',
  },
  {
    icon:  '📧',
    title: 'Email',
    info:  'info@jamia-umar.edu.pk',
    sub:   'Reply within 24 hours',
    bg:    'bg-yellow-50',
  },
  {
    icon:  '⏰',
    title: 'Office Hours',
    info:  'Mon – Sat',
    sub:   '8:00 AM – 5:00 PM',
    bg:    'bg-purple-50',
  },
]

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!form.name || !form.message) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest">
            Get In Touch
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900 mt-2">
            Contact Us
          </h2>
          <div className="w-16 h-1 bg-yellow-500 rounded-full mx-auto mt-4"></div>
          <p className="text-gray-500 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Have questions? We are here to help. Reach out to us anytime.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {CONTACT_INFO.map((c, i) => (
            <div key={i}
              className={`${c.bg} rounded-2xl p-4 sm:p-6 text-center
                          border border-gray-100 hover:shadow-md
                          transition-all hover:-translate-y-1`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white
                              flex items-center justify-center text-xl sm:text-2xl
                              mx-auto mb-3 shadow-sm">
                {c.icon}
              </div>
              <h3 className="font-bold text-green-900 text-xs sm:text-sm mb-1">
                {c.title}
              </h3>
              <p className="text-green-800 font-semibold text-xs sm:text-sm">
                {c.info}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Contact Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left — Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-5 sm:p-8 border border-gray-100">
            <h3 className="text-green-900 font-bold text-lg sm:text-xl mb-2">
              💬 Send Us a Message
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-5">
              We will get back to you as soon as possible.
            </p>

            {/* Success */}
            {submitted && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl
                              px-4 py-3 mb-4 text-green-700 text-sm font-bold
                              flex items-center gap-2">
                ✅ Message sent successfully! JazakAllah Khair 🤲
              </div>
            )}

            <div className="flex flex-col gap-3 sm:gap-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Full name..."
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                               focus:outline-none focus:border-green-400 bg-white
                               transition-colors placeholder-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="0300-XXXXXXX"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                               focus:outline-none focus:border-green-400 bg-white
                               transition-colors placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-white
                             transition-colors placeholder-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                  Message *
                </label>
                <textarea
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm
                             focus:outline-none focus:border-green-400 bg-white
                             transition-colors resize-none placeholder-gray-300"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-800 to-green-700
                           hover:from-green-900 hover:to-green-800 text-white font-bold
                           py-3 rounded-xl text-sm shadow-lg hover:shadow-xl
                           transition-all hover:-translate-y-0.5
                           flex items-center justify-center gap-2">
                📨 Send Message
              </button>

            </div>
          </div>

          {/* Right — Map + Info */}
          <div className="flex flex-col gap-4">

            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-green-800 to-green-900
                            rounded-2xl overflow-hidden flex-1 min-h-[200px] sm:min-h-[280px]
                            flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-5 left-5 w-20 h-20 rounded-full border-4 border-white"></div>
                <div className="absolute bottom-5 right-5 w-32 h-32 rounded-full border-4 border-white"></div>
              </div>
              <div className="text-center relative z-10 p-6">
                <div className="text-5xl sm:text-6xl mb-4">🗺️</div>
                <p className="text-white font-bold text-base sm:text-lg">
                  Jamia Umar Islamic University
                </p>
                <p className="text-white/60 text-xs sm:text-sm mt-2">
                  Burewala, Vehari, Punjab, Pakistan
                </p>
                <button className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-green-900
                                   font-bold text-xs sm:text-sm px-5 py-2 rounded-xl
                                   transition-colors">
                  📍 Get Directions
                </button>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-green-900 rounded-2xl p-5 sm:p-6">
              <h4 className="text-yellow-400 font-bold text-sm sm:text-base mb-4">
                ⚡ Quick Contact
              </h4>
              <div className="space-y-3">
                {[
                  { icon: '📞', label: 'Call Us',   value: '0300-XXXXXXX'          },
                  { icon: '📧', label: 'Email Us',  value: 'info@jamia-umar.edu.pk'},
                  { icon: '📍', label: 'Visit Us',  value: 'Faisalabad, Pakistan'  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center
                                    justify-center text-sm flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">{item.label}</div>
                      <div className="text-white text-xs sm:text-sm font-semibold">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}