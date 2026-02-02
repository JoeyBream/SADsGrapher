import styles from './Breadcrumb.module.css'

export default function Breadcrumb({ names, onZoomTo }) {
  const crumbs = [
    'All Farmed Animals',
    ...names,
  ]

  return (
    <nav className={styles.breadcrumb} aria-label="Treemap navigation">
      {crumbs.map((name, i) => (
        <span key={i} className={styles.item}>
          {i > 0 && <span className={styles.separator}>/</span>}
          {i < crumbs.length - 1 ? (
            <button
              className={styles.link}
              onClick={() => onZoomTo(i)}
            >
              {name}
            </button>
          ) : (
            <span className={styles.current}>{name}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
