import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
