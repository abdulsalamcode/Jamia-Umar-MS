import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost/jamia-umar-ms/api/profile/index.php'

export default function ProfileSettings() {
  const { user, login } = useAuth()

  // ── Profile Tab State ──
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', identity_code: '', role: '', subject: '', section: ''
  })
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileSaving,  setProfileSaving]  = useState(false)
  const [profileMsg,     setProfileMsg]     = useState({ type: '', text: '' })

  // ── Password Tab State ──
  const [passForm, setPassForm] = useState({
    current_password: '', new_password: '', confirm_password: ''
  })
  const [passLoading, setPassLoading] = useState(false)
  const [passMsg,     setPassMsg]     = useState({ type: '', text: '' })
  const [showPass,    setShowPass]    = useState({ current: false, new: false, confirm: false })

  // ── Active Tab ──
  const [tab, setTab] = useState('profile')

  // ── Fetch Profile ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const res   = await fetch(API, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) setProfile(data.profile)
      } catch {
        setProfileMsg({ type: 'error', text: 'Failed to load profile. Check your server.' })
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // ── Save Profile ──
  const handleProfileSave = async () => {
    if (!profile.name.trim()) {
      setProfileMsg({ type: 'error', text: 'Name cannot be empty' })
      return
    }
    try {
      setProfileSaving(true)
      setProfileMsg({ type: '', text: '' })
      const token = localStorage.getItem('token')
      const res   = await fetch(API, {
        method:  'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name:  profile.name,
          email: profile.email,
          phone: profile.phone,
        })
      })
      const data = await res.json()
      if (data.success) {
        setProfileMsg({ type: 'success', text: '✅ Profile updated successfully!' })
        // AuthContext user update karo (naam change reflect karo topbar mein)
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}')
        savedUser.name  = profile.name
        login(savedUser, token)
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Update failed' })
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Connection error. Check your server.' })
    } finally {
      setProfileSaving(false)
    }
  }

  // ── Change Password ──
  const handlePasswordChange = async () => {
    setPassMsg({ type: '', text: '' })

    if (!passForm.current_password || !passForm.new_password || !passForm.confirm_password) {
      setPassMsg({ type: 'error', text: 'Please fill all fields' })
      return
    }
    if (passForm.new_password !== passForm.confirm_password) {
      setPassMsg({ type: 'error', text: 'New passwords do not match' })
      return
    }
    if (passForm.new_password.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    try {
      setPassLoading(true)
      const token = localStorage.getItem('token')
      const res   = await fetch(API, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passForm.current_password,
          new_password:     passForm.new_password,
        })
      })
      const data = await res.json()
      if (data.success) {
        setPassMsg({ type: 'success', text: '✅ Password changed successfully!' })
        setPassForm({ current_password: '', new_password: '', confirm_password: '' })
      } else {
        setPassMsg({ type: 'error', text: data.message || 'Failed to change password' })
      }
    } catch {
      setPassMsg({ type: 'error', text: 'Connection error. Check your server.' })
    } finally {
      setPassLoading(false)
    }
  }

  const avatarLetter = profile.name?.charAt(0)?.toUpperCase() || 'A'

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── Header ── */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">⚙️ Profile Settings</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage your account information</p>
      </div>

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 p-6
                      flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center
                        justify-center text-green-900 font-bold text-2xl flex-shrink-0 shadow">
          {avatarLetter}
        </div>
        <div>
          <p className="text-lg font-bold text-green-900">
            {profileLoading ? '...' : profile.name || 'Administrator'}
          </p>
          <p className="text-sm text-gray-400">{profile.identity_code}</p>
          <span className="inline-block mt-1 text-xs bg-green-100 text-green-700
                           font-bold px-2.5 py-0.5 rounded-full capitalize">
            {profile.role || 'admin'}
          </span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {[
          { key: 'profile',  label: '👤 Edit Profile' },
          { key: 'password', label: '🔒 Change Password' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setProfileMsg({ type:'',text:'' }); setPassMsg({ type:'',text:'' }) }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
              ${tab === t.key
                ? 'bg-white text-green-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          TAB: Edit Profile
      ══════════════════════════════════════ */}
      {tab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {profileLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin w-8 h-8 text-green-700" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : (
            <>
              {/* Message */}
              {profileMsg.text && (
                <div className={`rounded-xl px-4 py-3 mb-5 text-sm font-bold border-2
                  ${profileMsg.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-600'}`}>
                  {profileMsg.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1.5 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:border-green-400 bg-gray-50"
                    placeholder="Your full name"
                  />
                </div>

                {/* Identity Code (readonly) */}
                <div>
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1.5 block">
                    Identity Code
                  </label>
                  <input
                    type="text"
                    value={profile.identity_code}
                    readOnly
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm
                               bg-gray-100 text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* Role (readonly) */}
                <div>
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1.5 block">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    readOnly
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm
                               bg-gray-100 text-gray-400 cursor-not-allowed capitalize"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:border-green-400 bg-gray-50"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1.5 block">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:border-green-400 bg-gray-50"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>

                {/* Subject (teacher only) */}
                {profile.role === 'teacher' && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1.5 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={profile.subject}
                      readOnly
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm
                                 bg-gray-100 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                )}

              </div>

              {/* Save Button */}
              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className={`mt-6 w-full bg-gradient-to-r from-green-800 to-green-700
                           text-white font-bold py-3 rounded-xl text-sm
                           shadow transition-all flex items-center justify-center gap-2
                           ${profileSaving
                             ? 'opacity-70 cursor-not-allowed'
                             : 'hover:from-green-900 hover:to-green-800 hover:-translate-y-0.5'
                           }`}
              >
                {profileSaving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Saving...
                  </>
                ) : '💾 Save Changes'}
              </button>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: Change Password
      ══════════════════════════════════════ */}
      {tab === 'password' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* Message */}
          {passMsg.text && (
            <div className={`rounded-xl px-4 py-3 mb-5 text-sm font-bold border-2
              ${passMsg.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-600'}`}>
              {passMsg.text}
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* Current Password */}
            <div>
              <label className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1.5 block">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPass.current ? 'text' : 'password'}
                  value={passForm.current_password}
                  onChange={e => setPassForm({ ...passForm, current_password: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 pr-12 py-3 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50"
                  placeholder="Enter current password"
                />
                <button
                  onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.current ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1.5 block">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPass.new ? 'text' : 'password'}
                  value={passForm.new_password}
                  onChange={e => setPassForm({ ...passForm, new_password: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 pr-12 py-3 text-sm
                             focus:outline-none focus:border-green-400 bg-gray-50"
                  placeholder="Min. 6 characters"
                />
                <button
                  onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.new ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-green-900 uppercase tracking-wide mb-1.5 block">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPass.confirm ? 'text' : 'password'}
                  value={passForm.confirm_password}
                  onChange={e => setPassForm({ ...passForm, confirm_password: e.target.value })}
                  className={`w-full border-2 rounded-xl px-4 pr-12 py-3 text-sm
                             focus:outline-none bg-gray-50
                             ${passForm.confirm_password && passForm.new_password !== passForm.confirm_password
                               ? 'border-red-300 focus:border-red-400'
                               : 'border-gray-100 focus:border-green-400'
                             }`}
                  placeholder="Re-enter new password"
                />
                <button
                  onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.confirm ? '🙈' : '👁️'}
                </button>
              </div>
              {passForm.confirm_password && passForm.new_password !== passForm.confirm_password && (
                <p className="text-red-500 text-xs mt-1 font-medium">⚠️ Passwords do not match</p>
              )}
            </div>

          </div>

          {/* Change Button */}
          <button
            onClick={handlePasswordChange}
            disabled={passLoading}
            className={`mt-6 w-full bg-gradient-to-r from-green-800 to-green-700
                       text-white font-bold py-3 rounded-xl text-sm
                       shadow transition-all flex items-center justify-center gap-2
                       ${passLoading
                         ? 'opacity-70 cursor-not-allowed'
                         : 'hover:from-green-900 hover:to-green-800 hover:-translate-y-0.5'
                       }`}
          >
            {passLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Changing...
              </>
            ) : '🔒 Change Password'}
          </button>

        </div>
      )}

    </div>
  )
}