import { formatBurdenFull, formatSadsPerYear, formatAnimalCount, formatPercent } from '../../lib/formatters'
import styles from './TreemapTooltip.module.css'

export default function TreemapTooltip({ node, mousePosition }) {
  if (!node) return null

  const data = node.data
  const parentValue = node.parent ? node.parent.value : node.value

  return (
    <div
      className={styles.tooltip}
      style={{
        left: mousePosition.x + 16,
        top: mousePosition.y - 10,
      }}
    >
      <div className={styles.name}>{data.name}</div>
      <div className={styles.row}>
        <span className={styles.label}>Total SAD Burden:</span>
        <span className={styles.value}>{formatBurdenFull(node.value)}</span>
      </div>
      {data.sadsPerYear != null && (
        <div className={styles.row}>
          <span className={styles.label}>SADs per year:</span>
          <span className={styles.value}>{formatSadsPerYear(data.sadsPerYear)}</span>
        </div>
      )}
      <div className={styles.row}>
        <span className={styles.label}>Animals/yr:</span>
        <span className={styles.value}>{formatAnimalCount(data.animalsPerYear)}</span>
      </div>
      {node.parent && (
        <div className={styles.row}>
          <span className={styles.label}>Share of {node.parent.data.name}:</span>
          <span className={styles.value}>{formatPercent(node.value, parentValue)}</span>
        </div>
      )}
    </div>
  )
}
