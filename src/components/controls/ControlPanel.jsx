import TypeFilter from './TypeFilter'
import SearchFilter from './SearchFilter'
import styles from './ControlPanel.module.css'

export default function ControlPanel() {
  return (
    <aside className={styles.panel}>
      <SearchFilter />
      <TypeFilter />
    </aside>
  )
}
