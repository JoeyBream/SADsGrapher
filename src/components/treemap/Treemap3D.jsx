import { useMemo, useState, useRef, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as d3 from 'd3'
import * as THREE from 'three'
import { useDashboard } from '../../context/DashboardContext'
import { useFilteredData } from '../../hooks/useFilteredData'
import { TYPE_COLORS, TYPE_LABELS } from '../../lib/constants'
import { formatBurdenFull, formatSadsPerYear, formatAnimalCount, formatPercent } from '../../lib/formatters'
import sadsData from '../../data/sads-data.json'
import styles from './Treemap3D.module.css'

const GRID_SIZE = 20
const MAX_HEIGHT = 12
const GAP = 0.08
const BASE_THICKNESS = 0.15

function getNodeType(node) {
  let current = node
  while (current) {
    if (current.data && current.data.type) return current.data.type
    current = current.parent
  }
  return null
}

function getAnimalName(node) {
  let current = node
  while (current) {
    if (current.data && current.data.animal) return current.data.animal
    current = current.parent
  }
  const type = getNodeType(node)
  return type ? TYPE_LABELS[type] : null
}

function hexToVec3(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

function Block({ position, size, color, node, onHover, onUnhover, isHovered }) {
  const meshRef = useRef()
  const [r, g, b] = hexToVec3(color)
  const baseColor = useMemo(() => new THREE.Color(r, g, b), [r, g, b])
  const emissiveColor = useMemo(() => new THREE.Color(r * 0.3, g * 0.3, b * 0.3), [r, g, b])
  const hoverEmissive = useMemo(() => new THREE.Color(r * 0.8, g * 0.8, b * 0.8), [r, g, b])

  const targetScale = useRef(1)
  const currentScale = useRef(0.01)
  const entryDelay = useRef(Math.random() * 0.6)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    elapsed.current += delta
    if (elapsed.current < entryDelay.current) return

    const target = isHovered ? 1.03 : 1
    targetScale.current = target
    currentScale.current += (targetScale.current - currentScale.current) * Math.min(delta * 6, 1)
    meshRef.current.scale.y = currentScale.current
  })

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    onHover(node, e)
  }, [node, onHover])

  const handlePointerOut = useCallback((e) => {
    e.stopPropagation()
    document.body.style.cursor = 'auto'
    onUnhover()
  }, [onUnhover])

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[size[0], size[1], size[2]]} />
      <meshStandardMaterial
        color={baseColor}
        emissive={isHovered ? hoverEmissive : emissiveColor}
        emissiveIntensity={isHovered ? 0.6 : 0.15}
        roughness={0.55}
        metalness={0.15}
        envMapIntensity={0.4}
      />
    </mesh>
  )
}

function GroundPlane({ size }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -BASE_THICKNESS, 0]} receiveShadow>
      <planeGeometry args={[size + 3, size + 3]} />
      <meshStandardMaterial
        color="#151520"
        roughness={0.95}
        metalness={0.05}
      />
    </mesh>
  )
}

function Tooltip3D({ node, position }) {
  if (!node) return null

  const data = node.data
  const parentValue = node.parent ? node.parent.value : node.value
  const type = getNodeType(node)
  const color = type ? TYPE_COLORS[type] : '#999'
  const animalName = getAnimalName(node)

  return (
    <Html
      position={[position[0], position[1] + 0.5, position[2]]}
      center
      style={{ pointerEvents: 'none' }}
    >
      <div className={styles.tooltip}>
        <div className={styles.tooltipAccent} style={{ backgroundColor: color }} />
        {animalName && (
          <div className={styles.tooltipAnimal} style={{ color }}>
            {animalName}
          </div>
        )}
        <div className={styles.tooltipName}>{data.name}</div>
        <div className={styles.tooltipGrid}>
          <span className={styles.tooltipLabel}>SAD Burden</span>
          <span className={styles.tooltipValue}>{formatBurdenFull(node.value)}</span>
          {data.sadsPerYear != null && (
            <>
              <span className={styles.tooltipLabel}>SADs/year</span>
              <span className={styles.tooltipValue}>{formatSadsPerYear(data.sadsPerYear)}</span>
            </>
          )}
          <span className={styles.tooltipLabel}>Animals/yr</span>
          <span className={styles.tooltipValue}>{formatAnimalCount(data.animalsPerYear)}</span>
          {node.parent && (
            <>
              <span className={styles.tooltipLabel}>Share</span>
              <span className={styles.tooltipValue}>{formatPercent(node.value, parentValue)}</span>
            </>
          )}
        </div>
      </div>
    </Html>
  )
}

function CameraRig() {
  const { camera } = useThree()
  const initialized = useRef(false)

  useFrame(() => {
    if (!initialized.current) {
      camera.position.set(14, 12, 14)
      camera.lookAt(0, 0, 0)
      initialized.current = true
    }
  })

  return null
}

function Scene({ data }) {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [hoveredPos, setHoveredPos] = useState([0, 0, 0])

  const blocks = useMemo(() => {
    if (!data) return []

    const root = d3.hierarchy(data)
      .sum(d => d.totalBurden || 0)
      .sort((a, b) => b.value - a.value)

    const treemap = d3.treemap()
      .tile(d3.treemapSquarify)
      .size([GRID_SIZE, GRID_SIZE])
      .paddingOuter(0.3)
      .paddingTop(0.6)
      .paddingInner(0.15)
      .round(false)

    treemap(root)

    const leaves = root.leaves()
    if (leaves.length === 0) return []

    const values = leaves.map(l => l.value).filter(v => v > 0)
    const minVal = Math.min(...values)
    const maxVal = Math.max(...values)
    const logMin = Math.log10(Math.max(minVal, 1))
    const logMax = Math.log10(Math.max(maxVal, 1))

    return leaves.map(leaf => {
      const type = getNodeType(leaf)
      const color = type ? TYPE_COLORS[type] : '#999'
      const logVal = Math.log10(Math.max(leaf.value, 1))
      const normalized = logMax > logMin ? (logVal - logMin) / (logMax - logMin) : 0.5
      const height = 0.15 + normalized * MAX_HEIGHT

      const cx = (leaf.x0 + leaf.x1) / 2 - GRID_SIZE / 2
      const cz = (leaf.y0 + leaf.y1) / 2 - GRID_SIZE / 2
      const w = Math.max((leaf.x1 - leaf.x0) - GAP, 0.05)
      const d = Math.max((leaf.y1 - leaf.y0) - GAP, 0.05)

      return {
        node: leaf,
        position: [cx, height / 2, cz],
        size: [w, height, d],
        color,
        topY: height,
      }
    })
  }, [data])

  const handleHover = useCallback((node, e) => {
    setHoveredNode(node)
    const block = blocks.find(b => b.node === node)
    if (block) {
      setHoveredPos([block.position[0], block.topY, block.position[2]])
    }
  }, [blocks])

  const handleUnhover = useCallback(() => {
    setHoveredNode(null)
  }, [])

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 16, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-5, 8, -5]} intensity={0.3} color="#7088b0" />
      <pointLight position={[0, 20, 0]} intensity={0.4} color="#b0a0d0" />

      <GroundPlane size={GRID_SIZE} />

      {blocks.map((block, i) => (
        <Block
          key={`${block.node.data.name}-${i}`}
          position={block.position}
          size={block.size}
          color={block.color}
          node={block.node}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isHovered={hoveredNode === block.node}
        />
      ))}

      {hoveredNode && <Tooltip3D node={hoveredNode} position={hoveredPos} />}

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 2, 0]}
        autoRotate
        autoRotateSpeed={0.3}
      />

      <fog attach="fog" args={['#0c0c14', 25, 55]} />
    </>
  )
}

function Legend3D() {
  const types = Object.entries(TYPE_COLORS)

  return (
    <div className={styles.legend}>
      <div className={styles.legendTitle}>Species</div>
      <div className={styles.legendItems}>
        {types.map(([type, color]) => (
          <div key={type} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: color }} />
            <span className={styles.legendLabel}>{TYPE_LABELS[type]}</span>
          </div>
        ))}
      </div>
      <div className={styles.legendNote}>
        Height = log(SAD Burden)
      </div>
    </div>
  )
}

function ScaleIndicator() {
  return (
    <div className={styles.scaleBar}>
      <div className={styles.scaleLabel}>
        <span className={styles.scaleLow}>Low</span>
        <span className={styles.scaleHigh}>High</span>
      </div>
      <div className={styles.scaleTrack} />
      <div className={styles.scaleCaption}>SAD Burden (log scale)</div>
    </div>
  )
}

export default function Treemap3D() {
  const { state } = useDashboard()

  const filteredData = useFilteredData(
    sadsData,
    state.typeFilter,
    state.searchQuery
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          camera={{ fov: 45, near: 0.1, far: 100 }}
        >
          <color attach="background" args={['#0c0c14']} />
          <Scene data={filteredData} />
        </Canvas>
      </div>
      <Legend3D />
      <ScaleIndicator />
      <div className={styles.hint}>
        Drag to orbit &middot; Scroll to zoom
      </div>
    </div>
  )
}
