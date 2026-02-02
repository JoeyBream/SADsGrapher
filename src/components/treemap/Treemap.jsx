import { useRef, useCallback } from 'react'
import { useResponsiveDimensions } from '../../hooks/useResponsiveDimensions'
import { useTreemapLayout } from '../../hooks/useTreemapLayout'
import { useTreemapZoom } from '../../hooks/useTreemapZoom'
import { useFilteredData } from '../../hooks/useFilteredData'
import { useDashboard } from '../../context/DashboardContext'
import { getTypeColor } from '../../lib/colorScales'
import { formatBurden } from '../../lib/formatters'
import TreemapCell from './TreemapCell'
import TreemapTooltip from './TreemapTooltip'
import Breadcrumb from './Breadcrumb'
import Legend from './Legend'
import sadsData from '../../data/sads-data.json'
import styles from './Treemap.module.css'

export default function Treemap() {
  const containerRef = useRef(null)
  const { width, height } = useResponsiveDimensions(containerRef)
  const { state, dispatch } = useDashboard()
  const { currentPath, pathStack, zoomIn, zoomTo } = useTreemapZoom()

  const filteredData = useFilteredData(
    sadsData,
    state.typeFilter,
    state.searchQuery
  )

  const layout = useTreemapLayout(filteredData, width, height, currentPath)

  const handleMouseEnter = useCallback((node, e) => {
    dispatch({ type: 'SET_HOVERED', payload: node })
    dispatch({ type: 'SET_MOUSE', payload: { x: e.clientX, y: e.clientY } })
  }, [dispatch])

  const handleMouseLeave = useCallback(() => {
    dispatch({ type: 'SET_HOVERED', payload: null })
  }, [dispatch])

  const handleMouseMove = useCallback((e) => {
    if (state.hoveredNode) {
      dispatch({ type: 'SET_MOUSE', payload: { x: e.clientX, y: e.clientY } })
    }
  }, [dispatch, state.hoveredNode])

  const handleCellClick = useCallback((node) => {
    if (node.children && node.children.length > 0) {
      zoomIn(node)
    } else if (node.parent && node.parent.children && node.parent.depth > 0) {
      zoomIn(node.parent)
    }
  }, [zoomIn])

  const handleZoomTo = useCallback((depth) => {
    zoomTo(depth)
  }, [zoomTo])

  // Build breadcrumb names from path stack
  const breadcrumbNames = pathStack.map(path => path[path.length - 1])

  return (
    <div className={styles.wrapper}>
      <Breadcrumb names={breadcrumbNames} onZoomTo={handleZoomTo} />
      <div
        ref={containerRef}
        className={styles.container}
        onMouseMove={handleMouseMove}
      >
        {layout && width > 0 && height > 0 && (
          <svg
            width={width}
            height={height}
            className={styles.svg}
            role="img"
            aria-label="Treemap showing global animal suffering burden by Suffering Adjusted Days"
          >
            {/* Group-level labels and backgrounds at all hierarchy depths */}
            {layout.displayRoot.descendants().filter(n => n.children && n.depth > 0).map((group) => {
              const gw = group.x1 - group.x0
              const gh = group.y1 - group.y0
              if (gw < 2 || gh < 2) return null
              const bgColor = getTypeColor(group)
              const isTopLevel = group.parent === layout.displayRoot
              return (
                <g key={`group-${group.data.name}-${group.depth}`}>
                  {isTopLevel && (
                    <rect
                      x={group.x0}
                      y={group.y0}
                      width={gw}
                      height={gh}
                      fill={bgColor}
                      opacity={0.12}
                      rx={3}
                    />
                  )}
                  {gh > 20 && gw > 50 && (
                    <text
                      x={group.x0 + 6}
                      y={group.y0 + 15}
                      fill={isTopLevel ? bgColor : 'var(--color-text-secondary)'}
                      fontSize={isTopLevel ? '12' : '10'}
                      fontWeight={isTopLevel ? '700' : '600'}
                      opacity={isTopLevel ? 1 : 0.7}
                      style={{ pointerEvents: 'none' }}
                    >
                      {group.data.name} ({formatBurden(group.value)})
                    </text>
                  )}
                </g>
              )
            })}

            {/* Leaf cells */}
            {layout.leaves.map((leaf) => (
              <TreemapCell
                key={`${leaf.data.name}-${leaf.depth}-${leaf.x0}-${leaf.y0}`}
                node={leaf}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleCellClick}
              />
            ))}
          </svg>
        )}
      </div>
      <Legend />
      <TreemapTooltip
        node={state.hoveredNode}
        mousePosition={state.mousePosition}
      />
    </div>
  )
}
