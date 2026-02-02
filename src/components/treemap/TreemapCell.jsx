import { getTypeColor, getTextColor } from '../../lib/colorScales'
import { formatBurden } from '../../lib/formatters'

export default function TreemapCell({ node, onMouseEnter, onMouseLeave, onClick }) {
  const x = node.x0
  const y = node.y0
  const w = node.x1 - node.x0
  const h = node.y1 - node.y0

  if (w < 1 || h < 1) return null

  const bgColor = getTypeColor(node)
  const textColor = getTextColor(bgColor)
  const showLabel = w > 40 && h > 18
  const showValue = w > 60 && h > 32

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
        rx={2}
        ry={2}
      />
      {showLabel && (
        <clipPath id={`clip-${node.data.name.replace(/\s+/g, '-')}-${x}-${y}`}>
          <rect x={x + 4} y={y + 2} width={w - 8} height={h - 4} />
        </clipPath>
      )}
      {showLabel && (
        <text
          x={x + 6}
          y={y + 14}
          fill={textColor}
          fontSize="11"
          fontWeight="500"
          clipPath={`url(#clip-${node.data.name.replace(/\s+/g, '-')}-${x}-${y})`}
          style={{ pointerEvents: 'none' }}
        >
          {node.data.name}
        </text>
      )}
      {showValue && (
        <text
          x={x + 6}
          y={y + 28}
          fill={textColor}
          fontSize="10"
          opacity={0.8}
          style={{ pointerEvents: 'none' }}
        >
          {formatBurden(node.value)}
        </text>
      )}
    </g>
  )
}
