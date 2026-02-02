import { useState, useCallback } from 'react'

function getNodePath(node) {
  const path = []
  let current = node
  while (current && current.parent) {
    path.unshift(current.data.name)
    current = current.parent
  }
  return path
}

export function findNodeByPath(root, path) {
  let current = root
  for (const name of path) {
    if (!current.children) return null
    const found = current.children.find(c => c.data.name === name)
    if (!found) return null
    current = found
  }
  return current
}

export function useTreemapZoom() {
  const [pathStack, setPathStack] = useState([])

  const zoomIn = useCallback((node) => {
    if (node && node.children && node.children.length > 0) {
      setPathStack(prev => [...prev, getNodePath(node)])
    }
  }, [])

  const zoomTo = useCallback((depth) => {
    setPathStack(prev => prev.slice(0, depth))
  }, [])

  const zoomOut = useCallback(() => {
    setPathStack(prev => prev.slice(0, -1))
  }, [])

  const currentPath = pathStack.length > 0
    ? pathStack[pathStack.length - 1]
    : null

  return { currentPath, pathStack, zoomIn, zoomTo, zoomOut }
}
