export function extractTypes(data) {
  const types = []
  if (data.children) {
    for (const child of data.children) {
      if (child.type) {
        types.push({ id: child.type, name: child.name })
      }
    }
  }
  return types
}

export function filterDataByTypes(data, activeTypes) {
  if (!activeTypes || activeTypes.size === 0) return data

  return {
    ...data,
    children: data.children
      .filter(child => !child.type || activeTypes.has(child.type))
      .map(child => ({ ...child })),
  }
}

export function filterDataBySearch(data, query) {
  if (!query || query.trim() === '') return data

  const lower = query.toLowerCase()

  function nodeMatches(node) {
    if (node.name.toLowerCase().includes(lower)) return true
    if (node.children) {
      return node.children.some(nodeMatches)
    }
    return false
  }

  function pruneTree(node) {
    if (!node.children) {
      return node.name.toLowerCase().includes(lower) ? { ...node } : null
    }

    const filteredChildren = node.children
      .map(pruneTree)
      .filter(Boolean)

    if (filteredChildren.length === 0 && !node.name.toLowerCase().includes(lower)) {
      return null
    }

    return { ...node, children: filteredChildren.length > 0 ? filteredChildren : node.children }
  }

  const result = pruneTree(data)
  return result || data
}

export function isLeafNode(node) {
  return !node.children || node.children.length === 0
}
