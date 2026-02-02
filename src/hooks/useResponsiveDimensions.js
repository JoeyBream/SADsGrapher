import { useState, useEffect, useRef } from 'react'

export function useResponsiveDimensions(containerRef) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const prevRef = useRef({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      const w = Math.floor(width)
      const h = Math.floor(height)
      if (w !== prevRef.current.width || h !== prevRef.current.height) {
        prevRef.current = { width: w, height: h }
        setDimensions({ width: w, height: h })
      }
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [containerRef])

  return dimensions
}
