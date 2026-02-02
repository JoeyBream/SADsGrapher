import { useDashboard } from '../../context/DashboardContext'
import styles from './Header.module.css'

export default function Header() {
  const { state, dispatch } = useDashboard()
  const is3D = state.viewMode === '3d'

  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>SADsGrapher</h1>
        <p className={styles.subtitle}>Visualizing Global Farmed Animal Suffering Burden</p>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${!is3D ? styles.viewBtnActive : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: '2d' })}
          >
            2D
          </button>
          <button
            className={`${styles.viewBtn} ${is3D ? styles.viewBtnActive : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: '3d' })}
          >
            3D
          </button>
        </div>
        <span className={styles.unit}>
          {is3D ? 'Area = SAD Burden · Height = log(Burden)' : 'Size = Total SAD Burden (SADs × animals/yr)'}
        </span>
      </div>
    </header>
  )
}
