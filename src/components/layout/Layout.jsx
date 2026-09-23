import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { useState } from 'react'

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={`app-shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((isCollapsed) => !isCollapsed)} />
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
      <footer className="site-footer">Nami Ramen <span>made slowly, served warmly</span></footer>
    </div>
  )
}
