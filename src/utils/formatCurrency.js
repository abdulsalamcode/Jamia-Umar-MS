// ── Currency Format Utilities ──

// 185000 → ₨ 1,85,000
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₨ 0'
  return `₨ ${Number(amount).toLocaleString('en-PK')}`
}

// 185000 → 1.85L
export const formatCurrencyShort = (amount) => {
  if (!amount) return '₨ 0'
  if (amount >= 10000000) return `₨ ${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000)   return `₨ ${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000)     return `₨ ${(amount / 1000).toFixed(1)}K`
  return `₨ ${amount}`
}

// "185000" → 185000 (string to number)
export const parseCurrency = (str) => {
  if (!str) return 0
  return parseFloat(str.toString().replace(/[^0-9.]/g, '')) || 0
}

// Array of amounts ka total
export const sumAmounts = (items, key = 'amount') => {
  return items.reduce((total, item) => total + (Number(item[key]) || 0), 0)
}

// Percentage calculate karo
export const getPercentage = (value, total) => {
  if (!total) return '0%'
  return `${((value / total) * 100).toFixed(1)}%`
}