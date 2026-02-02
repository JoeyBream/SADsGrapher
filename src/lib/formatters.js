export function formatBurden(value) {
  if (value == null) return 'N/A'
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
  return value.toFixed(0)
}

export function formatBurdenFull(value) {
  if (value == null) return 'N/A'
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function formatSadsPerYear(value) {
  if (value == null) return 'N/A'
  return `${value.toFixed(1)} SADs/yr`
}

export function formatAnimalCount(value) {
  if (value == null) return 'N/A'
  if (value >= 1e12) return `${(value / 1e12).toFixed(0)}T`
  if (value >= 1e9) return `${(value / 1e9).toFixed(0)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`
  return value.toLocaleString('en-US')
}

export function formatPercent(value, total) {
  if (total === 0 || value == null) return ''
  const pct = (value / total) * 100
  if (pct < 0.1) return '<0.1%'
  if (pct < 1) return `${pct.toFixed(1)}%`
  return `${pct.toFixed(0)}%`
}

export function truncateLabel(text, maxLen) {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen - 1) + '\u2026'
}
