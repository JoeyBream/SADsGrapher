import Header from './Header'
import Footer from './Footer'
import ControlPanel from '../controls/ControlPanel'
import Treemap from '../treemap/Treemap'
import styles from './AppShell.module.css'

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.body}>
        <ControlPanel />
        <main className={styles.main}>
          <Treemap />
        </main>
      </div>
      <Footer />
    </div>
  )
}
