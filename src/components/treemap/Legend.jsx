import { TYPE_COLORS, TYPE_LABELS } from '../../lib/constants'
import styles from './Legend.module.css'

export default function Legend() {
  const types = Object.entries(TYPE_COLORS)

  return (
    <div className={styles.legend}>
      {types.map(([type, color]) => (
        <div key={type} className={styles.item}>
          <span
            className={styles.swatch}
            style={{ backgroundColor: color, color }}
          />
          <span className={styles.label}>{TYPE_LABELS[type]}</span>
        </div>
      ))}
    </div>
  )
}
