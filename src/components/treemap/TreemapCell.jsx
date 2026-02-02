import { getTypeColor } from '../../lib/colorScales'
import { formatBurden } from '../../lib/formatters'

export default function TreemapCell({ node, onMouseEnter, onMouseLeave, onClick }) {
  const x = node.x0
  const y = node.y0
  const w = node.x1 - node.x0
  const h = node.y1 - node.y0

  if (w < 1 || h < 1) return null

  const bgColor = getTypeColor(node)
  const showLabel = w > 38 && h > 16
  const showValue = w > 55 && h > 30
  const clipId = `c-${Math.round(x)}-${Math.round(y)}`

  return (
    <g
      className="treemap-cell"
      onMouseEnter={(e) => onMouseEnter(node, e)}
      onMouseLeave={onMouseLeave}
      onClick={(e) => { e.stopPropagation(); onClick(node) }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={bgColor}
        rx={3}
        ry={3}
      />
      {showLabel && (
        <clipPath id={clipId}>
          <rect x={x + 4} y={y + 2} width={w - 8} height={h - 4} />
        </clipPath>
      )}
      {showLabel && (
        <text
          x={x + 6}
          y={y + 14}
          fill="#fff"
          fontSize="10.5"
          fontWeight="500"
          fontFamily="'DM Sans', sans-serif"
          clipPath={`url(#${clipId})`}
          style={{ pointerEvents: 'none' }}
        >
          {node.data.name}
        </text>
      )}
      {showValue && (
        <text
          x={x + 6}
          y={y + 27}
          fill="rgba(255,255,255,0.65)"
          fontSize="9.5"
          fontFamily="'DM Mono', monospace"
          clipPath={`url(#${clipId})`}
          style={{ pointerEvents: 'none' }}
        >
          {formatBurden(node.value)}
        </text>
      )}
    </g>
  )
}
