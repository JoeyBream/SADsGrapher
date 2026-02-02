import { useMemo } from 'react'
import * as d3 from 'd3'
import { TREEMAP_PADDING } from '../lib/constants'
import { findNodeByPath } from './useTreemapZoom'

export function useTreemapLayout(data, width, height, zoomPath) {
  return useMemo(() => {
    if (!data || !width || !height) return null

    const root = d3.hierarchy(data)
      .sum(d => d.totalBurden || 0)
      .sort((a, b) => b.value - a.value)

    const treemap = d3.treemap()
      .tile(d3.treemapSquarify)
      .size([width, height])
      .paddingOuter(TREEMAP_PADDING.outer)
      .paddingTop(TREEMAP_PADDING.top)
      .paddingInner(TREEMAP_PADDING.inner)
      .round(true)

    treemap(root)

    let displayRoot = root
    if (zoomPath) {
      const target = findNodeByPath(root, zoomPath)
      if (target) {
        // Resolve the type from ancestors for color assignment
        let resolvedType = null
        let cur = target
        while (cur) {
          if (cur.data.type) { resolvedType = cur.data.type; break }
          cur = cur.parent
        }

        // Clone data and inject type if missing
        const zoomData = { ...target.data }
        if (resolvedType && !zoomData.type) {
          zoomData.type = resolvedType
        }

        const zoomTreemap = d3.treemap()
          .tile(d3.treemapSquarify)
          .size([width, height])
          .paddingOuter(TREEMAP_PADDING.outer)
          .paddingTop(TREEMAP_PADDING.top)
          .paddingInner(TREEMAP_PADDING.inner)
          .round(true)

        const zoomRoot = d3.hierarchy(zoomData)
          .sum(d => d.totalBurden || 0)
          .sort((a, b) => b.value - a.value)

        zoomTreemap(zoomRoot)
        displayRoot = zoomRoot
      }
    }

    const leaves = displayRoot.leaves()

    return { root, displayRoot, leaves }
  }, [data, width, height, zoomPath])
}
