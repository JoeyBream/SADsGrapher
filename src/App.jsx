import { DashboardProvider } from './context/DashboardContext'
import AppShell from './components/layout/AppShell'

function App() {
  return (
    <DashboardProvider>
      <AppShell />
    </DashboardProvider>
  )
}

export default App
