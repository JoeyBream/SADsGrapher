import { useDashboard } from '../../context/DashboardContext'
import { TYPE_COLORS, TYPE_LABELS } from '../../lib/constants'
import styles from './TypeFilter.module.css'

export default function TypeFilter() {
  const { state, dispatch } = useDashboard()
  const types = Object.entries(TYPE_COLORS)
  const allSelected = state.typeFilter.size === 0

  return (
    <div className={styles.filter}>
      <h3 className={styles.heading}>Animal Types</h3>
      <button
        className={`${styles.pill} ${allSelected ? styles.pillActive : ''}`}
        onClick={() => dispatch({ type: 'SET_ALL_TYPES' })}
      >
        All
      </button>
      {types.map(([type, color]) => {
        const isActive = allSelected || state.typeFilter.has(type)
        return (
          <button
            key={type}
            className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
            style={{
              '--pill-color': color,
              borderColor: isActive ? color : 'var(--color-border)',
              backgroundColor: isActive ? color : 'transparent',
              color: isActive ? '#fff' : 'var(--color-text-secondary)',
            }}
            onClick={() => dispatch({ type: 'TOGGLE_TYPE', payload: type })}
          >
            {TYPE_LABELS[type]}
          </button>
        )
      })}
    </div>
  )
}
