import Header from './Header'
import Footer from './Footer'
import ControlPanel from '../controls/ControlPanel'
import Treemap from '../treemap/Treemap'
import Treemap3D from '../treemap/Treemap3D'
import { useDashboard } from '../../context/DashboardContext'
import styles from './AppShell.module.css'

export default function AppShell() {
  const { state } = useDashboard()
  const is3D = state.viewMode === '3d'

  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.body}>
        <ControlPanel />
        <main className={styles.main}>
          {is3D ? <Treemap3D /> : <Treemap />}
        </main>
      </div>
      <Footer />
    </div>
  )
}
