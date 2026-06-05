// ── Date Format Utilities ──

// 2026-05-07 → 07 May 2026
export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-PK', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

// 2026-05-07T09:30:00 → 07 May 2026, 09:30 AM
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-PK', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// 2026-05-07 → Thursday, 07 May 2026
export const formatFullDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-PK', {
    weekday: 'long',
    day:     '2-digit',
    month:   'long',
    year:    'numeric',
  })
}

// Today's date → 2026-05-07
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]
}

// Today's date → 07 May 2026
export const getTodayFormatted = () => {
  return formatDate(new Date().toISOString())
}

// Get current month → 2026-05
export const getCurrentMonth = () => {
  return new Date().toISOString().slice(0, 7)
}

// 2026-05 → May 2026
export const formatMonth = (monthStr) => {
  if (!monthStr) return '-'
  const date = new Date(monthStr + '-01')
  return date.toLocaleDateString('en-PK', {
    month: 'long',
    year:  'numeric',
  })
}

// Check if date is today
export const isToday = (dateStr) => {
  return dateStr === getTodayDate()
}