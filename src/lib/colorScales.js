import { TYPE_COLORS } from './constants'

export function getTypeColor(node) {
  let current = node
  while (current) {
    if (current.data && current.data.type) {
      return TYPE_COLORS[current.data.type] || '#999'
    }
    current = current.parent
  }
  return '#999'
}

export function getCellColor(node, opacity = 1) {
  const base = getTypeColor(node)
  if (opacity === 1) return base
  return applyOpacity(base, opacity)
}

function applyOpacity(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function getTextColor(bgHex) {
  const r = parseInt(bgHex.slice(1, 3), 16)
  const g = parseInt(bgHex.slice(3, 5), 16)
  const b = parseInt(bgHex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1a1a2e' : '#ffffff'
}
