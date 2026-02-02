import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>SADsGrapher</h1>
        <p className={styles.subtitle}>Visualizing Global Farmed Animal Suffering Burden</p>
      </div>
      <div className={styles.meta}>
        <span className={styles.unit}>Size = Total SAD Burden (SADs x animals/yr)</span>
      </div>
    </header>
  )
}
